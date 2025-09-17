const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🖼️  Converting images to WebP format...\n');

// Create WebP directory
const webpDir = path.join('static', 'images', 'webp');
if (!fs.existsSync(webpDir)) {
    fs.mkdirSync(webpDir, { recursive: true });
    console.log('✅ Created WebP directory:', webpDir);
}

// Function to convert image to WebP
function convertToWebP(inputPath, outputPath, quality = 85) {
    try {
        const command = `cwebp "${inputPath}" -q ${quality} -o "${outputPath}"`;
        execSync(command, { stdio: 'pipe' });
        return true;
    } catch (error) {
        console.error(`❌ Failed to convert: ${path.basename(inputPath)}`);
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

let totalOriginalSize = 0;
let totalWebPSize = 0;
let convertedCount = 0;

// Convert JPG files
console.log('📸 Converting JPG files...');
const jpgFiles = fs.readdirSync(path.join('static', 'images'))
    .filter(file => file.toLowerCase().endsWith('.jpg'));

jpgFiles.forEach(file => {
    const inputPath = path.join('static', 'images', file);
    const outputPath = path.join(webpDir, file.replace('.jpg', '.webp'));
    
    console.log(`   Converting: ${file}`);
    if (convertToWebP(inputPath, outputPath)) {
        totalOriginalSize += getFileSize(inputPath);
        totalWebPSize += getFileSize(outputPath);
        convertedCount++;
    }
});

// Convert PNG files (excluding favicons and logos)
console.log('\n🖼️  Converting PNG files...');
const pngFiles = fs.readdirSync(path.join('static', 'images'))
    .filter(file => {
        const lowerFile = file.toLowerCase();
        return lowerFile.endsWith('.png') && 
               !lowerFile.includes('favicon') && 
               !lowerFile.includes('logo') && 
               !lowerFile.includes('icon');
    });

pngFiles.forEach(file => {
    const inputPath = path.join('static', 'images', file);
    const outputPath = path.join(webpDir, file.replace('.png', '.webp'));
    
    console.log(`   Converting: ${file}`);
    if (convertToWebP(inputPath, outputPath)) {
        totalOriginalSize += getFileSize(inputPath);
        totalWebPSize += getFileSize(outputPath);
        convertedCount++;
    }
});

// Convert icons with lower quality
console.log('\n🔗 Converting icon files...');
const iconDir = path.join('static', 'images', 'icons');
if (fs.existsSync(iconDir)) {
    const iconFiles = fs.readdirSync(iconDir)
        .filter(file => file.toLowerCase().endsWith('.png'));
    
    iconFiles.forEach(file => {
        const inputPath = path.join(iconDir, file);
        const outputPath = path.join(webpDir, file.replace('.png', '.webp'));
        
        console.log(`   Converting icon: ${file}`);
        if (convertToWebP(inputPath, outputPath, 75)) {
            totalOriginalSize += getFileSize(inputPath);
            totalWebPSize += getFileSize(outputPath);
            convertedCount++;
        }
    });
}

// Show results
console.log('\n📊 Conversion Results:');
console.log(`✅ Successfully converted: ${convertedCount} files`);
console.log(`📁 WebP files saved in: ${webpDir}`);

if (totalOriginalSize > 0 && totalWebPSize > 0) {
    const originalSizeMB = (totalOriginalSize / (1024 * 1024)).toFixed(2);
    const webpSizeMB = (totalWebPSize / (1024 * 1024)).toFixed(2);
    const savings = (((totalOriginalSize - totalWebPSize) / totalOriginalSize) * 100).toFixed(1);
    
    console.log(`\n💾 File Size Comparison:`);
    console.log(`   Original size: ${originalSizeMB} MB`);
    console.log(`   WebP size: ${webpSizeMB} MB`);
    console.log(`   Space saved: ${savings}%`);
}

console.log('\n🎉 WebP conversion completed!');
console.log('\nNext steps:');
console.log('1. Update your image references in templates');
console.log('2. Test the WebP images in your browser');
console.log('3. Keep original images as fallbacks');
