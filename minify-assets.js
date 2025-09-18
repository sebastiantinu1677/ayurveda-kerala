const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CSS_DIR = './static/css';
const JS_DIR = './static/js';
const MINIFIED_DIR = './static/assets/minified';

// Create minified directory if it doesn't exist
if (!fs.existsSync(MINIFIED_DIR)) {
  fs.mkdirSync(MINIFIED_DIR, { recursive: true });
}

// Function to minify CSS using clean-css
function minifyCSS(inputPath, outputPath) {
  try {
    const command = `cleancss -o "${outputPath}" "${inputPath}"`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error minifying CSS ${inputPath}:`, error.message);
    return false;
  }
}

// Function to minify JS using terser
function minifyJS(inputPath, outputPath) {
  try {
    const command = `terser "${inputPath}" -o "${outputPath}" -c -m`;
    execSync(command, { stdio: 'pipe' });
    return true;
  } catch (error) {
    console.error(`Error minifying JS ${inputPath}:`, error.message);
    return false;
  }
}

// Function to bundle CSS files
function bundleCSS() {
  const cssFiles = [
    'tailwind.css',
    'custom.css',
    'critical.css'
  ];
  
  let bundledCSS = '';
  
  cssFiles.forEach(file => {
    const filePath = path.join(CSS_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      bundledCSS += `/* ${file} */\n${content}\n\n`;
    }
  });
  
  const bundlePath = path.join(MINIFIED_DIR, 'bundle.css');
  fs.writeFileSync(bundlePath, bundledCSS);
  
  // Minify the bundle
  const minifiedPath = path.join(MINIFIED_DIR, 'bundle.min.css');
  return minifyCSS(bundlePath, minifiedPath);
}

// Function to bundle JS files
function bundleJS() {
  const jsFiles = [
    'lazy-loading.js',
    'analytics-enhanced.js',
    'accessibility.js'
  ];
  
  let bundledJS = '';
  
  jsFiles.forEach(file => {
    const filePath = path.join(JS_DIR, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      bundledJS += `/* ${file} */\n${content}\n\n`;
    }
  });
  
  const bundlePath = path.join(MINIFIED_DIR, 'bundle.js');
  fs.writeFileSync(bundlePath, bundledJS);
  
  // Minify the bundle
  const minifiedPath = path.join(MINIFIED_DIR, 'bundle.min.js');
  return minifyJS(bundlePath, minifiedPath);
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

// Function to check if required tools are available
function checkTools() {
  const tools = ['cleancss', 'terser'];
  let allAvailable = true;
  
  tools.forEach(tool => {
    try {
      execSync(`${tool} --version`, { stdio: 'pipe' });
    } catch (error) {
      console.error(`❌ ${tool} not found. Please install it:`);
      if (tool === 'cleancss') {
        console.error('   npm install -g clean-css-cli');
      } else if (tool === 'terser') {
        console.error('   npm install -g terser');
      }
      allAvailable = false;
    }
  });
  
  return allAvailable;
}

// Main minification function
function minifyAssets() {
  console.log('🗜️  Starting asset minification...\n');
  
  if (!checkTools()) {
    console.log('❌ Required tools not found. Please install them first.');
    process.exit(1);
  }
  
  let totalOriginalSize = 0;
  let totalMinifiedSize = 0;
  
  // Bundle and minify CSS
  console.log('📦 Bundling CSS files...');
  if (bundleCSS()) {
    const bundlePath = path.join(MINIFIED_DIR, 'bundle.css');
    const minifiedPath = path.join(MINIFIED_DIR, 'bundle.min.css');
    
    const bundleSize = getFileSize(bundlePath);
    const minifiedSize = getFileSize(minifiedPath);
    const savings = ((bundleSize - minifiedSize) / bundleSize * 100).toFixed(1);
    
    console.log(`✅ CSS bundled and minified`);
    console.log(`   ${formatFileSize(bundleSize)} → ${formatFileSize(minifiedSize)} (${savings}% smaller)`);
    
    totalOriginalSize += bundleSize;
    totalMinifiedSize += minifiedSize;
  }
  
  // Bundle and minify JS
  console.log('\n📦 Bundling JS files...');
  if (bundleJS()) {
    const bundlePath = path.join(MINIFIED_DIR, 'bundle.js');
    const minifiedPath = path.join(MINIFIED_DIR, 'bundle.min.js');
    
    const bundleSize = getFileSize(bundlePath);
    const minifiedSize = getFileSize(minifiedPath);
    const savings = ((bundleSize - minifiedSize) / bundleSize * 100).toFixed(1);
    
    console.log(`✅ JS bundled and minified`);
    console.log(`   ${formatFileSize(bundleSize)} → ${formatFileSize(minifiedSize)} (${savings}% smaller)`);
    
    totalOriginalSize += bundleSize;
    totalMinifiedSize += minifiedSize;
  }
  
  // Summary
  console.log('\n📊 Minification Summary:');
  console.log(`   Total original size: ${formatFileSize(totalOriginalSize)}`);
  console.log(`   Total minified size: ${formatFileSize(totalMinifiedSize)}`);
  
  if (totalOriginalSize > 0) {
    const totalSavings = ((totalOriginalSize - totalMinifiedSize) / totalOriginalSize * 100).toFixed(1);
    console.log(`   Total savings: ${formatFileSize(totalOriginalSize - totalMinifiedSize)} (${totalSavings}% smaller)`);
  }
  
  console.log('\n🎉 Asset minification complete!');
}

// Run minification
minifyAssets();
