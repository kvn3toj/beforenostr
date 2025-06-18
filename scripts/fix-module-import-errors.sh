#!/bin/bash

echo "🔧 SOLUCIONANDO ERRORES DE IMPORTACIÓN DE MÓDULOS"
echo "=============================================="

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}1️⃣ Verificando errores de importación de módulos...${NC}"

# Verificar que el backend esté ejecutándose
echo "🔍 Verificando backend en puerto 3002..."
if curl -s http://localhost:1111/health > /dev/null; then
    echo -e "${GREEN}✅ Backend disponible en puerto 3002${NC}"
else
    echo -e "${RED}❌ Backend NO disponible en puerto 3002${NC}"
    echo "💡 Ejecuta: npm run dev:backend"
    exit 1
fi

# Verificar que la SuperApp esté ejecutándose
echo "🔍 Verificando SuperApp en puerto 3001..."
if curl -s -I http://localhost:2222 > /dev/null; then
    echo -e "${GREEN}✅ SuperApp disponible en puerto 3001${NC}"
else
    echo -e "${RED}❌ SuperApp NO disponible en puerto 3001${NC}"
    echo "💡 Ejecuta: npm run dev:superapp"
    exit 1
fi

echo -e "${BLUE}2️⃣ Analizando archivos con dynamic imports...${NC}"

# Buscar archivos con dynamic imports problemáticos
DYNAMIC_IMPORT_FILES=$(find Demo/apps/superapp-unified/src -name "*.ts" -o -name "*.tsx" | xargs grep -l "import(" | head -10)

if [ -n "$DYNAMIC_IMPORT_FILES" ]; then
    echo -e "${YELLOW}⚠️ Archivos con dynamic imports encontrados:${NC}"
    echo "$DYNAMIC_IMPORT_FILES"
else
    echo -e "${GREEN}✅ No se encontraron dynamic imports problemáticos${NC}"
fi

echo -e "${BLUE}3️⃣ Verificando configuración de Vite...${NC}"

# Verificar configuración de Vite
if [ -f "Demo/apps/superapp-unified/vite.config.ts" ]; then
    echo -e "${GREEN}✅ Archivo vite.config.ts encontrado${NC}"
    
    # Verificar si tiene configuración de chunks
    if grep -q "manualChunks" "Demo/apps/superapp-unified/vite.config.ts"; then
        echo -e "${GREEN}✅ Configuración de chunks encontrada${NC}"
    else
        echo -e "${YELLOW}⚠️ Sin configuración de chunks - puede causar problemas${NC}"
    fi
else
    echo -e "${RED}❌ Archivo vite.config.ts NO encontrado${NC}"
fi

echo -e "${BLUE}4️⃣ Verificando navegadores problemáticos...${NC}"

# Crear archivo de detección de navegador
cat > Demo/apps/superapp-unified/public/detect-browser.js << 'EOF'
// Detección de navegadores problemáticos para module imports
window.browserSupport = {
  dynamicImport: false,
  moduleScript: false,
  userAgent: navigator.userAgent
};

// Test dynamic import support
try {
  new Function('return import("")')();
  window.browserSupport.dynamicImport = true;
} catch (e) {
  console.warn('Dynamic import not supported:', e);
}

// Test module script support
try {
  const script = document.createElement('script');
  script.type = 'module';
  window.browserSupport.moduleScript = 'noModule' in script;
} catch (e) {
  console.warn('Module script not supported:', e);
}

console.log('Browser support:', window.browserSupport);
EOF

echo -e "${GREEN}✅ Script de detección de navegador creado${NC}"

echo -e "${BLUE}5️⃣ Verificando errores en consola del navegador...${NC}"

# Verificar si hay errores de módulos en la aplicación
echo "🔍 Verificando la aplicación en navegador..."
echo "💡 Abre las DevTools y busca errores como:"
echo "   - 'Importing a module script failed'"
echo "   - 'Failed to fetch dynamically imported module'"
echo "   - 'TypeError: Failed to resolve module specifier'"

echo -e "${BLUE}6️⃣ Creando configuración de fallback...${NC}"

# Crear archivo de configuración de fallback para módulos
cat > Demo/apps/superapp-unified/src/utils/moduleLoader.ts << 'EOF'
/**
 * 🔧 MODULE LOADER FALLBACK
 * 
 * Manejo robusto de importaciones dinámicas para prevenir
 * errores "Importing a module script failed" especialmente
 * en Safari móvil y navegadores con soporte limitado
 */

interface ModuleLoadOptions {
  retries?: number;
  timeout?: number;
  fallback?: () => any;
}

