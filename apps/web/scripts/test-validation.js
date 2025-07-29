#!/usr/bin/env node

/**
 * Test script for gallery validation system
 */

const fs = require('fs');
const path = require('path');

// Simple test to validate gallery data structure
function testGalleryData() {
  const galleryPath = path.join(__dirname, '../src/data/gallery.ts');
  
  if (!fs.existsSync(galleryPath)) {
    console.error('❌ Gallery data file not found');
    return;
  }
  
  const content = fs.readFileSync(galleryPath, 'utf8');
  
  // Extract and count image entries
  const srcMatches = [...content.matchAll(/src:\s*["']([^"']+)["']/g)];
  const thumbnailMatches = [...content.matchAll(/thumbnailSrc:\s*["']([^"']+)["']/g)];
  const idMatches = [...content.matchAll(/id:\s*["']([^"']+)["']/g)];
  
  console.log('🖼️  Gallery Data Validation Test');
  console.log('================================');
  console.log(`Found ${idMatches.length} image entries`);
  console.log(`Found ${srcMatches.length} source images`);
  console.log(`Found ${thumbnailMatches.length} thumbnail images`);
  
  // Check for consistency
  if (idMatches.length === srcMatches.length && srcMatches.length === thumbnailMatches.length) {
    console.log('✅ Data structure is consistent');
  } else {
    console.log('❌ Data structure inconsistency detected');
  }
  
  // Validate naming patterns
  let namingIssues = 0;
  srcMatches.forEach((match, index) => {
    const imagePath = match[1];
    const filename = imagePath.split('/').pop() || '';
    const nameWithoutExt = filename.replace(/\.(jpg|png|webp)$/i, '');
    
    // Expected format: {service}-{project-type}-{location}-{date}
    const namingPattern = /^(roofing|siding|gutters|windows|chimneys|commercial)-[\w-]+-([\w-]+)-(\d{4}-\d{2}-\d{2})$/;
    
    if (!namingPattern.test(nameWithoutExt)) {
      console.log(`⚠️  Image ${index + 1}: naming convention issue - ${filename}`);
      namingIssues++;
    }
  });
  
  if (namingIssues === 0) {
    console.log('✅ All images follow naming convention');
  } else {
    console.log(`⚠️  ${namingIssues} naming convention issues found`);
  }
  
  // Test TypeScript types (basic syntax check)
  const typePath = path.join(__dirname, '../src/types/gallery.ts');
  if (fs.existsSync(typePath)) {
    console.log('✅ Gallery types file exists');
  } else {
    console.log('❌ Gallery types file not found');
  }
  
  console.log('\n✨ Validation test complete!');
}

testGalleryData();