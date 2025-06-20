#!/usr/bin/env ts-node

/**
 * Script de Unificación del Sitio Web CoomÜnity Recuperado
 * 
 * Este script consolida todos los archivos recuperados de las diferentes demos
 * en una estructura unificada y funcional para desarrollo local.
 */

import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

interface UnificationConfig {
  sourceDir: string;
  targetDir: string;
  sections: {
    [key: string]: {
      sourcePath: string;
      targetPath: string;
      mainHtml?: string;
      variations?: string[];
    };
  };
}

interface PathRewriteRule {
  pattern: RegExp;
  replacement: string;
  description: string;
}

class CoomUnityWebsiteUnifier {
  private config: UnificationConfig;
  private logFile: string;
  private processedFiles: number = 0;
  private errors: string[] = [];

  constructor() {
    this.config = {
      sourceDir: './recovered_code',
      targetDir: './my_recovered_website',
      sections: {
        pilgrim: {
          sourcePath: 'pilgrim_demo',
          targetPath: 'sections/pilgrim',
          mainHtml: 'demo_pilgrim_index_full_assets.html'
        },
        merchant: {
          sourcePath: 'merchant_dev',
          targetPath: 'sections/merchant',
          mainHtml: 'merchant_home_09_final_state_2025-06-03T02-13-20-890Z.html',
          variations: [
            'merchant_home_01_initial_load_2025-06-03T02-11-13-867Z.html',
            'merchant_home_02_after_scroll_2025-06-03T02-11-18-900Z.html',
            'merchant_home_03_click_button_not__disabled___1_2025-06-03T02-11-31-051Z.html'
          ]
        },
        'red-pill': {
          sourcePath: 'red_pill_interactive',
          targetPath: 'sections/red-pill',
          mainHtml: 'red_pill_initial_1.html'
        }
      }
    };

    this.logFile = path.join(this.config.targetDir, 'docs', 'unification_log.txt');
  }

  /**
   * Función principal que ejecuta todo el proceso de unificación
   */
  async unify(): Promise<void> {
    try {
      this.log('🚀 Iniciando proceso de unificación del sitio web CoomÜnity...\n');

      // Fase 1: Crear estructura de directorios
      await this.createDirectoryStructure();

      // Fase 2: Copiar archivos por sección
      for (const [sectionName, sectionConfig] of Object.entries(this.config.sections)) {
        await this.processSection(sectionName, sectionConfig);
      }

      // Fase 3: Crear archivos de configuración y navegación
      await this.createConfigurationFiles();
      await this.createNavigationIndex();

      // Fase 4: Generar reportes
      await this.generateUnificationReport();

      this.log(`\n✅ Unificación completada exitosamente!`);
      this.log(`📁 Proyecto unificado disponible en: ${this.config.targetDir}`);
      this.log(`📊 Archivos procesados: ${this.processedFiles}`);
      
      if (this.errors.length > 0) {
        this.log(`⚠️  Se encontraron ${this.errors.length} errores (ver log para detalles)`);
      }

    } catch (error) {
      this.log(`❌ Error crítico durante la unificación: ${error}`);
      throw error;
    }
  }

  /**
   * Crear la estructura completa de directorios del proyecto unificado
   */
  private async createDirectoryStructure(): Promise<void> {
    this.log('📁 Creando estructura de directorios...');

    const directories = [
      'public',
      'sections/pilgrim/assets/css',
      'sections/pilgrim/assets/js',
      'sections/pilgrim/assets/images',
      'sections/pilgrim/assets/fonts',
      'sections/pilgrim/assets/data',
      'sections/pilgrim/inline/css',
      'sections/pilgrim/inline/js',
      'sections/merchant/assets/css',
      'sections/merchant/assets/js',
      'sections/merchant/assets/images',
      'sections/merchant/assets/fonts',
      'sections/merchant/assets/data',
      'sections/merchant/inline/css',
      'sections/merchant/inline/js',
      'sections/merchant/variations',
      'sections/red-pill/assets/css',
      'sections/red-pill/assets/js',
      'sections/red-pill/assets/images',
      'sections/red-pill/assets/videos',
      'sections/red-pill/assets/fonts',
      'sections/red-pill/assets/data',
      'sections/red-pill/inline/css',
      'sections/red-pill/inline/js',
      'sections/red-pill/journey',
      'sections/red-pill/analytics/interaction_maps',
      'sections/red-pill/analytics/interaction_paths',
      'sections/red-pill/analytics/sessions',
      'shared/css',
      'shared/js',
      'shared/images',
      'shared/fonts',
      'shared/data',
      'api/routes',
      'api/data',
      'api/middleware',
      'docs/extraction_reports',
      'docs/interaction_analysis'
    ];

    for (const dir of directories) {
      const fullPath = path.join(this.config.targetDir, dir);
      await fs.ensureDir(fullPath);
    }

    this.log('✅ Estructura de directorios creada');
  }

