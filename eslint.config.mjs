import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs}'] },
  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js, import: importPlugin, eslintPluginPrettier },
    extends: ['js/recommended'],
  },
  {
    rules: {
      ...prettierConfig.rules,
      // Airbnb-style core rules
      'prettier/prettier': 'warn', //Runs Prettier inside ESLint, highlighting any formatting that doesn't follow Prettier's rules.
      'no-unused-vars': 'warn', //Warns if you declare variables or functions you never use.
      'no-console': 'warn', //Warns on any console.log, console.error, etc.
      'no-var': 'error', //Disallows var. Enforces use of let or const.
      'prefer-const': 'error', //Suggests using const when variables are never reassigned.
      eqeqeq: ['error', 'always'], //Enforces strict equality (=== and !==) over loose equality (==, !=).
      // Import rules (Airbnb inspired)
      'import/no-unresolved': 'error', //Ensures that an import path exists and resolves correctly.
      'import/named': 'error', //Ensures named imports exist in the referenced module.
      'import/namespace': 'error', //Ensures namespace imports (import * as) work properly and are used correctly.
      'import/default': 'error', //Ensures default imports exist — if you do import something from 'module', that module must actually have a default export.
      'import/no-duplicates': 'warn', //Warns when you import the same file more than once (even with different named/default imports).
      'import/order': [
        // Enforces consistent order of import groups.
        'warn',
        {
          groups: [
            'builtin', //Node.js modules like fs, path
            'external', //Packages like react, lodash
            'internal', //Your app’s internal modules
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always', //Enforces a blank line between each group ("newlines-between": "always").
        },
      ],
    },
  },
  {
    files: ['webpack.*.js'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
]);
