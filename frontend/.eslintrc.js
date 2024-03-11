module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  'overrides': [
    {
      'env': {
        'node': true,
      },
      'files': [
        '.eslintrc.{js,cjs}',
      ],
      'parserOptions': {
        'sourceType': 'script',
      },
    },
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 'latest',
    'sourceType': 'module',
  },
  'plugins': [
    '@typescript-eslint',
    'react',
    'jsx-max-len',
    'import',
    'no-relative-import-paths',
    'simple-import-sort',
    'brackets',
  ],
  'rules': {
    'prefer-const': 'error',
    'no-prototype-builtins': 'off',
    'require-atomic-updates': 'off',

    'comma-dangle': [
      'error',
      {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'never',
      },
    ],
    'curly': 'error',
    'no-extra-bind': 'error',
    'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 1 }],
    'no-lonely-if': 'error',
    'eol-last': ['error', 'always'],
    'comma-spacing': ['error', { 'before': false, 'after': true }],
    'key-spacing': ['error', { 'afterColon': true, 'beforeColon': false }],
    'eqeqeq': 'off',
    'no-eval': 'error',
    'no-console': 'warn',
    'no-self-compare': 'error',
    'no-else-return': ['error', { allowElseIf: false }],
    'no-unused-expressions': [
      'error',
      {
        'allowTaggedTemplates': true,
        'allowShortCircuit': true,
        'allowTernary': true,
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        'vars': 'all',
        'args': 'all',
      },
    ],
    'no-use-before-define': [
      'error',
      {
        'functions': false,
      },
    ],
    'wrap-iife': 'error',
    'yoda': ['error', 'never'],
    'strict': ['error', 'never'],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': [
      'error',
      {
        builtinGlobals: true,
        'hoist': 'all',
        'allow': [
          'done',
          'cb',
          'callback',
          'history',
          'name',
          'Text',
          'event',
          'Range',
          'MouseEvent',
        ],
      },
    ],

    // stylistic
    'brace-style': [
      'error',
      'stroustrup',
    ],
    'comma-style': [
      'error',
      'last',
    ],
    'space-infix-ops': ['error'],
    'one-var': [
      'error',
      {
        'initialized': 'never',
      },
    ],
    'no-trailing-spaces': 'error',
    'newline-per-chained-call': ['error', { 'ignoreChainWithDepth': 2 }],
    'react/no-unescaped-entities': 'off',
    'function-call-argument-newline': ['error', 'consistent'],
    'operator-linebreak': ['error', 'before'],
    'function-paren-newline': ['error', 'multiline-arguments'],
    'implicit-arrow-linebreak': ['error', 'beside'],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreRegExpLiterals: true,
        ignoreUrls: true,
        ignorePattern: '^\\s+\\w+[=:\\s]+["\'][\\w\\-_0-9\\s\'\\.,!?’]+["\'&],?',
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreComments: true,
      },
    ],
    'multiline-ternary': ['error', 'always-multiline'],
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: '*', next: ['return', 'class', 'export', 'function', 'throw', 'try'] },
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      { blankLine: 'any', prev: ['const', 'let', 'var'], next: ['const', 'let', 'var'] },
      { blankLine: 'always', prev: 'expression', next: ['if', 'switch', 'for'] },
    ],
    'brackets/array-bracket-newline': 'error',
    'brackets/call-parens-newline': 'error',
    'brackets/conditional-parens-newline': 'error',
    'brackets/func-parens-newline': 'error',
    'brackets/object-curly-newline': 'error',

    // es6
    'no-var': 'error',
    'arrow-parens': ['error', 'as-needed'],
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-spacing': 'error',

    'padded-blocks': ['error', 'never'],
    'no-multi-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'linebreak-style': [
      'error',
      'unix',
    ],
    'quotes': [
      'error',
      'single',
    ],
    'semi': [
      'error',
      'always',
    ],
    'new-cap': [
      'error',
      {
        newIsCap: true,
        capIsNew: false,
      },
    ],
    'keyword-spacing': ['error'],
    'space-before-blocks': ['error', 'always'],
    'space-in-parens': ['error', 'never'],
    'space-before-function-paren': ['error', {
      anonymous: 'never',
      named: 'never',
      asyncArrow: 'always',
    }],

    // react rules
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/no-access-state-in-setstate': 'warn',
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    'react/jsx-max-props-per-line': ['error', { 'maximum': 1, 'when': 'multiline' }],
    'jsx-max-len/jsx-max-len': ['error', { 'lineMaxLength': 120, 'tabWidth': 4, 'maxAttributesPerLine': 1 }],

    'react/no-unused-prop-types': 'error',
    'react/prop-types': 'error',
    'react/jsx-key': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/prefer-stateless-function': 'error',
    'react/prefer-es6-class': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-closing-bracket-location': 'error',
    'jsx-quotes': [
      'error',
      'prefer-double',
    ],
    'react/jsx-tag-spacing': 'error',
    'react/jsx-curly-spacing': [
      'error',
      {
        'when': 'never',
      },
    ],
    'react/jsx-boolean-value': 'error',
    'react/no-string-refs': 'error',
    'react/jsx-wrap-multilines': 'error',
    'react/self-closing-comp': 'error',
    'react/jsx-no-bind': [
      'error',
      {
        'ignoreRefs': true,
        'allowArrowFunctions': true,
      },
    ],
    'react/require-render-return': 'error',
    'react/no-multi-comp': ['error', { 'ignoreStateless': false }],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-curly-newline': ['error', { multiline: 'consistent', singleline: 'consistent' }],
    'react/jsx-equals-spacing': ['error', 'never'],
    'react/jsx-one-expression-per-line': 'error',
    'react/display-name': 'off',

    // imports
    'import/no-relative-packages': 'error',
    'no-relative-import-paths/no-relative-import-paths': [
      'error',
      {
        'allowSameFolder': true,
        'rootDir': 'frontend/src',
        'prefix': '@',
      },
    ],
    'import/newline-after-import': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        'groups': [
          // Packages
          [
            '^react',
            '^@?\\w',
          ],

          // Packages's or global style imports.
          ['^.*dist.*'],
          ['^'],

          ['^\\u0000@/Components', '^@/Components'],
          ['^\\u0000@/app', '^@/app'],
          ['^\\u0000@/services', '^@/services'],
          ['^\\u0000@/interfaces', '^@/interfaces'],
          ['^\\u0000@/styles', '^@/styles'],
          ['^\\u0000@/utils', '^@/utils'],
          ['^\\u0000@/hooks', '^@/hooks'],
          ['^\\u0000@/tests', '^@/tests'],

          ['^\\u0000\\./Components/.*', '^\\./Components/.*'],
          ['^\\./\\w+.[jt]sx', '^\\./.+.[jt]s', '^\\./\\w+'],

          // Project's style imports.
          ['^@/Components/.*.scss', '^@/Components/.*.css'],
          ['^./.*.scss', '^./.*.css'],
        ],
      },
    ],
  },
};

