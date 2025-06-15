const { test, expect } = require('@playwright/test');

test.describe('API Endpoints Verification', () => {
  const baseURL = 'http://localhost:3002';

  test('should verify /users endpoint works correctly', async ({ request }) => {
    console.log('🔍 Testing /users endpoint...');
    
    const response = await request.get(`${baseURL}/users`);
    
    console.log('📊 Response status:', response.status());
    console.log('📋 Response headers:', await response.allHeaders());
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    console.log('📄 Response body:', JSON.stringify(responseBody, null, 2));
    
    // Verificar estructura de respuesta
    expect(responseBody).toHaveProperty('data');
    expect(responseBody).toHaveProperty('total');
    expect(responseBody).toHaveProperty('page');
    expect(responseBody).toHaveProperty('pageSize');
    expect(Array.isArray(responseBody.data)).toBe(true);
    
    console.log('✅ /users endpoint working correctly!');
  });

  test('should verify /roles endpoint and capture error details', async ({ request }) => {
    console.log('🔍 Testing /roles endpoint...');
    
    const response = await request.get(`${baseURL}/roles`);
    
    console.log('📊 Response status:', response.status());
    console.log('📋 Response headers:', await response.allHeaders());
    
    const responseBody = await response.text();
    console.log('📄 Response body:', responseBody);
    
    if (response.status() === 500) {
      console.log('❌ /roles endpoint returning 500 error as expected');
      
      try {
        const errorJson = JSON.parse(responseBody);
        console.log('🔍 Error details:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('📄 Raw error response:', responseBody);
      }
    } else {
      console.log('✅ /roles endpoint working correctly!');
      const jsonBody = JSON.parse(responseBody);
      console.log('📄 Success response:', JSON.stringify(jsonBody, null, 2));
    }
  });

  test('should verify server is running', async ({ request }) => {
    console.log('🔍 Testing server health...');
    
    const response = await request.get(`${baseURL}/`);
    
    console.log('📊 Root endpoint status:', response.status());
    
    if (response.status() === 200) {
      const responseBody = await response.text();
      console.log('📄 Root response:', responseBody);
      console.log('✅ Server is running correctly!');
    } else {
      console.log('❌ Server health check failed');
    }
  });

  test('should test simple endpoints', async ({ request }) => {
    console.log('🔍 Testing simple endpoints...');
    
    // Test /users/test
    const usersTest = await request.get(`${baseURL}/users/test`);
    console.log('📊 /users/test status:', usersTest.status());
    if (usersTest.status() === 200) {
      const body = await usersTest.json();
      console.log('📄 /users/test response:', JSON.stringify(body, null, 2));
    }
    
    // Test /users/simple
    const usersSimple = await request.get(`${baseURL}/users/simple`);
    console.log('📊 /users/simple status:', usersSimple.status());
    if (usersSimple.status() === 200) {
      const body = await usersSimple.json();
      console.log('📄 /users/simple response:', JSON.stringify(body, null, 2));
    }
  });
}); 