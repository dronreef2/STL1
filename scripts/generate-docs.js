#!/usr/bin/env node

/**
 * Generate documentation (README.md) for each design project
 * This script scans design/ for index.js files and generates README.md files
 */

const fs = require('fs');
const path = require('path');

const DESIGN_DIR = path.join(__dirname, '../design');
const DIST_DIR = path.join(__dirname, '../dist');
const WEB_PUBLIC_DIR = path.join(__dirname, '../web/public');

// Directories to exclude from documentation generation
const EXCLUDED_DIRS = ['node_modules', 'utils', 'examples'];

// Function to find all index.js files in design/
function findDesignFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && !EXCLUDED_DIRS.includes(entry.name)) {
        scan(fullPath);
      } else if (entry.name === 'index.js') {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Function to convert folder name to title
function folderNameToTitle(folderName) {
  return folderName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Function to extract description from first comment in file
function extractDescription(designFile) {
  try {
    const content = fs.readFileSync(designFile, 'utf8');
    // Look for first multi-line comment or single-line comment
    const multiLineMatch = content.match(/\/\*\*?\s*\n?\s*\*?\s*(.+?)\s*\n/);
    if (multiLineMatch) {
      return multiLineMatch[1].replace(/^\*\s*/, '').trim();
    }
    
    const singleLineMatch = content.match(/\/\/\s*(.+?)\s*\n/);
    if (singleLineMatch) {
      return singleLineMatch[1].trim();
    }
    
    return '';
  } catch (error) {
    return '';
  }
}

// Function to generate README content and catalog entry
function generateReadme(designFile) {
  const projectDir = path.dirname(designFile);
  const projectName = path.basename(projectDir);
  const relativePath = path.relative(DESIGN_DIR, designFile);
  
  console.log(`Generating documentation for: ${projectName}`);
  
  try {
    // Load the module to get parameter definitions
    const module = require(designFile);
    
    if (!module.getParameterDefinitions) {
      console.log(`  ⚠ Skipping ${projectName} - no getParameterDefinitions function`);
      return null;
    }
    
    const paramDefs = module.getParameterDefinitions();
    
    // Build the title
    const title = folderNameToTitle(projectName);
    
    // Extract description
    const description = extractDescription(designFile) || `Parametric ${title} design`;
    
    // Build the README content
    let content = `# ${title}\n\n`;
    
    // Add Parameters table
    content += `## Parâmetros Configuráveis\n`;
    content += `| Parâmetro | Tipo | Padrão | Descrição |\n`;
    content += `|-----------|------|--------|-----------|\n`;
    
    if (paramDefs.length === 0) {
      content += `| - | - | - | Nenhum parâmetro configurável |\n`;
    } else {
      paramDefs.forEach(param => {
        const name = param.name || '-';
        const type = param.type || '-';
        const initial = param.initial !== undefined ? param.initial : '-';
        const description = param.caption || '-';
        
        content += `| ${name} | ${type} | ${initial} | ${description} |\n`;
      });
    }
    
    content += '\n';
    
    // Add STL download link with existence check
    const stlPath = `../../dist/${projectName}.stl`;
    const stlFullPath = path.join(DIST_DIR, `${projectName}.stl`);
    
    if (fs.existsSync(stlFullPath)) {
      content += `[Download STL](${stlPath})\n`;
    } else {
      content += `_STL file not yet generated. Run \`npm run gen\` to create it._\n`;
    }
    
    // Get file stats for lastUpdate
    const stats = fs.statSync(designFile);
    
    // Build catalog entry
    const catalogEntry = {
      id: projectName,
      title: title,
      description: description,
      stlUrl: `/models/${projectName}.stl`,
      parameters: paramDefs.map(param => ({
        name: param.name || '',
        type: param.type || 'text',
        initial: param.initial !== undefined ? param.initial : '',
        caption: param.caption || '',
        min: param.min,
        max: param.max,
        step: param.step
      })),
      lastUpdate: stats.mtime.toISOString(),
      readmeContent: content
    };
    
    return {
      projectDir,
      projectName,
      content,
      catalogEntry
    };
    
  } catch (error) {
    console.error(`  ✗ Error processing ${projectName}:`, error.message);
    return null;
  }
}

// Main execution
console.log('Generating documentation for all design projects...\n');

const designFiles = findDesignFiles(DESIGN_DIR);
console.log(`Found ${designFiles.length} design file(s) to process\n`);

let generatedCount = 0;
const catalogEntries = [];

designFiles.forEach(file => {
  const result = generateReadme(file);
  
  if (result) {
    const readmePath = path.join(result.projectDir, 'README.md');
    
    try {
      fs.writeFileSync(readmePath, result.content, 'utf8');
      console.log(`  ✓ Generated ${result.projectName}/README.md\n`);
      generatedCount++;
      
      // Add to catalog
      catalogEntries.push(result.catalogEntry);
    } catch (error) {
      console.error(`  ✗ Error writing ${readmePath}:`, error.message);
    }
  }
});

// Generate catalog.json for the web interface
console.log('Generating catalog.json for web interface...');

// Ensure web/public directory exists
if (!fs.existsSync(WEB_PUBLIC_DIR)) {
  fs.mkdirSync(WEB_PUBLIC_DIR, { recursive: true });
}

const catalogPath = path.join(WEB_PUBLIC_DIR, 'catalog.json');

try {
  fs.writeFileSync(
    catalogPath,
    JSON.stringify(catalogEntries, null, 2),
    'utf8'
  );
  console.log(`  ✓ Generated catalog.json with ${catalogEntries.length} entries\n`);
} catch (error) {
  console.error(`  ✗ Error writing catalog.json:`, error.message);
}

console.log(`\nDocumentation generation complete! Generated ${generatedCount} README file(s).`);
