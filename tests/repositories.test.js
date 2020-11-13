import PropTypes from 'prop-types';

import hexagon, { Repositories } from '../src';

describe('Repositories', () => {
  let fnUseCase;
  const fn = jest.fn();

  beforeEach(() => {
    fn.mockClear();
    fnUseCase = hexagon(fn);
    jest.spyOn(console, 'error');
  });

  it('allows to add repository for number', () => {
    fnUseCase.repositories = {
      numericPort: Repositories.number,
    };

    fnUseCase.usePorts({
      numericPort: 2,
    });

    expect(fnUseCase.repositories.numericPort).toEqual(Repositories.number);
  });

  it('logs nothing when a port has no repository', () => {
    fnUseCase.usePorts({
      anyPort: 'any value',
    });

    expect(console.error).not.toHaveBeenCalled();
  });

  it('logs an error PropTypes-like', () => {
    fnUseCase.repositories = {
      numericPort: Repositories.number,
    };

    fnUseCase.usePorts({
      numericPort: '3',
    });

    expect(console.error).toHaveBeenCalledWith(
      'Warning: Failed repository type: Invalid repository `numericPort` of ' +
        'type `string` supplied to `useCase(mockConstructor)`, expected `number`.',
    );
  });

  it('works the same way internally than PropTypes', () => {
    expect(Repositories).toEqual(expect.objectContaining(PropTypes));
  });
});