  /**
   * Procesar una sección específica (pilgrim, merchant, red-pill)
   */
  private async processSection(sectionName: string, sectionConfig: any): Promise<void> {
    this.log(`\n🔄 Procesando sección: ${sectionName}`);

    const sourcePath = path.join(this.config.sourceDir, sectionConfig.sourcePath);
    const targetPath = path.join(this.config.targetDir, sectionConfig.targetPath);

    // Verificar que la carpeta fuente existe
    if (!await fs.pathExists(sourcePath)) {
      const error = `Carpeta fuente no encontrada: ${sourcePath}`;
      this.errors.push(error);
      this.log(`❌ ${error}`);
      return;
    }

    // Copiar assets
    await this.copyAssets(sourcePath, targetPath);

    // Copiar archivos inline
    await this.copyInlineFiles(sourcePath, targetPath);

    // Procesar archivos HTML
    await this.processHtmlFiles(sectionName, sectionConfig, sourcePath, targetPath);

    // Copiar archivos de análisis específicos
    await this.copyAnalysisFiles(sectionName, sourcePath, targetPath);

    this.log(`✅ Sección ${sectionName} procesada`);
  }

  /**
   * Copiar y organizar archivos de assets (CSS, JS, imágenes, etc.)
   */
  private async copyAssets(sourcePath: string, targetPath: string): Promise<void> {
    const assetsSourcePath = path.join(sourcePath, 'assets');
    
    if (!await fs.pathExists(assetsSourcePath)) {
      this.log(`⚠️  No se encontró carpeta assets en ${sourcePath}`);
      return;
    }

    const assetTypes = ['css', 'js', 'images', 'fonts', 'videos', 'data', 'other'];

    for (const assetType of assetTypes) {
      const assetSourcePath = path.join(assetsSourcePath, assetType);
      const assetTargetPath = path.join(targetPath, 'assets', assetType);

      if (await fs.pathExists(assetSourcePath)) {
        await fs.copy(assetSourcePath, assetTargetPath, {
          overwrite: true,
          preserveTimestamps: true
        });

        // Reescribir rutas en archivos CSS y JS
        if (assetType === 'css') {
          await this.rewritePathsInCssFiles(assetTargetPath);
        } else if (assetType === 'js') {
          await this.rewritePathsInJsFiles(assetTargetPath);
        }

        this.log(`  📄 Copiados assets/${assetType}`);
      }
    }
  }

  /**
   * Copiar archivos inline CSS y JS
   */
  private async copyInlineFiles(sourcePath: string, targetPath: string): Promise<void> {
    const inlineTypes = ['inline_css', 'inline_js'];

    for (const inlineType of inlineTypes) {
      const inlineSourcePath = path.join(sourcePath, inlineType);
      const inlineTargetPath = path.join(targetPath, 'inline', inlineType.replace('inline_', ''));

      if (await fs.pathExists(inlineSourcePath)) {
        await fs.copy(inlineSourcePath, inlineTargetPath, {
          overwrite: true,
          preserveTimestamps: true
        });
        this.log(`  📄 Copiados ${inlineType}`);
      }
    }
  }

