/**
 * 🏪 GA4 Events - Merchant Section
 * 
 * Ejemplos específicos para la sección Merchant
 */

// Tracking de interacciones de productos/servicios
document.querySelectorAll('.product-card, .service-item').forEach(item => {
  item.addEventListener('click', () => {
    window.GA4Tracker.trackEvent('merchant_product_view', {
      product_id: item.dataset.productId || 'unknown',
      product_name: item.querySelector('.product-name')?.textContent || 'unknown',
      product_category: item.dataset.category || 'general',
      interaction_type: 'click'
    });
  });
});

// Formularios de contacto o compra
document.querySelectorAll('form[data-merchant-form]').forEach(form => {
  form.addEventListener('submit', (e) => {
    window.GA4Tracker.trackEvent('merchant_form_submit', {
      form_type: form.dataset.formType || 'contact',
      form_id: form.id || 'unknown',
      fields_completed: form.querySelectorAll('input:not(:empty), textarea:not(:empty)').length
    });
  });
});