const fetch = require('node-fetch');

async function getToken() {
  try {
    const response = await fetch('http://localhost:3002/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@gamifier.com', password: 'admin123' })
    });
    const data = await response.json();
    console.log(data.access_token);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getToken(); 