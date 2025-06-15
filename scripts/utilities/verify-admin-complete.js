const { PrismaClient } = require('./src/generated/prisma');

async function verifyAdminComplete() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 VERIFICACIÓN COMPLETA DEL USUARIO ADMINISTRADOR\n');
    
    // 1. Verificar usuario administrador
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@gamifier.com' },
      include: {
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true
                  }
                }
              }
            }
          }
        }
      }
    });
    
    if (!adminUser) {
      console.log('❌ Usuario administrador NO encontrado');
      return;
    }
    
    console.log('✅ Usuario administrador encontrado:');
    console.log('- ID:', adminUser.id);
    console.log('- Email:', adminUser.email);
    console.log('- Nombre:', adminUser.name);
    console.log('- Activo:', adminUser.isActive);
    console.log('- Password configurado:', adminUser.password ? 'SÍ' : 'NO');
    console.log('- Roles asignados:', adminUser.userRoles.length);
    
    // 2. Verificar roles
    console.log('\n📋 ROLES ASIGNADOS:');
    if (adminUser.userRoles.length === 0) {
      console.log('⚠️ NO tiene roles asignados');
    } else {
      adminUser.userRoles.forEach((userRole, index) => {
        console.log(`${index + 1}. Rol: ${userRole.role.name}`);
        console.log(`   Descripción: ${userRole.role.description || 'Sin descripción'}`);
        console.log(`   Permisos: ${userRole.role.rolePermissions.length}`);
      });
    }
    
    // 3. Verificar permisos
    console.log('\n🔐 PERMISOS DISPONIBLES:');
    const allPermissions = adminUser.userRoles.flatMap(userRole => 
      userRole.role.rolePermissions.map(rp => rp.permission.name)
    );
    
    if (allPermissions.length === 0) {
      console.log('⚠️ NO tiene permisos asignados');
    } else {
      allPermissions.forEach((permission, index) => {
        console.log(`${index + 1}. ${permission}`);
      });
    }
    
    // 4. Verificar si necesita permisos básicos de admin
    const requiredPermissions = [
      'users:read', 'users:write', 'users:delete',
      'roles:read', 'roles:write', 'roles:delete',
      'permissions:read', 'permissions:write',
      'admin:access'
    ];
    
    console.log('\n🎯 VERIFICACIÓN DE PERMISOS REQUERIDOS:');
    const missingPermissions = requiredPermissions.filter(req => 
      !allPermissions.includes(req)
    );
    
    if (missingPermissions.length > 0) {
      console.log('⚠️ Permisos faltantes:');
      missingPermissions.forEach(perm => console.log(`   - ${perm}`));
    } else {
      console.log('✅ Todos los permisos básicos están presentes');
    }
    
    // 5. Test de login directo
    console.log('\n🔑 TEST DE AUTENTICACIÓN:');
    try {
      const bcrypt = require('bcryptjs');
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      console.log('Password "admin123" válida:', isPasswordValid ? '✅ SÍ' : '❌ NO');
    } catch (error) {
      console.log('❌ Error verificando password:', error.message);
    }
    
    // 6. Resumen final
    console.log('\n📊 RESUMEN:');
    console.log('- Usuario existe:', '✅');
    console.log('- Usuario activo:', adminUser.isActive ? '✅' : '❌');
    console.log('- Password configurado:', adminUser.password ? '✅' : '❌');
    console.log('- Roles asignados:', adminUser.userRoles.length > 0 ? '✅' : '❌');
    console.log('- Permisos disponibles:', allPermissions.length > 0 ? '✅' : '❌');
    
    if (adminUser.isActive && adminUser.password && adminUser.userRoles.length > 0) {
      console.log('\n🎉 ESTADO: Usuario administrador COMPLETAMENTE FUNCIONAL');
    } else {
      console.log('\n⚠️ ESTADO: Usuario administrador REQUIERE CONFIGURACIÓN');
    }
    
  } catch (error) {
    console.error('❌ Error en verificación:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminComplete(); 