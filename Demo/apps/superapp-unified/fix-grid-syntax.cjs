const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to recursively find all TypeScript/React files
function findFiles(pattern) {
  return glob.sync(pattern, {
    ignore: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.git/**', '**/backups/**']
  });
}

// Function to convert Grid v2 syntax to Grid v1 syntax
function convertGridSyntax(content) {
  let modified = false;
  let newContent = content;

  // Pattern to match Grid components with size prop
  // This regex captures: size={{ xs: 12, md: 6, lg: 4 }} etc.
  const sizeRegex = /size=\{\{\s*([^}]+)\s*\}\}/g;

  newContent = newContent.replace(sizeRegex, (match, sizeContent) => {
    modified = true;

    // Parse the size content to extract breakpoint values
    const breakpoints = {};

    // Handle different patterns like xs: 12, md: 6, etc.
    const breakpointRegex = /(\w+):\s*([^,}]+)/g;
    let bpMatch;

    while ((bpMatch = breakpointRegex.exec(sizeContent)) !== null) {
      const [, breakpoint, value] = bpMatch;
      breakpoints[breakpoint] = value.trim();
    }

    // Convert to Grid v1 syntax
    let gridProps = ['item'];

    // Add breakpoint props
    Object.entries(breakpoints).forEach(([bp, value]) => {
      if (bp === 'xs') {
        gridProps.push(`xs={${value}}`);
      } else {
        gridProps.push(`${bp}={${value}}`);
      }
    });

    return gridProps.join(' ');
  });

  return { content: newContent, modified };
}

// Main function to process files
function processFiles() {
  const patterns = [
    'src/**/*.tsx',
    'src/**/*.ts',
    'components/**/*.tsx',
    'components/**/*.ts',
    'pages/**/*.tsx',
    'pages/**/*.ts'
  ];

  let totalFiles = 0;
  let modifiedFiles = 0;

  patterns.forEach(pattern => {
    const files = findFiles(pattern);

    files.forEach(filePath => {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { content: newContent, modified } = convertGridSyntax(content);

        if (modified) {
          fs.writeFileSync(filePath, newContent, 'utf8');
          console.log(`✅ Fixed Grid syntax in: ${filePath}`);
          modifiedFiles++;
        }

        totalFiles++;
      } catch (error) {
        console.error(`❌ Error processing ${filePath}:`, error.message);
      }
    });
  });

  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Files unchanged: ${totalFiles - modifiedFiles}`);

  if (modifiedFiles > 0) {
    console.log(`\n🎉 Grid syntax conversion completed successfully!`);
    console.log(`   All Grid components now use Material-UI v5 Grid v1 syntax.`);
  } else {
    console.log(`\n✨ No Grid syntax issues found.`);
  }
}

// Run the script
console.log('🔧 Starting Grid syntax conversion...\n');
processFiles();
