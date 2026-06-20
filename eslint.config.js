import js from '@eslint/js';

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        FormData: 'readonly',
        DOMParser: 'readonly',
        URLSearchParams: 'readonly',
        setTimeout: 'readonly',
        Promise: 'readonly',
        Set: 'readonly',
        Math: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'AwaitExpression',
          message: 'Используйте Promise-цепочки вместо await.',
        },
        {
          selector: 'FunctionDeclaration[async=true]',
          message: 'Async-функции запрещены.',
        },
        {
          selector: 'ArrowFunctionExpression[async=true]',
          message: 'Async-функции запрещены.',
        },
      ],
    },
  },
];
