#!/bin/bash

# ================================================================
# GIT WORKFLOW COMMANDS - PROYECTO COOMUNITY
# ================================================================
# Comandos para crear backup de rama, commits y push al repositorio
# Ejecutar desde la raíz del monorepo: /Users/kevinp/Movies/GAMIFIER-copy
# ================================================================

echo "🚀 WORKFLOW COMPLETO DE GIT - PROYECTO COOMUNITY"
echo "=================================================="

# ================================================================
# FASE 1: VERIFICACIÓN INICIAL
# ================================================================
echo "📋 1. VERIFICACIÓN DEL ESTADO ACTUAL"
echo "git status"
echo "git branch -a"
echo "git log --oneline -3"
echo ""

# ================================================================
# FASE 2: CREAR RAMA DE BACKUP
# ================================================================
echo "💾 2. CREAR RAMA DE BACKUP (ej: gamifier3.0)"
echo "git checkout -b gamifier3.0    # Crear nueva rama desde la actual"
echo "git checkout gamifier2.0       # Regresar a la rama de trabajo"
echo ""

# ================================================================
# FASE 3: AGREGAR Y COMMITEAR CAMBIOS
# ================================================================
echo "📦 3. AGREGAR Y COMMITEAR CAMBIOS"
echo "git add .                      # Agregar todos los archivos"
echo "git status                     # Verificar archivos staged"
echo ""
echo "# Ejemplo de commit message completo:"
echo 'git commit -m "feat: Implement Cosmic Design System and Ayni Intelligence - Add comprehensive color system integration with Material UI - Implement CosmicProfileWidget, CosmicThemeSwitcher, UniversalAyniDashboard - Add advanced components: CosmicAnalyticsDashboard, ElementalWisdomCircles, MLCollaborationEngine - Create centralized theme system with cosmic color variables - Add useAyniIntelligence hook for philosophical AI integration - Update admin monitoring and notifications pages - Include color system verification scripts and documentation"'
echo ""

# ================================================================
# FASE 4: PUSH AL REPOSITORIO REMOTO
# ================================================================
echo "🌐 4. SUBIR RAMAS AL REPOSITORIO REMOTO"
echo "git push origin gamifier3.0    # Subir rama de backup"
echo "git push origin gamifier2.0    # Subir rama principal"
echo ""

# ================================================================
# FASE 5: COMMITS ADICIONALES (si hay cambios pendientes)
# ================================================================
echo "🔄 5. COMMITS ADICIONALES (si existen cambios)"
echo "git add archivo1 archivo2      # Agregar archivos específicos"
echo "git commit -m \"chore: Update environment configuration and add auth testing script - Update .env and .env.backup with latest configuration values - Add scripts/test-auth-flow.sh for authentication flow testing - Environment optimizations for development workflow\""
echo "git push origin gamifier2.0"
echo ""

# ================================================================
# COMANDOS DIRECTOS PARA COPY-PASTE
# ================================================================
echo "⚡ COMANDOS DIRECTOS PARA COPY-PASTE:"
echo "=================================================="
echo ""

echo "# 1. Verificar estado"
echo "git status && git branch -a && git log --oneline -3"
echo ""

echo "# 2. Crear backup (cambiar nombre de rama según necesites)"
echo "git checkout -b gamifier4.0 && git checkout gamifier2.0"
echo ""

echo "# 3. Add y commit rápido"
echo "git add . && git status"
echo ""

echo "# 4. Commit típico (personalizar mensaje)"
echo "git commit -m \"feat: [DESCRIPCIÓN] - [DETALLES] - [ARCHIVOS PRINCIPALES]\""
echo ""

echo "# 5. Push de ambas ramas"
echo "git push origin gamifier4.0 && git push origin gamifier2.0"
echo ""

echo "# 6. Verificación final"
echo "git log --oneline -4 && git status"
echo ""

# ================================================================
# COMANDOS DE EMERGENCIA
# ================================================================
echo "🆘 COMANDOS DE EMERGENCIA:"
echo "=================================================="
echo ""
echo "# Deshacer último commit (mantener cambios)"
echo "git reset --soft HEAD~1"
echo ""
echo "# Ver diferencias antes de commit"
echo "git diff --staged"
echo ""
echo "# Unstage archivos"
echo "git restore --staged <archivo>"
echo ""
echo "# Ver log detallado"
echo "git log --graph --oneline --decorate --all"
echo ""

# ================================================================
# TEMPLATES DE COMMIT MESSAGES
# ================================================================
echo "📝 TEMPLATES DE COMMIT MESSAGES:"
echo "=================================================="
echo ""
echo "# Features nuevos:"
echo "feat: [TÍTULO] - [COMPONENTES] - [FUNCIONALIDADES] - [ARCHIVOS CLAVE]"
echo ""
echo "# Configuración:"
echo "chore: [TÍTULO] - [ARCHIVOS CONFIG] - [SCRIPTS] - [OPTIMIZACIONES]"
echo ""
echo "# Correcciones:"
echo "fix: [TÍTULO] - [PROBLEMA RESUELTO] - [ARCHIVOS AFECTADOS]"
echo ""
echo "# Documentación:"
echo "docs: [TÍTULO] - [DOCUMENTOS] - [GUÍAS] - [REPORTES]"
echo ""

# ================================================================
# WORKFLOW ESPECÍFICO COOMUNITY
# ================================================================
echo "🎯 WORKFLOW ESPECÍFICO PROYECTO COOMUNITY:"
echo "=================================================="
echo ""
echo "# Siempre trabajar desde la raíz del monorepo"
echo "cd /Users/kevinp/Movies/GAMIFIER-copy"
echo ""
echo "# Ramas principales:"
echo "# gamifier2.0 = Desarrollo activo"
echo "# gamifier3.0 = Backup estable"
echo "# gamifier4.0 = Siguiente backup"
echo ""
echo "# Estructura de commits típica:"
echo "# 1. Features (páginas, componentes, sistemas)"
echo "# 2. Configuration (env, scripts, setup)"  
echo "# 3. Fixes (correcciones, optimizaciones)"
echo ""

echo "✅ SCRIPT COMPLETADO - LISTO PARA USO DIRECTO" 