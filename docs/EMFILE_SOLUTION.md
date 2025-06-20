# 🔧 Solución EMFILE - CoomÜnity SuperApp

## Problema Identificado
```
EMFILE: too many open files
Error: EMFILE: too many open files, watch '/Users/.../node_modules/@mui/icons-material/...'
```

## Causa Raíz
- **Sistema:** macOS tenía límite de archivos abiertos en 256 (muy bajo)
- **Contexto:** Proyectos complejos con muchas dependencias (especialmente @mui/icons-material)
- **Herramienta:** Vite + Node.js excedían el límite durante el desarrollo

## Solución Implementada ✅

### 1. Configuración Permanente del Sistema macOS

**Archivo creado:** `/Library/LaunchDaemons/limit.maxfiles.plist`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN"
        "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>Label</key>
    <string>limit.maxfiles</string>
    <key>ProgramArguments</key>
    <array>
      <string>launchctl</string>
      <string>limit</string>
      <string>maxfiles</string>
      <string>524288</string>
      <string>524288</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>ServiceIPC</key>
    <false/>
  </dict>
</plist>
```

**Comandos ejecutados:**
```bash
sudo cp /tmp/limit.maxfiles.plist /Library/LaunchDaemons/
sudo chown root:wheel /Library/LaunchDaemons/limit.maxfiles.plist
sudo launchctl load -w /Library/LaunchDaemons/limit.maxfiles.plist
```

### 2. Optimización de Vite

**Archivo:** `vite.config.ts`

- Añadido `depth: 3` para limitar profundidad de file watching
- Ignorados directorios adicionales: test-results, playwright-report, .cache
- Mantenidas optimizaciones existentes para @mui/icons-material

### 3. Verificación

**Antes:**
```bash
launchctl limit maxfiles
# maxfiles    256            unlimited
```

**Después:**
```bash
launchctl limit maxfiles
# maxfiles    524288         unlimited
```

**Resultado:**
- ✅ SuperApp inicia sin errores EMFILE
- ✅ Puerto 3001 responde correctamente (HTTP/1.1 200 OK)
- ✅ Configuración persistente (sobrevive reinicios)

## Referencias

- [Neo4j macOS File Limits Guide](https://neo4j.com/developer/kb/setting-max-open-file-limits-on-osx/)
- [Thomas Jung's Medium Article](https://medium.com/mindful-technology/too-many-open-files-limit-ulimit-on-mac-os-x-add0f1bfddde)

## Fecha de Implementación
Junio 20, 2025

## Estado
✅ **RESUELTO** - Solución permanente implementada y verificada 