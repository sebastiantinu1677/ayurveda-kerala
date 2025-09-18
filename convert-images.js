const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const IMAGES_DIR = './static/images';
const WEBP_DIR = './static/images/webp';
const QUALITY = 85; // WebP quality (0-100)

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

// Create WebP directory if it doesn't exist
if (!fs.existsSync(WEBP_DIR)) {
  fs.mkdirSync(WEBP_DIR, { recursive: true });
}

// Function to convert image to WebP
function convertToWebP(inputPath, outputPath) {
  try {
    const command = `cwebp -q ${QUALITY} "${inputPath}" -o "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error converting ${inputPath}:`, error.message);
    return false;
  }
}

// Function to get file size
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Main conversion function
function convertImages() {
  console.log('🖼️  Starting WebP conversion...\n');
  
  let totalOriginalSize = 0;
  let totalWebPSize = 0;
  let convertedCount = 0;
  let skippedCount = 0;
  
  // Get all image files
  const files = fs.readdirSync(IMAGES_DIR);
  
  files.forEach(file => {
    const filePath = path.join(IMAGES_DIR, file);
    const ext = path.extname(file).toLowerCase();
    
    // Skip if not a supported image format or if it's already in webp directory
    if (!SUPPORTED_FORMATS.includes(ext) || file.startsWith('webp/')) {
      return;
    }
    
    const fileName = path.basename(file, ext);
    const webpPath = path.join(WEBP_DIR, `${fileName}.webp`);
    
    // Skip if WebP already exists and is newer
    if (fs.existsSync(webpPath)) {
      const originalStats = fs.statSync(filePath);
      const webpStats = fs.statSync(webpPath);
      
      if (webpStats.mtime > originalStats.mtime) {
        console.log(`⏭️  Skipping ${file} (WebP already exists and is newer)`);
        skippedCount++;
        return;
      }
    }
    
    console.log(`🔄 Converting ${file}...`);
    
    const originalSize = getFileSize(filePath);
    const success = convertToWebP(filePath, webpPath);
    
    if (success) {
      const webpSize = getFileSize(webpPath);
      const savings = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} → ${fileName}.webp`);
      console.log(`   ${formatFileSize(originalSize)} → ${formatFileSize(webpSize)} (${savings}% smaller)\n`);
      
      totalOriginalSize += originalSize;
      totalWebPSize += webpSize;
      convertedCount++;
    } else {
      console.log(`❌ Failed to convert ${file}\n`);
    }
  });
  
  // Summary
  console.log('📊 Conversion Summary:');
  console.log(`   Converted: ${convertedCount} images`);
  console.log(`   Skipped: ${skippedCount} images`);
  console.log(`   Total original size: ${formatFileSize(totalOriginalSize)}`);
  console.log(`   Total WebP size: ${formatFileSize(totalWebPSize)}`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalWebPSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`   Total savings: ${formatFileSize(totalOriginalSize - totalWebPSize)} (${totalSavings}% smaller)`);
  }
  
  console.log('\n🎉 WebP conversion complete!');
}

// Check if cwebp is available
function checkWebPTools() {
  try {
    execSync('cwebp -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('❌ cwebp not found. Please install WebP tools:');
    console.error('   Windows: Download from https://developers.google.com/speed/webp/download');
    console.error('   macOS: brew install webp');
    console.error('   Linux: sudo apt-get install webp');
    return false;
  }
}

// Run conversion
if (checkWebPTools()) {
  convertImages();
} else {
  process.exit(1);
}