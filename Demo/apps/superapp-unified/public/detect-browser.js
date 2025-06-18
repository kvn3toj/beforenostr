// Detección de navegadores problemáticos para module imports
window.browserSupport = {
  dynamicImport: false,
  moduleScript: false,
  userAgent: navigator.userAgent
};

// Test dynamic import support
try {
  new Function('return import("")')();
  window.browserSupport.dynamicImport = true;
} catch (e) {
  console.warn('Dynamic import not supported:', e);
}

// Test module script support
try {
  const script = document.createElement('script');
  script.type = 'module';
  window.browserSupport.moduleScript = 'noModule' in script;
} catch (e) {
  console.warn('Module script not supported:', e);
}

console.log('Browser support:', window.browserSupport);
