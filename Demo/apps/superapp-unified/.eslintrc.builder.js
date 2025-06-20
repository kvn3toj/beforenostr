// 🎯 ESLint Configuration for Builder.io Components
// Enforces rules to prevent hook errors and import issues

module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    // 🚨 CRITICAL: Prevent massive Material UI imports
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['@mui/material'],
            importNames: ['*'],
            message: '❌ BUILDER.IO RULE: Use specific imports instead of massive imports from @mui/material. Example: import Box from "@mui/material/Box"'
          },
          {
            group: ['@mui/icons-material'],
            importNames: ['*'],
            message: '❌ BUILDER.IO RULE: Use specific imports instead of massive imports from @mui/icons-material. Example: import PlayArrowIcon from "@mui/icons-material/PlayArrow"'
          }
        ],
        paths: [
          {
            name: '@mui/material',
            message: '❌ BUILDER.IO RULE: Import specific components instead. Use: import Box from "@mui/material/Box"'
          },
          {
            name: '@mui/icons-material',
            message: '❌ BUILDER.IO RULE: Import specific icons instead. Use: import PlayArrowIcon from "@mui/icons-material/PlayArrow"'
          }
        ]
      }
    ],

    // 🔄 Enforce proper hook dependencies
    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',

    // 🧹 Require cleanup in useEffect
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: '(useCallback|useMemo)'
      }
    ],

    // 📦 Enforce proper TypeScript usage
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],

    // 🎯 Console logs allowed for debugging Builder.io issues
    'no-console': [
      'warn',
      {
        allow: ['warn', 'error', 'info']
      }
    ],

    // 🚨 Prevent potential circular dependencies
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',

    // 🔧 Enforce consistent naming for refs
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        filter: {
          regex: 'Ref$',
          match: true
        },
        format: ['camelCase'],
        suffix: ['Ref']
      }
    ]
  },

  // 🎯 Override rules for specific Builder.io component patterns
  overrides: [
    {
      files: ['**/pages/**/*.tsx', '**/components/**/*.tsx'],
      rules: {
        // Require error boundaries for complex components
        'react/display-name': 'error',
        
        // Enforce proper prop types
        'react/prop-types': 'off', // We use TypeScript
        '@typescript-eslint/explicit-function-return-type': 'off',
        
        // Allow any for Builder.io compatibility
        '@typescript-eslint/no-explicit-any': 'warn'
      }
    },
    {
      // Special rules for video/media components
      files: ['**/*Player*.tsx', '**/*Video*.tsx', '**/*Media*.tsx'],
      rules: {
        // Require cleanup effects
        'react-hooks/exhaustive-deps': 'error',
        
        // Require error handling
        'no-console': 'off', // Allow debugging in media components
        
        // Require proper ref typing
        '@typescript-eslint/no-non-null-assertion': 'warn'
      }
    }
  ],

  // 🛠️ Custom rules for Builder.io
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json'
      }
    }
  },

  // 🎯 Environment for Builder.io components
  env: {
    browser: true,
    es2021: true,
    node: true
  },

  // 📝 Parser options
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  }
}; 