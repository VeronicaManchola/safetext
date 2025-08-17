// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const pluginPrettier = require('eslint-plugin-prettier');
const pluginImport = require('eslint-plugin-import');

module.exports = defineConfig([
  // Config base de Expo (flat). Mantiene React Native y TypeScript listos.
  expoConfig,

  // Capa de reglas del proyecto
  {
    // Ignora todo lo que no es código de app para evitar “module is not defined”
    ignores: [
      'node_modules/**',
      'android/**',
      'ios/**',
      '.expo/**',
      'dist/**',
      'build/**',
      'babel.config.js',
      '.prettierrc.cjs',
    ],

    plugins: {
      prettier: pluginPrettier,
    },

    // Resolver para que eslint-plugin-import entienda TypeScript + tus aliases
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.json' },
        node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      },
    },

    rules: {
      // Prettier integrado como regla
      'prettier/prettier': 'error',

      // Orden de imports (agrupado, con salto, y alfabético)
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['internal', 'parent', 'sibling', 'index']],
          pathGroups: [
            // Aliases internos (ajusta según tus paths en tsconfig)
            { pattern: '@components/**', group: 'internal', position: 'after' },
            { pattern: '@constants/**', group: 'internal', position: 'after' },
            { pattern: '@hooks/**', group: 'internal', position: 'after' },
            { pattern: '@store/**', group: 'internal', position: 'after' },
            { pattern: '@domain/**', group: 'internal', position: 'after' },
            { pattern: '@services/**', group: 'internal', position: 'after' },
            { pattern: '@api/**', group: 'internal', position: 'after' },
            { pattern: '@utils/**', group: 'internal', position: 'after' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],

      // Mantener any como warning (no bloquea el flujo)
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
