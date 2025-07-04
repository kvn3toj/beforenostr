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
