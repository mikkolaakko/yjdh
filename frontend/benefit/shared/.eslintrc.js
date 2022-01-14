const { join } = require('path');

module.exports = {
  extends: [
    'auto',
    'plugin:@next/next/recommended',
    'plugin:you-dont-need-lodash-underscore/compatible',
  ],
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      // Use package.json from both this package folder and root.
      { packageDir: [__dirname, join(__dirname, '../../')] },
    ],
    'no-void': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-export-from': 'off',
    'lodash/prefer-noop': 'off',
    'react/function-component-definition': 'off',
  },
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['**/__tests__/**'],
      rules: {
        'testing-library/render-result-naming-convention': 'off',
        'jest/expect-expect': 'off',
        'jest/no-done-callback': 'off',
        'security/detect-non-literal-regexp': 'off',
        'no-secrets/no-secrets': 'off',
        'no-await-in-loop': 'off',
        'no-restricted-syntax': 0,
      },
    },
  ],
};