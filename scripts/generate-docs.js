#!/usr/bin/env node

/**
 * Generate documentation (README.md) for each design project
 * This script scans design/ for index.js files and generates README.md files
 */

const fs = require('fs');
const path = require('path');

const DESIGN_DIR = path.join(__dirname, '../design');
const DIST_DIR = path.join(__dirname, '../dist');

// Function to find all index.js files in design/
function findDesignFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== 'utils') {
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

// Function to generate README content
function generateReadme(designFile) {
  const projectDir = path.dirname(designFile);
  const projectName = path.basename(projectDir);
  const relativePath = path.relative(DESIGN_DIR, designFile);
  
  // Skip examples and utils folders
  if (projectName === 'examples' || projectName === 'utils') {
    return null;
  }
  
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
    
    // Build the README content
    let content = `# ${title}\n\n`;
    
    // Add Parameters table
    content += `## Parâmetros Configuráveis\n`;
    content += `| Parâmetro | Tipo | Padrão | Descrição |\n`;
    content += `|-----------|------|--------|-----------|`;
    
    if (paramDefs.length === 0) {
      content += `\n| - | - | - | Nenhum parâmetro configurável |\n`;
    } else {
      paramDefs.forEach(param => {
        const name = param.name || '-';
        const type = param.type || '-';
        const initial = param.initial !== undefined ? param.initial : '-';
        const description = param.caption || '-';
        
        content += `\n| ${name} | ${type} | ${initial} | ${description} |`;
      });
      content += '\n';
    }
    
    content += '\n';
    
    // Add STL download link
    const stlPath = `../../dist/${projectName}.stl`;
    content += `[Download STL](${stlPath})\n`;
    
    return {
      projectDir,
      projectName,
      content
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

designFiles.forEach(file => {
  const result = generateReadme(file);
  
  if (result) {
    const readmePath = path.join(result.projectDir, 'README.md');
    
    try {
      fs.writeFileSync(readmePath, result.content, 'utf8');
      console.log(`  ✓ Generated ${result.projectName}/README.md\n`);
      generatedCount++;
    } catch (error) {
      console.error(`  ✗ Error writing ${readmePath}:`, error.message);
    }
  }
});

console.log(`\nDocumentation generation complete! Generated ${generatedCount} README file(s).`);
