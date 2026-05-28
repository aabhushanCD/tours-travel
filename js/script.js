/**
 * ============================================================
 * NEPAL TRAILS — Main JavaScript
 * Author: Nepal Trails Agency
 * 
 * Sections:
 * 1. DOM Ready Init
 * 2. Navbar — Scroll Effect & Active Link
 * 3. Hamburger Menu (Mobile)
 * 4. Scroll Reveal Animations
 * 5. Package Filter Tabs
 * 6. Inquiry Form Handler
 * 7. Contact Form Handler
 * 8. Newsletter Form Handler
 * 9. Back-to-Top Button
 * 10. Smooth Scroll for Anchor Links
 * 11. Counters (Stats Animation)
 * 12. Toast Notification
 * 13. Floating Contacts Visibility
 * 14. Current Date default in Hero Form
 * ============================================================
 */

'use strict';

/* ============================================================
   UTILITIES
============================================================ */

/**
 * Show a toast notification message
 * @param {string} message - Text to display
 * @param {string} type    - 'success' | 'error'
 */
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  // Style by type
  toast.style.background = type === 'error' ? '#C0392B' : '#27AE60';

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/**
 * Throttle a function call
 * @param {Function} fn  - Function to throttle
 * @param {number} delay - Delay in ms
 */
function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/* ============================================================
   1. DOM READY — INIT ALL MODULES
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initNavbarScroll();
  initHamburgerMenu();
  initScrollReveal();
  initPackageFilter();
  initInquiryForm();
  initContactForm();
  initNewsletterForm();
  initBackToTop();
  initSmoothScroll();
  initCounters();
  initFloatingContacts();
  setDefaultDate();
  initNavActiveLinks();
});

/* ============================================================
   2. NAVBAR — SCROLL EFFECT
============================================================ */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const handleScroll = throttle(function () {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Set initial state
  handleScroll();
}

/* ============================================================
   NAVBAR — ACTIVE LINK ON SCROLL
============================================================ */
function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id], main > section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    }
  );

  sections.forEach(function (section) {
    observer.observe(section);
  });
}

/* ============================================================
   3. HAMBURGER MENU (MOBILE)
============================================================ */
function initHamburgerMenu() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const overlay   = document.getElementById('nav-overlay');
  if (!hamburger || !navLinks || !overlay) return;

  function openMenu() {
    hamburger.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);

  // Close menu when a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && hamburger.classList.contains('open')) {
      closeMenu();
    }
  });

  // Resize: close mobile menu if resized to desktop
  window.addEventListener('resize', throttle(function () {
    if (window.innerWidth > 1024) {
      closeMenu();
    }
  }, 200));
}

/* ============================================================
   4. SCROLL REVEAL ANIMATIONS
============================================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Once revealed, stop observing for performance
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealElements.forEach(function (el) {
    revealObserver.observe(el);
  });
}

/* ============================================================
   5. PACKAGE FILTER TABS
============================================================ */
function initPackageFilter() {
  const tabs    = document.querySelectorAll('.pkg-tab');
  const cards   = document.querySelectorAll('.pkg-card');
  if (!tabs.length || !cards.length) return;

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      // Update active tab
      tabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      // Show/hide cards with smooth transition
      cards.forEach(function (card) {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          // Trigger reveal if not already visible
          setTimeout(function () {
            card.classList.add('visible');
          }, 50);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ============================================================
   6. INQUIRY FORM (HERO)
============================================================ */
function initInquiryForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const destination = document.getElementById('trip-destination').value;
    const date        = document.getElementById('trip-date').value;
    const travelers   = document.getElementById('trip-travelers').value;

    if (!destination) {
      showToast('Please select a destination first!', 'error');
      return;
    }

    if (!date) {
      showToast('Please select your travel date!', 'error');
      return;
    }

    // Build WhatsApp message
    const destText      = document.getElementById('trip-destination').options[
      document.getElementById('trip-destination').selectedIndex
    ].text;
    const travelersText = document.getElementById('trip-travelers').options[
      document.getElementById('trip-travelers').selectedIndex
    ].text;

    const message = encodeURIComponent(
      `Hello Nepal Trails! 🙏\n\nI am interested in:\n` +
      `📍 Destination: ${destText}\n` +
      `📅 Travel Date: ${date}\n` +
      `👥 Travelers: ${travelersText}\n\n` +
      `Please send me a free quote. Thank you!`
    );

    const whatsappURL = `https://wa.me/9779841234567?text=${message}`;

    // Open WhatsApp
    window.open(whatsappURL, '_blank');
    showToast('Opening WhatsApp for your free quote! 🎉', 'success');
  });
}

