import { test, expect } from '@playwright/test';

test.describe('Videos Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/videos');
  });

  test('Vi-25150: Videos - Sistema multimedia completo funcional', async ({ page }) => {
    // Verificar elementos básicos del header
    await expect(page.locator('h3')).toContainText('📹 CoomÜnity Videos');
    await expect(page.locator('text=Plataforma de contenido multimedia educativo')).toBeVisible();
    
    // Verificar chips de estadísticas del usuario
    await expect(page.locator('text=Videos Vistos')).toBeVisible();
    await expect(page.locator('text=de Contenido')).toBeVisible();
    await expect(page.locator('text=Días de Racha')).toBeVisible();
    
    // Verificar barra de búsqueda
    await expect(page.locator('input[placeholder*="Buscar videos"]')).toBeVisible();
    
    // Verificar iconos de navegación
    await expect(page.locator('[data-testid="ViewListIcon"], [data-testid="ViewModuleIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="SubscriptionsIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="SettingsIcon"]')).toBeVisible();

    console.log('✅ Vi-25150: Header y navegación verificados');
  });

  test('Vi-a3b2a: Videos - Sistema de categorías de contenido', async ({ page }) => {
    // Verificar sección de categorías
    await expect(page.locator('text=🎯 Categorías de Contenido')).toBeVisible();
    
    // Verificar categorías específicas del ecosistema CoomÜnity
    const categories = [
      'Todas', 'Fotografía', 'Mindfulness', 'Tecnología', 'Negocios', 
      'Salud', 'Productividad', 'Arte', 'Finanzas', 'Comunicación', 'Emprendimiento'
    ];
    
    for (const category of categories) {
      await expect(page.locator(`button:has-text("${category}")`)).toBeVisible();
    }
    
    // Verificar que las categorías muestran contadores de videos
    await expect(page.locator('text=203').first()).toBeVisible(); // Tecnología
    await expect(page.locator('text=156').first()).toBeVisible(); // Negocios
    
    // Probar selección de categoría
    await page.click('button:has-text("Tecnología")');
    await page.waitForTimeout(500); // Esperar filtrado
    
    console.log('✅ Vi-a3b2a: Sistema de categorías verificado');
  });

  test('Vi-bff2d: Videos - Funcionalidad del ecosistema CoomÜnity', async ({ page }) => {
    // Verificar videos destacados con datos específicos
    await expect(page.locator('text=⭐ Videos Destacados')).toBeVisible();
    
    // Verificar videos específicos del ecosistema
    await expect(page.locator('text=Diseño UX/UI: Principios fundamentales')).toBeVisible();
    await expect(page.locator('text=Emprendimiento Digital: De la idea al MVP')).toBeVisible();
    await expect(page.locator('text=React.js Avanzado: Optimización')).toBeVisible();
    
    // Verificar elementos de gamificación
    await expect(page.locator('text=CoomÜnity Academy')).toBeVisible();
    await expect(page.locator('text=Dev CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Emprendedores CoomÜnity')).toBeVisible();
    
    // Verificar ratings y vistas
    await expect(page.locator('text=4.9').first()).toBeVisible();
    await expect(page.locator('text=12.5k vistas')).toBeVisible();
    
    console.log('✅ Vi-bff2d: Funcionalidad del ecosistema verificada');
  });

  test('Vi-3460b: Videos - Funcionalidad de tabs - Tendencias', async ({ page }) => {
    // Cambiar a la tab de Tendencias
    await page.click('button[role="tab"]:has-text("Tendencias")');
    await page.waitForTimeout(500);
    
    // Verificar contenido de tendencias
    await expect(page.locator('text=📈 Videos en Tendencia')).toBeVisible();
    await expect(page.locator('text=Los videos más populares del ecosistema CoomÜnity')).toBeVisible();
    
    // Verificar ranking de videos
    await expect(page.locator('text=#1').first()).toBeVisible();
    await expect(page.locator('text=#2').first()).toBeVisible();
    await expect(page.locator('text=#3').first()).toBeVisible();
    
    // Verificar progreso de visualización
    await expect(page.locator('text=📊 Tu Progreso de Visualización')).toBeVisible();
    await expect(page.locator('text=Videos completados esta semana')).toBeVisible();
    await expect(page.locator('text=78% de tu meta semanal')).toBeVisible();
    
    // Verificar estadísticas del usuario
    await expect(page.locator('text=Tiempo total visto')).toBeVisible();
    await expect(page.locator('text=Videos completados')).toBeVisible();
    await expect(page.locator('text=Racha actual')).toBeVisible();
    
    console.log('✅ Vi-3460b: Tab de Tendencias verificada');
  });

  test('Vi-d97a8: Videos - Funcionalidad de tabs - Mis Playlists', async ({ page }) => {
    // Cambiar a la tab de Playlists
    await page.click('button[role="tab"]:has-text("Mis Playlists")');
    await page.waitForTimeout(500);
    
    // Verificar header de playlists
    await expect(page.locator('text=📚 Mis Listas de Reproducción')).toBeVisible();
    await expect(page.locator('button:has-text("Nueva Playlist")')).toBeVisible();
    
    // Verificar playlists específicas del ecosistema
    await expect(page.locator('text=Desarrollo Full Stack CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Diseño de Experiencias Digitales')).toBeVisible();
    await expect(page.locator('text=Emprendimiento y Negocios Digitales')).toBeVisible();
    
    // Verificar información de las playlists
    await expect(page.locator('text=24 videos').first()).toBeVisible();
    await expect(page.locator('text=Serie completa de desarrollo full stack')).toBeVisible();
    
    // Verificar botones de acción
    await expect(page.locator('button:has-text("Reproducir")')).toBeVisible();
    await expect(page.locator('button:has-text("Aleatorio")')).toBeVisible();
    
    // Probar apertura del diálogo de nueva playlist
    await page.click('button:has-text("Nueva Playlist")');
    await expect(page.locator('text=📚 Crear Nueva Playlist')).toBeVisible();
    await expect(page.locator('input[label="Nombre de la Playlist"]')).toBeVisible();
    
    // Cerrar diálogo
    await page.click('button:has-text("Cancelar")');
    
    console.log('✅ Vi-d97a8: Tab de Playlists verificada');
  });

  test('Vi-4e493: Videos - Funcionalidad de tabs - Historial', async ({ page }) => {
    // Cambiar a la tab de Historial
    await page.click('button[role="tab"]:has-text("Historial")');
    await page.waitForTimeout(500);
    
    // Verificar contenido del historial
    await expect(page.locator('text=📝 Historial de Reproducción')).toBeVisible();
    await expect(page.locator('text=Tus últimos 156 videos vistos')).toBeVisible();
    
    // Verificar elementos del historial
    await expect(page.locator('text=Visto el')).toBeVisible();
    await expect(page.locator('text=Progreso:')).toBeVisible();
    
    // Verificar tip de gamificación
    await expect(page.locator('text=💡')).toBeVisible();
    await expect(page.locator('text=Termina los videos para desbloquear nuevos contenidos')).toBeVisible();
    await expect(page.locator('text=ganar ÜCoins')).toBeVisible();
    
    console.log('✅ Vi-4e493: Tab de Historial verificada');
  });

  test('Vi-c80b9: Videos - Funcionalidad de búsqueda y filtros', async ({ page }) => {
    const searchBox = page.locator('input[placeholder*="Buscar videos"]');
    
    // Probar búsqueda
    await searchBox.fill('React');
    await page.waitForTimeout(1000);
    
    // Verificar que se muestran resultados relacionados
    await expect(page.locator('text=React.js Avanzado')).toBeVisible();
    
    // Limpiar búsqueda
    await searchBox.clear();
    await page.waitForTimeout(500);
    
    // Probar filtro por categoría
    await page.click('button:has-text("Tecnología")');
    await page.waitForTimeout(500);
    
    // Verificar cambio de vista
    const viewToggle = page.locator('[data-testid="ViewListIcon"], [data-testid="ViewModuleIcon"]').first();
    await viewToggle.click();
    await page.waitForTimeout(500);
    
    console.log('✅ Vi-c80b9: Búsqueda y filtros verificados');
  });

  test('Vi-2691a: Videos - Reproductor flotante funcional', async ({ page }) => {
    // Buscar y hacer clic en el botón de play de un video
    const playButton = page.locator('[data-testid="PlayArrowIcon"]').first();
    await playButton.click();
    await page.waitForTimeout(1000);
    
    // Verificar que aparece el reproductor flotante
    await expect(page.locator('text=Diseño UX/UI: Principios fundamentales').first()).toBeVisible();
    
    // Verificar controles del reproductor flotante
    await expect(page.locator('[data-testid="SkipPreviousIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="PlayArrowIcon"]:visible, [data-testid="PauseIcon"]:visible')).toBeVisible();
    await expect(page.locator('[data-testid="SkipNextIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="VolumeUpIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="FullscreenIcon"]')).toBeVisible();
    
    // Verificar barra de progreso
    await expect(page.locator('.MuiLinearProgress-root')).toBeVisible();
    
    // Probar cerrar reproductor
    await page.click('button:has-text("×")');
    await page.waitForTimeout(500);
    
    console.log('✅ Vi-2691a: Reproductor flotante verificado');
  });

  test('Vi-8b4ea: Videos - Datos del análisis extraído', async ({ page }) => {
    // Verificar datos específicos del análisis extraído
    
    // Datos de categorías con contadores precisos
    await expect(page.locator('text=203').first()).toBeVisible(); // Tecnología
    await expect(page.locator('text=156').first()).toBeVisible(); // Negocios
    await expect(page.locator('text=145').first()).toBeVisible(); // Emprendimiento
    
    // Verificar canales específicos del ecosistema
    await expect(page.locator('text=CoomÜnity Academy')).toBeVisible();
    await expect(page.locator('text=Dev CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Emprendedores CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Bienestar CoomÜnity')).toBeVisible();
    
    // Verificar estadísticas de usuario basadas en análisis
    await expect(page.locator('text=89').first()).toBeVisible(); // Videos vistos
    await expect(page.locator('text=12').first()).toBeVisible(); // Días de racha
    
    // Cambiar a tab de Tendencias para verificar más datos
    await page.click('button[role="tab"]:has-text("Tendencias")');
    await page.waitForTimeout(500);
    
    // Verificar datos específicos de progreso
    await expect(page.locator('text=78%')).toBeVisible(); // Meta semanal
    
    console.log('✅ Vi-8b4ea: Datos del análisis extraído verificados');
  });

  test('Vi-9b478: Videos - Integración con ecosistema CoomÜnity', async ({ page }) => {
    // Verificar elementos específicos del ecosistema CoomÜnity
    await expect(page.locator('text=📹 CoomÜnity Videos')).toBeVisible();
    await expect(page.locator('text=ÜCoins')).toBeVisible();
    
    // Verificar integración de gamificación
    await page.click('button[role="tab"]:has-text("Historial")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=ÜCoins por tu progreso')).toBeVisible();
    
    // Verificar branding coherente
    await expect(page.locator('text=CoomÜnity').first()).toBeVisible();
    
    // Verificar elementos de comunidad
    await page.click('button[role="tab"]:has-text("Mis Playlists")');
    await page.waitForTimeout(500);
    
    await expect(page.locator('text=CoomÜnity').first()).toBeVisible();
    
    console.log('✅ Vi-9b478: Integración con ecosistema verificada');
  });

  test('Vi-890f9: Videos - Funciones de desarrollo pendiente', async ({ page }) => {
    // Verificar que NO hay indicadores de "en desarrollo"
    await expect(page.locator('text=en desarrollo')).not.toBeVisible();
    await expect(page.locator('text=próximamente')).not.toBeVisible();
    await expect(page.locator('text=coming soon')).not.toBeVisible();
    
    // Verificar que todas las funcionalidades están implementadas
    
    // Funcionalidad de categorías
    await page.click('button:has-text("Tecnología")');
    await page.waitForTimeout(500);
    
    // Funcionalidad de tabs
    await page.click('button[role="tab"]:has-text("Tendencias")');
    await page.waitForTimeout(500);
    await page.click('button[role="tab"]:has-text("Mis Playlists")');
    await page.waitForTimeout(500);
    await page.click('button[role="tab"]:has-text("Historial")');
    await page.waitForTimeout(500);
    
    // Funcionalidad de búsqueda
    const searchBox = page.locator('input[placeholder*="Buscar videos"]');
    await searchBox.fill('test');
    await page.waitForTimeout(500);
    await searchBox.clear();
    
    // Funcionalidad de reproductor
    const playButton = page.locator('[data-testid="PlayArrowIcon"]').first();
    await playButton.click();
    await page.waitForTimeout(1000);
    
    // Cerrar reproductor
    await page.click('button:has-text("×")');
    
    console.log('✅ Vi-890f9: No hay funciones de desarrollo pendiente');
  });
});

test.describe('Videos Mobile Tests', () => {
  test.use({ 
    viewport: { width: 375, height: 667 }
  });

  test('Videos responsive design en móvil', async ({ page }) => {
    await page.goto('/videos');
    
    // Verificar que el contenido se adapta a móvil
    await expect(page.locator('h3')).toContainText('📹 CoomÜnity Videos');
    
    // Verificar grid responsivo de categorías
    await expect(page.locator('button:has-text("Todas")')).toBeVisible();
    
    // Verificar que las cards de videos se adaptan
    await expect(page.locator('text=⭐ Videos Destacados')).toBeVisible();
    
    console.log('✅ Videos responsive design verificado en móvil');
  });
}); 