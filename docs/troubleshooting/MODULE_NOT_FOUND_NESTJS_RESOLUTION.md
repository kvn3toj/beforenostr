# NestJS MODULE_NOT_FOUND Error Resolution Guide

**Date:** July 9, 2025  
**Context:** CoomÜnity Backend - NestJS in Turborepo Monorepo  
**Error:** `Cannot find module '/Users/kevinp/Movies/GAMIFIER-copy/backend/dist/main'`

## 🚨 Problem Description

When running the NestJS backend in a monorepo setup, the application failed to start with a `MODULE_NOT_FOUND` error, even though TypeScript compilation completed successfully.

### Error Details

```bash
Error: Cannot find module '/Users/kevinp/Movies/GAMIFIER-copy/backend/dist/main'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1212:15)
    at Module._load (node:internal/modules/cjs/loader:1043:27)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:164:12)
    at node:internal/main/run_main_module:28:49 {
  code: 'MODULE_NOT_FOUND',
  requireStack: []
}
```

### Environment

- **Node.js Version:** v20.19.3
- **Framework:** NestJS with TypeScript
- **Setup:** Turborepo monorepo with `@coomunity/backend` and `@coomunity/shared-types`
- **Expected Path:** `backend/dist/main.js`
- **Actual Path:** `backend/dist/backend/src/main.js`

## 🔍 Root Cause Analysis

### Primary Issue: Incorrect Build Output Structure

The TypeScript compiler was outputting files to `backend/dist/backend/src/` instead of `backend/dist/` due to misconfigured `baseUrl` in `tsconfig.json`.

### Secondary Issue: Missing Prisma Generated Files

The Prisma generated client files were not being copied to the correct location in the build output, causing runtime import errors.

### Configuration Problems Identified

1. **tsconfig.json:** `"baseUrl": "./"` caused nested output structure
2. **nest-cli.json:** Asset copying configuration was pointing to wrong output directory
3. **Prisma files:** Generated files not properly copied to dist during build

## 🛠️ Solution Applied

### Step 1: Fix TypeScript Configuration

```json
// backend/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": "./src", // Changed from "./"
    "outDir": "./dist",
    "paths": {
      "@/*": ["*"] // Changed from "src/*"
    }
  }
}
```

### Step 2: Update NestJS CLI Configuration

```json
// backend/nest-cli.json
{
  "compilerOptions": {
    "assets": [
      {
        "include": "src/generated/prisma/**/*",
        "outDir": "dist" // Changed from "dist/backend"
      }
    ]
  }
}
```

### Step 3: Manual File Copying (Temporary Fix)

```bash
# Copy compiled files to correct location
cp -r dist/backend/src/* dist/

# Copy Prisma generated files
mkdir -p dist/generated/prisma
cp -r src/generated/prisma/* dist/generated/prisma/
```

### Step 4: Verification

```bash
# Test backend startup
node dist/main.js

# Test health endpoint
curl http://localhost:3002/health
```

## ✅ Verification Results

### Successful Backend Startup

```bash
[Nest] 8713  - 07/09/2025, 12:50:03 PM     LOG [NestFactory] Starting Nest application...
[Nest] 8713  - 07/09/2025, 12:50:03 PM     LOG [MetricsService] ✅ Prometheus metrics initialized
🌌 PhilosophyModule CONSTRUCTOR: Activando la Consola de Experiencias...
🌟 CommunicationsModule CONSTRUCTOR: Activando la Orquestación de Agentes IA...
[Nest] 8713  - 07/09/2025, 12:50:04 PM     LOG [InstanceLoader] PrismaModule dependencies initialized
```

### Health Check Response

```json
{
  "status": "ok",
  "timestamp": "2025-07-09T17:50:18.674Z",
  "message": "Backend is running",
  "appService": "available",
  "endpoints": {
    "health": "OK",
    "auth": "OK",
    "api": "OK"
  }
}
```

## 🔧 Automation Solution

### Postbuild Script (Recommended)

Add to `package.json`:

```json
{
  "scripts": {
    "build": "nest build",
    "postbuild": "npm run copy-assets",
    "copy-assets": "cp -r dist/backend/src/* dist/ 2>/dev/null || true && mkdir -p dist/generated/prisma && cp -r src/generated/prisma/* dist/generated/prisma/ 2>/dev/null || true"
  }
}
```

### Alternative: Build Script Enhancement

```bash
#!/bin/bash
# build-backend.sh
echo "🏗️ Building NestJS backend..."
npm run build

echo "📁 Copying assets to correct locations..."
if [ -d "dist/backend/src" ]; then
  cp -r dist/backend/src/* dist/
  echo "✅ Main files copied"
fi

if [ -d "src/generated/prisma" ]; then
  mkdir -p dist/generated/prisma
  cp -r src/generated/prisma/* dist/generated/prisma/
  echo "✅ Prisma files copied"
fi

echo "🚀 Backend build complete!"
```

## 📋 Troubleshooting Checklist

### When MODULE_NOT_FOUND Occurs:

1. **Check file existence:**

   ```bash
   ls -la backend/dist/main.js
   ```

2. **Verify build output structure:**

   ```bash
   ls -la backend/dist/
   ```

3. **Check for nested output:**

   ```bash
   ls -la backend/dist/backend/src/
   ```

4. **Verify Prisma files:**

   ```bash
   ls -la backend/dist/generated/prisma/
   ```

5. **Check TypeScript config:**
   ```bash
   cat backend/tsconfig.json | grep -A 5 -B 5 "baseUrl"
   ```

### Quick Fix Commands:

```bash
# Navigate to backend directory
cd backend

# Clean and rebuild
rm -rf dist && npm run build

# Apply manual fix
cp -r dist/backend/src/* dist/ 2>/dev/null || true
mkdir -p dist/generated/prisma
cp -r src/generated/prisma/* dist/generated/prisma/ 2>/dev/null || true

# Test startup
node dist/main.js
```

## 🚀 Prevention Strategies

### 1. Proper TypeScript Configuration

- Use `"baseUrl": "./src"` in monorepo setups
- Ensure `outDir` points to `"./dist"`
- Configure paths relative to `baseUrl`

### 2. Asset Management

- Configure `nest-cli.json` to copy generated files
- Use postbuild scripts for reliable asset copying
- Include Prisma generation in build process

### 3. Build Verification

- Always test compiled output before deployment
- Include health checks in build verification
- Use automated scripts for consistent builds

### 4. Monorepo Best Practices

- Maintain consistent directory structures
- Use workspace-relative paths
- Document build processes clearly

## 📚 Related References

- [NestJS CLI Configuration](https://docs.nestjs.com/cli/overview)
- [TypeScript Module Resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html)
- [Prisma Client Generation](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/generating-prisma-client)
- [Turborepo Module Resolution](https://turbo.build/repo/docs/handbook/troubleshooting#module-resolution-issues)

## 🎯 Key Takeaways

1. **baseUrl Configuration:** Critical for proper build output structure in monorepos
2. **Asset Copying:** Generated files must be explicitly copied to build output
3. **Verification:** Always test compiled output before considering build complete
4. **Automation:** Use scripts to ensure consistent and reliable builds
5. **Documentation:** Document solutions for team knowledge sharing

---

**Status:** ✅ **RESOLVED**  
**Backend:** Running successfully on port 3002  
**Health Check:** Responding correctly  
**Next Steps:** Implement automation scripts to prevent recurrence
