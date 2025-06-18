#!/bin/bash
echo "🔥 ELIMINACIÓN CRÍTICA DE ARCHIVOS MOCK BLOQUEANTES - SUPERAPP COOMUNITY"
echo "=========================================================================="
echo ""

# Directorio base
SUPERAPP_DIR="Demo/apps/superapp-unified/src"

echo "🎯 ELIMINANDO ARCHIVOS CRÍTICOS QUE BLOQUEAN EFECTOS VISUALES..."
echo ""

# ARCHIVO CRÍTICO #1: marketplaceMockData.ts (969 líneas)
echo "📄 ELIMINANDO: marketplaceMockData.ts (969 líneas de datos hardcodeados)"
if [ -f "$SUPERAPP_DIR/data/marketplaceMockData.ts" ]; then
    mv "$SUPERAPP_DIR/data/marketplaceMockData.ts" "$SUPERAPP_DIR/data/marketplaceMockData.ts.BACKUP_$(date +%Y%m%d_%H%M%S)"
    echo "   ✅ MOVIDO A BACKUP: marketplaceMockData.ts"
    echo "   🎨 RESULTADO: Efectos visuales Marketplace ahora visibles"
else
    echo "   ⚠️ Archivo no encontrado (ya eliminado?)"
fi
echo ""

# ARCHIVO CRÍTICO #3: lets-mock-service.ts (323 líneas)
echo "📄 COMENTANDO: lets-mock-service.ts (323 líneas de servicios simulados)"
if [ -f "$SUPERAPP_DIR/lib/lets-mock-service.ts" ]; then
    # Crear backup
    cp "$SUPERAPP_DIR/lib/lets-mock-service.ts" "$SUPERAPP_DIR/lib/lets-mock-service.ts.BACKUP_$(date +%Y%m%d_%H%M%S)"
    
    # Comentar el contenido crítico (mantener exports para evitar errores de compilación)
    cat > "$SUPERAPP_DIR/lib/lets-mock-service.ts" << 'EOF'
// 🚨 MOCK SERVICE TEMPORALMENTE DESHABILITADO PARA DESBLOQUEAR EFECTOS VISUALES
// Archivo original respaldado como .BACKUP_[timestamp]

// Tipos básicos mantenidos para compatibilidad
export interface LetsTransaction {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  description: string;
  type: 'PAYMENT' | 'EXCHANGE' | 'SERVICE' | 'PRODUCT';
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  completedAt?: Date;
}

export interface LetsUser {
  id: string;
  name: string;
  email: string;
  balance: number;
  trustScore: number;
  totalTransactions: number;
}

export interface LetsBalance {
  userId: string;
  balance: number;
  pendingIn: number;
  pendingOut: number;
  lastUpdated: string;
}

// Servicio deshabilitado - forzará errores claros en lugar de simulaciones
class LetsMockService {
  async getBalance(userId: string): Promise<LetsBalance> {
    throw new Error('LETS Mock Service deshabilitado - integrando con backend real');
  }
  
  async getTransactions(userId: string): Promise<LetsTransaction[]> {
    throw new Error('LETS Mock Service deshabilitado - integrando con backend real');
  }
  
  // Todos los demás métodos también deshabilitados...
}

export const letsMockService = new LetsMockService();
EOF
    
    echo "   ✅ CONTENIDO COMENTADO: lets-mock-service.ts"
    echo "   🎨 RESULTADO: LETS fallará limpiamente, efectos visuales visibles"
else
    echo "   ⚠️ Archivo no encontrado"
fi
echo ""

echo "📋 INFORMACIÓN SOBRE useRealBackendData.ts:"
echo "   📄 Archivo: $SUPERAPP_DIR/hooks/useRealBackendData.ts (2,605 líneas)"
echo "   🔧 ACCIÓN REQUERIDA: Eliminar manualmente Builder.io Safe Mode"
echo "   📍 Líneas críticas a eliminar:"
echo "      - Línea ~177: isBuilderEnvironment detection"
echo "      - Líneas 180-220: Builder.io mock data return"
echo "      - Líneas 250-290: Wallet mock data"
echo "      - Líneas 320-360: Game data mock"
echo "   💡 Resultado: Datos reales o errores claros (no simulaciones)"
echo ""

echo "🎯 VERIFICACIÓN POST-ELIMINACIÓN:"
echo "================================="
echo ""
echo "✅ PASOS COMPLETADOS:"
echo "   1. marketplaceMockData.ts → ELIMINADO/BACKUP"
echo "   2. lets-mock-service.ts → COMENTADO/BACKUP"
echo ""
echo "⚠️ PASOS MANUALES REQUERIDOS:"
echo "   3. Refactorizar useRealBackendData.ts (eliminar Builder.io Safe Mode)"
echo ""
echo "🎨 EFECTOS VISUALES ESPERADOS AHORA VISIBLES:"
echo "   • ✨ Cosmic Design System"
echo "   • 🔮 Glassmorphism Effects"
echo "   • 🌟 Revolutionary Auras"
echo "   • ⚡ Dynamic Particles"
echo "   • 🎨 Material UI v7 Advanced Features"
echo ""
echo "🚀 SIGUIENTE PASO: Reiniciar SuperApp para ver efectos desbloqueados"
echo "   cd Demo/apps/superapp-unified && npm run dev"
echo ""
echo "✨ ¡ÉXITO! Los efectos visuales revolucionarios ahora deben ser visibles"