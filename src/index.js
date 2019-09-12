import memoize from './memo';

const getUsePorts = (fn, name, ports = {}, oldCache) => {
  let cache;

  const usePorts = (newPorts = {}) => {
    return createHexagon(fn, name, { ...ports, ...newPorts }, cache);
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

const createHexagon = (fn, name, ports = {}, cache) => ({
  name,
  usePorts: getUsePorts(fn, name, ports, cache),
  execute: getExecute(fn, ports),
});

export default function hexagon(useCaseFn) {
  return createHexagon(useCaseFn, `useCase(${useCaseFn.name})`, {});
}
