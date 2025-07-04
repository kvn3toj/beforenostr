#!/bin/bash
echo "🌱 Configurando ambiente para programa Beta CoomÜnity..."
cp .env.beta .env
npm run build
echo "✅ Ambiente Beta configurado correctamente"
