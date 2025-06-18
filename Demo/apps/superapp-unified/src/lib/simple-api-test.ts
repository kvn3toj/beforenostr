/**
 * 🔍 Utilidad simple para probar la API sin complejidades
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:1111';

export async function testSimpleLogin(email: string, password: string) {
  console.group('🔍 Simple Login Test');

  try {
    console.log('📍 API Base URL:', API_BASE_URL);
    console.log('🌍 Current Origin:', window.location.origin);
    console.log('📧 Email:', email);

    const url = `${API_BASE_URL}/auth/login`;
    const requestBody = JSON.stringify({ email, password });

    console.log('🎯 Request URL:', url);
    console.log('📦 Request Body:', requestBody);

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: requestBody,
    };

    console.log('⚙️ Request Options:', requestOptions);
    console.log('🚀 Making fetch request...');

    const response = await fetch(url, requestOptions);

    console.log('📨 Response received');
    console.log('📊 Response Status:', response.status);
    console.log(
      '📋 Response Headers:',
      Object.fromEntries(response.headers.entries())
    );
    console.log('✅ Response OK:', response.ok);

    if (response.ok) {
      const data = await response.json();
      console.log('🎉 Login Success:', data);
      console.groupEnd();
      return data;
    } else {
      const errorData = await response.json();
      console.error('❌ Login Failed:', errorData);
      console.groupEnd();
      throw new Error(
        `Login failed: ${response.status} ${errorData.message || response.statusText}`
      );
    }
  } catch (error) {
    console.error('💥 Fetch Error:', error);
    console.error('🔍 Error Details:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    console.groupEnd();
    throw error;
  }
}

export async function testHealthEndpoint() {
  try {
    console.log('🏥 Testing health endpoint...');
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    console.log('✅ Health OK:', data);
    return data;
  } catch (error) {
    console.error('❌ Health check failed:', error);
    throw error;
  }
}

export async function testCORSPreflight() {
  try {
    console.log('🌐 Testing CORS preflight...');
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });

    console.log('📊 CORS Preflight Status:', response.status);
    console.log(
      '📋 CORS Headers:',
      Object.fromEntries(response.headers.entries())
    );
    return response.status === 200 || response.status === 204;
  } catch (error) {
    console.error('❌ CORS preflight failed:', error);
    return false;
  }
}
