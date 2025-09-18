// Enhanced User Experience Features
(function() {
  'use strict';

  // UX Configuration
  const uxConfig = {
    readingProgress: true,
    smoothScrolling: true,
    backToTop: true,
    searchHighlight: true,
    imageZoom: true,
    tooltips: true,
    notifications: true,
    keyboardShortcuts: true
  };


  // Reading Progress Bar
  function initReadingProgress() {
    if (!uxConfig.readingProgress) return;
    
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    
    const style = document.createElement('style');
    style.textContent = `
      .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(0,0,0,0.1);
        z-index: 1000;
      }
      
      .reading-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #3CB371, #FFD700);
        width: 0%;
        transition: width 0.1s ease;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(progressBar);
    
    const fill = progressBar.querySelector('.reading-progress-fill');
    
    function updateProgress() {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      fill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    window.addEventListener('scroll', updateProgress, { passive: true });
  }

  // Smooth Scrolling
  function initSmoothScrolling() {
    if (!uxConfig.smoothScrolling) return;
    
    const style = document.createElement('style');
    style.textContent = `
      html {
        scroll-behavior: smooth;
      }
      
      @media (prefers-reduced-motion: reduce) {
        html {
          scroll-behavior: auto;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Back to Top Button - Disabled (using footer button instead)
  function initBackToTop() {
    // Back to top functionality is handled by footer.html
    return;
  }

  // Search Highlight
  function initSearchHighlight() {
    if (!uxConfig.searchHighlight) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q') || urlParams.get('search');
    
    if (searchTerm) {
      const style = document.createElement('style');
      style.textContent = `
        .search-highlight {
          background-color: #FFD700 !important;
          color: #000 !important;
          padding: 2px 4px !important;
          border-radius: 2px !important;
        }
      `;
      document.head.appendChild(style);
      
      function highlightText(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
      }
      
      // Highlight search terms in content
      const contentElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, .content');
      contentElements.forEach(element => {
        if (element.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
          element.innerHTML = highlightText(element.innerHTML, searchTerm);
        }
      });
    }
  }

  // Image Zoom
  function initImageZoom() {
    if (!uxConfig.imageZoom) return;
    
    const images = document.querySelectorAll('img:not(.no-zoom)');
    
    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.className = 'image-zoom-modal';
        modal.innerHTML = `
          <div class="image-zoom-content">
            <span class="image-zoom-close">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
          </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
          .image-zoom-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: zoom-out;
          }
          
          .image-zoom-content {
            position: relative;
            max-width: 90%;
            max-height: 90%;
          }
          
          .image-zoom-content img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .image-zoom-close {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 30px;
            cursor: pointer;
            z-index: 2001;
          }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Close modal
        modal.addEventListener('click', () => {
          document.body.removeChild(modal);
        });
        
        modal.querySelector('.image-zoom-close').addEventListener('click', (e) => {
          e.stopPropagation();
          document.body.removeChild(modal);
        });
      });
    });
  }

  // Tooltips
  function initTooltips() {
    if (!uxConfig.tooltips) return;
    
    const elements = document.querySelectorAll('[data-tooltip]');
    
    elements.forEach(element => {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = element.dataset.tooltip;
      
      const style = document.createElement('style');
      style.textContent = `
        .tooltip {
          position: absolute;
          background: #333;
          color: white;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          pointer-events: none;
          max-width: 200px;
          word-wrap: break-word;
        }
        
        .tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px;
          border-width: 5px;
          border-style: solid;
          border-color: #333 transparent transparent transparent;
        }
        
        .tooltip.visible {
          opacity: 1;
          visibility: visible;
        }
      `;
      document.head.appendChild(style);
      document.body.appendChild(tooltip);
      
      element.addEventListener('mouseenter', () => {
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        tooltip.classList.add('visible');
      });
      
      element.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
    });
  }

  // Notifications
  function initNotifications() {
    if (!uxConfig.notifications) return;
    
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-container';
    
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1500;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      
      .notification {
        background: #333;
        color: white;
        padding: 12px 16px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
      }
      
      .notification.show {
        transform: translateX(0);
      }
      
      .notification.success {
        background: #4CAF50;
      }
      
      .notification.error {
        background: #f44336;
      }
      
      .notification.warning {
        background: #ff9800;
      }
      
      .notification.info {
        background: #2196F3;
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(notificationContainer);
    
    // Global notification function
    window.showNotification = function(message, type = 'info', duration = 3000) {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      
      notificationContainer.appendChild(notification);
      
      // Show notification
      setTimeout(() => {
        notification.classList.add('show');
      }, 100);
      
      // Hide notification
      setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, duration);
    };
  }

  // Keyboard Shortcuts
  function initKeyboardShortcuts() {
    if (!uxConfig.keyboardShortcuts) return;
    
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + K for search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="search"]');
        if (searchInput) {
          searchInput.focus();
        }
      }
      
      // Escape to close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal, .image-zoom-modal');
        modals.forEach(modal => {
          if (modal.parentNode) {
            modal.parentNode.removeChild(modal);
          }
        });
      }
      
      // Space to pause/resume videos
      if (e.key === ' ' && e.target.tagName === 'VIDEO') {
        e.preventDefault();
        if (e.target.paused) {
          e.target.play();
        } else {
          e.target.pause();
        }
      }
    });
  }

  // Initialize all UX features
  function initUXEnhancements() {
    initReadingProgress();
    initSmoothScrolling();
    initBackToTop();
    initSearchHighlight();
    initImageZoom();
    initTooltips();
    initNotifications();
    initKeyboardShortcuts();
    
    console.log('UX enhancements initialized');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUXEnhancements);
  } else {
    initUXEnhancements();
  }

})();
