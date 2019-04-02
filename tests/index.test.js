import { sleep } from './test-utils';

import hexagon from '../src';

describe('Hexagon.js', () => {
  let fnUseCase;
  const fn = jest.fn();

  beforeEach(() => {
    fn.mockClear();
    fnUseCase = hexagon(fn);
  });

  describe('ways of passing the ports', () => {
    it('gets its name from the original function', () => {
      expect(fnUseCase.name).toEqual(`useCase(${fn.name})`);
    });

    it('gets executed with no ports', () => {
      fnUseCase.execute();

      expect(fn).toHaveBeenCalledWith(undefined);
    });

    it('gets executed with 2 ports passed at once', () => {
      const fnUseCaseAB = fnUseCase.usePorts({ a: 1, b: 2 });

      fnUseCaseAB.execute();

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2 });
    });

    it('gets executed with 2 ports passed at two different points', () => {
      const fnUseCaseA = fnUseCase.usePorts({ a: 1 });
      const fnUseCaseAB = fnUseCaseA.usePorts({ b: 2 });

      fnUseCaseAB.execute();

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2 });
    });

    it('gets executed when all ports are passed on "execute"', () => {
      fnUseCase.execute({ a: 1, b: 2 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2 });
    });

    it('gets executed with ports pased before and on "execute"', () => {
      const fnUseCaseA = fnUseCase.usePorts({ a: 1 });

      fnUseCaseA.execute({ b: 2 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2 });
    });
  });

  describe('ports bond', () => {
    it('returns a new use case with the passed ports bound', () => {
      const fnUseCaseA = fnUseCase.usePorts({ a: 1 });

      fnUseCaseA.execute({ b: 1, c: 1 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 1, c: 1 });

      fnUseCaseA.execute({ b: 2 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2 });
    });

    it('returns a new use case with passed ports bound both in the last call and in previous calls', () => {
      const fnUseCaseA = fnUseCase.usePorts({ a: 1 });

      const fnUseCaseAB1 = fnUseCaseA.usePorts({ b: 1 });
      const fnUseCaseAB2 = fnUseCaseA.usePorts({ b: 2 });

      fnUseCaseAB1.execute({ c: 1 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 1, c: 1 });

      fnUseCaseAB2.execute({ c: 2 });

      expect(fn).toHaveBeenCalledWith({ a: 1, b: 2, c: 2 });
    });
  });

  describe('async use cases', () => {
    it('allows to await a use case with an async implementation', async () => {
      let response;
      const SUCCESS = 'success';
      const asyncFn = async () => {
        await sleep(100);
        response = SUCCESS;
      };

      const asyncUseCase = hexagon(asyncFn);

      await asyncUseCase.execute();

      expect(response).toEqual(SUCCESS);
    });
  });
});
