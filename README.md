# Hexagon

Hexagon is a JavaScript library aimed to make it easier in JS to follow an Hexagonal Architecture, independently from whichever framework you decide to use.

It allows to define infrastructure independent use cases with pure javascript that get their primary and secondary ports at different points in time and gets executed on demand with whichever ports already passed

## Install

Install Hexagon using [`yarn`](https://yarnpkg.com/en/package/jest):

```bash
yarn add --dev @azyr/hexagon
```

Or [`npm`](https://www.npmjs.com/):

```bash
npm install --save-dev @azyr/hexagon
```

## Examples

`hexagon` is used to create a UseCase scenario, passing the implementation of the use case as a JS function that receives an object as a single input containing all the ports used in the use case:
```javascript
import hexagon from 'hexagon';

function sum({port1, port2, port3}) {
  console.log(port1 + port2 + port3);
}

const sumUseCase = hexagon(sum);
```

With `execute`, a UseCase can be executed passing all the ports:
```javascript
const sumUseCase = hexagon(sum);

sumUseCase.execute({ port1: 1, port2: 2, port3: 3 }); // 6
```

The ports can be bound with `usePorts`
```javascript
const sumUseCase = hexagon(sum);

const sum5UseCase = sumUseCase.usePorts({ port1: 5 });

sum5UseCase.execute({ port2: 2, port3: 3 }); // 10
sum5UseCase.execute({ port2: 1, port3: 2 }); // 8
```

Any amount of ports can be bound with `usePorts`, even all of them:
```javascript
const sumUseCase = hexagon(sum);

const show6UseCase = sumUseCase.usePorts({ port1: 1, port2: 2, port3: 3 });

show6UseCase.execute(); // 6
```

Multiple UseCases can be executed based on an new unbound UseCase:
```javascript
const sumUseCase = hexagon(sum);

sumUseCase.execute({ port1: 1, port2: 2, port3: 3 }); // 6
sumUseCase.execute({ port1: 5, port2: 2, port3: 3 }); // 10
```

Multiple UseCases can be build based on some UseCase with some ports bound:
```javascript
const sumUseCase = hexagon(sum);

const sum1UseCase = sumUseCase.usePorts({ port1: 1 });
const sum5UseCase = sumUseCase.usePorts({ port1: 5 });

sum1UseCase.execute({ port2: 2, port3: 3 }); // 6
sum5UseCase.execute({ port2: 2, port3: 3 }); // 10
```

The UseCase can be implemented with an async function, allowing the infrastructure to await the UseCase execution
```javascript
const asyncUseCase = hexagon(asyncFunction);

await asyncUseCase.execute();

// or without async/await:

asyncUseCase.execute().then(() => {});
```