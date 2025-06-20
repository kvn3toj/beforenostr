const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUTPUT_FILE = path.join(__dirname, 'backend_modules.mmd');

function getSubfolders(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
}

function sanitizeNodeName(name) {
  return name.replace(/[^a-zA-Z0-9]/g, '');
}

function generateMermaid(modules) {
  let mermaid = '%% @backgroundColor(#ffffff)\ngraph TD\n';
  mermaid += '    C[Desarrollo de Módulos]\n';
  modules.forEach(module => {
    const moduleNode = sanitizeNodeName(module.name);
    mermaid += `    C --> ${moduleNode}[${module.name}]\n`;
    if (module.subfolders.length > 0) {
      mermaid += `    subgraph ${module.name}\n`;
      module.subfolders.forEach(sub => {
        const subNode = sanitizeNodeName(module.name + '_' + sub);
        mermaid += `        ${subNode}[${sub}]\n`;
        mermaid += `        ${moduleNode} --> ${subNode}\n`;
      });
      mermaid += '    end\n';
    }
  });
  mermaid += '\n%% Instrucciones:\n';
  mermaid += '%% 1. Ejecuta: node generate_mermaid_from_folders.cjs\n';
  mermaid += '%% 2. Abre backend_modules.mmd en Mermaid Editor para visualizar.\n';
  return mermaid;
}

function main() {
  if (!fs.existsSync(SRC_DIR)) {
    console.error('No se encontró la carpeta src');
    process.exit(1);
  }
  const modules = getSubfolders(SRC_DIR).map(moduleName => {
    const modulePath = path.join(SRC_DIR, moduleName);
    const subfolders = getSubfolders(modulePath).filter(sub => !sub.startsWith('.'));
    return { name: moduleName, subfolders };
  });
  const mermaid = generateMermaid(modules);
  fs.writeFileSync(OUTPUT_FILE, mermaid, 'utf8');
  console.log(`Diagrama Mermaid generado en ${OUTPUT_FILE}`);
}

main(); 