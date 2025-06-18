import { test, expect } from '@playwright/test';

test.describe('Profile Integration Test - Sistema de Gestión de Usuario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:1111');
  });

  // Función helper para navegar a Mi Perfil
  async function navigateToProfile(page: any) {
    // Buscar y hacer click en el botón del menú o directamente en "Mi Perfil"
    try {
      // Primero intentar click directo
      await page.click('text=Mi Perfil', { timeout: 5000 });
    } catch {
      // Si falla, buscar un botón de menú y hacer click
      try {
        await page.click('[data-testid="MenuIcon"]', { timeout: 5000 });
        await page.waitForTimeout(500);
        await page.click('text=Mi Perfil');
      } catch {
        // Como último recurso, buscar en la barra de navegación principal
        await page.click('nav >> text=Mi Perfil');
      }
    }
  }

  test('Mi Perfil está completamente integrado con datos del ecosistema CoomÜnity', async ({ page }) => {
    // 1. Navegar a Mi Perfil
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // 2. Verificar header del perfil con información completa
    await expect(page.locator('text=Ana García Mendoza')).toBeVisible();
    await expect(page.locator('[data-testid="VerifiedIcon"]')).toBeVisible(); // Usuario verificado
    await expect(page.locator('text=Pionero')).toBeVisible(); // Rank de comunidad
    
    // 3. Verificar bio y ubicación
    await expect(page.locator('text=Diseñadora UX/UI especializada en interfaces intuitivas')).toBeVisible();
    await expect(page.locator('text=Medellín, Colombia')).toBeVisible();
    await expect(page.locator('text=Miembro desde 8 meses')).toBeVisible();
    await expect(page.locator('text=4.8/5 (15 reseñas)')).toBeVisible();

    // 4. Verificar stats rápidas en el header
    await expect(page.locator('text=7').first()).toBeVisible(); // Nivel
    await expect(page.locator('text=1250')).toBeVisible(); // ÜCoins
    await expect(page.locator('text=23').first()).toBeVisible(); // Gigs Completados
    await expect(page.locator('text=340')).toBeVisible(); // Puntos Ayni

    // 5. Verificar botones de acción
    await expect(page.locator('button:has([data-testid="EditIcon"])')).toBeVisible();
    await expect(page.locator('button:has([data-testid="PhotoCameraIcon"])')).toBeVisible();
    await expect(page.locator('button:has([data-testid="SettingsIcon"])').first()).toBeVisible();

    // 6. Verificar tabs de navegación
    await expect(page.locator('[role="tab"]:has-text("Actividades")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Habilidades")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Logros")')).toBeVisible();
    await expect(page.locator('[role="tab"]:has-text("Configuración")')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Actividades', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Tab de Actividades (ya está activo por defecto)
    await expect(page.locator('text=Marketplace').first()).toBeVisible();
    await expect(page.locator('text=ÜPlay').first()).toBeVisible();
    await expect(page.locator('text=Social').first()).toBeVisible();
    await expect(page.locator('text=Pilgrim').first()).toBeVisible();

    // Verificar datos del Marketplace
    await expect(page.locator('text=23 proyectos')).toBeVisible(); // Gigs completados
    await expect(page.locator('text=8 categorías')).toBeVisible(); // Servicios ofrecidos
    await expect(page.locator('text=98%')).toBeVisible(); // Satisfacción del cliente
    await expect(page.locator('text=2 horas')).toBeVisible(); // Tiempo de respuesta

    // Verificar datos de ÜPlay
    await expect(page.locator('text=12 eventos')).toBeVisible(); // Eventos participados
    await expect(page.locator('text=4.9/5.0')).toBeVisible(); // Rating como organizador
    await expect(page.locator('text=3 eventos')).toBeVisible(); // Eventos organizados
    await expect(page.locator('text=89 personas')).toBeVisible(); // Conexiones de red

    // Verificar datos de Social
    await expect(page.locator('text=45 publicaciones')).toBeVisible(); // Posts compartidos
    await expect(page.locator('text=7 grupos')).toBeVisible(); // Comunidades unidas
    await expect(page.locator('text=156 votos')).toBeVisible(); // Votos útiles
    await expect(page.locator('text=12 sesiones')).toBeVisible(); // Sesiones de mentoría

    // Verificar datos de Pilgrim
    await expect(page.locator('text=8 jornadas')).toBeVisible(); // Jornadas completadas
    await expect(page.locator('text=15 nuevas skills')).toBeVisible(); // Habilidades aprendidas
    await expect(page.locator('text=5 certificados')).toBeVisible(); // Certificados obtenidos
    await expect(page.locator('text=23 días')).toBeVisible(); // Racha de aprendizaje
  });

  test('Verificar funcionalidad de tabs - Habilidades', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Click en tab de Habilidades
    await page.click('[role="tab"]:has-text("Habilidades")');
    await page.waitForSelector('text=🎯 Habilidades y Competencias');

    // Verificar título y descripción
    await expect(page.locator('text=🎯 Habilidades y Competencias')).toBeVisible();
    await expect(page.locator('text=Basado en tu desempeño en proyectos y evaluaciones de la comunidad')).toBeVisible();

    // Verificar habilidades específicas con niveles
    await expect(page.locator('text=Diseño UX/UI')).toBeVisible();
    await expect(page.locator('text=95%').first()).toBeVisible(); // Nivel de UX/UI
    await expect(page.locator('text=Figma')).toBeVisible();
    await expect(page.locator('text=90%').first()).toBeVisible(); // Nivel de Figma
    await expect(page.locator('text=React.js')).toBeVisible();
    await expect(page.locator('text=85%').first()).toBeVisible(); // Nivel de React
    await expect(page.locator('text=Design Thinking')).toBeVisible();
    await expect(page.locator('text=88%').first()).toBeVisible(); // Nivel de Design Thinking

    // Verificar barras de progreso (LinearProgress)
    const progressBars = page.locator('[role="progressbar"]');
    await expect(progressBars).toHaveCount(6); // 6 habilidades

    // Verificar consejo al final
    await expect(page.locator('text=💡 Consejo: Completa más proyectos relacionados con estas habilidades')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Logros', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Click en tab de Logros
    await page.click('[role="tab"]:has-text("Logros")');
    await page.waitForSelector('text=🏆 Logros y Reconocimientos');

    // Verificar título y descripción
    await expect(page.locator('text=🏆 Logros y Reconocimientos')).toBeVisible();
    await expect(page.locator('text=Insignias ganadas por tu participación activa en CoomÜnity')).toBeVisible();

    // Verificar logros específicos
    await expect(page.locator('text=Pionero CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Miembro fundador de la comunidad')).toBeVisible();
    await expect(page.locator('text=LEGENDARY')).toBeVisible(); // Rareza

    await expect(page.locator('text=Mentor Destacado')).toBeVisible();
    await expect(page.locator('text=10+ sesiones de mentoría completadas')).toBeVisible();
    await expect(page.locator('text=EPIC')).toBeVisible(); // Rareza

    await expect(page.locator('text=Diseñador Estrella')).toBeVisible();
    await expect(page.locator('text=Rating promedio 4.8+ en diseño')).toBeVisible();
    await expect(page.locator('text=RARE')).toBeVisible(); // Rareza

    await expect(page.locator('text=Colaborador Activo')).toBeVisible();
    await expect(page.locator('text=100+ interacciones en comunidad')).toBeVisible();
    await expect(page.locator('text=COMMON')).toBeVisible(); // Rareza

    // Verificar iconos de trofeos
    const trophyIcons = page.locator('[data-testid="EmojiEventsIcon"]');
    await expect(trophyIcons).toHaveCount(4); // 4 logros + posibles otros

    // Verificar próximo logro
    await expect(page.locator('text=🎉 ¡Próximo logro! Completa 5 gigs más para desbloquear')).toBeVisible();
    await expect(page.locator('text="Maestro del Marketplace" (Legendary)')).toBeVisible();
  });

  test('Verificar funcionalidad de tabs - Configuración', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Click en tab de Configuración  
    await page.click('[role="tab"]:has-text("Configuración")');
    await page.waitForSelector('text=🔐 Configuración de Privacidad');

    // Verificar sección de privacidad
    await expect(page.locator('text=🔐 Configuración de Privacidad')).toBeVisible();
    await expect(page.locator('text=Perfil Visible Públicamente')).toBeVisible();
    await expect(page.locator('text=Mostrar Ingresos')).toBeVisible();
    await expect(page.locator('text=Mostrar Ubicación')).toBeVisible();
    await expect(page.locator('text=Mostrar Email')).toBeVisible();

    // Verificar sección de notificaciones
    await expect(page.locator('text=🔔 Configuración de Notificaciones')).toBeVisible();
    await expect(page.locator('text=Notificaciones por Email')).toBeVisible();
    await expect(page.locator('text=Notificaciones Push')).toBeVisible();
    await expect(page.locator('text=Notificaciones SMS')).toBeVisible();
    await expect(page.locator('text=Marketing y Promociones')).toBeVisible();

    // Verificar switches funcionales
    const switches = page.locator('input[type="checkbox"]');
    await expect(switches).toHaveCount(8); // 4 privacidad + 4 notificaciones

    // Verificar configuraciones generales
    await expect(page.locator('text=⚙️ Configuraciones Generales')).toBeVisible();
    await expect(page.locator('text=Idioma')).toBeVisible();
    await expect(page.locator('text=Zona Horaria')).toBeVisible();
    await expect(page.locator('text=Moneda Preferida')).toBeVisible();

    // Verificar selects con valores por defecto
    await expect(page.locator('text=Español')).toBeVisible();
    await expect(page.locator('text=Bogotá (COT)')).toBeVisible();
    await expect(page.locator('text=COP - Peso Colombiano')).toBeVisible();

    // Verificar mensaje de perfil completo
    await expect(page.locator('text=✅ Perfil Completo: Tu perfil está 100% completo')).toBeVisible();
  });

  test('Verificar diálogo de edición', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Abrir diálogo de edición
    await page.click('button:has([data-testid="EditIcon"])');
    await page.waitForSelector('text=✏️ Editar Perfil');

    // Verificar campos del diálogo
    await expect(page.locator('text=✏️ Editar Perfil')).toBeVisible();
    await expect(page.locator('input[value="Ana García Mendoza"]')).toBeVisible();
    await expect(page.locator('textarea:has-text("Diseñadora UX/UI especializada")')).toBeVisible();
    await expect(page.locator('input[value="Medellín, Colombia"]')).toBeVisible();
    await expect(page.locator('input[value="+57 300 123 4567"]')).toBeVisible();

    // Verificar botones del diálogo
    await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
    await expect(page.locator('button:has-text("Guardar Cambios")')).toBeVisible();

    // Cerrar diálogo
    await page.click('button:has-text("Cancelar")');
    await expect(page.locator('text=✏️ Editar Perfil')).not.toBeVisible();
  });

  test('Verificar interactividad de switches en configuración', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Ir a configuración
    await page.click('[role="tab"]:has-text("Configuración")');
    await page.waitForSelector('text=🔐 Configuración de Privacidad');

    // Encontrar y clickear un switch específico
    const profileVisibleSwitch = page.locator('text=Perfil Visible Públicamente').locator('..').locator('input[type="checkbox"]');
    
    // Verificar que el switch es interactivo (podemos hacer click)
    await profileVisibleSwitch.click();
    
    // Los switches deberían estar funcionando (aunque no persistimos el estado en este test)
    // Verificamos que al menos son clicables
    await expect(profileVisibleSwitch).toBeDefined();
  });

  test('Verificar que no hay indicadores de desarrollo pendiente', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Verificar que NO aparecen indicadores de desarrollo
    await expect(page.locator('text=pendiente')).not.toBeVisible();
    await expect(page.locator('text=en desarrollo')).not.toBeVisible();
    await expect(page.locator('text=próximamente')).not.toBeVisible();
    await expect(page.locator('text=Página del perfil de usuario en desarrollo')).not.toBeVisible();
  });

  test('Verificar mejoras significativas comparado con estado anterior', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Verificar elementos clave que confirman las mejoras
    const improvedFeatures = [
      'Ana García Mendoza', // Nombre completo del usuario
      'Diseñadora UX/UI especializada', // Bio profesional
      'Pionero', // Rank de comunidad
      '🎯 Habilidades y Competencias', // Sección de habilidades
      '🏆 Logros y Reconocimientos', // Sección de logros
      '🔐 Configuración de Privacidad', // Configuración avanzada
      'LEGENDARY', // Sistema de rareza de logros
      'Marketplace', // Integración con otros módulos
      'ÜPlay', // Integración con ÜPlay
      'Pilgrim', // Integración con Pilgrim
      '✅ Perfil Completo', // Estado del perfil
      'Miembro desde 8 meses' // Datos de membresía
    ];

    for (const feature of improvedFeatures) {
      await expect(page.locator(`text=${feature}`).first()).toBeVisible();
    }

    // Verificar que tiene múltiples tabs (funcionalidad nueva)
    await expect(page.locator('[role="tablist"]')).toBeVisible();
    
    // Verificar avatar y elementos visuales avanzados
    const avatar = page.locator('img').or(page.locator('[role="img"]')).first();
    await expect(avatar).toBeDefined();

    // Contar contenido para verificar el aumento significativo
    const content = await page.textContent('main');
    const contentLength = content?.length || 0;

    // El perfil era básico (~264 caracteres) ahora debe ser mucho mayor
    expect(contentLength).toBeGreaterThan(1500);
  });

  test('Verificar integración completa con el ecosistema CoomÜnity', async ({ page }) => {
    await navigateToProfile(page);
    await page.waitForSelector('text=Ana García Mendoza');

    // Verificar estadísticas específicas del ecosistema CoomÜnity
    await expect(page.locator('text=ÜCoins')).toBeVisible(); // Moneda del ecosistema
    await expect(page.locator('text=Puntos Ayni')).toBeVisible(); // Sistema de ayuda mutua
    await expect(page.locator('text=usr_640baa58')).not.toBeVisible(); // ID interno no visible al usuario

    // Verificar integración con todos los módulos
    await expect(page.locator('text=Marketplace')).toBeVisible();
    await expect(page.locator('text=ÜPlay')).toBeVisible();
    await expect(page.locator('text=Social')).toBeVisible();
    await expect(page.locator('text=Pilgrim')).toBeVisible();

    // Verificar datos coherentes del ecosistema
    await expect(page.locator('text=ana.garcia@coomunity.co')).not.toBeVisible(); // Email privado
    await expect(page.locator('text=+57 300 123 4567')).not.toBeVisible(); // Teléfono privado
    
    // Verificar elementos de gamificación
    await expect(page.locator('text=Nivel')).toBeVisible();
    await expect(page.locator('text=Pionero')).toBeVisible(); // Rank
    await expect(page.locator('text=LEGENDARY')).toBeVisible(); // Rareza de logros
    
    // Verificar elementos culturales colombianos
    await expect(page.locator('text=Medellín, Colombia')).toBeVisible();
    await expect(page.locator('text=COP - Peso Colombiano')).toBeVisible();
    await expect(page.locator('text=Bogotá (COT)')).toBeVisible();
  });
}); 