#!/usr/bin/env node

/**
 * 🏥 Backend Health Check Script
 *
 * This script helps diagnose backend connectivity issues by testing:
 * - Backend availability
 * - CORS configuration
 * - Port accessibility
 * - Authentication endpoints
 */

const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:1111';
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:2222';

console.log('🏥 CoomÜnity Backend Health Check');
console.log('====================================');
console.log(`🎯 Backend URL: ${API_BASE_URL}`);
console.log(`🌍 Frontend Origin: ${FRONTEND_ORIGIN}`);
console.log('');

async function checkHealth() {
  const checks = [];

  // 1. Basic connectivity check
  console.log('1️⃣ Testing basic connectivity...');
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.text();

    checks.push({
      name: 'Basic Connectivity',
      status: response.ok ? '✅ PASS' : '❌ FAIL',
      details: `Status: ${response.status} ${response.statusText}`,
      data: data.length > 100 ? data.substring(0, 100) + '...' : data,
    });
  } catch (error) {
    checks.push({
      name: 'Basic Connectivity',
      status: '❌ FAIL',
      details: `Error: ${error.message}`,
      data: 'Backend not accessible',
    });
  }

  // 2. CORS preflight check
  console.log('2️⃣ Testing CORS configuration...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        Origin: FRONTEND_ORIGIN,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type,Authorization',
      },
    });

    const corsHeaders = {
      'access-control-allow-origin': response.headers.get(
        'access-control-allow-origin'
      ),
      'access-control-allow-methods': response.headers.get(
        'access-control-allow-methods'
      ),
      'access-control-allow-headers': response.headers.get(
        'access-control-allow-headers'
      ),
      'access-control-allow-credentials': response.headers.get(
        'access-control-allow-credentials'
      ),
    };

    const corsOk =
      response.ok &&
      (corsHeaders['access-control-allow-origin'] === '*' ||
        corsHeaders['access-control-allow-origin'] === FRONTEND_ORIGIN);

    checks.push({
      name: 'CORS Configuration',
      status: corsOk ? '✅ PASS' : '⚠️ WARNING',
      details: `Status: ${response.status}, Origin allowed: ${corsHeaders['access-control-allow-origin']}`,
      data: corsHeaders,
    });
  } catch (error) {
    checks.push({
      name: 'CORS Configuration',
      status: '❌ FAIL',
      details: `Error: ${error.message}`,
      data: 'CORS preflight failed',
    });
  }

  // 3. Auth endpoint check
  console.log('3️⃣ Testing authentication endpoint...');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: FRONTEND_ORIGIN,
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'invalid',
      }),
    });

    // We expect this to fail with 401, but that means the endpoint is working
    const authOk = response.status === 401 || response.status === 400;

    checks.push({
      name: 'Auth Endpoint',
      status: authOk ? '✅ PASS' : '❌ FAIL',
      details: `Status: ${response.status} ${response.statusText}`,
      data: authOk
        ? 'Endpoint responding correctly'
        : 'Endpoint not responding as expected',
    });
  } catch (error) {
    checks.push({
      name: 'Auth Endpoint',
      status: '❌ FAIL',
      details: `Error: ${error.message}`,
      data: 'Auth endpoint not accessible',
    });
  }

  // 4. Custom origin test (for dynamic ports like 48752)
  const testOrigins = [
    'http://localhost:48752', // The problematic port from the error
    'http://localhost:2222',
    'http://localhost:5173',
    'http://127.0.0.1:48752',
  ];

  console.log('4️⃣ Testing custom origins...');
  for (const origin of testOrigins) {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          Origin: origin,
        },
      });

      const corsOrigin = response.headers.get('access-control-allow-origin');
      const corsOk = corsOrigin === '*' || corsOrigin === origin;

      checks.push({
        name: `Custom Origin: ${origin}`,
        status: corsOk ? '✅ PASS' : '⚠️ WARNING',
        details: `CORS Origin: ${corsOrigin}`,
        data: response.ok ? 'Backend accessible' : 'Backend error',
      });
    } catch (error) {
      checks.push({
        name: `Custom Origin: ${origin}`,
        status: '❌ FAIL',
        details: `Error: ${error.message}`,
        data: 'Request failed',
      });
    }
  }

  // Report results
  console.log('\n📊 Health Check Results:');
  console.log('========================');

  checks.forEach((check) => {
    console.log(`\n${check.status} ${check.name}`);
    console.log(`   Details: ${check.details}`);
    if (typeof check.data === 'object') {
      console.log(`   Data:`, JSON.stringify(check.data, null, 4));
    } else {
      console.log(`   Data: ${check.data}`);
    }
  });

  // Summary
  const passed = checks.filter((c) => c.status.includes('✅')).length;
  const warnings = checks.filter((c) => c.status.includes('⚠️')).length;
  const failed = checks.filter((c) => c.status.includes('❌')).length;

  console.log('\n🎯 Summary:');
  console.log(`   ✅ Passed: ${passed}`);
  console.log(`   ⚠️ Warnings: ${warnings}`);
  console.log(`   ❌ Failed: ${failed}`);

  if (failed > 0) {
    console.log('\n�� Troubleshooting Tips:');
    console.log('   1. Ensure backend is running: npm run start:backend:dev');
    console.log('   2. Check backend logs for errors');
    console.log('   3. Verify .env configuration in both frontend and backend');
    console.log('   4. Try restarting both frontend and backend');
    console.log('   5. Check firewall/antivirus settings');
  }

  return { passed, warnings, failed, checks };
}

// Run the health check
checkHealth().catch((error) => {
  console.error('❌ Health check failed:', error);
  process.exit(1);
});
