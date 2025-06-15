# 🏗️ CoomÜnity Monorepo - Estructura Organizacional

## 📁 Estructura del Proyecto

```
GAMIFIER copy/
├── 📁 apps/                    # Aplicaciones principales
│   ├── superapp-unified/       # SuperApp CoomÜnity (Frontend)
│   └── admin-frontend/         # Gamifier Admin (Frontend)
├── 📁 backend/                 # Backend NestJS compartido
├── 📁 docs/                    # 📚 DOCUMENTACIÓN ORGANIZADA
│   ├── accessibility/          # Reportes de accesibilidad
│   ├── diagrams/              # Diagramas Mermaid (.mmd)
│   ├── implementation/         # Documentos de implementación
│   ├── reports/               # Reportes generales y archivos MD/TXT
│   └── testing/               # Documentación de testing y E2E
├── 📁 scripts/                # 🔧 SCRIPTS ORGANIZADOS
│   ├── analysis/              # Scripts de análisis y auditoría
│   ├── fixes/                 # Scripts de corrección automática
│   ├── utilities/             # Scripts utilitarios generales
│   └── database/              # Scripts relacionados con BD (SQL)
├── 📁 assets/                 # 🖼️ RECURSOS MULTIMEDIA
│   ├── images/                # Imágenes del proyecto
│   ├── screenshots/           # Screenshots y capturas
│   └── temp/                  # Archivos temporales
├── 📁 config/                 # ⚙️ CONFIGURACIONES ARCHIVADAS
│   ├── archived/              # Configuraciones y reportes JSON antiguos
│   ├── backup/                # Respaldos de configuración y datos CSV
│   └── json/                  # Archivos JSON de configuración
├── 📁 logs/                   # 📋 LOGS ORGANIZADOS POR CATEGORÍA
│   ├── auth/                  # Logs de autenticación
│   ├── backend/               # Logs del servidor backend
│   ├── testing/               # Logs de pruebas y testing
│   └── deployment/            # Logs de despliegue
└── 📁 shared/                 # Código compartido entre apps
```

## 🎯 Principios de Organización

### ✅ **Archivos que DEBEN estar en la raíz:**
- `package.json` - Configuración del monorepo
- `turbo.json` - Configuración de Turborepo
- `.env*` - Variables de entorno
- `.gitignore` - Exclusiones de Git
- `README.md` - Documentación principal
- Archivos de configuración esenciales (`.eslintrc`, `.prettierrc`, etc.)

### 🗂️ **Archivos organizados por categoría:**
- **Documentación** → `docs/`
- **Scripts** → `scripts/`
- **Imágenes/Screenshots** → `assets/`
- **Configuraciones archivadas** → `config/`

## 🧹 Limpieza Realizada

### 📊 **Antes vs Después:**
- **Antes**: 483 archivos/carpetas en raíz
- **Después**: 27 archivos/carpetas en raíz
- **Reducción**: 94% de archivos organizados

### 📁 **Archivos movidos:**
- **118 archivos .md** → `docs/`
- **144 archivos .js** → `scripts/`
- **40 archivos .json** → `config/json/` y `config/archived/`
- **80 archivos .png** → `assets/screenshots/`
- **31 archivos .log** → `logs/auth/`, `logs/backend/`, `logs/testing/`
- **6 archivos .mmd** → `docs/diagrams/`
- **3 archivos .csv** → `config/backup/`
- **7 archivos .sql** → `scripts/database/`
- **6 archivos .txt** → `docs/reports/`

## 🛡️ Mantenimiento

### **Prevención de acumulación:**
1. **Scripts temporales** → `scripts/utilities/`
2. **Reportes nuevos** → `docs/reports/`
3. **Screenshots de debug** → `assets/temp/`
4. **Configuraciones obsoletas** → `config/archived/`

### **Limpieza periódica recomendada:**
```bash
# Cada 2 semanas, revisar y limpiar:
find assets/temp/ -name "*.png" -mtime +14 -delete
find config/archived/ -name "*.json" -mtime +30 -delete
find docs/reports/ -name "*debug*" -mtime +7 -delete
```

## 🚀 Beneficios Obtenidos

- ✅ **Directorio raíz limpio y profesional**
- ✅ **Fácil navegación y localización de archivos**
- ✅ **Mejor experiencia de desarrollo**
- ✅ **Estructura escalable para el futuro**
- ✅ **Cumplimiento de mejores prácticas de monorepo**

---

*Estructura creada siguiendo las mejores prácticas de [Turborepo](https://github.com/vercel/turborepo/discussions/2639) y [monorepo management](https://victorlillo.dev/blog/clean-install-npm-yarn-monorepo)* 