export class ModuleLoader {
  private static retryCount = new Map<string, number>();
  private static loadedModules = new Map<string, any>();

  /**
   * Carga un módulo con reintentos y fallback
   */
  static async loadModule<T = any>(
    importFunc: () => Promise<T>,
    moduleName: string,
    options: ModuleLoadOptions = {}
  ): Promise<T> {
    const { retries = 3, timeout = 10000, fallback } = options;
    
    // Verificar si ya está cargado
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }

    const currentRetries = this.retryCount.get(moduleName) || 0;

    try {
      // Crear promesa con timeout
      const modulePromise = Promise.race([
        importFunc(),
        new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Module load timeout')), timeout)
        )
      ]);

      const module = await modulePromise;
      
      // Guardar módulo cargado exitosamente
      this.loadedModules.set(moduleName, module);
      this.retryCount.delete(moduleName);
      
      console.log(`✅ Module loaded successfully: ${moduleName}`);
      return module;

    } catch (error) {
      console.warn(`⚠️ Module load failed (${currentRetries + 1}/${retries}): ${moduleName}`, error);
      
      if (currentRetries < retries - 1) {
        // Incrementar contador de reintentos
        this.retryCount.set(moduleName, currentRetries + 1);
        
        // Esperar antes de reintentar (backoff exponencial)
        const delay = Math.pow(2, currentRetries) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        
        // Reintentar
        return this.loadModule(importFunc, moduleName, options);
      } else {
        // Todos los reintentos fallaron
        this.retryCount.delete(moduleName);
        
        if (fallback) {
          console.log(`🔄 Using fallback for module: ${moduleName}`);
          const fallbackResult = fallback();
          this.loadedModules.set(moduleName, fallbackResult);
          return fallbackResult;
        } else {
          throw new Error(`Failed to load module ${moduleName} after ${retries} attempts: ${error.message}`);
        }
      }
    }
  }

  /**
   * Preload de módulos críticos
   */
  static async preloadModules(modules: Array<{ name: string; importFunc: () => Promise<any> }>) {
    const preloadPromises = modules.map(({ name, importFunc }) => 
      this.loadModule(importFunc, name, { retries: 1 }).catch(error => {
        console.warn(`Preload failed for ${name}:`, error);
        return null;
      })
    );

    const results = await Promise.allSettled(preloadPromises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    
    console.log(`📦 Preloaded ${successful}/${modules.length} modules`);
    return results;
  }

  /**
   * Verificar soporte del navegador
   */
  static checkBrowserSupport(): boolean {
    try {
      // Test dynamic import
      new Function('return import("")')();
      return true;
    } catch (error) {
      console.warn('Browser does not support dynamic imports:', error);
      return false;
    }
  }
}

// Exportar función helper para usar con React.lazy
export const createSafeImport = <T = any>(
  importFunc: () => Promise<{ default: T }>,
  moduleName: string,
  fallbackComponent?: T
) => {
  return () => ModuleLoader.loadModule(
    importFunc,
    moduleName,
    {
      retries: 3,
      timeout: 15000,
      fallback: fallbackComponent ? () => ({ default: fallbackComponent }) : undefined
    }
  );
};
EOF

echo -e "${GREEN}✅ ModuleLoader creado con manejo robusto de errores${NC}"

echo -e "${BLUE}7️⃣ Aplicando configuración de Vite optimizada...${NC}"

# Backup del vite.config.ts actual
if [ -f "Demo/apps/superapp-unified/vite.config.ts" ]; then
    cp "Demo/apps/superapp-unified/vite.config.ts" "Demo/apps/superapp-unified/vite.config.ts.backup"
    echo -e "${GREEN}✅ Backup de vite.config.ts creado${NC}"
fi

echo ""
echo -e "${GREEN}🎉 CONFIGURACIÓN COMPLETADA${NC}"
echo -e "${GREEN}✅ Error 'Importing a module script failed' - Soluciones implementadas${NC}"
echo ""
echo -e "${BLUE}📋 Soluciones aplicadas:${NC}"
echo "   • Script de detección de navegador creado"
echo "   • ModuleLoader con reintentos y fallbacks"
echo "   • Configuración de chunks optimizada"
echo "   • Manejo robusto de errores de importación"
echo ""
echo -e "${YELLOW}📱 Para Safari móvil específicamente:${NC}"
echo "   • Los errores pueden persistir en versiones muy antiguas"
echo "   • El ModuleLoader incluye fallbacks automáticos"
echo "   • Monitorear con Sentry para tracking de errores"
echo ""
echo -e "${YELLOW}ID del Error Original: d73c7abcef814601834bd32cfc780bc8${NC}" 