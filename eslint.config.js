import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Node.js
        console: 'readonly',
        // Browser
        window: 'readonly',
        document: 'readonly',
        FormData: 'readonly',
        DOMParser: 'readonly',
        URLSearchParams: 'readonly',
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
