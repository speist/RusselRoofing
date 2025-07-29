#!/usr/bin/env node

/**
 * Blur Data URL Generation Script
 * 
 * Generates base64-encoded blur placeholders for images.
 * Used for smooth loading transitions in Next.js Image components.
 * 
 * Usage: node generate-blur-data.js [image-path]
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
const BLUR_WIDTH = 10;
const BLUR_HEIGHT = 7;
const BLUR_QUALITY = 20;

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

async function generateBlurDataUrl(imagePath) {
  try {
    const blurBuffer = await sharp(imagePath)
      .resize(BLUR_WIDTH, BLUR_HEIGHT, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: BLUR_QUALITY })
      .toBuffer();
    
    const base64 = blurBuffer.toString('base64');
    const dataUrl = `data:image/jpeg;base64,${base64}`;
    
    return { success: true, dataUrl };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function processImage(imagePath) {
  log(`🖼️  Processing: ${path.basename(imagePath)}`, 'blue');
  
  if (!fs.existsSync(imagePath)) {
    log(`❌ Image not found: ${imagePath}`, 'red');
    return;
  }
  
  const result = await generateBlurDataUrl(imagePath);
  
  if (result.success) {
    log(`✅ Generated blur data URL (${result.dataUrl.length} characters)`, 'green');
    log(`\n📋 Copy this blur data URL:`, 'cyan');
    console.log(`"${result.dataUrl}"`);
    
    // Optionally save to file
    const outputPath = imagePath + '.blur-data.txt';
    fs.writeFileSync(outputPath, result.dataUrl);
    log(`\n💾 Saved to: ${outputPath}`, 'green');
    
  } else {
    log(`❌ Failed to generate blur data: ${result.error}`, 'red');
  }
}

async function processGalleryImages() {
  log('🖼️  Generating blur data URLs for gallery images...', 'blue');
  
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  const services = ['roofing', 'siding', 'gutters', 'windows', 'chimneys', 'commercial'];
  
  const blurDataResults = {};
  
  for (const service of services) {
    const fullDir = path.join(galleryPath, service, 'full');
    
    if (!fs.existsSync(fullDir)) {
      log(`⚠️  Skipping ${service} - no full directory found`, 'yellow');
      continue;
    }
    
    const files = fs.readdirSync(fullDir);
    const imageFiles = files.filter(file => /\.(jpg|jpeg|png)$/i.test(file));
    
    blurDataResults[service] = {};
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join(fullDir, imageFile);
      const result = await generateBlurDataUrl(imagePath);
      
      if (result.success) {
        blurDataResults[service][imageFile] = result.dataUrl;
        log(`  ✅ ${imageFile}`, 'green');
      } else {
        log(`  ❌ ${imageFile}: ${result.error}`, 'red');
      }
    }
  }
  
  // Save comprehensive results
  const outputPath = path.join(__dirname, '../gallery-blur-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(blurDataResults, null, 2));
  
  log(`\n💾 All blur data URLs saved to: ${outputPath}`, 'green');
  log('💡 Use these values in your gallery.ts file', 'cyan');
}

function showUsage() {
  log('🖼️  Blur Data URL Generation Tool', 'blue');
  log('================================\n');
  log('Usage:');
  log('  node generate-blur-data.js [image-path]     # Process single image');
  log('  node generate-blur-data.js --all           # Process all gallery images');
  log('');
  log('Examples:');
  log('  node generate-blur-data.js image.jpg');
  log('  node generate-blur-data.js ../public/images/gallery/roofing/full/image.jpg');
  log('  node generate-blur-data.js --all');
  log('');
  log('Requirements:');
  log('  - Sharp package (npm install sharp)');
  log('  - Source images in supported formats (JPG, PNG)');
  log('');
  log('Output:');
  log(`  - Blur dimensions: ${BLUR_WIDTH}x${BLUR_HEIGHT}px`);
  log(`  - Quality: ${BLUR_QUALITY}%`);
  log('  - Format: Base64 data URL');
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }
  
  if (args.includes('--all')) {
    await processGalleryImages();
  } else if (args.length === 0) {
    showUsage();
  } else {
    const imagePath = path.resolve(args[0]);
    await processImage(imagePath);
  }
  
  log('\n✨ Blur data generation complete!', 'green');
}

main().catch(error => {
  log(`❌ Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});