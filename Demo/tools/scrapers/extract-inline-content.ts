import * as fs from 'fs/promises';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface ExtractedContent {
  css: Array<{ content: string; index: number; source: string }>;
  js: Array<{ content: string; index: number; source: string }>;
}

interface ExtractionReport {
  htmlFile: string;
  timestamp: string;
  extractedFiles: {
    css: string[];
    js: string[];
  };
  summary: {
    totalCssBlocks: number;
    totalJsBlocks: number;
    cssFilesSize: number;
    jsFilesSize: number;
  };
}

class InlineContentExtractor {
  private baseDir: string;

  constructor(baseDir: string = 'recovered_code') {
    this.baseDir = baseDir;
  }

  /**
   * Extrae contenido CSS y JS incrustado de un archivo HTML
   */
  private extractInlineContent(htmlContent: string, sourceFile: string): ExtractedContent {
    const $ = cheerio.load(htmlContent);
    const extracted: ExtractedContent = { css: [], js: [] };

    // Extraer bloques <style>
    $('style').each((index, element) => {
      const content = $(element).html()?.trim();
      if (content && content.length > 0) {
        extracted.css.push({
          content,
          index: index + 1,
          source: sourceFile
        });
      }
    });

    // Extraer bloques <script> sin src (JavaScript incrustado)
    $('script').each((index, element) => {
      const $script = $(element);
      const src = $script.attr('src');
      
      // Solo procesar scripts sin atributo src
      if (!src) {
        const content = $script.html()?.trim();
        if (content && content.length > 0) {
          extracted.js.push({
            content,
            index: index + 1,
            source: sourceFile
          });
        }
      }
    });

    return extracted;
  }

  /**
   * Guarda el contenido extraído en archivos separados
   */
  private async saveExtractedContent(
    extracted: ExtractedContent, 
    projectDir: string, 
    htmlFileName: string
  ): Promise<ExtractionReport> {
    const timestamp = new Date().toISOString();
    const baseFileName = path.basename(htmlFileName, '.html');
    
    // Crear directorios si no existen
    const inlineCssDir = path.join(projectDir, 'inline_css');
    const inlineJsDir = path.join(projectDir, 'inline_js');
    
    await fs.mkdir(inlineCssDir, { recursive: true });
    await fs.mkdir(inlineJsDir, { recursive: true });

    const report: ExtractionReport = {
      htmlFile: htmlFileName,
      timestamp,
      extractedFiles: { css: [], js: [] },
      summary: {
        totalCssBlocks: extracted.css.length,
        totalJsBlocks: extracted.js.length,
        cssFilesSize: 0,
        jsFilesSize: 0
      }
    };

    // Guardar archivos CSS
    for (const cssBlock of extracted.css) {
      const fileName = `${baseFileName}_style_block_${cssBlock.index}.css`;
      const filePath = path.join(inlineCssDir, fileName);
      
      // Agregar comentario con información del origen
      const header = `/* Extracted from: ${cssBlock.source} */\n/* Block index: ${cssBlock.index} */\n/* Extracted at: ${timestamp} */\n\n`;
      const fullContent = header + cssBlock.content;
      
      await fs.writeFile(filePath, fullContent, 'utf-8');
      report.extractedFiles.css.push(fileName);
      report.summary.cssFilesSize += fullContent.length;
      
      console.log(`✅ CSS block ${cssBlock.index} saved: ${fileName}`);
    }

    // Guardar archivos JavaScript
    for (const jsBlock of extracted.js) {
      const fileName = `${baseFileName}_script_block_${jsBlock.index}.js`;
      const filePath = path.join(inlineJsDir, fileName);
      
      // Agregar comentario con información del origen
      const header = `/* Extracted from: ${jsBlock.source} */\n/* Block index: ${jsBlock.index} */\n/* Extracted at: ${timestamp} */\n\n`;
      const fullContent = header + jsBlock.content;
      
      await fs.writeFile(filePath, fullContent, 'utf-8');
      report.extractedFiles.js.push(fileName);
      report.summary.jsFilesSize += fullContent.length;
      
      console.log(`✅ JS block ${jsBlock.index} saved: ${fileName}`);
    }

    return report;
  }

  /**
   * Procesa un archivo HTML específico
   */
  async processHtmlFile(htmlFilePath: string): Promise<ExtractionReport | null> {
    try {
      const htmlContent = await fs.readFile(htmlFilePath, 'utf-8');
      const projectDir = path.dirname(htmlFilePath);
      const htmlFileName = path.basename(htmlFilePath);
      
      console.log(`🔍 Processing: ${htmlFileName}`);
      
      const extracted = this.extractInlineContent(htmlContent, htmlFileName);
      
      if (extracted.css.length === 0 && extracted.js.length === 0) {
        console.log(`ℹ️  No inline content found in: ${htmlFileName}`);
        return null;
      }
      
      console.log(`📦 Found ${extracted.css.length} CSS blocks and ${extracted.js.length} JS blocks`);
      
      const report = await this.saveExtractedContent(extracted, projectDir, htmlFileName);
      
      return report;
    } catch (error) {
      console.error(`❌ Error processing ${htmlFilePath}:`, error);
      return null;
    }
  }

