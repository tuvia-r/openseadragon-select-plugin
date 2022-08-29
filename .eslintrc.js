const { off } = require("process");

module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    sourceType: "module"
  },
  plugins: ["@typescript-eslint/eslint-plugin",
    "prettier",
    "eslint-plugin-import",
    "eslint-plugin-import-helpers",
    "simple-import-sort",
    "import"],
  extends: [
    'prettier',
    "plugin:@typescript-eslint/recommended",
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript'
  ],
  root: true,
  env: {
    node: true,
    jest: true
  },
  ignorePatterns: [".eslintrc.js"],
  rules: {
    'simple-import-sort/sort': 'off',
    'import/no-default-export': 'error',
    'import/no-deprecated': 'warn',
    'import/no-internal-modules': 'off',
    'import/no-named-as-default': 'off',
    'import/order': 'off',
    'no-console': 'off',
    'max-len': ['error', { code: 200 }],
    'prettier/prettier': ['error', {'usePrettierrc': true, 'tabWidth': 4, 'useTabs': true, 'printWidth': 60}],
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
        filter: {
          regex: '^_.*$',
          match: false
        }
      },
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE']
      },
      {
        selector: 'typeLike',
        format: ['PascalCase']
      },
      {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase']
      },
      {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will', 'was', 'send', 'with']
      }
    ]
  }
};
