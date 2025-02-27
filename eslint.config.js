import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: [
      'dist/**',
      'build/**',
      'warp.json',
      'hiddify/**',
      'edge/waste/**',
      'node_modules/**',
      '**/node_modules/**',
      '**/package-lock.json'
      'boringtun-boringtun-cli-0.5.2/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