  /**
   * Procesa todos los archivos HTML en un directorio de proyecto
   */
  async processProjectDirectory(projectName: string): Promise<ExtractionReport[]> {
    const projectDir = path.join(this.baseDir, projectName);
    const reports: ExtractionReport[] = [];
    
    try {
      const files = await fs.readdir(projectDir);
      const htmlFiles = files.filter(file => file.endsWith('.html'));
      
      console.log(`🚀 Processing ${htmlFiles.length} HTML files in ${projectName}...`);
      
      for (const htmlFile of htmlFiles) {
        const htmlFilePath = path.join(projectDir, htmlFile);
        const report = await this.processHtmlFile(htmlFilePath);
        
        if (report) {
          reports.push(report);
        }
      }
      
      // Guardar reporte consolidado
      if (reports.length > 0) {
        const consolidatedReport = {
          project: projectName,
          timestamp: new Date().toISOString(),
          processedFiles: reports.length,
          totalExtractedFiles: {
            css: reports.reduce((sum, r) => sum + r.extractedFiles.css.length, 0),
            js: reports.reduce((sum, r) => sum + r.extractedFiles.js.length, 0)
          },
          reports
        };
        
        const reportPath = path.join(projectDir, 'inline_content_extraction_report.json');
        await fs.writeFile(reportPath, JSON.stringify(consolidatedReport, null, 2));
        
        console.log(`📊 Consolidated report saved: ${reportPath}`);
        console.log(`📈 Summary: ${consolidatedReport.totalExtractedFiles.css} CSS files, ${consolidatedReport.totalExtractedFiles.js} JS files extracted`);
      }
      
      return reports;
    } catch (error) {
      console.error(`❌ Error processing project directory ${projectName}:`, error);
      return [];
    }
  }

  /**
   * Procesa todos los proyectos en el directorio base
   */
  async processAllProjects(): Promise<void> {
    try {
      const projects = await fs.readdir(this.baseDir);
      const projectDirs = [];
      
      for (const project of projects) {
        const projectPath = path.join(this.baseDir, project);
        const stat = await fs.stat(projectPath);
        if (stat.isDirectory()) {
          projectDirs.push(project);
        }
      }
      
      console.log(`🌟 Found ${projectDirs.length} project directories: ${projectDirs.join(', ')}`);
      
      for (const project of projectDirs) {
        console.log(`\n🔄 Processing project: ${project}`);
        await this.processProjectDirectory(project);
      }
      
      console.log(`\n✅ All projects processed successfully!`);
    } catch (error) {
      console.error(`❌ Error processing projects:`, error);
    }
  }
}

// Función utilitaria para uso directo
export async function extractInlineFromHtml(htmlFilePath: string): Promise<void> {
  const extractor = new InlineContentExtractor();
  await extractor.processHtmlFile(htmlFilePath);
}

// Función utilitaria para procesar un proyecto específico
export async function extractInlineFromProject(projectName: string): Promise<void> {
  const extractor = new InlineContentExtractor();
  await extractor.processProjectDirectory(projectName);
}

// Función principal cuando se ejecuta directamente
async function main() {
  const args = process.argv.slice(2);
  const extractor = new InlineContentExtractor();
  
  if (args.length === 0) {
    // Procesar todos los proyectos
    console.log('🚀 Starting inline content extraction for all projects...');
    await extractor.processAllProjects();
  } else if (args.length === 1) {
    // Procesar un proyecto específico o archivo específico
    const target = args[0];
    
    if (target.endsWith('.html')) {
      // Es un archivo HTML específico
      console.log(`🚀 Processing specific HTML file: ${target}`);
      await extractor.processHtmlFile(target);
    } else {
      // Es un nombre de proyecto
      console.log(`🚀 Processing specific project: ${target}`);
      await extractor.processProjectDirectory(target);
    }
  } else {
    console.log(`
Usage:
  npx tsx extract-inline-content.ts                    # Process all projects
  npx tsx extract-inline-content.ts pilgrim_demo       # Process specific project
  npx tsx extract-inline-content.ts file.html          # Process specific HTML file
    `);
  }
}

// Ejecutar si es el módulo principal
if (require.main === module) {
  main().catch(console.error);
}

export default InlineContentExtractor; 