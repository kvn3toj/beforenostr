#!/bin/bash

echo "🔥 CONFIGURACIÓN TEMPORAL DE FIREWALL PARA DESARROLLO"
echo "===================================================="

echo ""
echo "🔧 Para permitir acceso de red a tu aplicación, ejecuta MANUALMENTE estos comandos:"
echo ""

echo "1. 🔓 TEMPORALMENTE deshabilitar firewall (cuidado - solo para desarrollo):"
echo "   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate off"
echo ""

echo "2. ✅ O AGREGAR EXCEPCIÓN específica para Node.js:"
echo "   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/bin/node"
echo "   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/bin/node"
echo ""

echo "3. 🔄 REINICIAR firewall después de agregar excepciones:"
echo "   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on"
echo ""

echo "4. ✅ VERIFICAR estado del firewall:"
echo "   /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate"
echo ""

echo "⚠️  IMPORTANTE: Recuerda volver a habilitar el firewall después de las pruebas:"
echo "   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --setglobalstate on"
echo ""

echo "🌐 DESPUÉS, tu amigo debería poder acceder a:"
echo "   http://$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}'):3001"
echo ""

echo "📋 COMANDOS PARA TU AMIGO:"
echo "========================="
IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')
echo "1. Test ping: ping $IP"
echo "2. Test SuperApp: curl http://$IP:3001 -I"
echo "3. Abrir en navegador: http://$IP:3001"
echo ""
