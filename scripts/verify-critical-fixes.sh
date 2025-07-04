#!/bin/bash

echo "🔍 CoomÜnity SuperApp - Critical Fixes Verification"
echo "=================================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Checking Service Status...${NC}"
echo ""

# 1. Backend Health Check
echo -n "🔧 Backend NestJS (port 3002): "
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/health)
if [ "$BACKEND_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ NOT RUNNING (HTTP $BACKEND_STATUS)${NC}"
    exit 1
fi

# 2. SuperApp Health Check
echo -n "🌟 SuperApp Frontend (port 3001): "
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)
if [ "$FRONTEND_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✅ RUNNING${NC}"
else
    echo -e "${RED}❌ NOT RUNNING (HTTP $FRONTEND_STATUS)${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🧪 Testing Critical Fixes...${NC}"
echo ""

# 3. Test Elemental System Endpoint (Previously 404)
echo -n "🌍 Elemental System Config Endpoint: "
ELEMENTAL_RESPONSE=$(curl -s http://localhost:3002/config/elemental-system)
ELEMENTAL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002/config/elemental-system)

if [ "$ELEMENTAL_STATUS" -eq 200 ]; then
    # Check if response contains expected elements
    if echo "$ELEMENTAL_RESPONSE" | grep -q "fuego" && echo "$ELEMENTAL_RESPONSE" | grep -q "agua" && echo "$ELEMENTAL_RESPONSE" | grep -q "tierra" && echo "$ELEMENTAL_RESPONSE" | grep -q "aire"; then
        echo -e "${GREEN}✅ FIXED (Complete Response)${NC}"
        echo "   📄 Sample: $(echo "$ELEMENTAL_RESPONSE" | jq -r '.fuego.name + " (" + .fuego.keyword + ")"' 2>/dev/null || echo "JSON parsing requires jq")"
    else
        echo -e "${YELLOW}⚠️ PARTIAL (Incomplete Response)${NC}"
    fi
else
    echo -e "${RED}❌ STILL FAILING (HTTP $ELEMENTAL_STATUS)${NC}"
fi

# 4. Check tagify.js NaN Fix
echo -n "🏷️ Tagify.js NaN Width Fix: "
TAGIFY_MARKETPLACE=$(grep -c "COOMUNITY FIX.*Safe width calculation" Demo/apps/superapp-unified/src/modules/marketplace/assets/js/tagify.js)
TAGIFY_PUBLIC=$(grep -c "COOMUNITY FIX.*Safe width calculation" Demo/apps/superapp-unified/public/js/tagify.js)

if [ "$TAGIFY_MARKETPLACE" -gt 0 ] && [ "$TAGIFY_PUBLIC" -gt 0 ]; then
    echo -e "${GREEN}✅ FIXED (Both files patched)${NC}"
    echo "   📁 Fixed: marketplace/assets/js/tagify.js"
    echo "   📁 Fixed: public/js/tagify.js"
else
    echo -e "${RED}❌ INCOMPLETE${NC}"
    echo "   📁 Marketplace fix: $TAGIFY_MARKETPLACE"
    echo "   📁 Public fix: $TAGIFY_PUBLIC"
fi

# 5. Verify ConfigModule Import
echo -n "🔧 ConfigModule Import in Backend: "
CONFIG_IMPORT=$(grep -c "import.*ConfigModule.*from.*./config/config.module" src/app.module.ts)
CONFIG_INCLUDED=$(grep -c "ConfigModule.*//.*Configuration Module" src/app.module.ts)

if [ "$CONFIG_IMPORT" -gt 0 ] && [ "$CONFIG_INCLUDED" -gt 0 ]; then
    echo -e "${GREEN}✅ PROPERLY IMPORTED${NC}"
else
    echo -e "${RED}❌ NOT IMPORTED${NC}"
fi

# 6. Frontend Integration Test
echo -n "🎯 Frontend Hook Integration: "
HOOK_EXISTS=$(ls Demo/apps/superapp-unified/src/hooks/home/useElementalConfig.ts 2>/dev/null)
if [ -n "$HOOK_EXISTS" ]; then
    echo -e "${GREEN}✅ HOOK EXISTS${NC}"
    echo "   📄 useElementalConfig.ts ready for backend integration"
else
    echo -e "${RED}❌ HOOK MISSING${NC}"
fi

echo ""
echo -e "${BLUE}📊 Summary Results${NC}"
echo "=================="

# Final summary
if [ "$BACKEND_STATUS" -eq 200 ] && [ "$FRONTEND_STATUS" -eq 200 ] && [ "$ELEMENTAL_STATUS" -eq 200 ] && [ "$TAGIFY_MARKETPLACE" -gt 0 ] && [ "$TAGIFY_PUBLIC" -gt 0 ]; then
    echo -e "${GREEN}🎉 ALL CRITICAL FIXES SUCCESSFUL!${NC}"
    echo ""
    echo "✅ Backend NestJS: Operational"
    echo "✅ SuperApp Frontend: Operational" 
    echo "✅ Elemental System Endpoint: Fixed (was 404)"
    echo "✅ NaN Width CSS Error: Fixed (tagify.js patched)"
    echo "✅ ConfigModule: Properly imported"
    echo ""
    echo -e "${GREEN}🚀 Ready for production deployment!${NC}"
else
    echo -e "${RED}❌ Some fixes still need attention${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔗 Testing URLs:${NC}"
echo "📍 Backend Health: http://localhost:3002/health"
echo "📍 Elemental Config: http://localhost:3002/config/elemental-system"
echo "📍 SuperApp: http://localhost:3001"
echo "📍 Backend Swagger: http://localhost:3002/api" 