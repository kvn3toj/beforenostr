// Test Video Navigation Script
// Run this in browser console on http://localhost:3001/uplay to test video clicking

console.log('🧪 Starting Video Navigation Test...');

// Test 1: Check if videos are loaded
const videoCards = document.querySelectorAll('.uplay-video-card');
console.log(`📋 Found ${videoCards.length} video cards`);

if (videoCards.length === 0) {
  console.error('❌ No video cards found! Check if videos are loading properly.');
} else {
  console.log('✅ Video cards are present in the DOM');

  // Test 2: Check if cards are clickable
  const firstCard = videoCards[0];
  if (firstCard) {
    console.log('🎯 Testing click on first video card...');

    // Add click event listener to see what happens
    firstCard.addEventListener('click', (e) => {
      console.log('📢 Video card clicked!', e);
      console.log('📍 Current URL before navigation:', window.location.href);

      // Wait a bit and check if URL changed
      setTimeout(() => {
        console.log('📍 Current URL after navigation:', window.location.href);
        if (window.location.href.includes('/uplay/video/')) {
          console.log('✅ Navigation successful!');
        } else {
          console.log('❌ Navigation failed - URL did not change');
        }
      }, 1000);
    });

    console.log('🔗 Click listener added. Now manually click the first video to test.');
  }
}

// Test 3: Check React component state
if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
  try {
    const fiber = firstCard?._reactInternalFiber || firstCard?.__reactInternalInstance;
    if (fiber) {
      console.log('⚛️ React component found, testing handleVideoClick...');
    }
  } catch (e) {
    console.log('ℹ️ Could not access React internals (normal in production)');
  }
}

console.log('🧪 Test setup complete. Click a video to see navigation results.');
