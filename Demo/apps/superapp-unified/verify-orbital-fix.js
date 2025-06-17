// 🔍 SCRIPT DE VERIFICACIÓN DE ELEMENTOS ORBITALES 3D
// Ejecutar en DevTools Console del navegador (F12)

console.log('🚀 Iniciando verificación de elementos orbitales 3D...');

function verifyOrbitalElements() {
  const results = {
    containerFound: false,
    overflowFixed: false,
    orbitalElementsFound: 0,
    transforms3DActive: false,
    animationsActive: false,
    cssImported: false
  };

  // 1. Verificar contenedor principal
  const orbitalWidget = document.querySelector('.orbital-widget');
  const centralContainer = document.querySelector('.central-orb-container');
  
  if (orbitalWidget && centralContainer) {
    results.containerFound = true;
    console.log('✅ Contenedores encontrados');
    
    // 2. Verificar overflow
    const widgetOverflow = window.getComputedStyle(orbitalWidget).overflow;
    const cardOverflow = window.getComputedStyle(orbitalWidget.querySelector('.MuiCard-root')).overflow;
    const containerOverflow = window.getComputedStyle(centralContainer).overflow;
    
    if (widgetOverflow === 'visible' || cardOverflow === 'visible' || containerOverflow === 'visible') {
      results.overflowFixed = true;
      console.log('✅ Overflow corregido correctamente');
      console.log(`   Widget: ${widgetOverflow}, Card: ${cardOverflow}, Container: ${containerOverflow}`);
    } else {
      console.log('❌ Overflow no está en visible');
      console.log(`   Widget: ${widgetOverflow}, Card: ${cardOverflow}, Container: ${containerOverflow}`);
    }
  } else {
    console.log('❌ Contenedores no encontrados');
  }

  // 3. Verificar elementos orbitales
  const orbitalElements = document.querySelectorAll('.orbital-element');
  results.orbitalElementsFound = orbitalElements.length;
  
  if (orbitalElements.length > 0) {
    console.log(`✅ ${orbitalElements.length} elementos orbitales encontrados`);
    
    // 4. Verificar transformaciones 3D
    let has3DTransforms = false;
    orbitalElements.forEach((element, index) => {
      const transform = window.getComputedStyle(element).transform;
      if (transform && transform !== 'none' && transform.includes('translate3d')) {
        has3DTransforms = true;
        console.log(`   Elemento ${index + 1}: Transform 3D activo - ${transform.substring(0, 50)}...`);
      }
    });
    
    results.transforms3DActive = has3DTransforms;
    if (has3DTransforms) {
      console.log('✅ Transformaciones 3D activas');
    } else {
      console.log('❌ No se detectaron transformaciones 3D');
    }
    
    // 5. Verificar animaciones
    const firstElement = orbitalElements[0];
    const animationName = window.getComputedStyle(firstElement).animationName;
    if (animationName && animationName !== 'none') {
      results.animationsActive = true;
      console.log('✅ Animaciones activas');
    } else {
      console.log('❌ Animaciones no detectadas');
    }
  } else {
    console.log('❌ No se encontraron elementos orbitales');
  }

  // 6. Verificar CSS importado
  const stylesheets = Array.from(document.styleSheets);
  const hasOrbitalCSS = stylesheets.some(sheet => {
    try {
      return Array.from(sheet.cssRules).some(rule => 
        rule.selectorText && rule.selectorText.includes('orbital-element')
      );
    } catch (e) {
      return false;
    }
  });
  
  results.cssImported = hasOrbitalCSS;
  if (hasOrbitalCSS) {
    console.log('✅ CSS orbital-planets-3d.css importado correctamente');
  } else {
    console.log('❌ CSS orbital no detectado');
  }

  // 7. Resumen final
  console.log('\n📊 RESUMEN DE VERIFICACIÓN:');
  console.log('================================');
  Object.entries(results).forEach(([key, value]) => {
    const status = value ? '✅' : '❌';
    console.log(`${status} ${key}: ${value}`);
  });

  const allGood = Object.values(results).every(v => v === true || (typeof v === 'number' && v > 0));
  
  if (allGood) {
    console.log('\n🎉 ¡TODOS LOS ELEMENTOS ORBITALES FUNCIONAN CORRECTAMENTE!');
  } else {
    console.log('\n⚠️ Algunos elementos necesitan atención');
  }

  return results;
}

// Función para destacar elementos orbitales visualmente
function highlightOrbitalElements() {
  const elements = document.querySelectorAll('.orbital-element');
  elements.forEach((el, index) => {
    el.style.border = '3px solid red';
    el.style.boxShadow = '0 0 20px red';
    
    setTimeout(() => {
      el.style.border = '';
      el.style.boxShadow = '';
    }, 3000);
  });
  
  console.log(`🔴 ${elements.length} elementos orbitales destacados temporalmente`);
}

// Función para inspeccionar un elemento específico
function inspectOrbitalElement(index = 0) {
  const elements = document.querySelectorAll('.orbital-element');
  if (elements[index]) {
    const element = elements[index];
    const styles = window.getComputedStyle(element);
    
    console.log(`🔍 Inspeccionando elemento orbital ${index + 1}:`);
    console.log('Position:', styles.position);
    console.log('Transform:', styles.transform);
    console.log('Transform-style:', styles.transformStyle);
    console.log('Overflow:', styles.overflow);
    console.log('Z-index:', styles.zIndex);
    console.log('Width:', styles.width);
    console.log('Height:', styles.height);
    console.log('Animation:', styles.animationName);
    
    // Resaltar el elemento
    element.style.border = '3px solid yellow';
    setTimeout(() => element.style.border = '', 2000);
    
    return element;
  } else {
    console.log(`❌ No se encontró elemento orbital en índice ${index}`);
  }
}

// Ejecutar verificación automáticamente
const results = verifyOrbitalElements();

// Comandos disponibles
console.log('\n🛠️ COMANDOS DISPONIBLES:');
console.log('========================');
console.log('verifyOrbitalElements() - Ejecutar verificación completa');
console.log('highlightOrbitalElements() - Destacar elementos orbitales');
console.log('inspectOrbitalElement(0) - Inspeccionar elemento específico (0-3)');

// Exponer funciones globalmente para uso en consola
window.verifyOrbitalElements = verifyOrbitalElements;
window.highlightOrbitalElements = highlightOrbitalElements;
window.inspectOrbitalElement = inspectOrbitalElement; 