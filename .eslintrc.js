const path = require("path");
module.exports = {
  extends: [
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "no-plusplus": "off",
    "no-console": "warn",
    "max-len": ["warn", { code: 120, ignorePattern: "^import .*" }],
    indent: [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "@typescript-eslint/indent": [
      "warn",
      2,
      {
        SwitchCase: 1,
      },
    ],
    "import/prefer-default-export": "off",
    "no-param-reassign": [
      "error",
      {
        props: false,
      },
    ],
    "@typescript-eslint/quotes": ["error", "double"],
    "max-lines-per-function": ["error", 50],
  },
  ignorePatterns: ["*config.js", "*eslintrc.js", "*config.ts"],
};
