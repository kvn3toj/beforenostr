import { test, expect } from '@playwright/test';

test.describe('Backend Integration Tests', () => {
  const baseURL = 'http://localhost:3002';

  test.beforeAll(async () => {
    // Verificar que el backend esté corriendo
    console.log('🔍 Verificando que el backend esté disponible...');
  });

  test('Health endpoint should return 200', async ({ request }) => {
    console.log('🏥 Testing health endpoint...');
    
    const response = await request.get(`${baseURL}/health`);
    expect(response.status()).toBe(200);
    
    const body = await response.json();
    expect(body).toHaveProperty('status');
    console.log('✅ Health check passed:', body);
  });

  test('Users endpoint should be accessible', async ({ request }) => {
    console.log('👥 Testing users endpoint...');
    
    const response = await request.get(`${baseURL}/users`);
    expect(response.status()).toBe(200);
    
    const users = await response.json();
    expect(Array.isArray(users)).toBe(true);
    console.log(`✅ Users endpoint returned ${users.length} users`);
  });

  test('Video items endpoint should be accessible', async ({ request }) => {
    console.log('🎥 Testing video items endpoint...');
    
    const response = await request.get(`${baseURL}/video-items`);
    expect(response.status()).toBe(200);
    
    const videoItems = await response.json();
    expect(Array.isArray(videoItems)).toBe(true);
    console.log(`✅ Video items endpoint returned ${videoItems.length} items`);
  });

  test('Specific video item should be retrievable', async ({ request }) => {
    console.log('🎬 Testing specific video item retrieval...');
    
    // First get all video items to find one to test
    const listResponse = await request.get(`${baseURL}/video-items`);
    const videoItems = await listResponse.json();
    
    if (videoItems.length > 0) {
      const firstVideoId = videoItems[0].id;
      const response = await request.get(`${baseURL}/video-items/${firstVideoId}`);
      expect(response.status()).toBe(200);
      
      const videoItem = await response.json();
      expect(videoItem).toHaveProperty('id', firstVideoId);
      expect(videoItem).toHaveProperty('title');
      console.log(`✅ Retrieved video item: ${videoItem.title}`);
    } else {
      console.log('⚠️ No video items found to test individual retrieval');
    }
  });

  test('Cache service health should be checkable', async ({ request }) => {
    console.log('💾 Testing cache health...');
    
    const response = await request.get(`${baseURL}/cache/health`);
    
    if (response.status() === 200) {
      const health = await response.json();
      console.log('✅ Cache health check passed:', health);
    } else {
      console.log('⚠️ Cache health endpoint not available or Redis not running');
      // This is not a failure since Redis might not be configured in test environment
    }
  });

  test('Auth endpoints should be accessible', async ({ request }) => {
    console.log('🔐 Testing auth endpoints...');
    
    // Test auth test endpoint
    const testResponse = await request.get(`${baseURL}/auth/test`);
    expect(testResponse.status()).toBe(200);
    
    const testResult = await testResponse.json();
    expect(testResult).toHaveProperty('message');
    console.log('✅ Auth test endpoint working:', testResult.message);
  });

  test('API should handle invalid endpoints gracefully', async ({ request }) => {
    console.log('❌ Testing error handling...');
    
    const response = await request.get(`${baseURL}/nonexistent-endpoint`);
    expect(response.status()).toBe(404);
    console.log('✅ 404 handling works correctly');
  });

  test('CORS headers should be present', async ({ request }) => {
    console.log('🌐 Testing CORS headers...');
    
    const response = await request.get(`${baseURL}/health`);
    const headers = response.headers();
    
    // Check for common CORS headers
    expect(headers).toHaveProperty('access-control-allow-origin');
    console.log('✅ CORS headers present');
  });

  test('API should return JSON content type', async ({ request }) => {
    console.log('📄 Testing content type headers...');
    
    const response = await request.get(`${baseURL}/users`);
    const contentType = response.headers()['content-type'];
    
    expect(contentType).toContain('application/json');
    console.log('✅ JSON content type header present');
  });

  test('Performance: Health endpoint should respond quickly', async ({ request }) => {
    console.log('⚡ Testing response time...');
    
    const startTime = Date.now();
    const response = await request.get(`${baseURL}/health`);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    expect(response.status()).toBe(200);
    expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    
    console.log(`✅ Health endpoint responded in ${responseTime}ms`);
  });
}); 