/* ============================================================
   7. CONTACT FORM HANDLER
============================================================ */
function initContactForm() {
  const form   = document.getElementById('contact-form');
  const btnEl  = document.getElementById('contact-submit-btn');
  if (!form || !btnEl) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name     = document.getElementById('contact-name').value.trim();
    const phone    = document.getElementById('contact-phone-input').value.trim();
    const email    = document.getElementById('contact-email-input').value.trim();
    const interest = document.getElementById('contact-interest').value;
    const budget   = document.getElementById('contact-budget').value;
    const message  = document.getElementById('contact-message').value.trim();

    // Basic validation
    if (!name) {
      showToast('Please enter your full name.', 'error');
      document.getElementById('contact-name').focus();
      return;
    }

    if (!phone) {
      showToast('Please enter your phone/WhatsApp number.', 'error');
      document.getElementById('contact-phone-input').focus();
      return;
    }

    // Simulate form submission (in production, connect to backend / FormSubmit / EmailJS)
    const originalText = btnEl.innerHTML;
    btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btnEl.disabled = true;

    setTimeout(function () {
      // Success
      form.reset();
      btnEl.innerHTML = originalText;
      btnEl.disabled  = false;

      showToast('Message sent! We will contact you within 1 hour. 🙏', 'success');

      // Auto-redirect to WhatsApp as backup
      const interestLabel = interest || 'General Inquiry';
      const budgetLabel   = budget   || 'Not specified';
      const waMessage     = encodeURIComponent(
        `Hello Nepal Trails! 🙏\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Email: ${email || 'Not provided'}\n` +
        `Interested in: ${interestLabel}\n` +
        `Budget: ${budgetLabel}\n` +
        `Message: ${message || 'No additional message'}`
      );

      setTimeout(function () {
        window.open(`https://wa.me/9779841234567?text=${waMessage}`, '_blank');
      }, 1500);

    }, 1200);
  });
}

/* ============================================================
   8. NEWSLETTER FORM HANDLER
============================================================ */
function initNewsletterForm() {
  const form  = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-email');
  if (!form || !input) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = input.value.trim();
    if (!email || !isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    input.value = '';
    showToast('Subscribed! Welcome to Nepal Trails newsletter. 🏔️', 'success');
  });
}

/**
 * Simple email validation
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ============================================================
   9. BACK TO TOP BUTTON
============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const handleScroll = throttle(function () {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   10. SMOOTH SCROLL FOR ANCHOR LINKS
============================================================ */
function initSmoothScroll() {
  const navbarHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--navbar-height'),
    10
  ) || 70;

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#!') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================================
   11. COUNTER ANIMATION (Stats in Hero & Why Section)
============================================================ */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number, .metric-num');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (counter) {
    counterObserver.observe(counter);
  });
}

/**
 * Animate a numeric counter from 0 to its value
 * @param {HTMLElement} el
 */
function animateCounter(el) {
  const originalText = el.textContent.trim();

  // Extract numeric part
  const numMatch = originalText.match(/[\d.]+/);
  if (!numMatch) return;

  const target    = parseFloat(numMatch[0]);
  const suffix    = originalText.replace(numMatch[0], '');
  const prefix    = originalText.indexOf(numMatch[0]) > 0
    ? originalText.substring(0, originalText.indexOf(numMatch[0]))
    : '';

  const duration  = 1800;
  const stepTime  = 20;
  const steps     = duration / stepTime;
  const increment = target / steps;

  let current = 0;
  let frame   = 0;

  const timer = setInterval(function () {
    frame++;
    current = Math.min(increment * frame, target);

    // Format nicely
    let displayNum = Number.isInteger(target)
      ? Math.floor(current).toLocaleString()
      : current.toFixed(1);

    el.textContent = prefix + displayNum + suffix;

    if (current >= target) {
      el.textContent = prefix + (Number.isInteger(target) ? target.toLocaleString() : target) + suffix;
      clearInterval(timer);
    }
  }, stepTime);
}

/* ============================================================
   12. FLOATING CONTACTS — Hide on Contact Section
============================================================ */
function initFloatingContacts() {
  const floatingContacts = document.getElementById('floating-contacts');
  const contactSection   = document.getElementById('contact');
  if (!floatingContacts || !contactSection) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          floatingContacts.style.opacity = '0';
          floatingContacts.style.pointerEvents = 'none';
        } else {
          floatingContacts.style.opacity = '1';
          floatingContacts.style.pointerEvents = 'all';
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(contactSection);

  // Add transition style
  floatingContacts.style.transition = 'opacity 0.3s ease';
}

