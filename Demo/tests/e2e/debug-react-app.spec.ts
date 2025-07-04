import { test, expect } from '@playwright/test';

test('Diagnosticar aplicación React - errores de consola', async ({ page }) => {
  const consoleMessages = [];
  const errors = [];

  // Capturar todos los mensajes de consola
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location()
    });
  });

  // Capturar errores de página
  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack
    });
  });

  // Ir a la aplicación
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Inspeccionar el contenido del DOM
  const domInfo = await page.evaluate(() => {
    return {
      rootHTML: document.querySelector('#root')?.innerHTML?.substring(0, 500) || 'NO CONTENT',
      bodyClasses: Array.from(document.body.classList),
      scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline').slice(0, 5),
      stylesheets: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href).slice(0, 5),
      hasReactDevTools: !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__,
      currentURL: window.location.href,
      reactVersion: window.React?.version || 'No detectado'
    };
  });

  console.log('=== DIAGNÓSTICO APLICACIÓN REACT ===');
  console.log('DOM Info:', domInfo);
  console.log('Console Messages:', consoleMessages);
  console.log('Page Errors:', errors);

  // Verificar que no haya errores críticos
  const criticalErrors = errors.filter(e => !e.message.includes('favicon'));
  expect(criticalErrors.length).toBe(0);
  
  // Verificar que el root tenga contenido
  expect(domInfo.rootHTML).not.toBe('NO CONTENT');
}); 