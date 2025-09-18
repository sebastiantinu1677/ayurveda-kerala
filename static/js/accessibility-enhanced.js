// Enhanced Accessibility Features
(function() {
  'use strict';

  // Accessibility configuration
  const a11yConfig = {
    skipLinks: true,
    focusManagement: true,
    keyboardNavigation: true,
    screenReaderSupport: true,
    reducedMotion: true,
    fontSizeControl: false
  };

  // Add skip links
  function addSkipLinks() {
    if (!a11yConfig.skipLinks) return;
    
    const skipLinks = document.createElement('div');
    skipLinks.className = 'skip-links';
    skipLinks.innerHTML = `
      <a href="#main-content" class="skip-link">Skip to main content</a>
      <a href="#navigation" class="skip-link">Skip to navigation</a>
      <a href="#footer" class="skip-link">Skip to footer</a>
    `;
    
    // Add CSS for skip links
    const style = document.createElement('style');
    style.textContent = `
      .skip-links {
        position: absolute;
        top: -100px;
        left: 0;
        z-index: 1000;
      }
      
      .skip-link {
        position: absolute;
        top: 0;
        left: 0;
        background: #000;
        color: #fff;
        padding: 8px 16px;
        text-decoration: none;
        font-weight: bold;
        border-radius: 0 0 4px 0;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
      }
      
      .skip-link:focus {
        transform: translateY(0);
        outline: 2px solid #fff;
        outline-offset: 2px;
      }
    `;
    
    document.head.appendChild(style);
    document.body.insertBefore(skipLinks, document.body.firstChild);
  }

  // Enhanced focus management
  function enhanceFocusManagement() {
    if (!a11yConfig.focusManagement) return;
    
    // Add focus indicators
    const style = document.createElement('style');
    style.textContent = `
      *:focus {
        outline: 2px solid #0066cc !important;
        outline-offset: 2px !important;
      }
      
      .focus-visible {
        outline: 2px solid #0066cc !important;
        outline-offset: 2px !important;
      }
      
      /* Remove focus outline for mouse users */
      .js-focus-visible :focus:not(.focus-visible) {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible polyfill behavior
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('js-focus-visible');
      }
    });
    
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('js-focus-visible');
    });
  }

  // Enhanced keyboard navigation
  function enhanceKeyboardNavigation() {
    if (!a11yConfig.keyboardNavigation) return;
    
    // Add keyboard navigation for custom components
    const dropdowns = document.querySelectorAll('.dropdown, .filter-content');
    
    dropdowns.forEach(dropdown => {
      const trigger = dropdown.querySelector('[aria-expanded]');
      const menu = dropdown.querySelector('.dropdown-menu, .filter-options');
      
      if (trigger && menu) {
        // Handle Enter and Space keys
        trigger.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            trigger.setAttribute('aria-expanded', !isExpanded);
            menu.style.display = isExpanded ? 'none' : 'block';
            
            if (!isExpanded) {
              const firstFocusable = menu.querySelector('button, input, select, a');
              if (firstFocusable) firstFocusable.focus();
            }
          }
        });
        
        // Handle Escape key
        menu.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            trigger.setAttribute('aria-expanded', 'false');
            menu.style.display = 'none';
            trigger.focus();
          }
        });
      }
    });
    
    // Add arrow key navigation for lists
    const lists = document.querySelectorAll('.testimonial-slider, .gallery-grid');
    
    lists.forEach(list => {
      const items = list.querySelectorAll('li, .item');
      let currentIndex = 0;
      
      list.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          e.preventDefault();
          currentIndex = Math.min(currentIndex + 1, items.length - 1);
          items[currentIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          e.preventDefault();
          currentIndex = Math.max(currentIndex - 1, 0);
          items[currentIndex].focus();
        }
      });
    });
  }

  // Screen reader enhancements
  function enhanceScreenReaderSupport() {
    if (!a11yConfig.screenReaderSupport) return;
    
    // Add live regions for dynamic content
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    liveRegion.id = 'live-region';
    document.body.appendChild(liveRegion);
    
    // Add screen reader only class
    const style = document.createElement('style');
    style.textContent = `
      .sr-only {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }
      
      .sr-only-focusable:focus {
        position: static !important;
        width: auto !important;
        height: auto !important;
        padding: inherit !important;
        margin: inherit !important;
        overflow: visible !important;
        clip: auto !important;
        white-space: normal !important;
      }
    `;
    document.head.appendChild(style);
    
    // Announce dynamic content changes
    function announceToScreenReader(message) {
      const liveRegion = document.getElementById('live-region');
      if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      }
    }
    
    // Announce filter changes
    document.querySelectorAll('.filter-content select, .filter-content input').forEach(filter => {
      filter.addEventListener('change', () => {
        const label = filter.previousElementSibling?.textContent || 'Filter';
        announceToScreenReader(`${label} changed to ${filter.value}`);
      });
    });
    
    // Announce testimonial changes
    const testimonialButtons = document.querySelectorAll('.testimonial-dots button');
    testimonialButtons.forEach((button, index) => {
      button.addEventListener('click', () => {
        announceToScreenReader(`Testimonial ${index + 1} selected`);
      });
    });
  }


  // Reduced motion support
  function addReducedMotionSupport() {
    if (!a11yConfig.reducedMotion) return;
    
    const style = document.createElement('style');
    style.textContent = `
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
      
      .reduced-motion *,
      .reduced-motion *::before,
      .reduced-motion *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    `;
    document.head.appendChild(style);
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }
    
    // Listen for changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      if (e.matches) {
        document.body.classList.add('reduced-motion');
      } else {
        document.body.classList.remove('reduced-motion');
      }
    });
  }

  // Font size control - COMPLETELY DISABLED
  function addFontSizeControl() {
    // Remove any existing font size controls
    const existingControls = document.querySelector('.font-size-controls');
    if (existingControls) {
      existingControls.remove();
    }
    
    // Remove any font size related styles
    const existingStyles = document.querySelectorAll('style');
    existingStyles.forEach(style => {
      if (style.textContent && style.textContent.includes('font-size-controls')) {
        style.remove();
      }
    });
    
    // Remove any font size classes from body
    document.body.classList.remove('large-text', 'larger-text', 'largest-text');
    
    // Clear localStorage font size preference
    localStorage.removeItem('fontSize');
    
    // Font size control has been completely disabled
    // No A-, A, A+ buttons will be created
    return;
  }

  // Initialize all accessibility features
  function initAccessibility() {
    addSkipLinks();
    enhanceFocusManagement();
    enhanceKeyboardNavigation();
    enhanceScreenReaderSupport();
    addReducedMotionSupport();
    addFontSizeControl();
    
    console.log('Enhanced accessibility features initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }

})();
