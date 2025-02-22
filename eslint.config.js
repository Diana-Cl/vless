export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      eqeqeq: 'warn',
      'prefer-const': 'error',
    },
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
  { files: ['**/*.json'], ...json.configs.recommended },
  { files: ['**/*.md'], ...markdown.configs.recommended },
  {
    ignores: [
      'dist/**',
      'build/**',
      'warp.json',
      'hiddify/**',
      'package.json',
      'edge/waste/**',
      'node_modules/**',
      '.prettierrc.js',
      'eslint.config.js',
      'package-lock.json',
      '!edge/assets/xxx.js',
      '!edge/assets/xxx.json',
      'boringtun-boringtun-cli-0.5.2/**',
    ],
  },
];
