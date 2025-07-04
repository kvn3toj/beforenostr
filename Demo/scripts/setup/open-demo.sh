#!/bin/bash

echo "🚀 Abriendo CoomÜnity Website Demo..."
echo ""

# Verificar que el servidor esté corriendo
if curl -s http://localhost:8080/api/health > /dev/null; then
    echo "✅ Servidor detectado en puerto 8080"
    echo ""
    
    # Abrir navegador en la página principal
    if command -v open > /dev/null; then
        # macOS
        echo "📱 Abriendo navegador..."
        open http://localhost:8080/public/
    elif command -v xdg-open > /dev/null; then
        # Linux
        echo "📱 Abriendo navegador..."
        xdg-open http://localhost:8080/public/
    elif command -v start > /dev/null; then
        # Windows
        echo "📱 Abriendo navegador..."
        start http://localhost:8080/public/
    else
        echo "📱 Abrir manualmente: http://localhost:8080/public/"
    fi
    
    echo ""
    echo "🎯 URLs principales:"
    echo "   • Homepage: http://localhost:8080/public/"
    echo "   • Pilgrim: http://localhost:8080/sections/pilgrim/"
    echo "   • Merchant: http://localhost:8080/sections/merchant/"
    echo "   • Red Pill: http://localhost:8080/sections/red-pill/"
    
else
    echo "❌ Servidor no detectado en puerto 8080"
    echo ""
    echo "Para iniciar el servidor:"
    echo "   cd my_recovered_website && node server.js"
    echo ""
    echo "O ejecutar:"
    echo "   npm run start"
fi 