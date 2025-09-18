// Advanced Lazy Loading with Intersection Observer
class LazyLoader {
  constructor() {
    this.imageObserver = null;
    this.videoObserver = null;
    this.iframeObserver = null;
    this.init();
  }

  init() {
    // Check if Intersection Observer is supported
    if ('IntersectionObserver' in window) {
      this.setupImageLazyLoading();
      this.setupVideoLazyLoading();
      this.setupIframeLazyLoading();
    } else {
      // Fallback for older browsers
      this.fallbackLazyLoading();
    }
  }

  setupImageLazyLoading() {
    const imageOptions = {
      root: null,
      rootMargin: '50px',
      threshold: 0.1
    };

    this.imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          this.loadImage(img);
          this.imageObserver.unobserve(img);
        }
      });
    }, imageOptions);

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
      this.imageObserver.observe(img);
    });
  }

  setupVideoLazyLoading() {
    const videoOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          this.loadVideo(video);
          this.videoObserver.unobserve(video);
        }
      });
    }, videoOptions);

    // Observe all videos with data-src
    document.querySelectorAll('video[data-src]').forEach(video => {
      this.videoObserver.observe(video);
    });
  }

  setupIframeLazyLoading() {
    const iframeOptions = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    this.iframeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const iframe = entry.target;
          this.loadIframe(iframe);
          this.iframeObserver.unobserve(iframe);
        }
      });
    }, iframeOptions);

    // Observe all iframes with data-src
    document.querySelectorAll('iframe[data-src]').forEach(iframe => {
      this.iframeObserver.observe(iframe);
    });
  }

  loadImage(img) {
    const src = img.dataset.src;
    const srcset = img.dataset.srcset;
    const sizes = img.dataset.sizes;

    // Create a new image to preload
    const newImg = new Image();
    
    newImg.onload = () => {
      img.src = src;
      if (srcset) img.srcset = srcset;
      if (sizes) img.sizes = sizes;
      img.classList.remove('lazy');
      img.classList.add('loaded');
      
      // Remove data attributes
      delete img.dataset.src;
      delete img.dataset.srcset;
      delete img.dataset.sizes;
    };

    newImg.onerror = () => {
      img.classList.add('error');
      console.error('Failed to load image:', src);
    };

    newImg.src = src;
    if (srcset) newImg.srcset = srcset;
  }

  loadVideo(video) {
    const src = video.dataset.src;
    const poster = video.dataset.poster;

    video.src = src;
    if (poster) video.poster = poster;
    video.classList.remove('lazy');
    video.classList.add('loaded');

    // Remove data attributes
    delete video.dataset.src;
    delete video.dataset.poster;
  }

  loadIframe(iframe) {
    const src = iframe.dataset.src;

    iframe.src = src;
    iframe.classList.remove('lazy');
    iframe.classList.add('loaded');

    // Remove data attribute
    delete iframe.dataset.src;
  }

  fallbackLazyLoading() {
    // Simple fallback for older browsers
    const lazyElements = document.querySelectorAll('[data-src]');
    
    const checkVisible = () => {
      lazyElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && element.dataset.src) {
          if (element.tagName === 'IMG') {
            this.loadImage(element);
          } else if (element.tagName === 'VIDEO') {
            this.loadVideo(element);
          } else if (element.tagName === 'IFRAME') {
            this.loadIframe(element);
          }
        }
      });
    };

    // Check on scroll and resize
    window.addEventListener('scroll', checkVisible);
    window.addEventListener('resize', checkVisible);
    
    // Initial check
    checkVisible();
  }

  // Method to manually trigger loading of specific elements
  loadElement(selector) {
    const element = document.querySelector(selector);
    if (element && element.dataset.src) {
      if (element.tagName === 'IMG') {
        this.loadImage(element);
      } else if (element.tagName === 'VIDEO') {
        this.loadVideo(element);
      } else if (element.tagName === 'IFRAME') {
        this.loadIframe(element);
      }
    }
  }

  // Method to preload critical images
  preloadCriticalImages() {
    const criticalImages = document.querySelectorAll('[data-preload="true"]');
    criticalImages.forEach(img => {
      this.loadImage(img);
    });
  }
}

// Initialize lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.lazyLoader = new LazyLoader();
  
  // Preload critical images immediately
  window.lazyLoader.preloadCriticalImages();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LazyLoader;
}
