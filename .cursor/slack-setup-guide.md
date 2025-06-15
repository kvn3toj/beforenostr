# 🔧 GUÍA DE CONFIGURACIÓN SLACK PARA COOMUNITY

## 📋 PASOS DE CONFIGURACIÓN

### 1. Activar Integración Slack
1. Ve a [Cursor Integrations](https://cursor.com/integrations)
2. Click "Connect" junto a Slack
3. Instala la app Cursor en tu workspace Slack
4. Autoriza la conexión

### 2. Configurar GitHub
1. Conecta tu cuenta GitHub si no está conectada
2. Autoriza acceso al repositorio CoomÜnity

### 3. Configurar Ajustes por Defecto
- **Repositorio**: `kevinp/coomunity` (ajustar según tu repo)
- **Rama**: `gamifier2.0`
- **Modelo**: `claude-3.5-sonnet`
- **Base Branch**: dejar en blanco (usará main/master)

### 4. Configurar Canales Slack
```
# En cada canal relevante:
@Cursor settings

# Configuración sugerida:
Repositorio: kevinp/coomunity
Rama: gamifier2.0
Modelo: claude-3.5-sonnet
```

### 5. Habilitar Configuraciones
- ✅ Usage based pricing
- ✅ Display agent summary
- ⚠️ Display agent summary in external channels (según necesidad)

## 🎯 COMANDOS DE PRUEBA

### Comando Básico
```
@Cursor [branch=gamifier2.0] help me understand the CoomÜnity project structure
```

### Comando Específico
```
@Cursor [branch=gamifier2.0] 
Check the health of backend and frontend services.
Verify ports 3001 (SuperApp) and 3002 (Backend) are configured correctly.
Run commands from monorepo root: /Users/kevinp/Movies/GAMIFIER copy/
```

## 📚 RECURSOS
- Templates de prompts: `.cursor/notepads/slack-prompt-templates.md`
- Estándares de desarrollo: `.cursor/notepads/coomunity-development-standards.md`
- Reglas específicas: `.cursor/rules/slack-agents-coomunity.md`
