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

  describe('ports bound', () => {
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

  describe('references', () => {
    describe('keeps same reference', () => {
      it('when passing the same ports', () => {
        const ref1 = fnUseCase.usePorts({ a: 1 });
        const ref2 = fnUseCase.usePorts({ a: 1 });

        expect(ref1 === ref2).toBe(true);
      });

      it('when passing ports with same arrays', () => {
        const ref1 = fnUseCase.usePorts({ a: [{ b: 1 }, { c: 2 }] });
        const ref2 = fnUseCase.usePorts({ a: [{ b: 1 }, { c: 2 }] });

        expect(ref1 === ref2).toBe(true);
      });

      it('when passing ports with same attributes', () => {
        const ref1 = fnUseCase.usePorts({ a: { b: 1 } });
        const ref2 = fnUseCase.usePorts({ a: { b: 1 } });

        expect(ref1 === ref2).toBe(true);
      });

      it('when passing ports with same array attributes', () => {
        const ref1 = fnUseCase.usePorts({ a: { b: [{ c: 1 }, { d: 2 }] } });
        const ref2 = fnUseCase.usePorts({ a: { b: [{ c: 1 }, { d: 2 }] } });

        expect(ref1 === ref2).toBe(true);
      });

      it('when passing already bound ports with the same value', () => {
        const ref1 = fnUseCase.usePorts({ a: 1 });
        const ref2 = ref1.usePorts({ a: 1 });

        expect(ref1 === ref2).toBe(true);
      });
    });

    describe('changes the reference', () => {
      describe('when passing different ports', () => {
        it('with a single port', () => {
          const ref1 = fnUseCase.usePorts({ a: 1 });
          const ref2 = fnUseCase.usePorts({ b: 2 });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports', () => {
          const ref1 = fnUseCase.usePorts({ a: 1, b: 2 });
          const ref2 = fnUseCase.usePorts({ a: 1, c: 3 });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing different port values', () => {
        it('with a single port', () => {
          const ref1 = fnUseCase.usePorts({ a: 1 });
          const ref2 = fnUseCase.usePorts({ a: 2 });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports', () => {
          const ref1 = fnUseCase.usePorts({ a: 1, b: 2 });
          const ref2 = fnUseCase.usePorts({ a: 2, b: 2 });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when changing ports', () => {
        it('with a single port', () => {
          const ref1 = fnUseCase.usePorts({ a: 1 });
          const ref2 = ref1.usePorts({ a: 2 });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports', () => {
          const ref1 = fnUseCase.usePorts({ a: 1, b: 2 });
          const ref2 = ref1.usePorts({ a: 2, b: 2 });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing more ports', () => {
        it('with a single port', () => {
          const ref1 = fnUseCase.usePorts({ a: 1 });
          const ref2 = ref1.usePorts({ b: 2 });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports', () => {
          const ref1 = fnUseCase.usePorts({ a: 1, b: 2 });
          const ref2 = ref1.usePorts({ a: 1, c: 3 });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing more ports', () => {
        it('with a single port', () => {
          const ref1 = fnUseCase.usePorts({ a: 1 });
          const ref2 = ref1.usePorts({ b: 2 });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports', () => {
          const ref1 = fnUseCase.usePorts({ a: 1, b: 2 });
          const ref2 = ref1.usePorts({ c: 3, d: 4 });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing ports with different attributes', () => {
        it('with a single port attribute', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: 1 } });
          const ref2 = fnUseCase.usePorts({ a: { c: 2 } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports and attributes', () => {
          const ref1 = fnUseCase.usePorts({ a: { b1: 1, b2: 2 }, b: { c: 3 } });
          const ref2 = fnUseCase.usePorts({ a: { d1: 2, d2: 2 }, b: { c: 3 } });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing ports with different attribute values', () => {
        it('with a single port attribute', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: 1 } });
          const ref2 = fnUseCase.usePorts({ a: { b: 2 } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports and attributes', () => {
          const ref1 = fnUseCase.usePorts({ a: { b1: 1, b2: 2 }, c: { d: 3 } });
          const ref2 = fnUseCase.usePorts({ a: { b1: 2, b2: 2 }, c: { d: 3 } });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when changin port attributes', () => {
        it('with a single port attribute', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: 1 } });
          const ref2 = ref1.usePorts({ a: { c: 2 } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports and attributes', () => {
          const ref1 = fnUseCase.usePorts({ a: { b1: 1, b2: 2 }, c: { d: 3 } });
          const ref2 = ref1.usePorts({ a: { e1: 2, e2: 2 }, c: { d: 3 } });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when changin port attribute values', () => {
        it('with a single port attribute', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: 1 } });
          const ref2 = ref1.usePorts({ a: { b: 2 } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple ports and attributes', () => {
          const ref1 = fnUseCase.usePorts({ a: { b1: 1, b2: 2 }, c: { d: 3 } });
          const ref2 = ref1.usePorts({ a: { b1: 2, b2: 2 }, c: { d: 3 } });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing ports with different arrays', () => {
        it('with a single attribute in the elements', () => {
          const ref1 = fnUseCase.usePorts({ a: [{ b: 1 }, { c: 2 }] });
          const ref2 = fnUseCase.usePorts({ a: [{ d: 1 }, { c: 2 }] });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple attributes in the elements', () => {
          const ref1 = fnUseCase.usePorts({ a: [{ b1: 1, b2: 2 }, { c: 3 }] });
          const ref2 = fnUseCase.usePorts({ a: [{ d1: 1, d2: 2 }, { c: 3 }] });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing ports with different array attributes', () => {
        it('with a single attribute in the elements', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: [{ c: 1 }, { d: 2 }] } });
          const ref2 = fnUseCase.usePorts({ a: { b: [{ e: 1 }, { d: 2 }] } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple attributes in the elements', () => {
          const ref1 = fnUseCase.usePorts({
            a: { b: [{ c1: 1, c2: 2 }, { d: 3 }] },
          });
          const ref2 = fnUseCase.usePorts({
            a: { b: [{ e1: 1, e2: 2 }, { d: 3 }] },
          });

          expect(ref1 === ref2).toBe(false);
        });
      });

      describe('when passing ports with different array attribute values', () => {
        it('with a single attribute in the elements', () => {
          const ref1 = fnUseCase.usePorts({ a: { b: [{ c: 1 }, { d: 2 }] } });
          const ref2 = fnUseCase.usePorts({ a: { b: [{ c: 3 }, { d: 2 }] } });

          expect(ref1 === ref2).toBe(false);
        });

        it('with multiple attributes in the elements', () => {
          const ref1 = fnUseCase.usePorts({
            a: { b: [{ c1: 1, c2: 2 }, { d: 3 }] },
          });
          const ref2 = fnUseCase.usePorts({
            a: { b: [{ c1: 3, c2: 2 }, { d: 3 }] },
          });

          expect(ref1 === ref2).toBe(false);
        });
      });

      it('when changing a port attribute from array to object', () => {
        const ref1 = fnUseCase.usePorts({
          a: { b: [{ c1: 1, c2: 2 }, { d: 3 }] },
        });
        const ref2 = fnUseCase.usePorts({
          a: { b: { c1: 1, c2: 2, d: 3 } },
        });

        expect(ref1 === ref2).toBe(false);
      });

      it('when merging two elements in an port attribute array', () => {
        const ref1 = fnUseCase.usePorts({
          a: { b: [{ c1: 1, c2: 2 }, { d: 3 }] },
        });
        const ref2 = fnUseCase.usePorts({
          a: { b: [{ c1: 1, c2: 2, d: 3 }] },
        });

        expect(ref1 === ref2).toBe(false);
      });
    });
  });
});
