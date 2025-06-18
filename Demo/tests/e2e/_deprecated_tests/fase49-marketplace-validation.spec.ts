import { test, expect } from '@playwright/test';

/**
 * 🧪 FASE 49 - Validación Marketplace CoomÜnity
 * Pruebas automatizadas para verificar alineación con Agile Inception
 */

test.describe('FASE 49 - Marketplace CoomÜnity - Validación Agile Inception', () => {

  test.beforeEach(async ({ page }) => {
    // Navegar al marketplace
    await page.goto('http://localhost:2222/marketplace');
    await page.waitForLoadState('networkidle');
  });

  test('🏪 Verificar Header y Terminología Oficial CoomÜnity', async ({ page }) => {
    console.log('🔍 Verificando header y terminología oficial...');

    // Verificar header principal con terminología oficial
    await expect(page.locator('text=🏪 Marketplace CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Economía Colaborativa')).toBeVisible();
    await expect(page.locator('text=Emprendedores Confiables')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();

    // Verificar mensaje sobre sistema de confianza
    await expect(page.locator('text=Solo Emprendedores Confiables')).toBeVisible();
    await expect(page.locator('text=Mëritos')).toBeVisible();
    await expect(page.locator('text=descuentos del 10% al 50%')).toBeVisible();
    await expect(page.locator('text=Consumidor Consciente')).toBeVisible();

    console.log('✅ Header y terminología oficial verificados');
  });

  test('💰 Verificar Sistema Monetario Lükas', async ({ page }) => {
    console.log('🔍 Verificando sistema monetario Lükas...');

    // Verificar que todos los productos usen moneda Lükas
    const priceElements = page.locator('text=/\\d+ Lükas/');
    const priceCount = await priceElements.count();
    expect(priceCount).toBeGreaterThan(0);

    // Verificar conversión aproximada a USD
    await expect(page.locator('text=/≈ \\$\\d+ USD/')).toBeVisible();

    // Verificar que NO aparezcan precios en COP
    const copPrices = page.locator('text=COP');
    await expect(copPrices).toHaveCount(0);

    console.log('✅ Sistema monetario Lükas verificado');
  });

  test('👥 Verificar Emprendedores Confiables', async ({ page }) => {
    console.log('🔍 Verificando emprendedores confiables...');

    // Verificar que aparezcan los emprendedores específicos
    await expect(page.locator('text=Jhonatan Arias')).toBeVisible();
    await expect(page.locator('text=Ana González')).toBeVisible();
    await expect(page.locator('text=Carlos Mendez')).toBeVisible();
    await expect(page.locator('text=María Tech')).toBeVisible();
    await expect(page.locator('text=Roberto Silva')).toBeVisible();

    // Verificar labels de "Emprendedor Confiable"
    await expect(page.locator('text=• Emprendedor Confiable')).toBeVisible();
    await expect(page.locator('text=• Emprendedora Confiable')).toBeVisible();

    console.log('✅ Emprendedores Confiables verificados');
  });

  test('🎨 Verificar Diseño Visual Alineado', async ({ page }) => {
    console.log('🔍 Verificando diseño visual alineado...');

    // Verificar gradiente oficial en header
    const headerCard = page.locator('div').filter({ hasText: '🏪 Marketplace CoomÜnity' }).first();
    await expect(headerCard).toBeVisible();

    // Verificar chips y badges
    await expect(page.locator('text=Bien Común')).toBeVisible();
    await expect(page.locator('[role="button"]').filter({ hasText: 'Tecnología' })).toBeVisible();
    await expect(page.locator('[role="button"]').filter({ hasText: 'Diseño' })).toBeVisible();

    // Verificar iconografía de opciones de entrega
    await expect(page.locator('text=📦 Entrega')).toBeVisible();
    await expect(page.locator('text=💻 Virtual')).toBeVisible();
    await expect(page.locator('text=📍 Presencial')).toBeVisible();

    console.log('✅ Diseño visual alineado verificado');
  });

  test('📈 Verificar Gamificación y Necesidades Demandadas', async ({ page }) => {
    console.log('🔍 Verificando gamificación...');

    // Verificar sección de necesidades demandadas
    await expect(page.locator('text=📈 Necesidades Más Demandadas en CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Servicios que nuestra comunidad más busca')).toBeVisible();

    // Verificar items específicos de demanda
    await expect(page.locator('text=Desarrollo Web')).toBeVisible();
    await expect(page.locator('text=Diseño Gráfico')).toBeVisible();
    await expect(page.locator('text=Marketing Digital')).toBeVisible();
    await expect(page.locator('text=Consultoría Consciente')).toBeVisible();

    // Verificar porcentajes de demanda
    await expect(page.locator('text=85% demanda')).toBeVisible();
    await expect(page.locator('text=mayor visibilidad')).toBeVisible();

    console.log('✅ Gamificación verificada');
  });

  test('⭐ Verificar Sistema de Rating y Confianza', async ({ page }) => {
    console.log('🔍 Verificando sistema de rating...');

    // Verificar ratings específicos de los servicios
    await expect(page.locator('text=4.8')).toBeVisible();
    await expect(page.locator('text=4.9')).toBeVisible();
    await expect(page.locator('text=4.7')).toBeVisible();
    await expect(page.locator('text=4.6')).toBeVisible();
    await expect(page.locator('text=4.5')).toBeVisible();

    // Verificar que aparezcan reseñas
    await expect(page.locator('text=/\\(\\d+ reseñas\\)/')).toBeVisible();

    // Verificar iconos de estrellas
    const starIcons = page.locator('[data-testid="StarIcon"]');
    const starCount = await starIcons.count();
    expect(starCount).toBeGreaterThan(0);

    console.log('✅ Sistema de rating verificado');
  });

  test('🎯 Verificar Servicios Específicos con Filosofía', async ({ page }) => {
    console.log('🔍 Verificando servicios con filosofía integrada...');

    // Verificar servicios específicos
    await expect(page.locator('text=Desarrollo Web Profesional')).toBeVisible();
    await expect(page.locator('text=Diseño UX/UI Premium')).toBeVisible();
    await expect(page.locator('text=Marketing Digital Estratégico')).toBeVisible();
    await expect(page.locator('text=Consultoría Empresarial Consciente')).toBeVisible();
    await expect(page.locator('text=Curso Online de Programación')).toBeVisible();

    // Verificar filosofía integrada en descripciones
    await expect(page.locator('text=30% de descuento')).toBeVisible();
    await expect(page.locator('text=apoyo al talento local')).toBeVisible();
    await expect(page.locator('text=ética y sostenible')).toBeVisible();
    await expect(page.locator('text=desarrollo consciente')).toBeVisible();
    await expect(page.locator('text=Bien Común')).toBeVisible();

    console.log('✅ Servicios con filosofía verificados');
  });

  test('🎛️ Verificar Sistema de Filtros Avanzados', async ({ page }) => {
    console.log('🔍 Verificando filtros avanzados...');

    // Abrir drawer de filtros
    const filterButton = page.locator('[data-testid="TuneIcon"]').first();
    await filterButton.click();

    // Verificar que el drawer se abra
    await expect(page.locator('text=🎛️ Filtros Avanzados')).toBeVisible();

    // Verificar filtros específicos
    await expect(page.locator('text=Categoría')).toBeVisible();
    await expect(page.locator('text=Rango de Precio (Lükas)')).toBeVisible();
    await expect(page.locator('text=Tipo de Entrega')).toBeVisible();
    await expect(page.locator('text=Rating Mínimo')).toBeVisible();

    // Verificar opciones de entrega en filtros
    await expect(page.locator('text=📦 Entrega a domicilio')).toBeVisible();
    await expect(page.locator('text=💻 Virtual/Online')).toBeVisible();
    await expect(page.locator('text=📍 Presencial')).toBeVisible();

    // Cerrar drawer
    const closeButton = page.locator('[data-testid="CloseIcon"]').first();
    await closeButton.click();

    console.log('✅ Sistema de filtros verificado');
  });

  test('🔍 Verificar Búsqueda Expandible', async ({ page }) => {
    console.log('🔍 Verificando búsqueda expandible...');

    // Activar búsqueda expandible
    const searchButton = page.locator('[data-testid="SearchIcon"]').first();
    await searchButton.click();

    // Verificar que aparezca el campo de búsqueda
    await expect(page.locator('input[placeholder*="Buscar servicios"]')).toBeVisible();
    await expect(page.locator('text=Ordenar por')).toBeVisible();

    // Probar búsqueda
    const searchInput = page.locator('input[placeholder*="Buscar servicios"]');
    await searchInput.fill('Desarrollo');

    // Verificar que mantenga funcionalidad (aunque sea visual)
    await expect(searchInput).toHaveValue('Desarrollo');

    console.log('✅ Búsqueda expandible verificada');
  });

  test('🎫 Verificar Acceso por Invitación', async ({ page }) => {
    console.log('🔍 Verificando información de acceso por invitación...');

    // Abrir menú contextual
    const menuButton = page.locator('[data-testid="MoreVertIcon"]').first();
    await menuButton.click();

    // Verificar información sobre acceso por invitación
    await expect(page.locator('text=🎫 Solo por Invitación')).toBeVisible();
    await expect(page.locator('text=acceso exclusivo a descuentos')).toBeVisible();

    // Cerrar menú
    await page.keyboard.press('Escape');

    console.log('✅ Acceso por invitación verificado');
  });

  test('📊 Verificar Contador de Productos y Estado', async ({ page }) => {
    console.log('🔍 Verificando contador y estado...');

    // Verificar contador de servicios en header
    const serviceCounter = page.locator('text=/\\d+/).first();
    await expect(serviceCounter).toBeVisible();

    // Verificar estado de conexión
    const connectionStatus = page.locator('text=/🌐 Conectado|📱 Modo offline/');
    await expect(connectionStatus).toBeVisible();

    // Verificar que hay servicios mostrados
    const serviceCards = page.locator('[role="button"]').filter({ hasText: 'Lükas' });
    const serviceCount = await serviceCards.count();
    expect(serviceCount).toBeGreaterThan(0);

    console.log('✅ Contador y estado verificados');
  });

  test('🚀 Verificar Acciones Rápidas', async ({ page }) => {
    console.log('🔍 Verificando acciones rápidas...');

    // Verificar sección de acciones rápidas
    await expect(page.locator('text=⚡ Acciones Rápidas')).toBeVisible();
    await expect(page.locator('text=Publicar Servicio')).toBeVisible();
    await expect(page.locator('text=Mi Tienda')).toBeVisible();
    await expect(page.locator('text=Mis Favoritos')).toBeVisible();

    // Verificar iconos en botones
    await expect(page.locator('[data-testid="LocalOfferIcon"]')).toBeVisible();
    await expect(page.locator('[data-testid="StoreIcon"]')).toBeVisible();

    console.log('✅ Acciones rápidas verificadas');
  });

  test('🔄 Verificar Funcionalidad de Refresh', async ({ page }) => {
    console.log('🔍 Verificando funcionalidad de refresh...');

    // Buscar botón de refresh
    const refreshButton = page.locator('[data-testid="RefreshIcon"]').first();
    await expect(refreshButton).toBeVisible();

    // Hacer click en refresh (verificar que no genere errores)
    await refreshButton.click();

    // Verificar que la página sigue funcionando
    await expect(page.locator('text=🏪 Marketplace CoomÜnity')).toBeVisible();

    console.log('✅ Funcionalidad de refresh verificada');
  });

  test('📱 Verificar Responsividad Mobile', async ({ page }) => {
    console.log('🔍 Verificando responsividad mobile...');

    // Cambiar a viewport mobile
    await page.setViewportSize({ width: 375, height: 667 });

    // Verificar que elementos principales sean visibles en mobile
    await expect(page.locator('text=🏪 Marketplace CoomÜnity')).toBeVisible();
    await expect(page.locator('text=Emprendedores Confiables')).toBeVisible();

    // Verificar que los servicios se muestren correctamente
    await expect(page.locator('text=Desarrollo Web Profesional')).toBeVisible();
    await expect(page.locator('text=Lükas')).toBeVisible();

    // Restaurar viewport desktop
    await page.setViewportSize({ width: 1280, height: 720 });

    console.log('✅ Responsividad mobile verificada');
  });

  test('🎊 Verificación Integral - Resumen Final', async ({ page }) => {
    console.log('🎊 Ejecutando verificación integral final...');

    // Conteo de elementos clave de Agile Inception
    const keyElements = [
      'Marketplace CoomÜnity',
      'Emprendedores Confiables', 
      'Bien Común',
      'Lükas',
      'Mëritos',
      'Solo por Invitación',
      'descuentos del 10% al 50%',
      'Desarrollo Web Profesional',
      'Jhonatan Arias',
      'Ana González'
    ];

    let foundElements = 0;
    for (const element of keyElements) {
      try {
        await expect(page.locator(`text=${element}`)).toBeVisible({ timeout: 2000 });
        foundElements++;
        console.log(`✅ Encontrado: ${element}`);
      } catch (error) {
        console.log(`❌ No encontrado: ${element}`);
      }
    }

    const alignmentPercentage = Math.round((foundElements / keyElements.length) * 100);
    console.log(`\n📊 RESUMEN FINAL:`);
    console.log(`   📈 Elementos encontrados: ${foundElements}/${keyElements.length}`);
    console.log(`   🎯 Porcentaje de alineación: ${alignmentPercentage}%`);
    
    // Verificar que tengamos al menos 80% de alineación
    expect(alignmentPercentage).toBeGreaterThanOrEqual(80);

    if (alignmentPercentage >= 90) {
      console.log(`   🏆 EXCELENTE: Marketplace totalmente alineado con Agile Inception`);
    } else if (alignmentPercentage >= 80) {
      console.log(`   ⚠️  BUENO: Mayormente alineado, ajustes menores necesarios`);
    }

    console.log('\n🎉 FASE 49 - VALIDACIÓN COMPLETADA CON ÉXITO');
  });
}); 