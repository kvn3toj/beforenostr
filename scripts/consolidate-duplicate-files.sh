#!/bin/bash

# 🎯 SCRIPT DE CONSOLIDACIÓN DE DUPLICADOS CRÍTICOS
# Basado en análisis de integración backend-frontend
# Fecha: $(date '+%Y-%m-%d %H:%M:%S')

set -e

echo "🔄 INICIANDO CONSOLIDACIÓN DE ARCHIVOS DUPLICADOS..."
echo "======================================================="

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

SUPERAPP_DIR="Demo/apps/superapp-unified"
BACKUP_DIR="backups/duplicate-consolidation-$(date +%Y%m%d_%H%M%S)"

# Crear directorio de backup
mkdir -p "$BACKUP_DIR"

echo -e "${YELLOW}📁 Directorio de backup creado: $BACKUP_DIR${NC}"

# 🏠 MÓDULO HOME - 9 duplicados identificados
echo -e "\n${GREEN}🏠 ANALIZANDO MÓDULO HOME (9 duplicados)${NC}"
echo "================================================"

HOME_FILES=(
    "$SUPERAPP_DIR/src/pages/Home.tsx"
    "$SUPERAPP_DIR/src/pages/HomeEnhanced.tsx"
    "$SUPERAPP_DIR/src/pages/HomeRevolutionary.tsx"
    "$SUPERAPP_DIR/src/components/home/HomePage.tsx"
    "$SUPERAPP_DIR/src/components/modules/home/HomePage.tsx"
)

echo "🔍 Archivos Home encontrados:"
for file in "${HOME_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file ($(wc -l < "$file") líneas)"
    else
        echo "  ❌ $file (no existe)"
    fi
done

# 🛒 MÓDULO MARKETPLACE - 13 duplicados identificados
echo -e "\n${GREEN}🛒 ANALIZANDO MÓDULO MARKETPLACE (13 duplicados)${NC}"
echo "===================================================="

MARKETPLACE_FILES=(
    "$SUPERAPP_DIR/src/pages/Marketplace.tsx"
    "$SUPERAPP_DIR/src/pages/MarketplaceMain.tsx"
    "$SUPERAPP_DIR/src/pages/MarketplaceEnhanced.tsx"
    "$SUPERAPP_DIR/src/components/marketplace/MarketplaceMain.tsx"
    "$SUPERAPP_DIR/src/components/modules/marketplace/MarketplaceMain.tsx"
)

echo "🔍 Archivos Marketplace encontrados:"
for file in "${MARKETPLACE_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file ($(wc -l < "$file") líneas)"
    else
        echo "  ❌ $file (no existe)"
    fi
done

# 👥 MÓDULO SOCIAL - 14 duplicados identificados
echo -e "\n${GREEN}👥 ANALIZANDO MÓDULO SOCIAL (14 duplicados)${NC}"
echo "==============================================="

SOCIAL_FILES=(
    "$SUPERAPP_DIR/src/pages/Social.tsx"
    "$SUPERAPP_DIR/src/pages/SocialMain.tsx"
    "$SUPERAPP_DIR/src/components/social/SocialMain.tsx"
    "$SUPERAPP_DIR/src/components/modules/social/SocialMain.tsx"
)

echo "🔍 Archivos Social encontrados:"
for file in "${SOCIAL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file ($(wc -l < "$file") líneas)"
    else
        echo "  ❌ $file (no existe)"
    fi
done

# 🎮 MÓDULO UPLAY - 10 duplicados identificados
echo -e "\n${GREEN}🎮 ANALIZANDO MÓDULO UPLAY (10 duplicados)${NC}"
echo "==============================================="

UPLAY_FILES=(
    "$SUPERAPP_DIR/src/pages/UPlay.tsx"
    "$SUPERAPP_DIR/src/pages/UPlayMain.tsx"
    "$SUPERAPP_DIR/src/components/uplay/UPlayMain.tsx"
    "$SUPERAPP_DIR/src/components/modules/uplay/UPlayMain.tsx"
)

echo "🔍 Archivos UPlay encontrados:"
for file in "${UPLAY_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file ($(wc -l < "$file") líneas)"
    else
        echo "  ❌ $file (no existe)"
    fi
done

# 💰 MÓDULO WALLET - 10 duplicados identificados
echo -e "\n${GREEN}💰 ANALIZANDO MÓDULO WALLET (10 duplicados)${NC}"
echo "==============================================="

WALLET_FILES=(
    "$SUPERAPP_DIR/src/pages/Wallet.tsx"
    "$SUPERAPP_DIR/src/pages/WalletMain.tsx"
    "$SUPERAPP_DIR/src/components/wallet/WalletMain.tsx"
    "$SUPERAPP_DIR/src/components/modules/wallet/WalletMain.tsx"
)

echo "🔍 Archivos Wallet encontrados:"
for file in "${WALLET_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        echo "  ✅ $file ($(wc -l < "$file") líneas)"
    else
        echo "  ❌ $file (no existe)"
    fi
done

# 📊 ANÁLISIS DE DUPLICADOS ESPECÍFICOS
echo -e "\n${YELLOW}📊 ANÁLISIS DETALLADO DE DUPLICADOS${NC}"
echo "===================================="

