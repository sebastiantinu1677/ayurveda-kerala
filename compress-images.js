const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const IMAGES_DIR = './static/images';
const COMPRESSED_DIR = './static/images/compressed';
const QUALITY = 85; // JPEG quality (0-100)
const WEBP_QUALITY = 80; // WebP quality (0-100)

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'];

// Create compressed directory if it doesn't exist
if (!fs.existsSync(COMPRESSED_DIR)) {
  fs.mkdirSync(COMPRESSED_DIR, { recursive: true });
}

// Function to compress image using ImageMagick
function compressImage(inputPath, outputPath, format) {
  try {
    let command;
    
    if (format === '.jpg' || format === '.jpeg') {
      command = `magick "${inputPath}" -quality ${QUALITY} -strip -interlace Plane "${outputPath}"`;
    } else if (format === '.png') {
      command = `magick "${inputPath}" -quality ${QUALITY} -strip "${outputPath}"`;
    } else {
      // For other formats, convert to JPEG
      command = `magick "${inputPath}" -quality ${QUALITY} -strip -interlace Plane "${outputPath.replace(/\.[^/.]+$/, '.jpg')}"`;
    }
    
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error.message);
    return false;
  }
}

// Function to create WebP version
function createWebP(inputPath, outputPath) {
  try {
    const command = `cwebp -q ${WEBP_QUALITY} "${inputPath}" -o "${outputPath}"`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error creating WebP ${inputPath}:`, error.message);
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

// Function to check if ImageMagick is available
function checkImageMagick() {
  try {
    execSync('magick -version', { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error('❌ ImageMagick not found. Please install ImageMagick:');
    console.error('   Windows: Download from https://imagemagick.org/script/download.php#windows');
    console.error('   macOS: brew install imagemagick');
    console.error('   Linux: sudo apt-get install imagemagick');
    return false;
  }
}

// Main compression function
function compressImages() {
  console.log('🗜️  Starting image compression...\n');
  
  let totalOriginalSize = 0;
  let totalCompressedSize = 0;
  let totalWebPSize = 0;
  let compressedCount = 0;
  let webpCount = 0;
  let skippedCount = 0;
  
  // Get all image files
  const files = fs.readdirSync(IMAGES_DIR);
  
  files.forEach(file => {
    const filePath = path.join(IMAGES_DIR, file);
    const ext = path.extname(file).toLowerCase();
    
    // Skip if not a supported image format or if it's in subdirectories
    if (!SUPPORTED_FORMATS.includes(ext) || file.includes('/')) {
      return;
    }
    
    const fileName = path.basename(file, ext);
    const compressedPath = path.join(COMPRESSED_DIR, file);
    const webpPath = path.join(COMPRESSED_DIR, `${fileName}.webp`);
    
    // Skip if compressed version already exists and is newer
    if (fs.existsSync(compressedPath)) {
      const originalStats = fs.statSync(filePath);
      const compressedStats = fs.statSync(compressedPath);
      
      if (compressedStats.mtime > originalStats.mtime) {
        console.log(`⏭️  Skipping ${file} (compressed version already exists and is newer)`);
        skippedCount++;
        return;
      }
    }
    
    console.log(`🗜️  Compressing ${file}...`);
    
    const originalSize = getFileSize(filePath);
    const success = compressImage(filePath, compressedPath, ext);
    
    if (success) {
      const compressedSize = getFileSize(compressedPath);
      const savings = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} compressed`);
      console.log(`   ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)} (${savings}% smaller)`);
      
      totalOriginalSize += originalSize;
      totalCompressedSize += compressedSize;
      compressedCount++;
      
      // Create WebP version
      console.log(`🔄 Creating WebP version...`);
      const webpSuccess = createWebP(compressedPath, webpPath);
      
      if (webpSuccess) {
        const webpSize = getFileSize(webpPath);
        const webpSavings = ((compressedSize - webpSize) / compressedSize * 100).toFixed(1);
        
        console.log(`✅ ${fileName}.webp created`);
        console.log(`   ${formatFileSize(compressedSize)} → ${formatFileSize(webpSize)} (${webpSavings}% smaller)`);
        
        totalWebPSize += webpSize;
        webpCount++;
      }
      
      console.log('');
    } else {
      console.log(`❌ Failed to compress ${file}\n`);
    }
  });
  
  // Summary
  console.log('📊 Compression Summary:');
  console.log(`   Compressed: ${compressedCount} images`);
  console.log(`   WebP created: ${webpCount} images`);
  console.log(`   Skipped: ${skippedCount} images`);
  console.log(`   Total original size: ${formatFileSize(totalOriginalSize)}`);
  console.log(`   Total compressed size: ${formatFileSize(totalCompressedSize)}`);
  console.log(`   Total WebP size: ${formatFileSize(totalWebPSize)}`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(1);
    const webpSavings = ((totalCompressedSize - totalWebPSize) / totalCompressedSize * 100).toFixed(1);
    console.log(`   Compression savings: ${formatFileSize(totalOriginalSize - totalCompressedSize)} (${totalSavings}% smaller)`);
    console.log(`   WebP savings: ${formatFileSize(totalCompressedSize - totalWebPSize)} (${webpSavings}% smaller)`);
  }
  
  console.log('\n🎉 Image compression complete!');
}

// Run compression
if (checkImageMagick()) {
  compressImages();
} else {
  process.exit(1);
}
