import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        FormData: 'readonly',
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