  /**
   * Procesar archivos HTML y reescribir rutas
   */
  private async processHtmlFiles(
    sectionName: string, 
    sectionConfig: any, 
    sourcePath: string, 
    targetPath: string
  ): Promise<void> {
    // Procesar archivo HTML principal
    if (sectionConfig.mainHtml) {
      const mainHtmlSource = path.join(sourcePath, sectionConfig.mainHtml);
      const mainHtmlTarget = path.join(targetPath, 'index.html');

      if (await fs.pathExists(mainHtmlSource)) {
        await this.processHtmlFile(mainHtmlSource, mainHtmlTarget, sectionName);
        this.log(`  📄 Procesado HTML principal: index.html`);
        this.processedFiles++;
      }
    }

    // Procesar variaciones (para merchant)
    if (sectionConfig.variations) {
      for (const variation of sectionConfig.variations) {
        const variationSource = path.join(sourcePath, variation);
        const variationName = this.getVariationName(variation);
        const variationTarget = path.join(targetPath, 'variations', `${variationName}.html`);

        if (await fs.pathExists(variationSource)) {
          await this.processHtmlFile(variationSource, variationTarget, sectionName);
          this.log(`  📄 Procesada variación: ${variationName}.html`);
          this.processedFiles++;
        }
      }
    }

    // Procesar archivos de journey (para red-pill)
    if (sectionName === 'red-pill') {
      await this.processRedPillJourneyFiles(sourcePath, targetPath);
    }
  }

  /**
   * Procesar archivos específicos del journey de red-pill
   */
  private async processRedPillJourneyFiles(sourcePath: string, targetPath: string): Promise<void> {
    const journeyFiles = [
      { source: 'red_pill_initial_1.html', target: 'initial.html' },
      { source: 'red_pill_video_ended_2.html', target: 'video_ended.html' },
      { source: 'red_pill_left_path_3.html', target: 'left_path.html' },
      { source: 'red_pill_response_1_4.html', target: 'response_1.html' },
      { source: 'red_pill_response_2_5.html', target: 'response_2.html' },
      { source: 'red_pill_right_path_6.html', target: 'right_path.html' },
      { source: 'red_pill_final_7.html', target: 'final.html' }
    ];

    for (const file of journeyFiles) {
      const sourceFile = path.join(sourcePath, file.source);
      const targetFile = path.join(targetPath, 'journey', file.target);

      if (await fs.pathExists(sourceFile)) {
        await this.processHtmlFile(sourceFile, targetFile, 'red-pill');
        this.log(`  📄 Procesado journey: ${file.target}`);
        this.processedFiles++;
      }
    }
  }

  /**
   * Procesar un archivo HTML individual y reescribir sus rutas
   */
  private async processHtmlFile(sourceFile: string, targetFile: string, sectionName: string): Promise<void> {
    try {
      let htmlContent = await fs.readFile(sourceFile, 'utf-8');

      // Aplicar reglas de reescritura específicas para HTML
      htmlContent = this.rewriteHtmlPaths(htmlContent, sectionName);

      // Asegurar que el directorio destino existe
      await fs.ensureDir(path.dirname(targetFile));

      // Escribir archivo procesado
      await fs.writeFile(targetFile, htmlContent, 'utf-8');

    } catch (error) {
      const errorMsg = `Error procesando ${sourceFile}: ${error}`;
      this.errors.push(errorMsg);
      this.log(`❌ ${errorMsg}`);
    }
  }

