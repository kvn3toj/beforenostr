#!/bin/bash

echo "🧹 CLEARING CORRUPTED AUTH TOKENS"
echo "================================="

echo ""
echo "🌐 Opening browser to clear localStorage..."
echo "⚠️  This will open the SuperApp in your default browser"
echo "📝 The script will automatically execute JavaScript to clear auth tokens"
echo ""

# Open the SuperApp in the default browser
open "http://localhost:3001"

# Wait a moment for the browser to load
sleep 3

# Create a temporary HTML file with auto-executing JavaScript to clear storage
cat > /tmp/clear_auth_tokens.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Clearing Auth Tokens - CoomÜnity</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 50px;
        }
        .container {
            background: rgba(255,255,255,0.1);
            border-radius: 20px;
            padding: 40px;
            backdrop-filter: blur(10px);
            max-width: 600px;
            margin: 0 auto;
        }
        .status {
            font-size: 18px;
            margin: 20px 0;
        }
        .success { color: #4CAF50; }
        .warning { color: #FF9800; }
        .info { color: #2196F3; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧹 CoomÜnity Auth Token Cleanup</h1>
        <div id="status">🔄 Cleaning corrupted tokens...</div>

        <script>
            function clearAuthTokens() {
                try {
                    const statusDiv = document.getElementById('status');

                    // Clear all auth-related keys from localStorage
                    const keysToRemove = [
                        'COOMUNITY_AUTH_TOKEN',
                        'COOMUNITY_USER_DATA',
                        'authToken',
                        'userData',
                        'access_token',
                        'user',
                        'token',
                        'jwt'
                    ];

                    let removedCount = 0;
                    statusDiv.innerHTML = '<div class="status info">🔍 Scanning localStorage...</div>';

                    keysToRemove.forEach(key => {
                        if (localStorage.getItem(key)) {
                            localStorage.removeItem(key);
                            removedCount++;
                            console.log(`Removed: ${key}`);
                        }
                    });

                    // Clear sessionStorage as well
                    sessionStorage.clear();

                    statusDiv.innerHTML = `
                        <div class="status success">✅ Cleanup Complete!</div>
                        <div class="status info">📊 Removed ${removedCount} corrupted tokens</div>
                        <div class="status info">🗑️ SessionStorage cleared</div>
                        <div class="status warning">⚠️ Please refresh the SuperApp (localhost:3001)</div>
                    `;

                    console.log('Auth token cleanup completed successfully');
                    console.log(`Removed ${removedCount} tokens from localStorage`);
                    console.log('SessionStorage cleared');

                    // Auto-close after 5 seconds
                    setTimeout(() => {
                        statusDiv.innerHTML += '<div class="status info">🔄 Auto-closing in 3 seconds...</div>';
                        setTimeout(() => {
                            window.close();
                        }, 3000);
                    }, 2000);

                } catch (error) {
                    console.error('Error clearing tokens:', error);
                    document.getElementById('status').innerHTML =
                        '<div class="status warning">❌ Error: ' + error.message + '</div>';
                }
            }

            // Execute immediately when page loads
            window.onload = clearAuthTokens;
        </script>
    </div>
</body>
</html>
EOF

# Open the cleanup page
echo "🚀 Opening token cleanup page..."
open "file:///tmp/clear_auth_tokens.html"

echo ""
echo "✅ CLEANUP SCRIPT EXECUTED"
echo "=========================="
echo "🔧 Next steps:"
echo "   1. Wait for the cleanup page to finish"
echo "   2. Refresh the SuperApp at http://localhost:3001"
echo "   3. Try logging in again with admin@gamifier.com / admin123"
echo ""
echo "📝 If the error persists, check the browser console for additional details"
