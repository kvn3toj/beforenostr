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

- **Node.js:** v20.19.3
- **Framework:** NestJS
- **Setup:** Turborepo monorepo with `@coomunity/backend` and `@coomunity/shared-types`
- **Build Tool:** TypeScript Compiler (tsc)

## 🔍 Root Cause Analysis

### Primary Issue: Incorrect Build Output Structure

- **Expected Path:** `backend/dist/main.js`
- **Actual Path:** `backend/dist/backend/src/main.js`
- **Cause:** Monorepo configuration with incorrect `baseUrl` in `tsconfig.json`

### Secondary Issue: Missing Prisma Generated Files

- **Expected Path:** `backend/dist/generated/prisma/`
- **Actual State:** Missing from build output
- **Cause:** Generated files not properly copied during build process

## 🛠️ Solution Implementation

### Step 1: Fix TypeScript Configuration

**File:** `backend/tsconfig.json`

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "allowSyntheticDefaultImports": true,
    "target": "es2021",
    "sourceMap": true,
    "outDir": "./dist",
    "baseUrl": "./src", // 🔧 FIXED: Changed from "./"
    "incremental": true,
    "skipLibCheck": true,
    "strictNullChecks": false,
    "noImplicitAny": false,
    "strictBindCallApply": false,
    "forceConsistentCasingInFileNames": false,
    "noFallthroughCasesInSwitch": false,
    "paths": {
      "@/*": ["*"] // 🔧 FIXED: Updated path mapping
    }
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "test",
    "**/*spec.ts",
    "**/*.tsx",
    "**/*.jsx",
    "../context-engineering/**/*.tsx",
    "../context-engineering/**/*.jsx",
    "../context-engineering/PRPs/validators/**/*"
  ]
}
```

### Step 2: Update NestJS CLI Configuration

**File:** `backend/nest-cli.json`

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true,
    "tsConfigPath": "tsconfig.backend.json",
    "assets": [
      {
        "include": "prisma/**/*",
        "outDir": "dist"
      },
      {
        "include": "src/generated/prisma/**/*",
        "outDir": "dist" // 🔧 FIXED: Changed from "dist/backend"
      }
    ],
    "watchAssets": true
  }
}
```

### Step 3: Rebuild and Fix File Structure

```bash
# Clean previous build
cd backend
rm -rf dist

# Rebuild with corrected configuration
npm run build

# Manual fix for immediate resolution
cp -r dist/backend/src/* dist/

# Generate Prisma client
npx prisma generate

# Copy Prisma files to correct location
mkdir -p dist/generated/prisma
cp -r src/generated/prisma/* dist/generated/prisma/
```

## ✅ Verification Steps

### 1. Check File Structure

```bash
ls -la backend/dist/main.js          # ✅ Should exist
ls -la backend/dist/generated/prisma/ # ✅ Should exist
```

### 2. Test Backend Startup

```bash
cd backend
node dist/main.js
```

### 3. Health Check

```bash
curl http://localhost:3002/health
# Expected: {"status":"ok","message":"Backend is running"}
```

## 🔄 Automation Solution

### Build Script Enhancement

**File:** `backend/package.json`

```json
{
  "scripts": {
    "build": "nest build",
    "build:fix": "npm run build && npm run copy-assets",
    "copy-assets": "npm run copy-main && npm run copy-prisma",
    "copy-main": "cp -r dist/backend/src/* dist/ 2>/dev/null || true",
    "copy-prisma": "npx prisma generate && mkdir -p dist/generated/prisma && cp -r src/generated/prisma/* dist/generated/prisma/ 2>/dev/null || true",
    "postbuild": "npm run copy-assets"
  }
}
```

## 📚 Related Issues and Solutions

### Common Variations of This Error

1. **Path Alias Issues in CLI Scripts**
   - **Solution:** Use `tsconfig-paths/register` with ts-node
   - **Reference:** [NestJS Path Aliases in CLI Scripts](https://medium.com/@bloodturtle/why-nestjs-path-aliases-break-in-cli-scripts-and-how-to-fix-them-3c0e0665896f)

2. **Module Resolution in Turborepo**
   - **Solution:** Proper `main` and `types` fields in package.json
   - **Reference:** [NestJS Module Resolution in Turborepo](https://medium.com/@cloudiafricaa/solving-nestjs-module-resolution-in-turborepo-the-package-json-fix-6e7ac0d037dc)

3. **TypeScript Cannot Find Module**
   - **Solution:** Check `moduleResolution`, install types, verify paths
   - **Reference:** [TypeScript Cannot Find Module](https://bobbyhadz.com/blog/typescript-cannot-find-module)

## 🎯 Key Learnings

### Configuration Best Practices

1. **TypeScript baseUrl:** Should point to `"./src"` in monorepo setups
2. **NestJS Assets:** Ensure `outDir` matches expected structure
3. **Prisma Integration:** Always copy generated files to dist
4. **Build Process:** Implement post-build asset copying

### Debugging Methodology

1. **Check Actual vs Expected Paths:** Use `ls -la` to verify file locations
2. **Trace Import Paths:** Follow the require stack in error messages
3. **Verify Configuration:** Cross-check tsconfig.json and nest-cli.json
4. **Test Incrementally:** Fix one issue at a time and verify

## 🚀 Prevention Strategies

### 1. Automated Build Verification

```bash
# Add to CI/CD pipeline
npm run build
test -f dist/main.js || exit 1
test -d dist/generated/prisma || exit 1
```

### 2. Development Scripts

```bash
# Add to package.json
"dev:check": "npm run build && node dist/main.js --dry-run"
```

### 3. Documentation

- Keep this guide updated with new variations
- Document monorepo-specific configurations
- Share with team members

## 📋 Troubleshooting Checklist

- [ ] TypeScript compilation successful (0 errors)
- [ ] `dist/main.js` exists in expected location
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Prisma files copied to `dist/generated/prisma/`
- [ ] `baseUrl` set to `"./src"` in tsconfig.json
- [ ] `outDir` correctly configured in nest-cli.json
- [ ] No conflicting processes on port 3002
- [ ] Health endpoint responds correctly

## 🔗 References

- [NestJS Path Aliases in CLI Scripts](https://medium.com/@bloodturtle/why-nestjs-path-aliases-break-in-cli-scripts-and-how-to-fix-them-3c0e0665896f)
- [NestJS Module Resolution in Turborepo](https://medium.com/@cloudiafricaa/solving-nestjs-module-resolution-in-turborepo-the-package-json-fix-6e7ac0d037dc)
- [TypeScript Cannot Find Module Solutions](https://bobbyhadz.com/blog/typescript-cannot-find-module)
- [Solving Unexpected Errors in NestJS](https://blog.stackademic.com/solving-unexpected-errors-in-nest-js-ccb345cf4887)

---

**Status:** ✅ Resolved
**Backend Health:** Operational on port 3002
**Last Updated:** July 9, 2025
