# 🖼️ WebP Image Conversion Guide

This guide will help you convert all your images to WebP format for better performance and faster loading times.

## 📋 Prerequisites

### 1. Install WebP Tools

#### Windows:
```bash
# Download cwebp.exe from Google WebP tools
# Place it in your system PATH or project directory
```

#### macOS:
```bash
brew install webp
```

#### Linux:
```bash
sudo apt-get install webp
```

## 🚀 Conversion Methods

### Method 1: Node.js Script (Recommended)
```bash
# Run the conversion script
npm run convert-images
```

### Method 2: Batch File (Windows)
```bash
# Double-click convert-to-webp.bat
# Or run in command prompt:
convert-to-webp.bat
```

### Method 3: PowerShell Script (Windows)
```powershell
# Run PowerShell as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\convert-to-webp.ps1
```

## 📁 File Structure After Conversion

```
static/images/
├── webp/                    # WebP converted images
│   ├── ayurveda-massage.webp
│   ├── kerala-beach.webp
│   ├── yoga-retreat.webp
│   └── ...
├── ayurveda-massage.jpg     # Original images (keep as fallback)
├── kerala-beach.png
└── ...
```

## 🔧 Template Updates

The `picture.html` partial has been updated to automatically use WebP images with fallbacks:

```html
<picture>
  <source srcset="/images/webp/image.webp" type="image/webp">
  <img src="/images/image.jpg" alt="Description">
</picture>
```

## 📊 Expected Results

- **File Size Reduction**: 25-50% smaller files
- **Loading Speed**: 20-40% faster image loading
- **SEO Benefits**: Better Core Web Vitals scores
- **User Experience**: Faster page loads, especially on mobile

## 🧪 Testing WebP Images

### 1. Browser Testing
- Open your website in Chrome, Firefox, or Edge
- Check Network tab in DevTools
- Verify WebP images are being loaded

### 2. Fallback Testing
- Disable WebP support in browser
- Verify original images still load

### 3. Performance Testing
- Use Google PageSpeed Insights
- Check Core Web Vitals improvements

## 🔄 Maintenance

### Adding New Images
1. Add original image to `static/images/`
2. Run conversion script: `npm run convert-images`
3. WebP version will be created automatically

### Updating Existing Images
1. Replace original image
2. Delete old WebP version
3. Run conversion script again

## 🚨 Troubleshooting

### Common Issues:

#### 1. "cwebp not found" Error
```bash
# Install WebP tools
# Windows: Download from Google WebP tools
# macOS: brew install webp
# Linux: sudo apt-get install webp
```

#### 2. Permission Errors
```bash
# Windows: Run as Administrator
# macOS/Linux: Check file permissions
```

#### 3. WebP Images Not Loading
- Check file paths in templates
- Verify WebP files exist in `static/images/webp/`
- Check browser WebP support

## 📈 Performance Monitoring

### Before Conversion:
- Note current image file sizes
- Record page load times
- Check Core Web Vitals scores

### After Conversion:
- Compare file sizes (should be 25-50% smaller)
- Measure page load improvements
- Verify Core Web Vitals improvements

## 🎯 Best Practices

1. **Keep Originals**: Always keep original images as fallbacks
2. **Quality Settings**: Use 85% quality for photos, 75% for icons
3. **Regular Updates**: Re-convert when adding new images
4. **Testing**: Always test in multiple browsers
5. **Monitoring**: Monitor performance improvements

## 🔗 Useful Resources

- [WebP Documentation](https://developers.google.com/speed/webp)
- [Browser Support](https://caniuse.com/webp)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [Core Web Vitals](https://web.dev/vitals/)

---

**Note**: After conversion, your website will automatically serve WebP images to supported browsers while maintaining fallbacks for older browsers. This ensures maximum compatibility and performance.
