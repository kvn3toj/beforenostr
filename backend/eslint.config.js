// 🎸 SOLISTA BACKEND NESTJS
// Configuración especializada para backend NestJS
// Extiende la configuración del orquestador principal

const baseConfig = require('../eslint.config.cjs');

module.exports = [
  // Heredar configuración base del orquestador
  ...baseConfig.filter(
    (config) =>
      config.name === 'coomunity/global-ignores' ||
      config.name === 'coomunity/backend'
  ),

  // 🔧 REFINAMIENTOS ESPECÍFICOS BACKEND
  {
    name: 'coomunity/backend-overrides',
    files: ['**/*.{ts,js}'],
    ignores: [
      'prisma/seed*.ts', // Seed files pueden usar console.log
      'scripts/**', // Scripts de desarrollo
      'generated/**',
      'dist/**',
    ],
    rules: {
      // Permitir console en seeds y scripts
      'no-console': [
        'warn',
        {
          allow: ['warn', 'error', 'info'],
        },
      ],

      // Reglas específicas para Prisma
      '@typescript-eslint/no-explicit-any': [
        'error',
        {
          ignoreRestArgs: true, // Permitir any en rest args de Prisma
        },
      ],

      // Reglas específicas para NestJS decorators
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],

      // Permitir parámetros sin uso en controladores NestJS
      'no-unused-vars': 'off',
    },
  },

  // 🌟 REGLAS ESPECÍFICAS PARA SEEDS Y SCRIPTS
  {
    name: 'coomunity/backend-seeds',
    files: ['prisma/seed*.ts', 'scripts/**/*.{ts,js}'],
    rules: {
      'no-console': 'off', // Permitir console en seeds y scripts
      '@typescript-eslint/no-explicit-any': 'warn', // Más permisivo en scripts
    },
  },
];
