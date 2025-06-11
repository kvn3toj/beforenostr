/**
 * Manual Verification Script for Marketplace Mobile Design
 *
 * This script helps verify that the marketplace home matches the Builder.io design specification.
 *
 * To use:
 * 1. Start the development server: npm run dev
 * 2. Open the app in mobile view (360px width)
 * 3. Navigate to /marketplace
 * 4. Run this script in the browser console
 */

function verifyMarketplaceMobileDesign() {
  console.log('🔍 Verifying Marketplace Mobile Design...');

  const results = {
    passed: [],
    failed: [],
    warnings: [],
  };

  // Helper function to check element existence
  function checkElement(selector, description) {
    const element = document.querySelector(selector);
    if (element) {
      results.passed.push(`✅ ${description}`);
      return element;
    } else {
      results.failed.push(`❌ ${description} - Element not found: ${selector}`);
      return null;
    }
  }

  // Helper function to check text content
  function checkTextContent(text, description) {
    const element = Array.from(document.querySelectorAll('*')).find(
      (el) => el.textContent.trim() === text && el.children.length === 0
    );
    if (element) {
      results.passed.push(`✅ ${description}`);
      return element;
    } else {
      results.failed.push(`❌ ${description} - Text not found: "${text}"`);
      return null;
    }
  }

  // Check mobile container
  const mobileContainer = checkElement(
    '[data-testid="mobile-marketplace"]',
    'Mobile marketplace container'
  );

  // Check status bar
  checkTextContent('9:30', 'Status bar time display');

  // Check top app bar
  checkTextContent('ÜMarket', 'ÜMarket title in header');

  // Check consumer/provider toggle
  checkTextContent('Consumidor', 'Consumidor button');
  checkTextContent('Proveedor', 'Proveedor button');

  // Check search bar
  const searchInput = checkElement(
    'input[placeholder*="Qué quieres encontrar"]',
    'Search input field'
  );

  // Check categories
  const categoryLabels = document.querySelectorAll('*');
  const categoriaCount = Array.from(categoryLabels).filter(
    (el) => el.textContent.trim() === 'Categoría' && el.children.length === 0
  ).length;

  if (categoriaCount >= 4) {
    results.passed.push(`✅ Category labels (found ${categoriaCount})`);
  } else {
    results.failed.push(
      `❌ Category labels - Expected at least 4, found ${categoriaCount}`
    );
  }

  checkTextContent('Ver todo', 'Ver todo button');

  // Check sections
  checkTextContent('Recomendados', 'Recomendados section header');
  checkTextContent('Categorías', 'Categorías section header');

  // Check mobile viewport constraints
  if (mobileContainer) {
    const containerWidth = mobileContainer.getBoundingClientRect().width;
    if (containerWidth <= 360) {
      results.passed.push(
        `✅ Mobile container width constraint (${containerWidth}px)`
      );
    } else {
      results.warnings.push(
        `⚠️ Mobile container width is ${containerWidth}px, should be ≤360px`
      );
    }
  }

  // Check color scheme
  if (mobileContainer) {
    const containerStyle = window.getComputedStyle(mobileContainer);
    const bgColor = containerStyle.backgroundColor;
    if (
      bgColor === 'rgb(255, 255, 255)' ||
      bgColor === 'rgba(255, 255, 255, 1)'
    ) {
      results.passed.push('✅ Correct container background color (white)');
    } else {
      results.failed.push(
        `❌ Container background color should be white, found: ${bgColor}`
      );
    }
  }

  // Check for Consumer button active state
  const consumerBtn = Array.from(document.querySelectorAll('*')).find(
    (el) => el.textContent.trim() === 'Consumidor' && el.children.length === 0
  );
  if (consumerBtn && consumerBtn.parentElement) {
    const btnStyle = window.getComputedStyle(consumerBtn.parentElement);
    const bgColor = btnStyle.backgroundColor;
    if (bgColor.includes('116, 0, 86') || bgColor.includes('#740056')) {
      results.passed.push(
        '✅ Consumer button has active styling (purple background)'
      );
    } else {
      results.warnings.push(`⚠️ Consumer button background color: ${bgColor}`);
    }
  }

  // Output results
  console.log('\n📊 VERIFICATION RESULTS:');
  console.log('========================');

  if (results.passed.length > 0) {
    console.log('\n✅ PASSED CHECKS:');
    results.passed.forEach((item) => console.log(item));
  }

  if (results.warnings.length > 0) {
    console.log('\n⚠️ WARNINGS:');
    results.warnings.forEach((item) => console.log(item));
  }

  if (results.failed.length > 0) {
    console.log('\n❌ FAILED CHECKS:');
    results.failed.forEach((item) => console.log(item));
  }

  const totalChecks =
    results.passed.length + results.failed.length + results.warnings.length;
  const successRate = Math.round((results.passed.length / totalChecks) * 100);

  console.log(
    `\n📈 SUCCESS RATE: ${successRate}% (${results.passed.length}/${totalChecks})`
  );

  if (results.failed.length === 0) {
    console.log(
      '\n🎉 All critical checks passed! The marketplace mobile design matches the Builder.io specification.'
    );
  } else {
    console.log(
      `\n🔧 ${results.failed.length} critical issues need to be fixed.`
    );
  }

  return {
    passed: results.passed.length,
    failed: results.failed.length,
    warnings: results.warnings.length,
    successRate: successRate,
  };
}

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('🚀 Marketplace Mobile Design Verification Tool');
  console.log(
    '💡 Run verifyMarketplaceMobileDesign() to check the current page'
  );

  // Auto-detect if we're on the marketplace page
  if (window.location.pathname.includes('/marketplace')) {
    console.log('📱 Marketplace page detected. Running verification...');
    setTimeout(verifyMarketplaceMobileDesign, 1000); // Wait for React to render
  }
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { verifyMarketplaceMobileDesign };
}
