#!/usr/bin/env node

/**
 * Batch Image Processing Script
 * 
 * Processes entire directories of project photos:
 * - Applies naming conventions
 * - Generates thumbnails
 * - Creates blur data URLs
 * - Outputs gallery data template
 * 
 * Usage: node process-images.js [source-directory] [service-category]
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
const BLUR_WIDTH = 10;
const BLUR_HEIGHT = 7;
const BLUR_QUALITY = 20;

const SERVICE_CATEGORIES = ['roofing', 'siding', 'gutters', 'windows', 'chimneys', 'commercial'];

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateNewFilename(originalName, service, projectType, location, date) {
  // Remove extension and clean up name
  const cleanName = originalName.replace(/\.(jpg|jpeg|png)$/i, '');
  
  // If no specific details provided, try to extract from filename
  if (!projectType || !location || !date) {
    // Use original name as fallback, cleaned up
    const cleanedOriginal = cleanName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    return `${service}-${cleanedOriginal}-${date || 'undated'}.jpg`;
  }
  
  return `${service}-${projectType}-${location}-${date}.jpg`;
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

async function getImageDimensions(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      aspectRatio: metadata.width / metadata.height
    };
  } catch (error) {
    return { aspectRatio: 1.5 }; // Default fallback
  }
}

function promptForDetails(filename) {
  // In a real implementation, this would use readline to prompt user
  // For now, we'll extract what we can from filename and use defaults
  
  log(`\\n📝 Processing: ${filename}`, 'cyan');
  log('   Using automatic naming (in real usage, would prompt for details)');
  
  // Extract potential date from filename
  const dateMatch = filename.match(/(\\d{4}-\\d{2}-\\d{2})/);
  const date = dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0];
  
  // Generate project type from filename
  const projectType = filename
    .replace(/\\.(jpg|jpeg|png)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30); // Limit length
  
  // Default location
  const location = 'new-jersey';
  
  return { projectType, location, date };
}

async function processImageFile(sourceFile, sourcePath, service, galleryPath, index) {
  log(`\\n🖼️  Processing ${index}: ${sourceFile}`, 'blue');
  
  const details = promptForDetails(sourceFile);
  const newFilename = generateNewFilename(sourceFile, service, details.projectType, details.location, details.date);
  const thumbnailFilename = newFilename.replace('.jpg', '-thumb.jpg');
  
  // Destination paths
  const fullDestPath = path.join(galleryPath, service, 'full', newFilename);
  const thumbDestPath = path.join(galleryPath, service, 'thumbnails', thumbnailFilename);
  
  // Copy main image
  try {
    fs.copyFileSync(sourcePath, fullDestPath);
    log(`  ✅ Copied to: ${newFilename}`, 'green');
  } catch (error) {
    log(`  ❌ Copy failed: ${error.message}`, 'red');
    return null;
  }
  
  // Generate thumbnail
  const thumbResult = await generateThumbnail(fullDestPath, thumbDestPath);
  if (thumbResult.success) {
    log(`  ✅ Generated thumbnail: ${thumbnailFilename}`, 'green');
  } else {
    log(`  ❌ Thumbnail failed: ${thumbResult.error}`, 'red');
  }
  
  // Generate blur data URL
  const blurResult = await generateBlurDataUrl(fullDestPath);
  const blurDataUrl = blurResult.success ? blurResult.dataUrl : '';
  
  if (blurResult.success) {
    log(`  ✅ Generated blur data URL`, 'green');
  } else {
    log(`  ❌ Blur data failed: ${blurResult.error}`, 'red');
  }
  
  // Get image dimensions
  const dimensions = await getImageDimensions(fullDestPath);
  
  // Create gallery data entry
  const galleryEntry = {
    id: (index + 1).toString(),
    src: `/images/gallery/${service}/full/${newFilename}`,
    alt: `${service} project - ${details.projectType.replace(/-/g, ' ')}`,
    thumbnailSrc: `/images/gallery/${service}/thumbnails/${thumbnailFilename}`,
    blurDataUrl: blurDataUrl,
    serviceTypes: [service.charAt(0).toUpperCase() + service.slice(1)],
    projectTitle: details.projectType.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()),
    description: `Professional ${service} project completed in ${details.location.replace(/-/g, ' ')}.`,
    location: details.location.replace(/-/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase()) + ', NJ',
    completedDate: details.date,
    aspectRatio: Math.round(dimensions.aspectRatio * 10) / 10
  };
  
  return galleryEntry;
}

async function processDirectory(sourceDir, service) {
  log(`\\n📁 Processing directory: ${sourceDir}`, 'blue');
  log(`🏷️  Service category: ${service}`, 'blue');
  
  if (!fs.existsSync(sourceDir)) {
    log(`❌ Source directory not found: ${sourceDir}`, 'red');
    return;
  }
  
  if (!SERVICE_CATEGORIES.includes(service)) {
    log(`❌ Invalid service category. Must be one of: ${SERVICE_CATEGORIES.join(', ')}`, 'red');
    return;
  }
  
  const galleryPath = path.join(__dirname, '../public/images/gallery');
  
  // Ensure gallery directories exist
  const serviceDirs = ['full', 'thumbnails', 'before-after'];
  serviceDirs.forEach(dir => {
    const dirPath = path.join(galleryPath, service, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  });
  
  // Find image files
  const files = fs.readdirSync(sourceDir);
  const imageFiles = files.filter(file => /\\.(jpg|jpeg|png)$/i.test(file));
  
  if (imageFiles.length === 0) {
    log('⚠️  No image files found in directory', 'yellow');
    return;
  }
  
  log(`Found ${imageFiles.length} image(s) to process`);
  
  const galleryEntries = [];
  let successCount = 0;
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    const sourcePath = path.join(sourceDir, imageFile);
    
    const entry = await processImageFile(imageFile, sourcePath, service, galleryPath, i);
    
    if (entry) {
      galleryEntries.push(entry);
      successCount++;
    }
  }
  
  // Save gallery data template
  if (galleryEntries.length > 0) {
    const outputPath = path.join(__dirname, `../gallery-data-${service}-${Date.now()}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(galleryEntries, null, 2));
    
    log(`\\n💾 Gallery data template saved to: ${outputPath}`, 'green');
    log('💡 Copy entries to your gallery.ts file', 'cyan');
  }
  
  log(`\\n📊 Processing Summary:`, 'blue');
  log(`  ✅ Successfully processed: ${successCount}`, 'green');
  log(`  📝 Gallery entries created: ${galleryEntries.length}`, 'green');
}

function showUsage() {
  log('🖼️  Batch Image Processing Tool', 'blue');
  log('===============================\\n');
  log('Usage:');
  log('  node process-images.js [source-directory] [service-category]');
  log('');
  log('Service Categories:');
  SERVICE_CATEGORIES.forEach(cat => log(`  • ${cat}`));
  log('');
  log('Examples:');
  log('  node process-images.js /path/to/photos roofing');
  log('  node process-images.js ../new-projects siding');
  log('');
  log('What this script does:');
  log('  1. 📁 Copies images to gallery structure');
  log('  2. 🏷️  Applies consistent naming conventions');
  log('  3. 🖼️  Generates thumbnails (400x267px)');
  log('  4. 🌀 Creates blur data URLs');
  log('  5. 📝 Outputs gallery data template');
  log('');
  log('Requirements:');
  log('  • Sharp package (npm install sharp)');
  log('  • Source images in JPG/PNG format');
  log('  • Valid service category');
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    showUsage();
    return;
  }
  
  if (args.length !== 2) {
    log('❌ Invalid arguments. Use --help for usage information.', 'red');
    return;
  }
  
  const [sourceDir, service] = args;
  const resolvedSourceDir = path.resolve(sourceDir);
  
  processDirectory(resolvedSourceDir, service.toLowerCase())
    .then(() => {
      log('\\n✨ Batch processing complete!', 'green');
      log('💡 Run validate-gallery.js to verify results', 'cyan');
    })
    .catch(error => {
      log(`❌ Processing error: ${error.message}`, 'red');
      process.exit(1);
    });
}

main();