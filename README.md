# Hexagon

Hexagon is a JavaScript library aimed to make it easier in JS to follow a Hexagonal Architecture, independently from whichever framework you decide to use.

It allows to define infrastructure-independent use cases with pure javascript that get their primary and secondary ports at different points in time and gets executed on demand with the ports that have been previously passed

## Install

Install Hexagon using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add @azyr/hexagon
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install @azyr/hexagon
```

## Examples

`hexagon` is used to create a UseCase scenario, passing the implementation of the use case as a JS function that receives an object as a single input containing all the ports used in the use case:

```javascript
import hexagon from '@azyr/hexagon';

function showSum({
  num1, // primary port (first summand)
  num2, // primaty port (second summand)
  show, // secondary port (render the result)
}) {
  show(num1 + num2);
}

const showSumUseCase = hexagon(showSum);
```

With `execute`, a UseCase can be executed passing all the ports:

```javascript
const showSumUseCase = hexagon(showSum);

showSumUseCase.execute({ num1: 1, num2: 2, show: res => console.log(res) }); // 3
```

With `usePorts`, a new UseCase is returned with those ports bound

```javascript
const showSumUseCase = hexagon(showSum);

const logSumUseCase = showSumUseCase.usePorts({ show: res => console.log(res) });

logSumUseCase.execute({ num1: 2, num2: 3 }); // 5
logSumUseCase.execute({ num1: 1, num2: 2 }); // 3
```

Any amount of ports can be bound with `usePorts`, even all of them:

```javascript
const showSumUseCase = hexagon(sum);

const log3UseCase = showSumUseCase.usePorts({
  num1: 1,
  num2: 2,
  show: res => console.log(res),
});

log3UseCase.execute(); // 3
```

Multiple UseCases can be build based on a UseCase with some ports already bound:

```javascript
const showSumUseCase = hexagon(sum);

const logSumUseCase = showSumUseCase.usePorts({
  show: res => console.log(res),
});

const warnSumUseCase = showSumUseCase.usePorts({
  show: res => console.warn(`Warning: ${res}`),
});

logSumUseCase.execute({ num1: 2, num2: 3 }); // 5
warnSumUseCase.execute({ num1: 2, num2: 3 }); // Warning: 5
```

### Asynchronicity

The UseCase can be implemented with an async function (or a function that returns a promise), allowing the infrastructure to await the UseCase execution (or .then the execution)

```javascript
const asyncUseCase = hexagon(asyncFunction);

await asyncUseCase.execute();

// or without async/await:

asyncUseCase.execute().then(() => {});
```

### Use Case References

If the same UseCase is called twice with the same ports with the same values, the reference to the returned UseCase is the same:

```javascript
const useCase1 = useCase.usePorts({ a: 1, b: 2 });
const useCase2 = useCase.usePorts({ a: 1, b: 2 });

useCase1 === useCase2 // true
```

If the ports are different or their value changes, the reference will be different:

```javascript
const useCase1 = useCase.usePorts({ a: 1, b: 2 });
const useCase2 = useCase.usePorts({ a: 1, c: 3 });

useCase1 === useCase2 // false
```

If the returned UseCase is called with the same ports, the reference won't change either:

```javascript
const useCaseWithPortsBound = useCase.usePorts({ a: 1, b: 2 });
const useCase2 = useCaseWithPortsBound.usePorts({ a: 1 });

useCase1 === useCase2 // true
```
