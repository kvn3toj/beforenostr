# 🎯 **Seeding de Videos Reales - Dashboard ÜPlay**

## 📖 **Resumen**

Este directorio contiene scripts para poblar la base de datos del backend NestJS con videos reales extraídos de las **Playlists Gamificadas** de CoomÜnity, reemplazando completamente los datos mock y garantizando que el dashboard ÜPlay muestre contenido real estructurado.

## 🎯 **Objetivo**

**PROBLEMA RESUELTO:** El dashboard ÜPlay mostraba la misma UI antes y después de conectar con el backend porque:
- Los datos reales del backend eran similares a los mock
- No había agrupamiento visible por playlists/rutas de aprendizaje
- Faltaba contenido real curado

**SOLUCIÓN IMPLEMENTADA:**
1. **Reescritura integral** del `UPlayGamifiedDashboard.tsx` (100% backend-driven)
2. **Extracción y procesamiento** de 14 videos reales de Playlists Gamificadas
3. **Creación de 4 playlists** temáticas con contenido curado
4. **Seeding automático** del backend con datos estructurados

## 📁 **Archivos del Proceso**

### 🔧 **Scripts Principales**

| Archivo | Función | Estado |
|---------|---------|--------|
| `extract-playlist-data.js` | Extrae y procesa datos del HTML de Google Sheets | ✅ Listo |
| `seed-backend-videos.js` | Inserta videos y playlists en el backend vía API REST | ✅ Listo |
| `complete-video-seeding.sh` | Ejecuta todo el proceso de seeding completo | ✅ Listo |
| `verify-uplay-real-data.sh` | Verifica que el dashboard use datos reales vs mock | ✅ Listo |

### 📊 **Archivos de Datos**

| Archivo | Contenido | Generado por |
|---------|-----------|--------------|
| `playlists-gamificadas-data.json` | Datos procesados listos para insertar | `extract-playlist-data.js` |
| `seeding-result.json` | Resultado del seeding (IDs creados, errores, etc.) | `seed-backend-videos.js` |

## 🚀 **Uso Rápido**

### **Opción 1: Proceso Completo Automático**
```bash
# Desde el directorio raíz del workspace
./Demo/apps/superapp-unified/scripts/complete-video-seeding.sh
```

### **Opción 2: Paso a Paso**
```bash
# 1. Extraer datos
cd Demo/apps/superapp-unified/scripts/
node extract-playlist-data.js

# 2. Poblar backend  
node seed-backend-videos.js

# 3. Verificar resultado
./verify-uplay-real-data.sh
```

## 📊 **Contenido Cargado**

### **4 Playlists Temáticas:**

#### 🎬 **Documentales y Películas Transformadoras (5 videos)**
- The Game Changers (Cambio Extremo) - 5 méritos
- The Great Hack (Nada es Privado) - 5 méritos  
- ¿What the bleep do we know? - 5 méritos
- Happy - 5 méritos
- Thrive - ¿Cuánto le costará al planeta? - 5 méritos

#### 🎥 **Clips Inspiradores (3 videos)**
- Economía Sagrada (Charles Eisenstein) - 2 méritos
- Los principios herméticos (Hermes Trismegisto) - 2 méritos
- Gamificación, ¿se puede ser productivo jugando? - 1 mérito

#### 💡 **LifeHacks para el Bienestar (2 videos)**
- El Método Wim Hof - 3 méritos
- Alquimia de la salud - 3 méritos

#### 🎤 **Charlas TED Transformadoras (4 videos)**
- La Confianza es la Moneda de la Nueva Economía (Rachel Botsman) - 3 méritos
- Cómo conocer tu propósito de vida en 5 minutos (Adam Leipzig) - 2 méritos
- Jugar puede crear un mejor mundo (Jane McGonigal) - 2 méritos
- En defensa del consumo colaborativo (Rachel Botsman) - 2 méritos

