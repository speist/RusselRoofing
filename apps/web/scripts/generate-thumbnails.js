#!/usr/bin/env node

/**
 * Thumbnail Generation Script
 * 
 * Generates 400x267px thumbnails for gallery images.
 * Requires sharp package for image processing.
 * 
 * Usage: node generate-thumbnails.js [source-directory]
 */

const fs = require('fs');
const path = require('path');

// Check if sharp is available
let sharp;
try {
  sharp = require('sharp');
} catch (error) {
  console.error('❌ Sharp package not found. Install with: npm install sharp');
  console.error('   This is required for image processing.');
  process.exit(1);
}

// Configuration
const THUMBNAIL_WIDTH = 400;
const THUMBNAIL_HEIGHT = 267;
const THUMBNAIL_QUALITY = 80;

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function generateThumbnail(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: THUMBNAIL_QUALITY })
      .toFile(outputPath);
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function getThumbnailPath(imagePath) {
  const dir = path.dirname(imagePath);
  const ext = path.extname(imagePath);
  const nameWithoutExt = path.basename(imagePath, ext);
  
  // Replace 'full' with 'thumbnails' in path and add '-thumb' suffix
  const thumbnailDir = dir.replace('/full/', '/thumbnails/');
  const thumbnailName = `${nameWithoutExt}-thumb${ext}`;
  
  return path.join(thumbnailDir, thumbnailName);
}

async function processDirectory(sourceDir) {
  log(`📁 Processing directory: ${sourceDir}`, 'blue');
  
  if (!fs.existsSync(sourceDir)) {
    log(`❌ Directory not found: ${sourceDir}`, 'red');
    return;
  }
  
  const files = fs.readdirSync(sourceDir);
  const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
  
  if (imageFiles.length === 0) {
    log('⚠️  No image files found in directory', 'yellow');
    return;
  }
  
  log(`Found ${imageFiles.length} image(s) to process`);
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const imageFile of imageFiles) {
    const inputPath = path.join(sourceDir, imageFile);
    const outputPath = getThumbnailPath(inputPath);
    
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    log(`  Processing: ${imageFile}...`);
    
    const result = await generateThumbnail(inputPath, outputPath);
    
    if (result.success) {
      log(`    ✅ Created: ${path.basename(outputPath)}`, 'green');
      successCount++;
    } else {
      log(`    ❌ Failed: ${result.error}`, 'red');
      errorCount++;
    }
  }
  
  log(`\n📊 Summary:`, 'blue');
  log(`  ✅ Success: ${successCount}`, 'green');
  log(`  ❌ Errors: ${errorCount}`, errorCount > 0 ? 'red' : 'reset');
}

async function processGalleryStructure() {
  log('🖼️  Processing entire gallery structure...', 'blue');
  
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const services = ['roofing', 'siding', 'gutters', 'windows', 'chimneys', 'commercial'];
  
  for (const service of services) {
    const fullDir = path.join(galleryPath, service, 'full');
    
    if (fs.existsSync(fullDir)) {
      await processDirectory(fullDir);
    } else {
      log(`⚠️  Skipping ${service} - no full directory found`, 'yellow');
    }
  }
}

function showUsage() {
  log('🖼️  Thumbnail Generation Tool', 'blue');
  log('============================\n');
  log('Usage:');
  log('  node generate-thumbnails.js                 # Process entire gallery');
  log('  node generate-thumbnails.js [directory]     # Process specific directory');
  log('');
  log('Examples:');
  log('  node generate-thumbnails.js ../public/images/gallery/roofing/full');
  log('  node generate-thumbnails.js /path/to/images');
  log('');
  log('Requirements:');
  log('  - Sharp package (npm install sharp)');
  log('  - Source images in supported formats (JPG, PNG)');
  log('');
  log('Output:');
  log(`  - Thumbnails: ${THUMBNAIL_WIDTH}x${THUMBNAIL_HEIGHT}px`);
  log(`  - Quality: ${THUMBNAIL_QUALITY}%`);
  log('  - Naming: original-name-thumb.jpg');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }
  
  if (args.length === 0) {
    // Process entire gallery structure
    await processGalleryStructure();
  } else {
    // Process specific directory
    const sourceDir = path.resolve(args[0]);
    await processDirectory(sourceDir);
  }
  
  log('\n✨ Thumbnail generation complete!', 'green');
  log('💡 Run validate-gallery.js to verify results', 'cyan');
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});