#!/bin/bash

# 🔮 CoP ORÁCULO - Quick Start
# Script maestro para inicio rápido de la Comunidad de Práctica Oráculo
# Autor: ǓAN (Agente IA Full-Stack de CoomÜnity)

echo "🔮 CoP ORÁCULO - Quick Start"
echo "==========================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ] || [ ! -d "backend" ]; then
    echo "❌ Error: Ejecuta este script desde la raíz del proyecto CoomÜnity"
    exit 1
fi

echo "🎯 Selecciona una opción:"
echo "1) 🚀 Setup completo (primera vez)"
echo "2) 🔧 Solo iniciar servicios"
echo "3) 🧹 Limpiar y reiniciar"
echo "4) 📚 Ver documentación"
echo "5) 🛑 Salir"

read -p "Opción (1-5): " choice

case $choice in
    1)
        echo "🚀 Iniciando setup completo..."
        ./scripts/cop-oraculo-setup.sh
        ;;
    2)
        echo "🔧 Iniciando servicios..."
        if [ -f "scripts/cop-oraculo-start.sh" ]; then
            ./scripts/cop-oraculo-start.sh
        else
            echo "📦 Iniciando backend directamente..."
            npm run start:backend:dev
        fi
        ;;
    3)
        echo "🧹 Limpiando e iniciando..."
        ./scripts/cop-oraculo-cleanup.sh
        sleep 2
        ./scripts/cop-oraculo-setup.sh
        ;;
    4)
        echo "📚 Abriendo documentación..."
        if command -v open &> /dev/null; then
            open docs/CoP_Oraculo_README.md
        elif command -v xdg-open &> /dev/null; then
            xdg-open docs/CoP_Oraculo_README.md
        else
            echo "📖 Lee la documentación en: docs/CoP_Oraculo_README.md"
        fi
        ;;
    5)
        echo "👋 ¡Hasta pronto!"
        exit 0
        ;;
    *)
        echo "❌ Opción inválida"
        exit 1
        ;;
esac

echo ""
echo "🌟 ¡CoP Oráculo lista para transformar feedback en sabiduría! 🌟"
echo "📚 Documentación: docs/CoP_Oraculo_README.md"
echo "🔗 API Docs: http://localhost:3002/api"