/* ============================================================
   13. SET DEFAULT DATE (Today) in Hero Inquiry Form
============================================================ */
function setDefaultDate() {
  const dateInput = document.getElementById('trip-date');
  if (!dateInput) return;

  // Set minimum date to today
  const today = new Date();
  const yyyy  = today.getFullYear();
  const mm    = String(today.getMonth() + 1).padStart(2, '0');
  const dd    = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  dateInput.min   = todayStr;

  // Default to 30 days from now (peak planning lead time)
  const future    = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const fy  = future.getFullYear();
  const fm  = String(future.getMonth() + 1).padStart(2, '0');
  const fd  = String(future.getDate()).padStart(2, '0');
  dateInput.value = `${fy}-${fm}-${fd}`;
}

/* ============================================================
   14. GALLERY LIGHTBOX (Simple)
============================================================ */
(function initGalleryLightbox() {
  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (!galleryItems.length) return;

    // Create lightbox elements
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image lightbox');
    lightbox.style.cssText = `
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.92);
      z-index: 9999;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      backdrop-filter: blur(4px);
    `;

    const lightboxImg = document.createElement('div');
    lightboxImg.style.cssText = `
      max-width: 90vw;
      max-height: 88vh;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.6);
      position: relative;
    `;

    const imgEl = document.createElement('img');
    imgEl.style.cssText = `
      display: block;
      max-width: 90vw;
      max-height: 88vh;
      object-fit: contain;
      border-radius: 12px;
    `;
    imgEl.alt = 'Nepal gallery image';

    const captionEl = document.createElement('div');
    captionEl.style.cssText = `
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
      color: white;
      padding: 1.5rem 1rem 0.85rem;
      font-size: 0.875rem;
      font-weight: 600;
      font-family: Inter, sans-serif;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.style.cssText = `
      position: absolute;
      top: 1rem;
      right: 1rem;
      width: 40px;
      height: 40px;
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      backdrop-filter: blur(4px);
      z-index: 10000;
      transition: background 0.2s;
    `;
    closeBtn.addEventListener('mouseenter', function () {
      closeBtn.style.background = 'rgba(255,255,255,0.3)';
    });
    closeBtn.addEventListener('mouseleave', function () {
      closeBtn.style.background = 'rgba(255,255,255,0.15)';
    });

    lightboxImg.appendChild(imgEl);
    lightboxImg.appendChild(captionEl);
    lightbox.appendChild(lightboxImg);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);

    function openLightbox(bgUrl, caption) {
      imgEl.src = bgUrl;
      captionEl.textContent = caption;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
      imgEl.src = '';
    }

    galleryItems.forEach(function (item) {
      item.style.cursor = 'pointer';
      item.addEventListener('click', function () {
        const imgDiv   = item.querySelector('.gallery-img');
        const caption  = item.querySelector('.gallery-caption');
        if (!imgDiv) return;

        // Extract background-image URL
        const style   = window.getComputedStyle(imgDiv);
        const bgImage = style.backgroundImage;
        const urlMatch = bgImage.match(/url\(["']?([^"')]+)["']?\)/);
        if (!urlMatch) return;

        // Use higher quality URL
        const url = urlMatch[1].replace('w=500', 'w=1200').replace('w=700', 'w=1400');
        openLightbox(url, caption ? caption.textContent : '');
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });

    closeBtn.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  });
})();

/* ============================================================
   15. DESTINATION CARD — WhatsApp Quick Inquiry
============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  // Attach "Book Now" buttons to WhatsApp with destination pre-filled
  const destBookBtns = {
    'dest-pokhara-book':   'Pokhara',
    'dest-mustang-book':   'Upper Mustang',
    'dest-ebc-book':       'Everest Base Camp',
    'dest-annapurna-book': 'Annapurna Circuit',
    'dest-chitwan-book':   'Chitwan National Park',
    'dest-lumbini-book':   'Lumbini',
    'dest-ilam-book':      'Ilam',
    'dest-rara-book':      'Rara Lake',
  };

  Object.entries(destBookBtns).forEach(function ([btnId, destName]) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const msg = encodeURIComponent(
        `Hello Nepal Trails! 🙏\n\nI am interested in booking a trip to *${destName}*.\n\nPlease send me more details and pricing. Thank you!`
      );
      window.open(`https://wa.me/+9779825376245?text=${msg}`, '_blank');
    });
  });

  // Package "Book Now" buttons
  const pkgBookBtns = {
    'pkg-ebc-btn':      'Everest Base Camp Trek (14 Days)',
    'pkg-ktm-btn':      'Kathmandu Valley Heritage Tour (7 Days)',
    'pkg-family-btn':   'Pokhara + Chitwan Family Special (5 Days)',
    'pkg-rafting-btn':  'Trishuli Rafting Adventure (3 Days)',
    'pkg-abc-btn':      'Annapurna Base Camp Trek (10 Days)',
    'pkg-lumbini-btn':  'Lumbini Pilgrimage Tour (4 Days)',
  };

  Object.entries(pkgBookBtns).forEach(function ([btnId, pkgName]) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const msg = encodeURIComponent(
        `Hello Nepal Trails! 🙏\n\nI would like to book the *${pkgName}* package.\n\nPlease share availability and pricing. Thank you!`
      );
      window.open(`https://wa.me/9779841234567?text=${msg}`, '_blank');
    });
  });

  // Activity "Inquire Now" buttons
  const activityBtns = {
    'act-trek-btn':     'Trekking',
    'act-para-btn':     'Paragliding in Pokhara',
    'act-raft-btn':     'White Water Rafting',
    'act-safari-btn':   'Jungle Safari',
    'act-flight-btn':   'Mountain Flight',
    'act-cultural-btn': 'Cultural Tour',
  };

  Object.entries(activityBtns).forEach(function ([btnId, actName]) {
    const btn = document.getElementById(btnId);
    if (!btn) return;

    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const msg = encodeURIComponent(
        `Hello Nepal Trails! 🙏\n\nI am interested in *${actName}*.\n\nPlease send me more details. Thank you!`
      );
      window.open(`https://wa.me/+9779825376245?text=${msg}`, '_blank');
    });
  });
});

