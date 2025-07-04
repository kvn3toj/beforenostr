#!/bin/bash

echo "🔍 NETWORK AUTHENTICATION DEBUG & FIX SCRIPT"
echo "==============================================="

# Get network IP for testing
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🌐 Network IP detected: $NETWORK_IP"

# Verify backend is responding from network
echo ""
echo "🔧 Testing backend connectivity from network..."
BACKEND_HEALTH=$(curl -s "http://$NETWORK_IP:3002/health" | grep "Backend is running" | wc -l)

if [ $BACKEND_HEALTH -gt 0 ]; then
    echo "✅ Backend accessible from network: http://$NETWORK_IP:3002"
else
    echo "❌ Backend NOT accessible from network"
    echo "🔧 Try: npm run dev:backend"
    exit 1
fi

# Test login endpoint specifically
echo ""
echo "🔐 Testing login endpoint with network origin..."
LOGIN_RESPONSE=$(curl -s -X POST "http://$NETWORK_IP:3002/auth/login" \
    -H "Content-Type: application/json" \
    -H "Origin: http://$NETWORK_IP:3001" \
    -d '{"email": "admin@gamifier.com", "password": "admin123"}' \
    -w "HTTPSTATUS:%{http_code}")

HTTP_STATUS=$(echo $LOGIN_RESPONSE | grep -o "HTTPSTATUS:[0-9]*" | sed 's/HTTPSTATUS://')
RESPONSE_BODY=$(echo $LOGIN_RESPONSE | sed 's/HTTPSTATUS:[0-9]*$//')

echo "📊 HTTP Status: $HTTP_STATUS"
echo "📄 Response Body (first 200 chars): ${RESPONSE_BODY:0:200}..."

if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ Network login endpoint working correctly"

    # Check if response contains expected JSON structure
    if echo "$RESPONSE_BODY" | grep -q "access_token" && echo "$RESPONSE_BODY" | grep -q "user"; then
        echo "✅ Response contains expected JSON structure"

        # Extract user email for verification
        USER_EMAIL=$(echo "$RESPONSE_BODY" | grep -o '"email":"[^"]*"' | cut -d'"' -f4)
        echo "📧 User Email in response: $USER_EMAIL"
    else
        echo "❌ Response does NOT contain expected JSON structure"
        echo "🚨 This indicates a backend problem"
    fi
else
    echo "❌ Network login failed with status: $HTTP_STATUS"
    echo "🚨 Response: $RESPONSE_BODY"
fi

# Check SuperApp accessibility
echo ""
echo "🌐 Checking SuperApp accessibility..."
SUPERAPP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://$NETWORK_IP:3001")

if [ "$SUPERAPP_STATUS" = "200" ]; then
    echo "✅ SuperApp accessible from network: http://$NETWORK_IP:3001"
else
    echo "❌ SuperApp NOT accessible: Status $SUPERAPP_STATUS"
    echo "🔧 Try: npm run dev:superapp"
fi

echo ""
echo "📋 SUMMARY:"
echo "==========================================="
echo "🌐 Network IP: $NETWORK_IP"
echo "🔧 Backend: http://$NETWORK_IP:3002 (Status: $([ $BACKEND_HEALTH -gt 0 ] && echo "✅ Working" || echo "❌ Failed"))"
echo "🌐 SuperApp: http://$NETWORK_IP:3001 (Status: $([ "$SUPERAPP_STATUS" = "200" ] && echo "✅ Working" || echo "❌ Failed"))"
echo "🔐 Login API: $([ "$HTTP_STATUS" = "200" ] && echo "✅ Working" || echo "❌ Failed")"

echo ""
echo "🔧 NEXT STEPS FOR FIXING JSON ERROR:"
echo "1. The backend is returning valid JSON"
echo "2. The problem is likely corrupted localStorage in the browser"
echo "3. Go to your network SuperApp: http://$NETWORK_IP:3001"
echo "4. Open Developer Tools (F12) → Application → Local Storage"
echo "5. Delete all COOMUNITY_* keys"
echo "6. Try logging in again"

echo ""
echo "🌐 Opening SuperApp for you to test..."
open "http://$NETWORK_IP:3001"
