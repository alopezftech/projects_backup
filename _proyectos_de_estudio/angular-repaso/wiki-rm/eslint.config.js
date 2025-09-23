// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  // Global ignores
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      '*.js',
      '*.mjs',
      '.angular/**',
      'src/environments/**',
    ],
  },

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Angular specific rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'error',

      // TypeScript rules
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-inferrable-types': 'error',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],

      // General code quality rules
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-duplicate-imports': 'error',
    },
  },

  // Server files - permitir console.log para logging de infraestructura
  {
    files: ['src/main.ts', 'src/server.ts'],
    rules: {
      'no-console': 'off',
    },
  },

  // HTML template files configuration
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      // Template best practices
      '@angular-eslint/template/no-autofocus': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/use-track-by-function': 'warn',
      '@angular-eslint/template/conditional-complexity': ['error', { maxComplexity: 3 }],
      '@angular-eslint/template/cyclomatic-complexity': ['error', { maxComplexity: 5 }],
    },
  }
);
