#!/bin/bash

# 🔧 GESTOR INTELIGENTE DE PUERTOS - PROYECTO COOMUNITY
# Solución definitiva para conflictos de puerto en desarrollo

set -e

echo "🚀 INICIANDO GESTOR INTELIGENTE DE PUERTOS..."

# Función para limpiar procesos
cleanup_processes() {
    echo "🧹 Limpiando procesos previos..."
    pkill -f "vite" 2>/dev/null || true
    pkill -f "npm run dev" 2>/dev/null || true
    lsof -ti:3000,3001,3002,3003 | xargs kill -9 2>/dev/null || true
    sleep 2
}

# Función para verificar puerto ocupado
check_port() {
    local port=$1
    local app_name=$2
    
    if lsof -i :$port >/dev/null 2>&1; then
        echo "⚠️  CONFLICTO: Puerto $port ya está ocupado"
        echo "🔍 Proceso ocupando puerto $port:"
        lsof -i :$port
        return 1
    else
        echo "✅ Puerto $port disponible para $app_name"
        return 0
    fi
}

# Función para iniciar aplicación específica
start_app() {
    local app=$1
    
    case $app in
        "backend")
            echo "🗄️  Iniciando Backend NestJS (puerto 3002)..."
            npm run dev:backend &
            ;;
        "admin")
            echo "👨‍💼 Iniciando Gamifier Admin (puerto 3000)..."
            check_port 3000 "Gamifier Admin" || return 1
            npm run dev:admin &
            ;;
        "superapp")
            echo "📱 Iniciando SuperApp (puerto 3001)..."
            check_port 3001 "SuperApp" || return 1
            npm run dev:superapp &
            ;;
        "both-frontends")
            echo "🔄 MODO CONFLICTIVO: Iniciando ambos frontends..."
            echo "⚠️  ADVERTENCIA: Esto puede causar conflictos de puerto"
            read -p "¿Continuar? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                check_port 3000 "Gamifier Admin" || return 1
                check_port 3001 "SuperApp" || return 1
                echo "📊 Iniciando con segregación estricta..."
                npm run dev:admin &
                sleep 5  # Esperar a que Admin se establezca
                npm run dev:superapp &
            else
                echo "❌ Operación cancelada"
                return 1
            fi
            ;;
        *)
            echo "❌ Aplicación desconocida: $app"
            echo "📋 Opciones válidas: backend, admin, superapp, both-frontends"
            return 1
            ;;
    esac
}

# Función para mostrar estado de puertos
show_port_status() {
    echo ""
    echo "📊 ESTADO ACTUAL DE PUERTOS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    for port in 3000 3001 3002; do
        if lsof -i :$port >/dev/null 2>&1; then
            app_info=$(lsof -i :$port | tail -1 | awk '{print $1 " (PID: " $2 ")"}')
            echo "🟢 Puerto $port: OCUPADO por $app_info"
        else
            echo "⚪ Puerto $port: LIBRE"
        fi
    done
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Función principal
main() {
    echo "🎯 OPCIONES DISPONIBLES:"
    echo "1) backend      - Solo Backend NestJS"
    echo "2) admin        - Solo Gamifier Admin" 
    echo "3) superapp     - Solo SuperApp"
    echo "4) both-frontends - Ambos frontends (CONFLICTIVO)"
    echo "5) status       - Ver estado de puertos"
    echo "6) clean        - Limpiar todos los procesos"
    echo ""
    
    if [ $# -eq 0 ]; then
        read -p "🔧 Selecciona una opción (1-6): " choice
        case $choice in
            1) app="backend";;
            2) app="admin";;
            3) app="superapp";;
            4) app="both-frontends";;
            5) show_port_status; exit 0;;
            6) cleanup_processes; echo "✅ Procesos limpiados"; exit 0;;
            *) echo "❌ Opción inválida"; exit 1;;
        esac
    else
        app=$1
    fi
    
    if [ "$app" = "status" ]; then
        show_port_status
        exit 0
    fi
    
    if [ "$app" = "clean" ]; then
        cleanup_processes
        echo "✅ Procesos limpiados"
        exit 0
    fi
    
    # Limpiar procesos previos
    cleanup_processes
    
    # Iniciar aplicación seleccionada
    if start_app $app; then
        echo ""
        echo "🎉 APLICACIÓN INICIADA EXITOSAMENTE"
        echo "⏱️  Esperando 10 segundos para verificar estado..."
        sleep 10
        show_port_status
        
        echo ""
        echo "🔗 URLS DE ACCESO:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        if lsof -i :3002 >/dev/null 2>&1; then
            echo "🗄️  Backend:        http://localhost:1111/health"
        fi
        if lsof -i :3000 >/dev/null 2>&1; then
            echo "👨‍💼 Gamifier Admin: http://localhost:3333"
        fi
        if lsof -i :3001 >/dev/null 2>&1; then
            echo "📱 SuperApp:        http://localhost:2222"
        fi
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        echo ""
        echo "💡 COMANDOS ÚTILES:"
        echo "   ./scripts/dev-port-manager.sh status  # Ver estado"
        echo "   ./scripts/dev-port-manager.sh clean   # Limpiar procesos"
        echo "   Ctrl+C para detener este script"
        echo ""
        
        # Mantener script activo para monitoring
        while true; do
            sleep 30
            echo "🔄 Verificando estado ($(date))..."
            show_port_status
        done
    else
        echo "❌ ERROR: No se pudo iniciar la aplicación"
        exit 1
    fi
}

# Ejecutar función principal con argumentos
main "$@" 