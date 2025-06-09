# 🚨 Quick Fix: "Failed to fetch" Error

This guide helps you quickly resolve the "TypeError: Failed to fetch" error when trying to login.

## 🔍 What This Error Means

The "Failed to fetch" error typically occurs when:

- The backend server is not running
- CORS configuration issues
- Network connectivity problems
- Wrong backend URL configuration

## ⚡ Quick Solutions (Try in Order)

### 1. ✅ Check if Backend is Running

Open a new terminal and run:

```bash
# Navigate to project root
cd /path/to/your/project

# Start the backend server
npm run start:backend:dev
```

**Expected output:**

```
🚀 Gamifier API is running on: http://localhost:3002
```

### 2. 🔍 Verify Backend Health

Open your browser and go to: http://localhost:3002/health

**Expected response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-XX...",
  "message": "Backend is running"
}
```

### 3. 🔧 Check Environment Configuration

Verify your `.env` file in `Demo/apps/superapp-unified/.env`:

```bash
VITE_API_BASE_URL=http://localhost:3002
VITE_ENABLE_MOCK_AUTH=false
```

### 4. 🛠️ Automated Fix Script

Run our automated verification script:

```bash
cd Demo/apps/superapp-unified
node scripts/verify-backend.js
```

This script will:

- Check if backend is running
- Install dependencies if needed
- Start the backend automatically
- Provide detailed troubleshooting

## 🔧 Manual Troubleshooting

### If Backend Won't Start

1. **Install Dependencies:**

```bash
cd /path/to/your/project
npm install
```

2. **Check Port Conflicts:**

```bash
# Check if port 3002 is in use
lsof -i :3002        # macOS/Linux
netstat -an | findstr 3002  # Windows
```

3. **Check Database:**

```bash
# Reset database if needed
npm run db:reset
npm run db:seed
```

### If CORS Errors Persist

1. **Clear Browser Cache:**

   - Press F12 → Application/Storage → Clear Storage
   - Or use Incognito/Private mode

2. **Check Frontend Origin:**

   - Note your frontend URL (e.g., http://localhost:48752)
   - Verify it's allowed in backend CORS configuration

3. **Restart Both Servers:**

```bash
# Terminal 1: Backend
npm run start:backend:dev

# Terminal 2: Frontend
cd Demo/apps/superapp-unified
npm run dev
```

## 🐛 Using Debug Tools

The application includes enhanced debugging tools:

1. **In Login Page:**

   - Click "🔍 Diagnostics" button
   - Use "🔬 Test Enhanced" for comprehensive testing
   - Review diagnostic report

2. **Browser Console:**

   - Press F12 → Console
   - Look for detailed error logs with troubleshooting steps

3. **Network Tab:**
   - Press F12 → Network
   - Try login again
   - Check failed requests for specific error details

## 📱 Production Deployment

For production environments:

1. **Update Environment Variables:**

```bash
VITE_API_BASE_URL=https://your-backend-domain.com
NODE_ENV=production
```

2. **Configure CORS:**

   - Add your production domain to allowed origins
   - Update `src/main.ts` CORS configuration

3. **SSL/HTTPS:**
   - Ensure both frontend and backend use HTTPS
   - Check SSL certificate validity

## 🆘 Still Need Help?

If none of these solutions work:

1. **Run Full Diagnostic:**

```bash
cd Demo/apps/superapp-unified
npm run dev

# In another terminal
node scripts/verify-backend.js
```

2. **Check Error Details:**

   - Open browser console (F12)
   - Copy the full error message and stack trace
   - Note your exact configuration (OS, Node version, etc.)

3. **Contact Support:**
   - Include diagnostic report
   - Provide error logs from both frontend and backend
   - Share your environment configuration

## 🔗 Related Files

- **API Service:** `src/lib/api-service.ts`
- **Auth Context:** `src/contexts/AuthContext.tsx`
- **Backend Main:** `src/main.ts`
- **CORS Config:** `src/main.ts` (CORS section)
- **Debug Tools:** `src/components/debug/NetworkErrorDebug.tsx`

---

💡 **Pro Tip:** Most "Failed to fetch" errors are resolved by simply starting the backend server with `npm run start:backend:dev`.
