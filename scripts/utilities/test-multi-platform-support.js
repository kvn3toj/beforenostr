const { chromium } = require('playwright');

async function testMultiPlatformSupport() {
  console.log('🎯 Iniciando test de soporte multi-plataforma...\n');
  
  const testCases = [
    {
      name: 'YouTube Video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      expectedPlatform: 'youtube',
      expectedId: 'dQw4w9WgXcQ'
    },
    {
      name: 'YouTube Short URL',
      url: 'https://youtu.be/dQw4w9WgXcQ',
      expectedPlatform: 'youtube',
      expectedId: 'dQw4w9WgXcQ'
    },
    {
      name: 'Vimeo Video',
      url: 'https://vimeo.com/148751763',
      expectedPlatform: 'vimeo',
      expectedId: '148751763'
    },
    {
      name: 'Local Video',
      url: '/videos/local-video.mp4',
      expectedPlatform: 'local',
      expectedId: null
    },
    {
      name: 'JSON Content with YouTube',
      url: JSON.stringify({ url: 'https://www.youtube.com/watch?v=EEZkQv25uEs', videoId: 'EEZkQv25uEs' }),
      expectedPlatform: 'youtube',
      expectedId: 'EEZkQv25uEs'
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n📋 Testing: ${testCase.name}`);
    console.log(`   URL: ${testCase.url}`);
    
    try {
      // Test platform detection endpoint
      const response = await fetch('http://localhost:1111/video-items/detect-platform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: testCase.url })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Platform: ${result.platform} (expected: ${testCase.expectedPlatform})`);
        console.log(`   ✅ External ID: ${result.externalId || 'null'} (expected: ${testCase.expectedId || 'null'})`);
        
        if (result.platform === testCase.expectedPlatform) {
          console.log(`   🎉 Platform detection: PASSED`);
        } else {
          console.log(`   ❌ Platform detection: FAILED`);
        }
        
        if (result.externalId === testCase.expectedId) {
          console.log(`   🎉 ID extraction: PASSED`);
        } else {
          console.log(`   ❌ ID extraction: FAILED`);
        }
      } else {
        console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n🎯 Testing duration calculation with different platforms...\n');

  // Test duration calculation for different platforms
  const durationTests = [
    {
      name: 'YouTube - Rick Roll',
      content: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
    },
    {
      name: 'Vimeo - Test Video',
      content: 'https://vimeo.com/148751763'
    }
  ];

  for (const test of durationTests) {
    console.log(`\n📋 Testing duration for: ${test.name}`);
    
    try {
      const response = await fetch('http://localhost:1111/video-items/calculate-duration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: test.content })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`   ✅ Duration: ${result.duration} seconds`);
        console.log(`   ✅ Method: ${result.method}`);
        console.log(`   ✅ Platform: ${result.platform}`);
      } else {
        console.log(`   ❌ API Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
  }

  console.log('\n🎉 Multi-platform support test completed!');
}

// Función auxiliar para fetch (Node.js)
if (typeof fetch === 'undefined') {
  global.fetch = require('node-fetch');
}

testMultiPlatformSupport().catch(console.error); 