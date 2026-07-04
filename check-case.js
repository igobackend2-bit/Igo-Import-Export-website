const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const importRegex = /from\s+['"](@\/[^'"]+|\.[^'"]+)['"]/g;
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    let resolved;
    if (importPath.startsWith('@/')) {
      resolved = path.resolve(path.join(__dirname, 'src'), importPath.substring(2));
    } else {
      resolved = path.resolve(path.dirname(filePath), importPath);
    }
    
    let found = false;
    const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx'];
    
    for (const ext of extensions) {
      if (fs.existsSync(resolved + ext)) {
        found = true;
        const dir = path.dirname(resolved + ext);
        const base = path.basename(resolved + ext);
        const files = fs.readdirSync(dir);
        if (!files.includes(base)) {
          console.log(`CASE MISMATCH in ${filePath}:\n  Imported: '${importPath}'\n  Actual file: ${files.find(f => f.toLowerCase() === base.toLowerCase())}\n`);
        }
        break;
      }
    }
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      checkFile(fullPath);
    }
  }
}

walkDir(path.join(__dirname, 'src'));
