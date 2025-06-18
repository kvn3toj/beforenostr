#!/bin/bash

echo "🔍 CRITICAL FIXES VERIFICATION - CoomÜnity SuperApp"
echo "=================================================="
echo

# Test 1: ProductDetail import fix
echo "✅ TEST 1: MarketplaceMockData Import Fix"
echo "----------------------------------------"

if [ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ]; then
    echo "✅ marketplaceMockData.ts file exists"
    
    # Check if getItemById function is available
    if grep -q "export const getItemById" Demo/apps/superapp-unified/src/data/marketplaceMockData.ts; then
        echo "✅ getItemById function is exported"
    else
        echo "❌ getItemById function not found"
    fi
    
    # Check if marketplaceMockData array is available  
    if grep -q "export const marketplaceMockData" Demo/apps/superapp-unified/src/data/marketplaceMockData.ts; then
        echo "✅ marketplaceMockData array is exported"
    else
        echo "❌ marketplaceMockData array not found"
    fi
else
    echo "❌ marketplaceMockData.ts file missing"
fi

echo

# Test 2: SuperApp accessibility
echo "✅ TEST 2: SuperApp Frontend Accessibility"
echo "------------------------------------------"

SUPERAPP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$SUPERAPP_RESPONSE" = "200" ]; then
    echo "✅ SuperApp responds HTTP 200 OK (Port 3001)"
else
    echo "❌ SuperApp not accessible (HTTP $SUPERAPP_RESPONSE)"
fi

echo

# Test 3: Backend accessibility and StudyRoomsModule
echo "✅ TEST 3: Backend and StudyRoomsModule Fix"
echo "-------------------------------------------"

BACKEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$BACKEND_RESPONSE" = "200" ]; then
    echo "✅ Backend responds HTTP 200 OK (Port 3002)"
else
    echo "❌ Backend not accessible (HTTP $BACKEND_RESPONSE)"
fi

# Check StudyRoomsModule configuration
if grep -q "import { AuthModule }" src/study-rooms/study-rooms.module.ts; then
    echo "✅ StudyRoomsModule imports AuthModule (JWT fix applied)"
else
    echo "❌ StudyRoomsModule still has old JWT configuration"
fi

if ! grep -q "JwtModule.register" src/study-rooms/study-rooms.module.ts; then
    echo "✅ Duplicate JwtModule registration removed"
else
    echo "❌ Duplicate JwtModule registration still present"
fi

echo

# Test 4: Check for ProductDetail import errors in logs
echo "✅ TEST 4: ProductDetail Import Resolution"
echo "-----------------------------------------"

# Test if ProductDetail page can be imported without errors
if node -e "
const fs = require('fs');
const content = fs.readFileSync('Demo/apps/superapp-unified/src/pages/ProductDetail.tsx', 'utf8');
if (content.includes('getItemById, marketplaceMockData') && fs.existsSync('Demo/apps/superapp-unified/src/data/marketplaceMockData.ts')) {
    console.log('✅ ProductDetail can import marketplaceMockData functions');
    process.exit(0);
} else {
    console.log('❌ ProductDetail import issue persists');
    process.exit(1);
}
" 2>/dev/null; then
    echo "✅ Import resolution verified"
else
    echo "❌ Import resolution failed"
fi

echo

# Test 5: Environment configuration
echo "✅ TEST 5: Environment Configuration"
echo "------------------------------------"

if grep -q "JWT_SECRET=" .env; then
    echo "✅ JWT_SECRET is configured in .env"
else
    echo "❌ JWT_SECRET missing from .env"
fi

echo

# Test 6: Process status
echo "✅ TEST 6: Process Status"
echo "-------------------------"

BACKEND_PROCESSES=$(ps aux | grep -E "(npm run.*backend|nest start)" | grep -v grep | wc -l)
if [ $BACKEND_PROCESSES -gt 0 ]; then
    echo "✅ Backend process is running ($BACKEND_PROCESSES process(es))"
else
    echo "❌ No backend processes detected"
fi

SUPERAPP_PROCESSES=$(ps aux | grep -E "(vite|npm run dev)" | grep -v grep | wc -l) 
if [ $SUPERAPP_PROCESSES -gt 0 ]; then
    echo "✅ SuperApp process is running ($SUPERAPP_PROCESSES process(es))"
else
    echo "❌ No SuperApp processes detected"
fi

echo
echo "🏁 VERIFICATION COMPLETE"
echo "========================"

# Summary
echo "📋 SUMMARY:"
echo "- MarketplaceMockData: $([ -f "Demo/apps/superapp-unified/src/data/marketplaceMockData.ts" ] && echo "✅ RESTORED" || echo "❌ MISSING")"
echo "- SuperApp Frontend: $([ "$SUPERAPP_RESPONSE" = "200" ] && echo "✅ ACCESSIBLE" || echo "❌ ISSUES")"
echo "- Backend Services: $([ "$BACKEND_RESPONSE" = "200" ] && echo "✅ ACCESSIBLE" || echo "❌ ISSUES")"
echo "- WebSocket Auth Fix: $(grep -q "import { AuthModule }" src/study-rooms/study-rooms.module.ts && echo "✅ APPLIED" || echo "❌ PENDING")"

echo
echo "🔗 Next Steps:"
echo "1. Test ProductDetail page: http://localhost:3001/product/blockchain-consulting-001"
echo "2. Test Study Rooms WebSocket: http://localhost:3001/uplay"
echo "3. Monitor backend logs for WebSocket authentication success"
echo "4. Verify chat functionality in Study Rooms" 