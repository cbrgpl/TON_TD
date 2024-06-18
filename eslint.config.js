import js from '@eslint/js';
import globals from 'globals';

import babelParser from '@babel/eslint-parser';

import tsParser from '@typescript-eslint/parser';
import ts from '@typescript-eslint/eslint-plugin';

import importX from 'eslint-plugin-import-x';
import prettierPlugin from 'eslint-plugin-prettier/recommended';

import vueParser from 'vue-eslint-parser';
import vuePlugin from 'eslint-plugin-vue';
import vueEslintConfig from '@vue/eslint-config-typescript';

const isProd = process.env.NODE_ENV === 'production';
const runInProd = (config) => (!isProd ? 'off' : config);

const modifyRulesWithPrefix = (prefix, rules) => {
  const modifiedRules = {};

  for (const prop of Object.keys(rules)) {
    modifiedRules[`${prefix}/${prop}`] = rules[prop];
  }

  return modifiedRules;
};

export const jsRules = {
  'no-case-declarations': 'off',
  'import/no-unresolved': 'off',
  'import/namespace': 'off',
  'import/no-duplicates': 'off',
  'no-async-promise-executor': 'off',
  'block-spacing': 'error',
  'no-console': 'off',
  'import/named': 'off',
  'curly': 2,
  'no-throw-literal': 'off',
  'arrow-spacing': ['error', { before: true, after: true }],
  'comma-dangle': ['error', 'always-multiline'],
  'comma-spacing': ['error', { after: true }],
  'object-curly-spacing': ['error', 'always'],
  'func-call-spacing': ['error', 'never'],
  'key-spacing': ['error', { afterColon: true, mode: 'strict' }],
  'keyword-spacing': ['error', { before: true, after: true }],
  'operator-assignment': ['error', 'always'],
  'no-var': 'error',
  'func-style': 'error',
  // 'no-console': ['error', { allow: ['warn', 'trace', 'group', 'groupCollapsed', 'groupEnd'] }],
  'eol-last': ['error', 'always'],
  'no-dupe-class-members': 'off',
};
export const vueRules = modifyRulesWithPrefix('vue', {
  'html-indent': [
    'error',
    2,
    {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
    },
  ],
  'html-self-closing': 0,
  'no-multiple-template-root': 'off',
  'define-props-declaration': ['error', 'type-based'],
  'no-v-for-template-key': 0,
  'max-attributes-per-line': [
    'error',
    {
      singleline: 1,
      multiline: {
        max: 1,
      },
    },
  ],
  'component-name-in-template-casing': [
    'error',
    'PascalCase',
    {
      registeredComponentsOnly: false,
    },
  ],
  'attribute-hyphenation': ['error', 'always'],
  'mustache-interpolation-spacing': ['error', 'always'],
  'no-v-model-argument': 0,
  'v-on-event-hyphenation': ['error', 'never'],
});

export const importRules = modifyRulesWithPrefix('import-x', {
  'export': 'error',
  'first': 'off',
  'extensions': 'off',
  'no-self-import': 'error',
  'no-unresolved': 'error',
  'no-useless-path-segments': [
    'error',
    {
      noUselessIndex: true,
    },
  ],
  'order': 0,
  'no-cycle': runInProd('error'),
  'no-deprecated': runInProd('warn'),
  'no-unused-modules': runInProd('error'),
  'no-named-as-default': runInProd('error'),
});

export const tsRules = modifyRulesWithPrefix('@typescript-eslint', {
  'consistent-type-imports': 'error',
  'no-unused-vars': 'error',
  'member-delimiter-style': 'error',
  'type-annotation-spacing': 'error',
  'no-explicit-any': 'warn',
});

const jsConfig = {
  files: ['**/*.js', '**/*.jsx'],
  plugins: {
    'import-x': importX,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.builtin,
      ...globals.browser,
    },
    parser: babelParser,
  },
  settings: {
    'prettier/prettier': [
      'error',
      {},
      {
        usePrettier: true,
      },
    ],
    'import-x/parsers': {
      '@babel/eslint-parser': ['**/*.js', '**/*.jsx'],
    },
  },
  rules: {
    ...importX.configs['recommended'].rules,
    ...jsRules,
    ...importRules,
  },
};

const tsConfig = {
  files: ['**/*.ts', '**/*.tsx'],
  ignores: ['vite.config.ts', 'electron/**/*', 'scripts/**/*', 'threadEvents.ts'],
  plugins: {
    '@typescript-eslint': ts,
    'import-x': importX,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.builtin,
      ...globals.browser,
    },
    parser: tsParser,
    parserOptions: {
      project: ['./tsconfig.json'],
    },
  },
  settings: {
    'prettier/prettier': 'error',
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import-x/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import-x/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },

  rules: {
    ...ts.configs['eslint-recommended'].rules,
    ...ts.configs['recommended'].rules,
    ...importX.configs['recommended'].rules,
    ...importX.configs['typescript'].rules,
    ...jsRules,
    ...importRules,
    ...tsRules,
  },
};

const tsNodeConfig = {
  files: ['vite.config.ts', 'eslint.config.js', 'commitlint.config.js', 'electron', 'scripts'],
  plugins: {
    '@typescript-eslint': ts,
    'import-x': importX,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.builtin,
      ...globals.node,
    },
    parser: tsParser,
    parserOptions: {
      project: ['./tsconfig.node.json'],
    },
  },
  settings: {
    'prettier/prettier': 'error',
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import-x/extensions': ['.js', '.ts'],
    'import-x/resolver': {
      typescript: {
        project: './tsconfig.node.json',
      },
      node: true,
    },
  },
  rules: {
    ...ts.configs['eslint-recommended'].rules,
    ...ts.configs['recommended'].rules,
    ...importX.configs['recommended'].rules,
    ...importX.configs['typescript'].rules,
    ...jsRules,
    ...importRules,
    ...tsRules,
  },
};

const vueConfig = {
  files: ['**/*.vue'],
  plugins: {
    '@typescript-eslint': ts,
    'import-x': importX,
    'vue': vuePlugin,
  },
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.builtin,
      ...globals.browser,
    },
    parser: vueParser,
    parserOptions: {
      parser: {
        ts: tsParser,
        js: babelParser,
      },
    },
  },
  settings: {
    'prettier/prettier': 'error',
    'import-x/extensions': ['.vue'],
    'import-x/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
      'vue-eslint-parser': ['.vue'],
    },
    'import-x/resolver': {
      typescript: {
        project: ['./tsconfig.json'],
      },
    },
  },
  rules: {
    ...ts.configs['eslint-recommended'].rules,
    ...ts.configs['recommended'].rules,
    ...importX.configs['recommended'].rules,
    ...importX.configs['typescript'].rules,
    ...vueEslintConfig.overrides[0].rules,
    ...jsRules,
    ...importRules,
    ...tsRules,
    ...vueRules,
  },
};

export default [
  {
    ignores: ['node_modules', '.vscode', 'package-lock.json', 'dist', 'dist-electron', 'release', '.eslintcache'],
  },
  js.configs.recommended,
  prettierPlugin,
  jsConfig,
  tsConfig,
  tsNodeConfig,
  vueConfig,
];