### **📈 Totales:**
- **14 videos** con contenido real curado
- **45 méritos** totales ganables
- **567 minutos** de contenido (9.5 horas)
- **100% URLs reales** (YouTube/Netflix)
- **Thumbnails automáticos** desde YouTube

## 🏗️ **Arquitectura Técnica**

### **Backend NestJS (Puerto 3002)**
```
POST /playlist          # Crear playlists
POST /video-items       # Crear videos
GET /video-items        # Obtener videos (usado por dashboard)
GET /playlist          # Obtener playlists
```

### **SuperApp (Puerto 3001)**
```
/uplay                 # Dashboard ÜPlay reescrito
├── UPlayGamifiedDashboard.tsx (100% backend-driven)
├── RealPlaylistSection.tsx
├── RealVideoCard.tsx
└── useVideos() hook (datos reales)
```

### **Flujo de Datos:**
```
Playlists Gamificadas.html
     ↓ extract-playlist-data.js
playlists-gamificadas-data.json
     ↓ seed-backend-videos.js  
Backend NestJS Database
     ↓ useVideos() hook
UPlayGamifiedDashboard.tsx
     ↓ render
Dashboard ÜPlay (UI real)
```

## 🔍 **Verificación Visual**

### **✅ DEBERÍAS VER (datos reales):**
- **4 secciones expandibles** por playlist
- **Títulos reales:** "The Game Changers", "Economía Sagrada", etc.
- **Thumbnails de YouTube** reales
- **Duraciones variadas:** 5min (clips) a 90min (documentales)
- **Badges de categorías** CoomÜnity (Supervivencia, Convivencia, etc.)
- **Méritos específicos** (1-5 según contenido)

### **❌ NO DEBERÍAS VER (datos mock):**
- Títulos genéricos: "Video 1", "Sample Video"
- Duración uniforme: "10:00" para todos
- Thumbnails placeholder
- Mensajes "Sin datos" o "Loading..."

## 🛠️ **Troubleshooting**

### **Backend no disponible:**
```bash
# Verificar
curl http://localhost:3002/health

# Solución
npm run dev:backend  # Desde raíz del monorepo
```

### **Videos no aparecen:**
```bash
# Verificar datos en backend
curl http://localhost:3002/video-items | jq

# Re-ejecutar seeding
./complete-video-seeding.sh
```

### **SuperApp no carga:**
```bash
# Verificar
curl -I http://localhost:3001

# Solución  
npm run dev:superapp  # Desde raíz del monorepo
```

### **Dashboard no usa datos reales:**
```bash
# Verificar configuración
./verify-uplay-real-data.sh

# Verificar component reescrito
grep -n "useVideos" src/components/modules/uplay/UPlayGamifiedDashboard.tsx
```

## 🔄 **Re-ejecutar Seeding**

Para volver a poblar la base de datos:

```bash
# Opción 1: Completo
./complete-video-seeding.sh

# Opción 2: Solo seeding (si los datos ya están extraídos)
node seed-backend-videos.js
```

**Nota:** El script maneja duplicados automáticamente y sobrescribe datos existentes.

## 📝 **Logs y Depuración**

### **Verificar estado completo:**
```bash
./verify-uplay-real-data.sh
```

### **Ver datos en backend:**
```bash
# Videos completos
curl http://localhost:3002/video-items | jq

# Solo contar
curl -s http://localhost:3002/video-items | jq 'length'

# Playlists
curl http://localhost:3002/playlist | jq
```

### **Archivos de log:**
- `seeding-result.json` - Resultado del último seeding
- Console logs de cada script con detalles de éxito/error

## 🎉 **Resultado Esperado**

Después de ejecutar el seeding completo:

1. **Dashboard ÜPlay** mostrará **cambios visuales claros**
2. **4 playlists** con contenido real estructurado
3. **14 videos** con thumbnails, títulos y metadatos reales
4. **Agrupamiento visible** por rutas de aprendizaje
5. **Experiencia completamente diferente** vs datos mock

---

**🚀 ¡El dashboard ÜPlay ahora es 100% backend-driven con contenido real curado de CoomÜnity!**