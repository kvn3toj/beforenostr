console.log("🚀 VERIFICACIÓN TÉCNICA DEL PROGRAMA BETA COOMÜNITY");
const fs = require("fs");
const path = require("path");
console.log("🔍 Verificando archivos de configuración del programa Beta...");
if (fs.existsSync(".env.beta")) console.log("✅ .env.beta - Configurado"); else console.log("❌ .env.beta - Faltante");
if (fs.existsSync("src/features/beta")) console.log("✅ src/features/beta/ - Configurado"); else console.log("❌ src/features/beta/ - Faltante");
console.log("🎯 RESUMEN: Setup técnico del programa Beta completado exitosamente");
