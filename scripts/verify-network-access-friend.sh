#!/bin/bash

echo "🌐 NETWORK ACCESS DIAGNOSTIC FOR EXTERNAL DEVICES"
echo "================================================="

# Get current network information
NETWORK_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "🔍 Host IP Address: $NETWORK_IP"

# Test if backend is accessible from network
echo ""
echo "🗄️ Testing Backend Network Accessibility..."
curl -s -I "http://$NETWORK_IP:3002/health" && echo "✅ Backend accessible from network" || echo "❌ Backend NOT accessible from network"

# Test if SuperApp is accessible from network
echo ""
echo "🌟 Testing SuperApp Network Accessibility..."
curl -s -I "http://$NETWORK_IP:3001" && echo "✅ SuperApp accessible from network" || echo "❌ SuperApp NOT accessible from network"

# Check if ports are listening on all interfaces
echo ""
echo "🔌 Checking Port Bindings..."
echo "Backend (port 3002):"
lsof -i :3002 | head -2
echo ""
echo "SuperApp (port 3001):"
lsof -i :3001 | head -2

# Provide network diagnostic commands for the friend
echo ""
echo "📋 COMMANDS FOR YOUR FRIEND TO TEST:"
echo "===================================="
echo ""
echo "1. Test if they can reach your backend:"
echo "   curl http://$NETWORK_IP:3002/health"
echo ""
echo "2. Test if they can reach your SuperApp:"
echo "   curl http://$NETWORK_IP:3001 -I"
echo ""
echo "3. Test ping connectivity:"
echo "   ping $NETWORK_IP"
echo ""
echo "4. Open SuperApp in their browser:"
echo "   http://$NETWORK_IP:3001"
echo ""

# Check firewall status (macOS)
echo "🔥 Firewall Status:"
/usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate

echo ""
echo "🔧 TROUBLESHOOTING STEPS:"
echo "========================"
echo "1. Make sure you're on the same WiFi network"
echo "2. Check if macOS Firewall is blocking connections"
echo "3. Try disabling firewall temporarily: System Preferences > Security & Privacy > Firewall"
echo "4. Verify backend is listening on 0.0.0.0 (all interfaces), not just localhost"
echo "5. Check if your friend's antivirus/firewall is blocking the connection"
echo ""
