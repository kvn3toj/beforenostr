#!/usr/bin/env node

/**
 * 🔐 Script de Restablecimiento de Contraseña de Admin
 *
 * Este script restablece la contraseña del usuario admin@gamifier.com
 * en el entorno de producción de forma segura.
 *
 * Uso en producción (Render):
 * node scripts/reset-admin-password.js
 */

const { PrismaClient } = require('../dist/generated/prisma');
const bcrypt = require('bcrypt');

async function resetAdminPassword() {
  const prisma = new PrismaClient();

  try {
    console.log('🔐 Iniciando restablecimiento de contraseña de admin...');

    // Nueva contraseña segura
    const newPassword = 'CoomUnity2025!Admin';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del admin
    const updatedUser = await prisma.user.update({
      where: { email: 'admin@gamifier.com' },
      data: { password: hashedPassword },
      select: { id: true, email: true, name: true, updatedAt: true },
    });

    console.log('✅ Contraseña de admin restablecida exitosamente:');
    console.log(`   - Usuario: ${updatedUser.email}`);
    console.log(`   - Nombre: ${updatedUser.name}`);
    console.log(`   - Actualizado: ${updatedUser.updatedAt}`);
    console.log(`   - Nueva contraseña: ${newPassword}`);
    console.log('');
    console.log('🔒 IMPORTANTE: Guarda esta contraseña en un lugar seguro.');
    console.log('🔒 Considera cambiarla después del primer login.');
  } catch (error) {
    console.error('❌ Error al restablecer contraseña:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
resetAdminPassword();
