const { PrismaClient } = require('./src/generated/prisma');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function verifyAdminUser() {
  try {
    console.log('🔍 Verificando usuario administrador...\n');
    
    // Buscar el usuario administrador
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@gamifier.com'
      },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!adminUser) {
      console.log('❌ Usuario administrador NO encontrado');
      console.log('🆕 Creando usuario administrador...\n');
      
      // Crear el usuario administrador
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      const newAdmin = await prisma.user.create({
        data: {
          email: 'admin@gamifier.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'Gamifier',
          name: 'Admin Gamifier',
          isActive: true
        }
      });

      // Buscar o crear el rol de administrador
      let adminRole = await prisma.role.findUnique({
        where: { name: 'ADMIN' }
      });

      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: {
            name: 'ADMIN',
            description: 'Administrator role with full access'
          }
        });
      }

      // Asignar el rol de administrador
      await prisma.userRole.create({
        data: {
          userId: newAdmin.id,
          roleId: adminRole.id
        }
      });

      console.log('✅ Usuario administrador creado exitosamente');
      console.log(`📧 Email: ${newAdmin.email}`);
      console.log(`🔑 Password: admin123`);
      console.log(`👤 Usuario ID: ${newAdmin.id}`);
      console.log(`🔒 Activo: ${newAdmin.isActive ? 'Sí' : 'No'}`);
      
    } else {
      console.log('✅ Usuario administrador encontrado:');
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`👤 Nombre: ${adminUser.firstName} ${adminUser.lastName}`);
      console.log(`🆔 Usuario ID: ${adminUser.id}`);
      console.log(`🔒 Activo: ${adminUser.isActive ? 'Sí' : 'No'}`);
      console.log(`🎭 Roles: ${adminUser.userRoles.map(ur => ur.role.name).join(', ') || 'Sin roles'}`);
      
      // Verificar la contraseña
      console.log('\n🔐 Verificando contraseña...');
      const isValidPassword = await bcrypt.compare('admin123', adminUser.password);
      console.log(`🔑 Contraseña válida: ${isValidPassword ? 'Sí' : 'No'}`);
      
      if (!isValidPassword) {
        console.log('\n🔧 Actualizando contraseña...');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { password: hashedPassword }
        });
        console.log('✅ Contraseña actualizada exitosamente');
      }
      
      if (!adminUser.isActive) {
        console.log('\n🔧 Activando usuario...');
        await prisma.user.update({
          where: { id: adminUser.id },
          data: { isActive: true }
        });
        console.log('✅ Usuario activado exitosamente');
      }
    }

    console.log('\n🧪 Realizando prueba de autenticación...');
    
    // Obtener el usuario actualizado
    const finalUser = await prisma.user.findUnique({
      where: { email: 'admin@gamifier.com' },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    });

    const passwordTest = await bcrypt.compare('admin123', finalUser.password);
    
    console.log('\n📋 RESUMEN FINAL:');
    console.log('================');
    console.log(`✅ Usuario existe: Sí`);
    console.log(`✅ Usuario activo: ${finalUser.isActive ? 'Sí' : 'No'}`);
    console.log(`✅ Contraseña válida: ${passwordTest ? 'Sí' : 'No'}`);
    console.log(`✅ Roles asignados: ${finalUser.userRoles.length > 0 ? 'Sí' : 'No'}`);
    
    if (finalUser.isActive && passwordTest) {
      console.log('\n🎉 El usuario administrador está listo para usar!');
      console.log('📧 Email: admin@gamifier.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('\n⚠️ Hay problemas con el usuario administrador que requieren atención');
    }

  } catch (error) {
    console.error('❌ Error al verificar usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyAdminUser(); 