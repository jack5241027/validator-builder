# validator-builder.js

Simple way to set up validator.

## Usage

There are two main apis in this library, one is **generateStrategy** and the other is **ValidatorBuilder**.

The most important thing at very beginning is to create **strategies** use `generateStrategy` at very first.

And use the **strategies** to create validator and init each field validation strategy.

### `generateStrategy`

Create **strategies** from custom validate function.

Pass a plain object to defined all validate strategy, and the property name is same as the validate strategy name.

Each validate function will pass into two parameters.

First parameter is input value, and second one is a threshold, to satisfy some condition which need additional threshold.

> NOTE: Each validate function should return `true` when the input value is valid.

```javascript
import { generateStrategy } from 'validator-builder';

const strategies = generateStrategy({
  isEmpty: val => val !== undefined && val !== null && Boolean(val) !== false,
  overMaxLength: (val, max) => val.length <= max,
});

```

### `ValidatorBuilder`

To create **validator** by setting default error message and threshold.

Pass a plain object which have two properties **defaultErrorSet** and **defaultThresholdSet**.

Use the **strategies** we just created, to be the property name of the error message plain object and thresholdS plain object.

```javascript
import ValidatorBuilder from 'validator-builder';

const validator = new ValidatorBuilder({
  defaultErrorSet: {
    [strategies.isEmpty]: 'No Empty.',
    [strategies.overMaxLength]: 'Too long.',
  },
  defaultThresholdSet: {
    [strategies.overMaxLength]: 6,
  },
});

```
### validator

The validator has three method, `init`, `start`, `getStateByFieldName`.

#### `validator.init`

Accept a list of object, each object should have `name` and `strategies`.

This will define each field's validate logic.

#### `validator.start`

Accept a plain object, which key should be all field's name, and value are those value.

Will return true when all field valid.

#### `validator.getStateByFieldName`

Accept field name which has been init by `validator.init`, and will return field validate state.

The validate state has isValid and errorMsg two property, by default isValid is true, and errorMsg is empty string changed after `validator.start` execute.

```javascript
validator.init([{
  name: '${fieldName}',
  strategies: [strategies.isEmpty, strategies.overMaxLength],
}]);

validator.start(data) => isAllValid

validator.getStateByFieldName(filedName) => ({
  isValid,
  errorMsg
})

```

## Example

```javascript
import ValidatorMediator, { generateStrategy } from 'validator-builder';

const strategies = generateStrategy({
  isEmpty: val => val !== undefined && val !== null && Boolean(val) !== false,
  isEmail: (email) => {
    const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return re.test(email);
  },
  overMaxLength: (val, max) => val.length <= max,
});

const validator = new ValidatorMediator({
  defaultErrorSet: {
    [strategies.isEmpty]: 'No Empty.',
    [strategies.isEmail]: 'Wrong Format.',
    [strategies.overMaxLength]: 'Too long.',
  },
  defaultThresholdSet: {
    [strategies.overMaxLength]: 6,
  },
});

validator.init([
  {
    name: 'nickName',
    strategies: [strategies.isEmpty, strategies.overMaxLength],
  },
  {
    name: 'email',
    strategies: [strategies.isEmpty, strategies.isEmail],
  },
  {
    name: 'tos',
    strategies: [strategies.isEmpty],
  },
]);

const isAllValid = validator.start(this.state);

const isNickNameValid = validator.getStateByFieldName('nickName').isValid
const nickNameErrorMsg = validator.getStateByFieldName('nickName').errorMsg
```
