module.exports = {
  "parser": "babel-eslint",
  "extends": "@jack5241027/eslint-config",
  "env": {
    "browser": true,
    "node": true,
    "jest": true
  },
  "settings": {
    "import/resolver": {
      "babel-module": {},
      "webpack": {}
    }
  }
};
