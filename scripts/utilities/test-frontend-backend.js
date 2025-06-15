// Simple test to verify frontend-backend integration
const fetch = require('node-fetch');

const BACKEND_URL = 'http://localhost:3002';
const FRONTEND_URL = 'http://localhost:3000';

async function testBackendEndpoints() {
  console.log('🔍 Testing Backend Endpoints...\n');
  
  const endpoints = [
    '/system/settings',
    '/system/health',
    '/mundos',
    '/playlists',
    '/content/mundos',
    '/content/mundos/1/playlists'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`);
      const data = await response.json();
      console.log(`✅ ${endpoint}: ${response.status} - ${Array.isArray(data) ? `${data.length} items` : 'Object'}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: Error - ${error.message}`);
    }
  }
}

async function testFrontendAccess() {
  console.log('\n🌐 Testing Frontend Access...\n');
  
  try {
    const response = await fetch(FRONTEND_URL);
    const html = await response.text();
    if (html.includes('<!doctype html>')) {
      console.log('✅ Frontend is accessible and serving HTML');
    } else {
      console.log('❌ Frontend response is not valid HTML');
    }
  } catch (error) {
    console.log(`❌ Frontend access failed: ${error.message}`);
  }
}

async function main() {
  console.log('🚀 Testing Gamifier Frontend-Backend Integration\n');
  console.log(`Backend URL: ${BACKEND_URL}`);
  console.log(`Frontend URL: ${FRONTEND_URL}\n`);
  
  await testBackendEndpoints();
  await testFrontendAccess();
  
  console.log('\n✨ Integration test completed!');
  console.log('\n📝 Next steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Navigate to different pages to test data loading');
  console.log('3. Check browser console for any API errors');
}

main().catch(console.error); 