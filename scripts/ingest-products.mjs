import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCES = [
  { dir: 'D:/Igo-websites/Igo- Crop Care/public/products', origin: 'Crop Care' },
  { dir: 'D:/Igo-websites/Igo-Farmer Factory/public', origin: 'Farmer Factory' },
  { dir: 'D:/Igo-websites/Igo-Nursery/public/images', origin: 'Nursery' },
  { dir: 'D:/Igo-websites/Igo-Palm Cafe/images', origin: 'Palm Cafe' },
  { dir: 'D:/Igo-websites/Igo-Protein Cuts/public/images', origin: 'Protein Cuts' }
];

// Target directories relative to the Next.js project root
const NEXT_DIR = path.resolve(__dirname, '..');
const TARGET_IMG_DIR = path.join(NEXT_DIR, 'public', 'products');
const TARGET_DATA_DIR = path.join(NEXT_DIR, 'public', 'data');
const DATA_FILE = path.join(TARGET_DATA_DIR, 'products.json');

// Directories to ignore
const IGNORE_DIRS = ['banners', 'branding', 'brands', 'sites', 'landscape_case_studies', 'landscape images', 'shop-attachments', 'harvest'];

// Keywords in filename to ignore (UI elements, backgrounds, logos, etc)
const EXCLUDE_KEYWORDS = ['bg', 'banner', 'logo', 'favicon', 'icon', 'login', 'auth', 'popup', 'hero', 'gallery', 'placeholder', 'apple-touch', 'window', 'vercel', 'globe', 'file', 'next', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 'divider', 'category_', 'why_us', 'fallback', 'thumb', 'download', 'ebay', '12pcs', '96pcs', '1pc'];

// Allowed extensions
const ALLOWED_EXTS = ['.webp', '.png', '.jpg', '.jpeg', '.jfif', '.gif'];

// Ensure target directories exist
if (!fs.existsSync(TARGET_IMG_DIR)) fs.mkdirSync(TARGET_IMG_DIR, { recursive: true });
if (!fs.existsSync(TARGET_DATA_DIR)) fs.mkdirSync(TARGET_DATA_DIR, { recursive: true });

let products = [];

// Helper to recursively get files
function getFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(file.toLowerCase())) {
        getFiles(path.join(dir, file), fileList);
      }
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

// Helper to sanitize filenames
function sanitizeFileName(name) {
  return name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
}

async function run() {
  console.log("Starting bulk product ingestion...");

  for (const source of SOURCES) {
    console.log(`Scanning ${source.origin}...`);
    const allFiles = getFiles(source.dir);
    
    // Group files by base name to deduplicate (prefer .webp)
    const fileGroups = {};
    for (const file of allFiles) {
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) continue;
      
      const baseName = path.basename(file, ext);
      
      // Skip unwanted UI/background files
      if (EXCLUDE_KEYWORDS.some(k => baseName.toLowerCase().includes(k))) {
        continue;
      }

      const relativePath = path.relative(source.dir, file);
      const categoryDir = path.dirname(relativePath).split(path.sep)[0];
      
      // Clean up category (if it's '.' or 'products', look deeper)
      let category = categoryDir === '.' ? 'General' : categoryDir;
      if (category.toLowerCase() === 'products') {
        const parts = path.relative(source.dir, file).split(path.sep);
        category = parts.length > 2 ? parts[1] : 'General';
      }
      
      // Override specific miscategorized folders
      if (source.origin === 'Crop Care' && category.toLowerCase() === 'vegetables') {
        category = 'Vegetable Seeds';
      }
      if (source.origin === 'Protein Cuts' && category.toLowerCase() === 'general') {
        category = 'Meat & Seafood';
      }

      // Aggressive normalization to catch "Garden gloves" vs "garden_gloves_with_style"
      let normalizedName = baseName.toLowerCase().replace(/[^a-z]/g, '');
      if (normalizedName.startsWith('gardengloves')) normalizedName = 'gardengloves';
      if (normalizedName.startsWith('cocopeat')) normalizedName = 'cocopeat';
      if (normalizedName.startsWith('handweeder')) normalizedName = 'handweeder';
      if (normalizedName.startsWith('plantcutter')) normalizedName = 'plantcutter';
      if (normalizedName.startsWith('sprayerhead')) normalizedName = 'sprayerhead';
      if (normalizedName.startsWith('rain')) normalizedName = 'rain'; // RAIN.jfif vs RAIN TREE.jfif

      const size = fs.statSync(file).size;
      
      // Find an existing group that matches EITHER the exact size OR the exact normalized name
      let foundKey = null;
      for (const existingKey in fileGroups) {
        const group = fileGroups[existingKey];
        const match = group.some(item => 
          item.size === size || 
          item.normalizedName === normalizedName
        );
        if (match) {
          foundKey = existingKey;
          break;
        }
      }

      const key = foundKey || `${category}-${normalizedName}`;

      if (!fileGroups[key]) {
        fileGroups[key] = [];
      }
      fileGroups[key].push({ file, ext, baseName, category, size, normalizedName });
    }

    // Process each group and pick the best image
    for (const key in fileGroups) {
      const group = fileGroups[key];
      // Sort to prefer .webp > .png > .jpg
      group.sort((a, b) => {
        const score = (ext) => ext === '.webp' ? 3 : ext === '.png' ? 2 : 1;
        return score(b.ext) - score(a.ext);
      });
      
      const bestImage = group[0];
      const targetCategoryDir = path.join(TARGET_IMG_DIR, source.origin, bestImage.category);
      if (!fs.existsSync(targetCategoryDir)) {
        fs.mkdirSync(targetCategoryDir, { recursive: true });
      }

      const cleanFileName = sanitizeFileName(path.basename(bestImage.file));
      const targetPath = path.join(targetCategoryDir, cleanFileName);
      
      // Copy file
      fs.copyFileSync(bestImage.file, targetPath);
      
      // Add to products array
      products.push({
        id: `${source.origin.replace(/\s+/g, '-').toLowerCase()}-${products.length + 1}`,
        name: bestImage.baseName,
        category: bestImage.category,
        origin: source.origin,
        image_url: `/products/${source.origin}/${bestImage.category}/${cleanFileName}`
      });
    }
  }

  // Save JSON
  fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  console.log(`✅ Ingestion complete! Saved ${products.length} products to products.json`);
}

run().catch(console.error);