/* ============================================================
   16. HERO BACKGROUND PARALLAX (subtle, performance-safe)
============================================================ */
(function initParallax() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  // Only run on desktop (skip for mobile performance)
  if (window.innerWidth < 768) return;

  window.addEventListener('scroll', throttle(function () {
    const scrollY = window.scrollY;
    const heroHeight = document.querySelector('.hero').offsetHeight;

    if (scrollY < heroHeight) {
      const translateY = scrollY * 0.35;
      heroBg.style.transform = `translateY(${translateY}px)`;
    }
  }, 16), { passive: true });
})();

/* ============================================================
   17. SCROLL INDICATOR — HIDE AFTER SCROLL
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const indicator = document.getElementById('scroll-indicator');
  if (!indicator) return;

  const hideIndicator = throttle(function () {
    if (window.scrollY > 100) {
      indicator.style.opacity = '0';
      indicator.style.pointerEvents = 'none';
      window.removeEventListener('scroll', hideIndicator);
    }
  }, 100);

  window.addEventListener('scroll', hideIndicator, { passive: true });
  indicator.style.transition = 'opacity 0.4s ease';
});

/* ============================================================
   18. ACTIVE YEAR IN FOOTER (Dynamic)
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  const footerYear = document.querySelector('.footer-bottom p');
  if (footerYear) {
    const year = new Date().getFullYear();
    footerYear.textContent = footerYear.textContent.replace('2024', year);
  }
});

/* ============================================================
   19. DESTINATION IMAGE LAZY LOAD ERROR FALLBACK
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  // Provide gradient fallback for any background-image that fails
  const bgDivs = document.querySelectorAll('[style*="background-image"]');

  bgDivs.forEach(function (div) {
    const style    = div.getAttribute('style');
    const urlMatch = style && style.match(/url\(['"]?([^'"]+)['"]?\)/);
    if (!urlMatch) return;

    const url = urlMatch[1];
    const img = new Image();

    img.onerror = function () {
      // Replace with beautiful gradient fallback
      div.style.backgroundImage = [
        'linear-gradient(135deg, #1B4F72 0%, #2E86C1 50%, #D35400 100%)'
      ].join(',');
    };

    img.src = url;
  });
});

/* ============================================================
   20. SMOOTH PAGE LOAD TRANSITION
============================================================ */
(function () {
  document.documentElement.style.opacity = '0';
  document.documentElement.style.transition = 'opacity 0.4s ease';

  window.addEventListener('load', function () {
    document.documentElement.style.opacity = '1';
  });
})();