  /**
   * Reescribir rutas en contenido HTML
   */
  private rewriteHtmlPaths(htmlContent: string, sectionName: string): string {
    const rules: PathRewriteRule[] = [
      // Rutas absolutas a CSS
      {
        pattern: /href=["']\/assets\/css\//g,
        replacement: 'href="assets/css/',
        description: 'CSS absoluto a relativo'
      },
      // Rutas absolutas a JS
      {
        pattern: /src=["']\/assets\/js\//g,
        replacement: 'src="assets/js/',
        description: 'JS absoluto a relativo'
      },
      // Rutas absolutas a imágenes
      {
        pattern: /src=["']\/assets\/images\//g,
        replacement: 'src="assets/images/',
        description: 'Imágenes absoluto a relativo'
      },
      // data-src para lazy loading
      {
        pattern: /data-src=["']\/assets\/images\//g,
        replacement: 'data-src="assets/images/',
        description: 'Data-src absoluto a relativo'
      },
      // Rutas absolutas a videos
      {
        pattern: /src=["']\/assets\/videos\//g,
        replacement: 'src="assets/videos/',
        description: 'Videos absoluto a relativo'
      },
      // Background images en style
      {
        pattern: /background-image:\s*url\(['"]?\/assets\/images\//g,
        replacement: 'background-image: url("assets/images/',
        description: 'Background images en style'
      }
    ];

    let processedContent = htmlContent;

    for (const rule of rules) {
      const beforeCount = (processedContent.match(rule.pattern) || []).length;
      processedContent = processedContent.replace(rule.pattern, rule.replacement);
      const afterCount = (processedContent.match(rule.pattern) || []).length;
      
      if (beforeCount > 0) {
        this.log(`    🔄 ${rule.description}: ${beforeCount} reemplazos`);
      }
    }

    return processedContent;
  }

  /**
   * Reescribir rutas en archivos CSS
   */
  private async rewritePathsInCssFiles(cssDir: string): Promise<void> {
    try {
      const cssFiles = await glob('**/*.css', { cwd: cssDir });

      for (const cssFile of cssFiles) {
        const cssFilePath = path.join(cssDir, cssFile);
        
        try {
          let cssContent = await fs.readFile(cssFilePath, 'utf-8');
          
          // Reescribir rutas url() en CSS
          const rules: PathRewriteRule[] = [
            {
              pattern: /url\(['"]?\/assets\/images\//g,
              replacement: 'url("../images/',
              description: 'URL images absoluto a relativo'
            },
            {
              pattern: /url\(['"]?\/assets\/fonts\//g,
              replacement: 'url("../fonts/',
              description: 'URL fonts absoluto a relativo'
            }
          ];

          let modified = false;
          for (const rule of rules) {
            const beforeCount = (cssContent.match(rule.pattern) || []).length;
            if (beforeCount > 0) {
              cssContent = cssContent.replace(rule.pattern, rule.replacement);
              modified = true;
              this.log(`    🔄 CSS ${cssFile}: ${rule.description} (${beforeCount} reemplazos)`);
            }
          }

          if (modified) {
            await fs.writeFile(cssFilePath, cssContent, 'utf-8');
          }

        } catch (error) {
          this.errors.push(`Error procesando CSS ${cssFile}: ${error}`);
        }
      }
    } catch (error) {
      this.log(`⚠️  Error al buscar archivos CSS en ${cssDir}: ${error}`);
    }
  }

  /**
   * Reescribir rutas en archivos JavaScript
   */
  private async rewritePathsInJsFiles(jsDir: string): Promise<void> {
    try {
      const jsFiles = await glob('**/*.js', { cwd: jsDir });

      for (const jsFile of jsFiles) {
        const jsFilePath = path.join(jsDir, jsFile);
        
        try {
          let jsContent = await fs.readFile(jsFilePath, 'utf-8');
          
          // Reescribir rutas comunes en JavaScript
          const rules: PathRewriteRule[] = [
            {
              pattern: /['"]\/assets\/images\//g,
              replacement: '"assets/images/',
              description: 'Rutas de imágenes en JS'
            },
            {
              pattern: /['"]\/assets\/data\//g,
              replacement: '"assets/data/',
              description: 'Rutas de datos en JS'
            }
          ];

          let modified = false;
          for (const rule of rules) {
            const beforeCount = (jsContent.match(rule.pattern) || []).length;
            if (beforeCount > 0) {
              jsContent = jsContent.replace(rule.pattern, rule.replacement);
              modified = true;
              this.log(`    🔄 JS ${jsFile}: ${rule.description} (${beforeCount} reemplazos)`);
            }
          }

          if (modified) {
            await fs.writeFile(jsFilePath, jsContent, 'utf-8');
          }

        } catch (error) {
          this.errors.push(`Error procesando JS ${jsFile}: ${error}`);
        }
      }
    } catch (error) {
      this.log(`⚠️  Error al buscar archivos JS en ${jsDir}: ${error}`);
    }
  }

  /**
   * Copiar archivos de análisis específicos
   */
  private async copyAnalysisFiles(sectionName: string, sourcePath: string, targetPath: string): Promise<void> {
    if (sectionName === 'red-pill') {
      // Copiar mapas de interacción y sesiones
      const analysisTypes = ['interaction_maps', 'interaction_paths', 'sessions'];
      
      for (const analysisType of analysisTypes) {
        const analysisSource = path.join(sourcePath, analysisType);
        const analysisTarget = path.join(targetPath, 'analytics', analysisType);

        if (await fs.pathExists(analysisSource)) {
          await fs.copy(analysisSource, analysisTarget, { overwrite: true });
          this.log(`  📊 Copiados analytics/${analysisType}`);
        }
      }
    }

    // Copiar reportes de extracción
    const reportFiles = ['extraction_report.json', 'inline_content_extraction_report.json'];
    const reportsTarget = path.join(this.config.targetDir, 'docs', 'extraction_reports');

    for (const reportFile of reportFiles) {
      const reportSource = path.join(sourcePath, reportFile);
      if (await fs.pathExists(reportSource)) {
        const reportTarget = path.join(reportsTarget, `${sectionName}_${reportFile}`);
        await fs.copy(reportSource, reportTarget, { overwrite: true });
      }
    }
  }

  /**
   * Crear archivos de configuración del proyecto
   */
  private async createConfigurationFiles(): Promise<void> {
    this.log('\n📝 Creando archivos de configuración...');

    // package.json
    const packageJson = {
      name: "coomunity-recovered-website",
      version: "1.0.0",
      description: "Sitio web CoomÜnity recuperado y unificado",
      main: "server.js",
      scripts: {
        start: "node server.js",
        dev: "nodemon server.js",
        build: "echo 'No build process needed for static site'",
        serve: "http-server my_recovered_website -p 8080 -c-1"
      },
      dependencies: {
        express: "^4.18.2",
        cors: "^2.8.5",
        "serve-static": "^1.15.0"
      },
      devDependencies: {
        nodemon: "^2.0.22",
        "http-server": "^14.1.1",
        "@types/node": "^18.0.0",
        typescript: "^4.9.0"
      },
      keywords: ["coomunity", "demo", "recovered", "website"],
      author: "CoomÜnity Team",
      license: "MIT"
    };

    await fs.writeFile(
      path.join(this.config.targetDir, 'package.json'),
      JSON.stringify(packageJson, null, 2),
      'utf-8'
    );

    // README.md
    const readme = `# CoomÜnity Recovered Website

Sitio web unificado de CoomÜnity recuperado de diferentes demos y versiones.

## Estructura del Proyecto

- \`sections/pilgrim/\` - Demo del Pilgrim
- \`sections/merchant/\` - Demo del Merchant  
- \`sections/red-pill/\` - Demo Red Pill Interactivo
- \`shared/\` - Recursos compartidos
- \`api/\` - APIs mockeadas para desarrollo

## Instalación y Uso

\`\`\`bash
npm install
npm start    # Servidor con APIs mockeadas
# o
npm run serve  # Servidor estático simple
\`\`\`

## Navegación

- Página principal: http://localhost:8080
- Pilgrim Demo: http://localhost:8080/sections/pilgrim/
- Merchant Demo: http://localhost:8080/sections/merchant/
- Red Pill Demo: http://localhost:8080/sections/red-pill/

## Documentación

Ver carpeta \`docs/\` para reportes de extracción y análisis de interacciones.
`;

    await fs.writeFile(
      path.join(this.config.targetDir, 'README.md'),
      readme,
      'utf-8'
    );

    this.log('✅ Archivos de configuración creados');
  }

  /**
   * Crear página de navegación principal
   */
  private async createNavigationIndex(): Promise<void> {
    const indexHtml = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CoomÜnity - Sitio Recuperado</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            max-width: 800px; 
            margin: 0 auto; 
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            background: rgba(255,255,255,0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        h1 { text-align: center; margin-bottom: 30px; }
        .section {
            background: rgba(255,255,255,0.1);
            margin: 20px 0;
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid #fff;
        }
        .section h2 { margin-top: 0; }
        .section a {
            color: #fff;
            text-decoration: none;
            font-weight: bold;
            display: inline-block;
            margin: 5px 10px 5px 0;
            padding: 8px 15px;
            background: rgba(255,255,255,0.2);
            border-radius: 5px;
            transition: all 0.3s ease;
        }
        .section a:hover {
            background: rgba(255,255,255,0.3);
            transform: translateY(-2px);
        }
        .footer {
            text-align: center;
            margin-top: 40px;
            opacity: 0.8;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌟 CoomÜnity - Sitio Web Recuperado</h1>
        
        <div class="section">
            <h2>🚀 Pilgrim Demo</h2>
            <p>Experiencia interactiva del usuario Pilgrim en la plataforma CoomÜnity.</p>
            <a href="sections/pilgrim/">Ver Demo Pilgrim</a>
        </div>

        <div class="section">
            <h2>🏪 Merchant Demo</h2>
            <p>Interfaz y funcionalidades del usuario Merchant (comerciante) en la plataforma.</p>
            <a href="sections/merchant/">Ver Demo Principal</a>
            <a href="sections/merchant/variations/initial_load.html">Estado Inicial</a>
            <a href="sections/merchant/variations/after_scroll.html">Después de Scroll</a>
            <a href="sections/merchant/variations/button_clicked.html">Botón Clickeado</a>
        </div>

        <div class="section">
            <h2>💊 Red Pill Interactive</h2>
            <p>Experiencia interactiva inmersiva tipo "Red Pill" con flujo de decisiones.</p>
            <a href="sections/red-pill/">Iniciar Experiencia</a>
            <a href="sections/red-pill/journey/initial.html">Estado Inicial</a>
            <a href="sections/red-pill/journey/left_path.html">Camino Izquierdo</a>
            <a href="sections/red-pill/journey/right_path.html">Camino Derecho</a>
            <a href="sections/red-pill/journey/final.html">Final</a>
        </div>

        <div class="section">
            <h2>📚 Documentación</h2>
            <p>Reportes de extracción, análisis de interacciones y documentación técnica.</p>
            <a href="docs/">Ver Documentación</a>
        </div>

        <div class="footer">
            <p>Sitio web unificado generado automáticamente desde código recuperado</p>
            <p>Generado el: ${new Date().toLocaleDateString()}</p>
        </div>
    </div>
</body>
</html>`;

    await fs.writeFile(
      path.join(this.config.targetDir, 'public', 'index.html'),
      indexHtml,
      'utf-8'
    );

    // También crear un index.html en la raíz que redirija
    const rootIndex = `<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="refresh" content="0; url=public/">
    <title>CoomÜnity - Redirigiendo...</title>
</head>
<body>
    <p>Redirigiendo a <a href="public/">la página principal</a>...</p>
</body>
</html>`;

    await fs.writeFile(
      path.join(this.config.targetDir, 'index.html'),
      rootIndex,
      'utf-8'
    );

    this.log('✅ Página de navegación creada');
  }

  /**
   * Generar reporte final de unificación
   */
  private async generateUnificationReport(): Promise<void> {
    const report = {
      timestamp: new Date().toISOString(),
      processedFiles: this.processedFiles,
      errors: this.errors,
      sections: Object.keys(this.config.sections),
      targetDirectory: this.config.targetDir,
      summary: {
        success: this.errors.length === 0,
        totalErrors: this.errors.length,
        sectionsProcessed: Object.keys(this.config.sections).length
      }
    };

    await fs.writeFile(
      path.join(this.config.targetDir, 'docs', 'unification_report.json'),
      JSON.stringify(report, null, 2),
      'utf-8'
    );

    this.log('✅ Reporte de unificación generado');
  }

  /**
   * Obtener nombre limpio para variación de archivo
   */
  private getVariationName(filename: string): string {
    if (filename.includes('initial_load')) return 'initial_load';
    if (filename.includes('after_scroll')) return 'after_scroll';
    if (filename.includes('click_button')) return 'button_clicked';
    if (filename.includes('final_state')) return 'final_state';
    return filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * Función de logging con timestamp
   */
  private log(message: string): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    
    console.log(logMessage);
    
    // Solo escribir al archivo de log si el directorio existe
    if (this.logFile && fs.existsSync(path.dirname(this.logFile))) {
      fs.appendFileSync(this.logFile, logMessage + '\n', 'utf-8');
    }
  }
}

// Ejecutar el script si se llama directamente
if (require.main === module) {
  const unifier = new CoomUnityWebsiteUnifier();
  unifier.unify().catch(error => {
    console.error('❌ Error fatal:', error);
    process.exit(1);
  });
}

export { CoomUnityWebsiteUnifier }; 