const validateStrategy = {};

let ID = 0;

export const generateStrategy = (strategies) => {
  const strategySet = {};

  Object.keys(strategies).forEach((strategy) => {
    validateStrategy[`${strategy}_${ID}`] = strategies[strategy];
    strategySet[strategy] = `${strategy}_${ID}`;
  });

  ID += 1;
  return strategySet;
};

export default class ValidatorBuilder {
  constructor({ defaultErrorSet = {}, defaultThresholdSet = {} }) {
    this.cache = {};
    this.defaultErrorSet = defaultErrorSet;
    this.defaultThresholdSet = defaultThresholdSet;
  }
  init = (fields) => {
    fields.forEach(this.add);
  };
  add = ({ name, strategies, thresholdSet = {}, errorSet = {} }) => {
    this.cache[name] = {
      strategies,
      thresholdSet,
      errorSet,
      isValid: true,
    };
  };
  start = (data) => {
    let result = true;

    Object.keys(this.cache).forEach((fieldName) => {
      const { strategies, thresholdSet, errorSet } = this.cache[fieldName];
      const val = data[fieldName];

      for (let i = 0; i < strategies.length; i++) {
        const strategy = strategies[i];
        const error =
          errorSet[strategy] || this.defaultErrorSet[strategy] || '';
        const threshold =
          thresholdSet[strategy] || this.defaultThresholdSet[strategy];

        const isValid = validateStrategy[strategy](val, threshold);
        this.cache[fieldName].isValid = isValid;
        if (!isValid) {
          this.cache[fieldName].errorMsg = error;
          if (result) {
            result = false;
          }
          break;
        }
        this.cache[fieldName].errorMsg = '';
      }
    });

    return result;
  };
  getStateByFieldName = fieldName => this.cache[fieldName];
}
