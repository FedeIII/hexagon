const getKeyFromArrayPort = (port, depth = 2) => {
  return port.map(arrayElement => getKeyFromPort(arrayElement, depth));
};

const getKeyFromPort = (port, depth = 2) => {
  if (port instanceof Array) {
    return `[${getKeyFromArrayPort(port, depth)}]`;
  }

  if (port instanceof Object) {
    return `{${Object.entries(port).map(
      ([key, value]) => `${key}:${getKeyFromPort(value, depth + 1)}`,
    )}}`;
  }

  return `${port}`;
};

const getMemoKey = ports => {
  return Object.entries(ports).reduce(
    (memoKey, [portKey, portValue]) =>
      `${memoKey}#${portKey}:${getKeyFromPort(portValue)}`,
    '',
  );
};

function memoize(func, pastPorts) {
  function memoizedFn(ports) {
    const memoKey = getMemoKey({ ...pastPorts, ...ports });
    const { cache } = memoizedFn;

    if (cache.has(memoKey)) {
      return cache.get(memoKey);
    }

    const result = func.call(this, ports);
    memoizedFn.cache = cache.set(memoKey, result);

    return result;
  }

  memoizedFn.cache = new Map();

  return memoizedFn;
}

export default memoize;
