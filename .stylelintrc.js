export default {
  extends: ['stylelint-config-standard'],
  overrides: [
    {
      files: ['**/*.html'],
      extends: ['stylelint-config-html'],
    },
    {
      files: ['**/*.vue'],
      extends: ['stylelint-config-standard', 'stylelint-config-standard-vue'],
    },
  ],
  plugins: ['stylelint-prettier'],
  rules: {
    'prettier/prettier': true,
    'declaration-empty-line-before': null,
    'no-empty-source': null,
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'v-bind'],
      },
    ],
    'selector-class-pattern': /^[a-zA-Z]+(-[a-zA-Z]+)*(__[a-zA-Z]+(-[a-zA-Z]+)*)?(--[a-zA-Z]+(-[a-zA-Z]+)*)?$/,
    'max-nesting-depth': 2,
    'value-keyword-case': [
      'lower',
      {
        ignoreKeywords: [],
        ignoreFunctions: ['v-bind'],
      },
    ],
  },
};
