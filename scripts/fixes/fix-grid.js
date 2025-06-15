const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Función para procesar un archivo
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Patrones para convertir Grid item a Grid size
  const patterns = [
    // Caso simple: xs={number}
    {
      from: /<Grid size= xs=\{(\d+)\}>/g,
      to: '<Grid size={$1}>'
    },
    // Caso con xs y md
    {
      from: /<Grid size= xs=\{(\d+)\} md=\{(\d+)\}>/g,
      to: '<Grid size={{ xs: $1, md: $2 }}>'
    },
    // Caso con xs, sm y md
    {
      from: /<Grid size= xs=\{(\d+)\} sm=\{(\d+)\} md=\{(\d+)\}>/g,
      to: '<Grid size={{ xs: $1, sm: $2, md: $3 }}>'
    },
    // Caso con xs y sm
    {
      from: /<Grid size= xs=\{(\d+)\} sm=\{(\d+)\}>/g,
      to: '<Grid size={{ xs: $1, sm: $2 }}>'
    },
    // Caso con xs y lg
    {
      from: /<Grid size= xs=\{(\d+)\} lg=\{(\d+)\}>/g,
      to: '<Grid size={{ xs: $1, lg: $2 }}>'
    },
    // Caso con xs, md y lg
    {
      from: /<Grid size= xs=\{(\d+)\} md=\{(\d+)\} lg=\{(\d+)\}>/g,
      to: '<Grid size={{ xs: $1, md: $2, lg: $3 }}>'
    }
  ];

  patterns.forEach(pattern => {
    if (pattern.from.test(content)) {
      content = content.replace(pattern.from, pattern.to);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  }
}

// Encuentra todos los archivos .tsx en el directorio uplay
function findTsxFiles(dir) {
  const files = [];
  
  function scanDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    items.forEach(item => {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (item.endsWith('.tsx')) {
        files.push(fullPath);
      }
    });
  }
  
  scanDir(dir);
  return files;
}

// Procesa todos los archivos
const uplayDir = 'src/components/modules/uplay';
const files = findTsxFiles(uplayDir);

console.log(`🔄 Processing ${files.length} files...`);

files.forEach(processFile);

console.log('🎉 Grid conversion completed!'); 