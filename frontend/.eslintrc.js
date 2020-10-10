module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    emcaVersion: 2020,
    ecmaFeatures: {
      jsx: true
    },
    project: ['./tsconfig.json', './tsconfig.eslint.json']
  },
  plugins: [
    '@typescript-eslint',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
    'prettier'
  ],

  extends: [
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'prettier',
    'plugin:prettier/recommended',
    'prettier/react',

    'prettier/@typescript-eslint'
  ],
  env: {
    node: true,
    browser: true,
    jest: true
  },
  rules: {
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off',
    'promise/always-return': 'error',
    // https://basarat.gitbooks.io/typescript/docs/tips/defaultIsBad.html
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'error',
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    // No jsx extension: https://github.com/facebook/create-react-app/issues/87#issuecomment-234627904
    'react/jsx-filename-extension': 'off',
    // Disable core rule when using @typescript no-use-before-define
    'no-use-before-define': [0],
    // Using warn for no-use-before-define until eslint-prettier updates
    '@typescript-eslint/no-use-before-define': [1],
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      { allowExpressions: true, allowTypedFunctionExpressions: true }
    ],
    // '@typescript-eslint/no-use-before-define': [
    //   'error',
    //   { functions: false, classes: true, variables: true, typedefs: true }
    // ],
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-useless-undefined': 'off',
    'no-underscore-dangle': [1, { allow: ['_id'] }],
    'prettier/prettier': 2
  }
};
