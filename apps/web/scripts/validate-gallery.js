#!/usr/bin/env node

/**
 * Gallery Validation Script
 * 
 * Validates that all images referenced in gallery.ts exist and checks
 * for missing thumbnails, incorrect paths, and naming convention compliance.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const GALLERY_DATA_PATH = path.join(__dirname, '../src/data/gallery.ts');
const GALLERY_IMAGES_PATH = path.join(__dirname, '../public/images/gallery');

// Color codes for console output
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

function extractImagePaths() {
  try {
    const galleryContent = fs.readFileSync(GALLERY_DATA_PATH, 'utf8');
    
    // Extract image paths using regex
    const srcMatches = [...galleryContent.matchAll(/src:\s*["']([^"']+)["']/g)];
    const thumbnailMatches = [...galleryContent.matchAll(/thumbnailSrc:\s*["']([^"']+)["']/g)];
    
    const fullImages = srcMatches.map(match => match[1]);
    const thumbnailImages = thumbnailMatches.map(match => match[1]);
    
    return { fullImages, thumbnailImages };
  } catch (error) {
    log(`Error reading gallery data: ${error.message}`, 'red');
    process.exit(1);
  }
}

function checkFileExists(imagePath) {
  const fullPath = path.join(__dirname, '..', 'public', imagePath);
  const placeholderPath = fullPath + '.placeholder';
  
  if (fs.existsSync(fullPath)) {
    return { exists: true, type: 'real' };
  } else if (fs.existsSync(placeholderPath)) {
    return { exists: true, type: 'placeholder' };
  }
  
  return { exists: false, type: null };
}

function validateNamingConvention(imagePath) {
  const filename = path.basename(imagePath);
  const nameWithoutExt = filename.replace(/\.(jpg|png|webp)$/i, '');
  
  // Expected format: {service}-{project-type}-{location}-{date}
  // Or for thumbnails: {service}-{project-type}-{location}-{date}-thumb
  const namingPattern = /^(roofing|siding|gutters|windows|chimneys|commercial)-[\w-]+-([\w-]+)-(\d{4}-\d{2}-\d{2})(-thumb)?$/;
  
  return namingPattern.test(nameWithoutExt);
}

function validateImagePaths(images, type) {
  log(`\n${colors.cyan}=== Validating ${type} Images ===${colors.reset}`);
  
  let validCount = 0;
  let missingCount = 0;
  let placeholderCount = 0;
  let namingIssues = 0;
  
  images.forEach((imagePath, index) => {
    const fileCheck = checkFileExists(imagePath);
    const namingValid = validateNamingConvention(imagePath);
    
    let status = '';
    if (!fileCheck.exists) {
      status = `${colors.red}✗ MISSING${colors.reset}`;
      missingCount++;
    } else if (fileCheck.type === 'placeholder') {
      status = `${colors.yellow}⚠ PLACEHOLDER${colors.reset}`;
      placeholderCount++;
    } else {
      status = `${colors.green}✓ EXISTS${colors.reset}`;
      validCount++;
    }
    
    if (!namingValid) {
      status += ` ${colors.yellow}(naming issue)${colors.reset}`;
      namingIssues++;
    }
    
    console.log(`${index + 1}. ${imagePath}`);
    console.log(`   ${status}`);
  });
  
  log(`\n${type} Summary:`, 'blue');
  log(`  ✓ Valid files: ${validCount}`, validCount > 0 ? 'green' : 'reset');
  log(`  ⚠ Placeholders: ${placeholderCount}`, placeholderCount > 0 ? 'yellow' : 'reset');
  log(`  ✗ Missing files: ${missingCount}`, missingCount > 0 ? 'red' : 'reset');
  log(`  ⚠ Naming issues: ${namingIssues}`, namingIssues > 0 ? 'yellow' : 'reset');
  
  return { validCount, missingCount, placeholderCount, namingIssues };
}

function checkFolderStructure() {
  log(`\n${colors.cyan}=== Validating Folder Structure ===${colors.reset}`);
  
  const expectedServices = ['roofing', 'siding', 'gutters', 'windows', 'chimneys', 'commercial'];
  const expectedSubdirs = ['full', 'thumbnails', 'before-after'];
  
  let structureValid = true;
  
  expectedServices.forEach(service => {
    const servicePath = path.join(GALLERY_IMAGES_PATH, service);
    
    if (!fs.existsSync(servicePath)) {
      log(`✗ Missing service directory: ${service}`, 'red');
      structureValid = false;
      return;
    }
    
    expectedSubdirs.forEach(subdir => {
      const subdirPath = path.join(servicePath, subdir);
      if (!fs.existsSync(subdirPath)) {
        log(`✗ Missing subdirectory: ${service}/${subdir}`, 'red');
        structureValid = false;
      }
    });
  });
  
  if (structureValid) {
    log('✓ Folder structure is valid', 'green');
  }
  
  return structureValid;
}

function generateReport(fullResults, thumbnailResults, structureValid) {
  log(`\n${colors.blue}=== GALLERY VALIDATION REPORT ===${colors.reset}`);
  
  const totalImages = fullResults.validCount + fullResults.missingCount + fullResults.placeholderCount;
  const totalThumbnails = thumbnailResults.validCount + thumbnailResults.missingCount + thumbnailResults.placeholderCount;
  
  log(`Total Images: ${totalImages}`);
  log(`Total Thumbnails: ${totalThumbnails}`);
  log(`Structure Valid: ${structureValid ? 'Yes' : 'No'}`, structureValid ? 'green' : 'red');
  
  const issues = [];
  
  if (fullResults.missingCount > 0) {
    issues.push(`${fullResults.missingCount} missing full images`);
  }
  
  if (thumbnailResults.missingCount > 0) {
    issues.push(`${thumbnailResults.missingCount} missing thumbnails`);
  }
  
  if (fullResults.namingIssues > 0 || thumbnailResults.namingIssues > 0) {
    issues.push(`${fullResults.namingIssues + thumbnailResults.namingIssues} naming convention issues`);
  }
  
  if (!structureValid) {
    issues.push('folder structure issues');
  }
  
  if (issues.length === 0) {
    log('\n✓ All validations passed! Gallery is ready.', 'green');
  } else {
    log('\n⚠ Issues found:', 'yellow');
    issues.forEach(issue => log(`  • ${issue}`, 'yellow'));
  }
  
  const placeholderTotal = fullResults.placeholderCount + thumbnailResults.placeholderCount;
  if (placeholderTotal > 0) {
    log(`\nℹ Note: ${placeholderTotal} placeholder files found. Replace with actual images when available.`, 'cyan');
  }
}

// Main execution
function main() {
  log('🖼️  Gallery Validation Tool', 'blue');
  log('===========================\n');
  
  const { fullImages, thumbnailImages } = extractImagePaths();
  
  log(`Found ${fullImages.length} full images and ${thumbnailImages.length} thumbnails in gallery data.`);
  
  const fullResults = validateImagePaths(fullImages, 'Full');
  const thumbnailResults = validateImagePaths(thumbnailImages, 'Thumbnail');
  const structureValid = checkFolderStructure();
  
  generateReport(fullResults, thumbnailResults, structureValid);
}

main();