#!/usr/bin/env node

/**
 * Generate all STL models from design/ directory
 * This script scans design/ for index.js files and generates STL files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DESIGN_DIR = path.join(__dirname, '../design');
const DIST_DIR = path.join(__dirname, '../dist');
const WEB_MODELS_DIR = path.join(__dirname, '../web/public/models');

// Ensure output directories exist
[DIST_DIR, WEB_MODELS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Function to find all index.js files in design/
function findDesignFiles(dir) {
  const files = [];
  
  function scan(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        scan(fullPath);
      } else if (entry.name === 'index.js') {
        files.push(fullPath);
      }
    }
  }
  
  scan(dir);
  return files;
}

// Generate STL for each design file
const designFiles = findDesignFiles(DESIGN_DIR);

console.log(`Found ${designFiles.length} design file(s) to process\n`);

designFiles.forEach(file => {
  const relativePath = path.relative(DESIGN_DIR, file);
  const projectName = path.dirname(relativePath).replace(/\//g, '-');
  const outputName = projectName || 'model';
  const outputFile = path.join(DIST_DIR, `${outputName}.stl`);
  const webOutputFile = path.join(WEB_MODELS_DIR, `${outputName}.stl`);
  
  console.log(`Processing: ${relativePath}`);
  console.log(`  Output: ${outputName}.stl`);
  
  try {
    // Generate STL
    execSync(`npx jscad "${file}" -o "${outputFile}"`, {
      stdio: 'inherit'
    });
    
    // Copy to web/public/models
    fs.copyFileSync(outputFile, webOutputFile);
    
    console.log(`  ✓ Generated and copied to web/public/models/\n`);
  } catch (error) {
    console.error(`  ✗ Error generating ${outputName}:`, error.message);
    console.error('');
  }
});

console.log('Generation complete!');
