// Advanced Analytics and Conversion Tracking
(function() {
  'use strict';

  // Enhanced conversion tracking
  const conversionEvents = {
    // Page engagement tracking
    pageEngagement: {
      scrollDepth: [25, 50, 75, 90, 100],
      timeOnPage: [30, 60, 120, 300], // seconds
      interactions: ['click', 'scroll', 'form_focus']
    },
    
    // Business-specific events
    businessEvents: {
      tourInquiry: 'tour_inquiry',
      brochureDownload: 'brochure_download',
      contactFormSubmit: 'contact_form_submit',
      phoneClick: 'phone_click',
      whatsappClick: 'whatsapp_click',
      emailClick: 'email_click',
      testimonialView: 'testimonial_view',
      galleryView: 'gallery_view',
      priceCalculator: 'price_calculator_use',
      filterUse: 'filter_use',
      searchUse: 'search_use'
    }
  };

  // Track scroll depth
  function trackScrollDepth() {
    let maxScroll = 0;
    const thresholds = conversionEvents.pageEngagement.scrollDepth;
    
    function checkScrollDepth() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / docHeight) * 100);
      
      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        thresholds.forEach(threshold => {
          if (scrollPercent >= threshold && maxScroll < threshold + 5) {
            gtag('event', 'scroll_depth', {
              'event_category': 'engagement',
              'event_label': `${threshold}%`,
              'value': threshold
            });
          }
        });
      }
    }
    
    window.addEventListener('scroll', checkScrollDepth, { passive: true });
  }

  // Track time on page
  function trackTimeOnPage() {
    const startTime = Date.now();
    const thresholds = conversionEvents.pageEngagement.timeOnPage;
    
    thresholds.forEach(threshold => {
      setTimeout(() => {
        gtag('event', 'time_on_page', {
          'event_category': 'engagement',
          'event_label': `${threshold}s`,
          'value': threshold
        });
      }, threshold * 1000);
    });
  }

  // Track form interactions
  function trackFormInteractions() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Track form starts
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('focus', () => {
          gtag('event', 'form_start', {
            'event_category': 'engagement',
            'event_label': form.id || 'contact_form'
          });
        }, { once: true });
      });
      
      // Track form submissions
      form.addEventListener('submit', (e) => {
        gtag('event', 'form_submit', {
          'event_category': 'conversion',
          'event_label': form.id || 'contact_form'
        });
      });
    });
  }

  // Track business-specific interactions
  function trackBusinessInteractions() {
    // Tour inquiry buttons
    document.querySelectorAll('[data-tour-inquiry]').forEach(button => {
      button.addEventListener('click', () => {
        gtag('event', conversionEvents.businessEvents.tourInquiry, {
          'event_category': 'conversion',
          'event_label': button.dataset.tourInquiry
        });
      });
    });
    
    // Phone number clicks
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', conversionEvents.businessEvents.phoneClick, {
          'event_category': 'contact',
          'event_label': 'phone'
        });
      });
    });
    
    // WhatsApp clicks
    document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', conversionEvents.businessEvents.whatsappClick, {
          'event_category': 'contact',
          'event_label': 'whatsapp'
        });
      });
    });
    
    // Email clicks
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.addEventListener('click', () => {
        gtag('event', conversionEvents.businessEvents.emailClick, {
          'event_category': 'contact',
          'event_label': 'email'
        });
      });
    });
    
    // Price calculator usage
    const calculator = document.querySelector('.budget-calculator');
    if (calculator) {
      const calculateButton = calculator.querySelector('button[type="submit"]');
      if (calculateButton) {
        calculateButton.addEventListener('click', () => {
          gtag('event', conversionEvents.businessEvents.priceCalculator, {
            'event_category': 'engagement',
            'event_label': 'budget_calculator'
          });
        });
      }
    }
    
    // Filter usage
    document.querySelectorAll('.filter-content select, .filter-content input').forEach(filter => {
      filter.addEventListener('change', () => {
        gtag('event', conversionEvents.businessEvents.filterUse, {
          'event_category': 'engagement',
          'event_label': filter.name || 'filter'
        });
      });
    });
  }

  // Track testimonial views
  function trackTestimonialViews() {
    const testimonials = document.querySelectorAll('.testimonial-item, .review-item');
    
    if (testimonials.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gtag('event', conversionEvents.businessEvents.testimonialView, {
              'event_category': 'engagement',
              'event_label': 'testimonial'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      testimonials.forEach(testimonial => observer.observe(testimonial));
    }
  }

  // Track gallery views
  function trackGalleryViews() {
    const galleries = document.querySelectorAll('.gallery, .image-gallery');
    
    if (galleries.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gtag('event', conversionEvents.businessEvents.galleryView, {
              'event_category': 'engagement',
              'event_label': 'gallery'
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      
      galleries.forEach(gallery => observer.observe(gallery));
    }
  }

  // Enhanced e-commerce tracking for tours
  function trackTourInteractions() {
    document.querySelectorAll('.tour-card, .reise-card').forEach(card => {
      const title = card.querySelector('h3, h2, .title')?.textContent || 'Unknown Tour';
      const price = card.querySelector('.price, .pricefrom')?.textContent || '0';
      
      // Track tour card views
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            gtag('event', 'view_item', {
              'event_category': 'ecommerce',
              'event_label': title,
              'value': parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
            });
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      observer.observe(card);
      
      // Track tour card clicks
      const link = card.querySelector('a');
      if (link) {
        link.addEventListener('click', () => {
          gtag('event', 'select_item', {
            'event_category': 'ecommerce',
            'event_label': title,
            'value': parseFloat(price.replace(/[^\d.,]/g, '').replace(',', '.')) || 0
          });
        });
      }
    });
  }

  // Track search functionality
  function trackSearchUsage() {
    const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="suche"]');
    
    searchInputs.forEach(input => {
      let searchStarted = false;
      
      input.addEventListener('input', () => {
        if (!searchStarted && input.value.length > 2) {
          searchStarted = true;
          gtag('event', conversionEvents.businessEvents.searchUse, {
            'event_category': 'engagement',
            'event_label': 'search_start'
          });
        }
      });
      
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.length > 0) {
          gtag('event', conversionEvents.businessEvents.searchUse, {
            'event_category': 'engagement',
            'event_label': 'search_submit',
            'value': input.value.length
          });
        }
      });
    });
  }

  // Initialize all tracking
  function initAdvancedAnalytics() {
    // Wait for gtag to be available (it might load after consent)
    function waitForGtag(retryCount = 0) {
      if (typeof gtag !== 'undefined') {
        console.log('Google Analytics loaded, initializing advanced tracking');
        trackScrollDepth();
        trackTimeOnPage();
        trackFormInteractions();
        trackBusinessInteractions();
        trackPagePerformance();
        trackUserEngagement();
      } else if (retryCount < 20) {
        setTimeout(() => waitForGtag(retryCount + 1), 500);
      } else {
        console.warn('Google Analytics not loaded after 10 seconds, skipping advanced tracking');
      }
    }
    
    waitForGtag();
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdvancedAnalytics);
  } else {
    initAdvancedAnalytics();
  }

})();
