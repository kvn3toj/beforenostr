#!/usr/bin/env node

/**
 * 🔍 Backend Verification and Auto-Start Script
 *
 * This script checks if the backend is running and provides options to start it
 * if it's not available. It's designed to help developers quickly resolve
 * "Failed to fetch" errors during development.
 */

const { spawn, exec } = require('child_process');
const fetch = require('node-fetch');
const path = require('path');

// Configuration
const BACKEND_URL = process.env.VITE_API_BASE_URL || 'http://localhost:1111';
const BACKEND_DIR = path.join(__dirname, '../../../..');
const TIMEOUT_MS = 5000;

console.log('🔍 CoomÜnity Backend Verification Tool\n');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Backend Directory: ${BACKEND_DIR}\n`);

/**
 * Check if backend is running
 */
async function checkBackend() {
  console.log('🔍 Checking backend status...');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(`${BACKEND_URL}/health`, {
      signal: controller.signal,
      method: 'GET',
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend is running!');
      console.log(`   Status: ${data.status}`);
      console.log(`   Timestamp: ${data.timestamp}`);
      return true;
    } else {
      console.log(`❌ Backend responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('⏰ Backend health check timed out');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('❌ Backend is not running (connection refused)');
    } else if (error.message.includes('fetch')) {
      console.log('❌ Cannot connect to backend (network error)');
    } else {
      console.log(`❌ Backend check failed: ${error.message}`);
    }
    return false;
  }
}

/**
 * Check if backend dependencies are installed
 */
async function checkDependencies() {
  console.log('\n🔍 Checking backend dependencies...');

  return new Promise((resolve) => {
    exec(
      'npm list --depth=0',
      { cwd: BACKEND_DIR },
      (error, stdout, stderr) => {
        if (error) {
          console.log('❌ Dependencies check failed');
          console.log('   Run: npm install');
          resolve(false);
        } else {
          console.log('✅ Dependencies are installed');
          resolve(true);
        }
      }
    );
  });
}

/**
 * Start backend in development mode
 */
async function startBackend() {
  console.log('\n🚀 Starting backend server...');
  console.log('   Command: npm run start:backend:dev');
  console.log('   Directory:', BACKEND_DIR);

  const backend = spawn('npm', ['run', 'start:backend:dev'], {
    cwd: BACKEND_DIR,
    stdio: 'inherit',
    shell: true,
  });

  backend.on('error', (error) => {
    console.error('❌ Failed to start backend:', error.message);
  });

  backend.on('exit', (code) => {
    if (code !== 0) {
      console.error(`❌ Backend exited with code ${code}`);
    }
  });

  // Wait a bit and check if it's running
  console.log('\n⏳ Waiting for backend to start...');

  for (let i = 0; i < 10; i++) {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`   Attempt ${i + 1}/10: Checking backend...`);

    if (await checkBackend()) {
      console.log('\n🎉 Backend is now running successfully!');
      return true;
    }
  }

  console.log('\n❌ Backend failed to start within expected time');
  return false;
}

/**
 * Install backend dependencies
 */
async function installDependencies() {
  console.log('\n📦 Installing backend dependencies...');

  return new Promise((resolve) => {
    const install = spawn('npm', ['install'], {
      cwd: BACKEND_DIR,
      stdio: 'inherit',
      shell: true,
    });

    install.on('error', (error) => {
      console.error('❌ Failed to install dependencies:', error.message);
      resolve(false);
    });

    install.on('exit', (code) => {
      if (code === 0) {
        console.log('✅ Dependencies installed successfully');
        resolve(true);
      } else {
        console.error(`❌ npm install exited with code ${code}`);
        resolve(false);
      }
    });
  });
}

/**
 * Display troubleshooting information
 */
function showTroubleshooting() {
  console.log('\n🛠️ Troubleshooting Steps:');
  console.log('');
  console.log('1. Manual Backend Start:');
  console.log(`   cd ${BACKEND_DIR}`);
  console.log('   npm install');
  console.log('   npm run start:backend:dev');
  console.log('');
  console.log('2. Check Backend Configuration:');
  console.log('   - Verify .env file exists');
  console.log('   - Check database connection');
  console.log('   - Review backend logs for errors');
  console.log('');
  console.log('3. Verify Ports:');
  console.log('   - Backend should run on port 3002');
  console.log('   - Check if port is already in use');
  console.log(
    '   - Use: lsof -i :3002 (macOS/Linux) or netstat -an | findstr 3002 (Windows)'
  );
  console.log('');
  console.log('4. CORS Configuration:');
  console.log('   - Check src/main.ts CORS settings');
  console.log('   - Ensure frontend origin is allowed');
  console.log('   - Verify Access-Control headers');
  console.log('');
  console.log('5. Network Issues:');
  console.log('   - Check firewall settings');
  console.log('   - Verify localhost resolution');
  console.log('   - Try 127.0.0.1 instead of localhost');
}

/**
 * Interactive prompt for user actions
 */
function prompt(question) {
  return new Promise((resolve) => {
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(question, (answer) => {
      readline.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

/**
 * Main execution function
 */
async function main() {
  try {
    // Check if backend is already running
    if (await checkBackend()) {
      console.log('\n🎉 Backend is already running and healthy!');
      console.log(
        '\nIf you\'re still experiencing "Failed to fetch" errors, check:'
      );
      console.log('- Frontend configuration (.env file)');
      console.log('- Browser network tab for CORS errors');
      console.log('- Backend logs for authentication issues');
      return;
    }

    console.log('\n❌ Backend is not running or not responding');

    // Check dependencies
    const hasDependencies = await checkDependencies();

    if (!hasDependencies) {
      const installDeps = await prompt(
        '\nWould you like to install dependencies? (y/n): '
      );
      if (installDeps === 'y' || installDeps === 'yes') {
        const success = await installDependencies();
        if (!success) {
          console.log('\n❌ Failed to install dependencies');
          showTroubleshooting();
          return;
        }
      } else {
        console.log('\n���️ Dependencies are required to run the backend');
        showTroubleshooting();
        return;
      }
    }

    // Ask user if they want to start the backend
    const startServer = await prompt(
      '\nWould you like to start the backend server? (y/n): '
    );

    if (startServer === 'y' || startServer === 'yes') {
      const success = await startBackend();
      if (!success) {
        showTroubleshooting();
      }
    } else {
      console.log('\n📝 To start the backend manually, run:');
      console.log(`   cd ${BACKEND_DIR}`);
      console.log('   npm run start:backend:dev');
      showTroubleshooting();
    }
  } catch (error) {
    console.error('\n💥 Unexpected error:', error.message);
    showTroubleshooting();
  }
}

// Run the script
if (require.main === module) {
  main();
}
