#!/bin/bash

# 🚀 SETUP SCRIPT PARA GEMINI MODULAR CODE REVIEWER
# ================================================

echo "🤖 Configurando Gemini Modular Code Reviewer para CoomÜnity"
echo "=========================================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "❌ Error: Debes ejecutar este script desde la raíz del proyecto"
    exit 1
fi

# Verificar que existe el directorio de script
