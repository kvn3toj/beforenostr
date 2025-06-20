# 🔧 CORS & Backend Connectivity Troubleshooting Guide

This guide helps resolve CORS and backend connectivity issues in the CoomÜnity SuperApp.

## 🚨 Common Error Symptoms

```
Failed to fetch
Cannot connect to backend at http://localhost:3002
CORS: Origin not allowed by CORS policy
Network request failed
```

## 🎯 Quick Diagnosis

### 1. Run Health Check Script

```bash
npm run health:backend
```

### 2. Check Services Status

```bash
npm run ecosystem:status
```

### 3. Use Connection Diagnostics (Development Only)

- Press `Ctrl+Shift+D` in the frontend
- Or wait for automatic popup on connection errors

## 🔧 Step-by-Step Troubleshooting

### Step 1: Verify Backend is Running

```bash
# Check if backend is running
curl http://localhost:3002/health

# Start backend if not running
npm run start:backend:dev
```

**Expected Response:** `"OK"` or similar health check response

### Step 2: Verify CORS Configuration

The backend has been configured to automatically allow:

- All localhost origins with any port
- Development ports (1024-65535)
- Specific whitelisted origins

**Test CORS manually:**

```bash
curl -X OPTIONS http://localhost:3002/auth/login \
  -H "Origin: http://localhost:48752" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
```

**Expected Headers:**

```
access-control-allow-origin: http://localhost:48752
access-control-allow-methods: GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS
access-control-allow-headers: Content-Type,Accept,Authorization,...
```

### Step 3: Test Authentication Endpoint

```bash
curl -X POST http://localhost:3002/auth/login \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:48752" \
  -d '{"email":"test@example.com","password":"invalid"}'
```

**Expected Response:** 401 Unauthorized (endpoint working) or 400 Bad Request

### Step 4: Check Environment Configuration

**Frontend (.env):**

```bash
# Demo/apps/superapp-unified/.env
VITE_API_BASE_URL=http://localhost:3002
VITE_ENABLE_MOCK_AUTH=false
```

**Backend Environment:**

```bash
# src/.env or environment variables
NODE_ENV=development
PORT=3002
```

### Step 5: Verify Port Availability

```bash
# Check if port 3002 is in use
lsof -i :3002

# Check if port 3001 (frontend) is in use
lsof -i :3001
```

## 🔍 Advanced Diagnostics

### Debug Mode Logging

The enhanced API service provides detailed logging in development:

1. Open browser DevTools
2. Look for detailed CORS and connection logs
3. Check Network tab for failed requests
4. Review Console for diagnostic information

### Environment Detection

The app automatically detects:

- **Development:** Standard localhost ports
- **Testing:** Unusual ports (like 48752)
- **Production:** Production URLs

### Connection Diagnostics Component

In development mode, the app includes a real-time diagnostics tool:

- Auto-appears on connection errors
- Manual trigger: `Ctrl+Shift+D`
- Tests multiple connection scenarios
- Provides specific troubleshooting steps

## 🛠 Common Fixes

### Fix 1: Restart Services

```bash
# Stop all services
pkill -f "localhost:300[0-9]"

# Start backend
npm run start:backend:dev

# Start frontend (in another terminal)
cd Demo/apps/superapp-unified
npm run dev
```

### Fix 2: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Fix 3: Check Firewall/Antivirus

Some antivirus software blocks localhost connections:

- Add localhost:3002 to exceptions
- Temporarily disable firewall
- Check corporate network restrictions

### Fix 4: Use Different Ports

If ports are in use:

**Backend:**

```bash
PORT=3003 npm run start:backend:dev
```

**Frontend (.env):**

```
VITE_API_BASE_URL=http://localhost:3003
```

### Fix 5: Enable Mock Mode (Temporary)

For immediate development:

```bash
# Demo/apps/superapp-unified/.env
VITE_ENABLE_MOCK_AUTH=true
```

This bypasses backend connectivity for authentication.

## 📊 Monitoring & Metrics

The app includes built-in monitoring:

- Connection success/failure rates
- CORS error tracking
- Performance metrics
- Error categorization

View metrics in development console for real-time insights.

## 🚀 Production Deployment

For production, ensure:

1. **Environment Variables:**

   ```
   VITE_API_BASE_URL=https://api.yourdomain.com
   NODE_ENV=production
   ```

2. **CORS Configuration:**

   - Update allowed origins in backend
   - Remove development-only origins
   - Use environment variables for allowed origins

3. **SSL/HTTPS:**
   - Ensure both frontend and backend use HTTPS
   - Configure proper SSL certificates

## 🆘 Still Having Issues?

### Check Logs

**Backend Logs:**

```bash
npm run start:backend:dev
# Look for CORS-related log messages
```

**Frontend Console:**

- Open DevTools
- Check Console tab for detailed error messages
- Look for Network tab request details

### Manual Testing

Use tools like:

- Postman
- curl
- Browser DevTools Network tab

### Contact Support

Include in your support request:

1. Output of `npm run health:backend`
2. Browser console errors
3. Network tab screenshots
4. Environment configuration

## 📝 Additional Resources

- [MDN CORS Documentation](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [NestJS CORS Configuration](https://docs.nestjs.com/security/cors)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

---

**Last Updated:** June 2025  
**Version:** 1.0.0
