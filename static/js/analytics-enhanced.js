// Enhanced Analytics and Conversion Tracking
class AnalyticsEnhanced {
  constructor() {
    this.gaId = 'AW-17574288605';
    this.events = [];
    this.init();
  }

  init() {
    // Initialize Google Analytics
    this.initGA();
    
    // Track page performance
    this.trackPerformance();
    
    // Track user engagement
    this.trackEngagement();
    
    // Track form interactions
    this.trackForms();
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
    
    // Track exit intent
    this.trackExitIntent();
  }

  initGA() {
    // Enhanced Google Analytics configuration
    if (typeof gtag !== 'undefined') {
      gtag('config', this.gaId, {
        'anonymize_ip': true,
        'allow_google_signals': true,
        'allow_ad_personalization_signals': false,
        'custom_map': {
          'custom_parameter_1': 'user_type',
          'custom_parameter_2': 'page_category'
        }
      });
    }
  }

  trackPerformance() {
    // Track Core Web Vitals
    if ('web-vital' in window) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(this.sendWebVital.bind(this, 'CLS'));
        getFID(this.sendWebVital.bind(this, 'FID'));
        getFCP(this.sendWebVital.bind(this, 'FCP'));
        getLCP(this.sendWebVital.bind(this, 'LCP'));
        getTTFB(this.sendWebVital.bind(this, 'TTFB'));
      });
    }

    // Track page load time
    window.addEventListener('load', () => {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      this.trackEvent('page_performance', 'load_time', Math.round(loadTime));
    });
  }

  sendWebVital(metric, data) {
    this.trackEvent('web_vitals', metric, Math.round(data.value));
  }

  trackEngagement() {
    // Track clicks on important elements
    document.addEventListener('click', (e) => {
      const target = e.target;
      
      // Track CTA clicks
      if (target.matches('a[href*="/kontakt/"], a[href*="wa.me"], button[class*="bg-yellow"]')) {
        this.trackEvent('engagement', 'cta_click', target.textContent.trim());
      }
      
      // Track navigation clicks
      if (target.matches('nav a, .navigation a')) {
        this.trackEvent('navigation', 'menu_click', target.textContent.trim());
      }
      
      // Track external links
      if (target.matches('a[href^="http"]:not([href*="' + window.location.hostname + '"])')) {
        this.trackEvent('engagement', 'external_link', target.href);
      }
    });

    // Track video interactions
    document.addEventListener('play', (e) => {
      if (e.target.tagName === 'VIDEO') {
        this.trackEvent('engagement', 'video_play', e.target.src);
      }
    });

    // Track image interactions
    document.addEventListener('load', (e) => {
      if (e.target.tagName === 'IMG') {
        this.trackEvent('engagement', 'image_load', e.target.src);
      }
    });
  }

  trackForms() {
    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const formName = form.name || form.id || 'unknown_form';
      
      this.trackEvent('form', 'submit', formName);
      
      // Track form fields
      const fields = form.querySelectorAll('input, textarea, select');
      fields.forEach(field => {
        if (field.name) {
          this.trackEvent('form_field', 'interaction', field.name);
        }
      });
    });

    // Track form field focus
    document.addEventListener('focus', (e) => {
      if (e.target.matches('input, textarea, select')) {
        this.trackEvent('form_field', 'focus', e.target.name || e.target.id);
      }
    }, true);
  }

  trackScrollDepth() {
    let maxScroll = 0;
    const milestones = [25, 50, 75, 90, 100];
    const reachedMilestones = new Set();

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        milestones.forEach(milestone => {
          if (scrollPercent >= milestone && !reachedMilestones.has(milestone)) {
            reachedMilestones.add(milestone);
            this.trackEvent('engagement', 'scroll_depth', milestone + '%');
          }
        });
      }
    });
  }

  trackTimeOnPage() {
    const startTime = Date.now();
    let timeOnPage = 0;

    // Update time on page every 30 seconds
    const interval = setInterval(() => {
      timeOnPage = Math.round((Date.now() - startTime) / 1000);
      
      // Track milestones
      if (timeOnPage === 30) {
        this.trackEvent('engagement', 'time_on_page', '30s');
      } else if (timeOnPage === 60) {
        this.trackEvent('engagement', 'time_on_page', '1m');
      } else if (timeOnPage === 300) {
        this.trackEvent('engagement', 'time_on_page', '5m');
      }
    }, 30000);

    // Track final time on page
    window.addEventListener('beforeunload', () => {
      clearInterval(interval);
      timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('engagement', 'time_on_page', timeOnPage + 's');
    });
  }

  trackExitIntent() {
    let exitIntentShown = false;
    
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitIntentShown) {
        exitIntentShown = true;
        this.trackEvent('engagement', 'exit_intent', 'detected');
      }
    });
  }

  trackEvent(category, action, label, value) {
    const event = {
      category,
      action,
      label,
      value,
      timestamp: Date.now()
    };

    this.events.push(event);

    // Send to Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label,
        'value': value
      });
    }

    // Send to Google Ads
    if (typeof gtag !== 'undefined') {
      gtag('event', 'conversion', {
        'send_to': this.gaId + '/conversion',
        'event_category': category,
        'event_label': label
      });
    }

    console.log('Analytics Event:', event);
  }

  // Method to track custom events
  trackCustomEvent(eventName, parameters = {}) {
    this.trackEvent('custom', eventName, JSON.stringify(parameters));
  }

  // Method to track e-commerce events
  trackPurchase(transactionId, value, currency = 'EUR', items = []) {
    if (typeof gtag !== 'undefined') {
      gtag('event', 'purchase', {
        'transaction_id': transactionId,
        'value': value,
        'currency': currency,
        'items': items
      });
    }
  }

  // Method to track page views
  trackPageView(pagePath, pageTitle) {
    if (typeof gtag !== 'undefined') {
      gtag('config', this.gaId, {
        'page_path': pagePath,
        'page_title': pageTitle
      });
    }
  }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.analytics = new AnalyticsEnhanced();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AnalyticsEnhanced;
}
