import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert current file path and directory for FlatCompat
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize FlatCompat for Next.js legacy configs
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

// Import GTS flat config
import gts from 'gts';

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
  // Next.js Configuration (via FlatCompat)
  ...compat.extends('next/core-web-vitals'),
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
