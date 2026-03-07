import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert current file path and directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import gts from 'gts';

// Core next plugins
import nextPlugin from '@next/eslint-plugin-next';
// eslint-plugin-react is currently crashing with ESLint 10 due to contextOrFilename.getFilename not a function.
// import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';

export default [
  // Global Ignores
  {
    ignores: [
      '.next/',
      'build/',
      'coverage/',
      'node_modules/',
      'out/',
      '**/*.d.ts', // Usually handled by tsc, ignore in lint to speed up
    ],
  },
  // GTS Configuration
  ...gts,

  // Next.js Core Web Vitals equivalent configuration for Flat Config
  // Removed `eslint-plugin-react` because it's incompatible with ESLint 10.
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': hooksPlugin,
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },

  // Custom Overrides
  {
    rules: {
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];
