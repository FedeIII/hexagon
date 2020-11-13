import memoize from './memo';
import { checkPortRepositories } from './repositories';

const getUsePorts = ({
  fn,
  name,
  ports = {},
  cache: oldCache,
  getRepositories,
}) => {
  let cache;

  const usePorts = (newPorts = {}) => {
    const repositories = getRepositories();
    checkPortRepositories(name, newPorts, repositories);

    return createHexagon({
      fn,
      name,
      ports: { ...ports, ...newPorts },
      cache,
      repositories,
    });
  };

  const memoizedUsePorts = memoize(usePorts, ports);

  if (oldCache) {
    memoizedUsePorts.cache = oldCache;
  }

  /* eslint-disable prefer-destructuring */
  cache = memoizedUsePorts.cache;

  return memoizedUsePorts;
};

const getExecute = (fn, ports = {}) => (newPorts = {}) => {
  let allPorts = { ...ports, ...newPorts };

  if (Object.keys(allPorts).length === 0) {
    allPorts = undefined;
  }

  return fn(allPorts);
};

const createHexagon = ({
  fn,
  name,
  ports = {},
  cache,
  repositories = null,
}) => {
  let _repositories = repositories;

  const newHexagon = {
    name,
    execute: getExecute(fn, ports),
    get repositories() {
      return _repositories;
    },
    set repositories(userDefinedRepos) {
      _repositories = userDefinedRepos;
    },
  };

  newHexagon.usePorts = getUsePorts({
    fn,
    name,
    ports,
    cache,
    getRepositories: () => _repositories,
  });

  return newHexagon;
};

export default function hexagon(useCaseFn) {
  return createHexagon({
    fn: useCaseFn,
    name: `useCase(${useCaseFn.name})`,
    ports: {},
  });
}