# Función para comparar archivos
compare_files() {
    local file1="$1"
    local file2="$2"
    
    if [[ -f "$file1" && -f "$file2" ]]; then
        local lines1=$(wc -l < "$file1")
        local lines2=$(wc -l < "$file2")
        local diff_lines=$(diff "$file1" "$file2" | wc -l)
        
        if [[ $diff_lines -eq 0 ]]; then
            echo "  🔁 IDÉNTICOS: $(basename "$file1") ↔ $(basename "$file2")"
            return 0
        else
            local similarity=$((100 - (diff_lines * 100 / (lines1 + lines2))))
            echo "  📝 SIMILITUD ${similarity}%: $(basename "$file1") ↔ $(basename "$file2")"
            return 1
        fi
    fi
    return 2
}

# 🎯 RECOMENDACIONES DE CONSOLIDACIÓN
echo -e "\n${GREEN}🎯 RECOMENDACIONES DE CONSOLIDACIÓN${NC}"
echo "===================================="

cat << 'EOF'

ESTRATEGIA DE CONSOLIDACIÓN RECOMENDADA:

📂 ESTRUCTURA OBJETIVO (Clean Architecture):
├── src/pages/                    # 🎯 PÁGINAS PRINCIPALES (1 por módulo)
│   ├── Home.tsx                  # ✅ MANTENER - Página principal
│   ├── Marketplace.tsx           # ✅ MANTENER - Página principal
│   ├── Social.tsx                # ✅ MANTENER - Página principal
│   ├── UPlay.tsx                 # ✅ MANTENER - Página principal
│   └── Wallet.tsx                # ✅ MANTENER - Página principal
│
├── src/components/modules/       # 🎯 COMPONENTES MODULARES REUTILIZABLES
│   ├── home/                     # ✅ Componentes específicos del Home
│   ├── marketplace/              # ✅ Componentes específicos del Marketplace
│   ├── social/                   # ✅ Componentes específicos del Social
│   ├── uplay/                    # ✅ Componentes específicos del UPlay
│   └── wallet/                   # ✅ Componentes específicos del Wallet
│
└── src/components/ui/            # 🎯 COMPONENTES UI GENERALES

🗑️ ARCHIVOS A ELIMINAR (Duplicados):
- HomeEnhanced.tsx, HomeRevolutionary.tsx (usar Home.tsx como base)
- MarketplaceMain.tsx, MarketplaceEnhanced.tsx (usar Marketplace.tsx como base)
- Archivos duplicados en múltiples directorios /modules/

🔧 PLAN DE MIGRACIÓN:
1. Backup automático de todos los archivos duplicados
2. Análisis de diferencias entre versiones
3. Consolidación en archivos principales
4. Actualización de imports en toda la aplicación
5. Testing de regresión automatizado

EOF

# 💾 CREAR BACKUP DE DUPLICADOS CRÍTICOS
echo -e "\n${YELLOW}💾 CREANDO BACKUP DE ARCHIVOS DUPLICADOS${NC}"
echo "========================================="

ALL_FILES=(
    "${HOME_FILES[@]}"
    "${MARKETPLACE_FILES[@]}"
    "${SOCIAL_FILES[@]}"
    "${UPLAY_FILES[@]}"
    "${WALLET_FILES[@]}"
)

for file in "${ALL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        # Crear estructura de directorios en backup
        backup_path="$BACKUP_DIR/${file#$SUPERAPP_DIR/}"
        mkdir -p "$(dirname "$backup_path")"
        cp "$file" "$backup_path"
        echo "  📋 $file → $backup_path"
    fi
done

# 📈 MÉTRICAS FINALES
echo -e "\n${GREEN}📈 MÉTRICAS DE DUPLICADOS${NC}"
echo "=========================="

total_duplicates=0
backed_up=0

for file in "${ALL_FILES[@]}"; do
    if [[ -f "$file" ]]; then
        ((total_duplicates++))
        ((backed_up++))
    fi
done

echo "📊 Total archivos analizados: $total_duplicates"
echo "💾 Total archivos respaldados: $backed_up"
echo "📂 Directorio backup: $BACKUP_DIR"

# 🚨 SIGUIENTE PASO RECOMENDADO
echo -e "\n${YELLOW}🚨 SIGUIENTES PASOS RECOMENDADOS${NC}"
echo "=================================="

cat << 'EOF'

⚠️ ESTE SCRIPT ES SOLO ANÁLISIS. PARA APLICAR CONSOLIDACIÓN:

1. 🔍 REVISAR BACKUP: Verificar que todos los archivos importantes están respaldados
2. 🧪 TESTING: Ejecutar suite completa de tests antes de consolidar
3. 🔧 CONSOLIDAR: Usar scripts específicos de consolidación por módulo
4. ✅ VALIDAR: Verificar que la aplicación funciona después de cada consolidación

COMANDOS SUGERIDOS:
./scripts/consolidate-home-duplicates.sh      # Consolidar módulo Home
./scripts/consolidate-marketplace-duplicates.sh  # Consolidar módulo Marketplace
npm run test:e2e                              # Verificar funcionalidad

EOF

echo -e "\n${GREEN}✅ ANÁLISIS DE DUPLICADOS COMPLETADO${NC}"
echo "===================================="
echo "📋 Reporte completo disponible en: $BACKUP_DIR/analysis-report.txt"

# Generar reporte detallado
{
    echo "REPORTE DE ANÁLISIS DE DUPLICADOS"
    echo "Fecha: $(date)"
    echo "==============================="
    echo ""
    echo "ARCHIVOS ANALIZADOS:"
    for file in "${ALL_FILES[@]}"; do
        if [[ -f "$file" ]]; then
            echo "✅ $file ($(wc -l < "$file") líneas)"
        else
            echo "❌ $file (no existe)"
        fi
    done
} > "$BACKUP_DIR/analysis-report.txt"

echo "📄 Reporte detallado guardado en: $BACKUP_DIR/analysis-report.txt" 