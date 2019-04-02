const getUsePorts = (fn, name, ports = {}) => (newPorts = {}) =>
  createHexagon(fn, name, { ...ports, ...newPorts });

const getExecute = (fn, ports = {}) => (newPorts = {}) => {
  let allPorts = { ...ports, ...newPorts };

  if (Object.keys(allPorts).length === 0) {
    allPorts = undefined;
  }

  fn(allPorts);
};

const createHexagon = (fn, name, ports = {}) => ({
  name,
  usePorts: getUsePorts(fn, name, ports),
  execute: getExecute(fn, ports),
});

export default function hexagon(useCaseFn) {
  return createHexagon(useCaseFn, `useCase(${useCaseFn.name})`, {});
}
