// Accessibility Enhancements
class AccessibilityEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.addSkipLinks();
    this.enhanceKeyboardNavigation();
    this.addFocusIndicators();
    this.improveColorContrast();
    this.addScreenReaderSupport();
    this.enhanceFormAccessibility();
    this.addReducedMotionSupport();
  }

  addSkipLinks() {
    // Add skip links if they don't exist
    if (!document.querySelector('.skip-link')) {
      const skipLinks = document.createElement('div');
      skipLinks.className = 'skip-links';
      skipLinks.innerHTML = `
        <a href="#main-content" class="skip-link">Zum Hauptinhalt springen</a>
        <a href="#navigation" class="skip-link">Zur Navigation springen</a>
        <a href="#search" class="skip-link">Zur Suche springen</a>
      `;
      document.body.insertBefore(skipLinks, document.body.firstChild);
    }
  }

  enhanceKeyboardNavigation() {
    // Add keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
      // Handle Enter key on clickable elements
      if (e.key === 'Enter' && e.target.matches('[role="button"], .clickable')) {
        e.target.click();
      }

      // Handle Escape key to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal, .popup');
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
          }
        });
      }

      // Handle arrow keys for custom dropdowns
      if (e.target.matches('.dropdown-trigger')) {
        const dropdown = e.target.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-menu')) {
          const items = dropdown.querySelectorAll('[role="menuitem"]');
          const currentIndex = Array.from(items).indexOf(document.activeElement);
          
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % items.length;
            items[nextIndex].focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
            items[prevIndex].focus();
          }
        }
      }
    });
  }

  addFocusIndicators() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
      .focus-visible {
        outline: 2px solid #3b82f6 !important;
        outline-offset: 2px !important;
      }
      
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 1000;
        border-radius: 4px;
      }
      
      .skip-link:focus {
        top: 6px;
      }
      
      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .bg-gray-100 { background-color: #000 !important; color: #fff !important; }
        .text-gray-600 { color: #fff !important; }
        .border-gray-200 { border-color: #fff !important; }
      }
    `;
    document.head.appendChild(style);
  }

  improveColorContrast() {
    // Check and improve color contrast
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
      const computedStyle = window.getComputedStyle(element);
      const backgroundColor = computedStyle.backgroundColor;
      const color = computedStyle.color;
      
      // Add high contrast class if needed
      if (this.needsHighContrast(backgroundColor, color)) {
        element.classList.add('high-contrast');
      }
    });
  }

  needsHighContrast(bgColor, textColor) {
    // Simple contrast check (in real implementation, use a proper contrast ratio calculator)
    return bgColor === 'rgb(255, 255, 255)' && textColor === 'rgb(107, 114, 128)';
  }

  addScreenReaderSupport() {
    // Add screen reader announcements
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'screen-reader-announcer';
    document.body.appendChild(announcer);

    // Add screen reader support for dynamic content
    this.observeDynamicContent();
  }

  observeDynamicContent() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              this.announceToScreenReader(node);
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  announceToScreenReader(element) {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer && element.textContent) {
      announcer.textContent = element.textContent;
    }
  }

  enhanceFormAccessibility() {
    // Add proper labels and descriptions to forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        // Add aria-describedby for help text
        const helpText = input.parentElement.querySelector('.help-text');
        if (helpText && !input.getAttribute('aria-describedby')) {
          const helpId = 'help-' + Math.random().toString(36).substr(2, 9);
          helpText.id = helpId;
          input.setAttribute('aria-describedby', helpId);
        }

        // Add required attribute announcement
        if (input.hasAttribute('required')) {
          input.setAttribute('aria-required', 'true');
        }

        // Add error state handling
        input.addEventListener('invalid', () => {
          input.setAttribute('aria-invalid', 'true');
        });

        input.addEventListener('input', () => {
          if (input.checkValidity()) {
            input.setAttribute('aria-invalid', 'false');
          }
        });
      });
    });
  }

  addReducedMotionSupport() {
    // Respect user's motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Method to announce messages to screen readers
  announce(message) {
    const announcer = document.getElementById('screen-reader-announcer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Method to trap focus in modals
  trapFocus(element) {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }
}

// Initialize accessibility enhancements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.accessibility = new AccessibilityEnhancer();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AccessibilityEnhancer;
}
