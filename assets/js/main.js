document.addEventListener('DOMContentLoaded', () => {
  // Add 'reveal' class to elements we want to animate on scroll
  const revealElements = document.querySelectorAll('.section-title, .timeline-item, .skill-card, .education-card, .project-card, .soft-skill-item, .cert-card');
  
  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  // Setup Intersection Observer
  const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  revealElements.forEach(el => {
    revealOnScroll.observe(el);
  });

  // Analytics: Track when sections are viewed and time spent
  const sectionObserverOptions = {
    threshold: 0.3 // Trigger when 30% of the section is visible
  };

  const viewedSections = new Set();
  const sectionEntryTimes = {};

  const sectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      const sectionId = entry.target.getAttribute('id');
      if (!sectionId) return;

      if (entry.isIntersecting) {
        // Track section view only once
        if (!viewedSections.has(sectionId) && window.firebaseLogEvent) {
          window.firebaseLogEvent('section_view', { section_name: sectionId });
          viewedSections.add(sectionId);
        }
        // Record the time they started looking at this section
        sectionEntryTimes[sectionId] = Date.now();
      } else {
        // When they leave the section, calculate how long they looked at it
        if (sectionEntryTimes[sectionId]) {
          const timeSpentSeconds = Math.round((Date.now() - sectionEntryTimes[sectionId]) / 1000);
          // Only log if they spent at least 2 seconds (filters out fast scrolling)
          if (timeSpentSeconds >= 2 && window.firebaseLogEvent) {
            window.firebaseLogEvent('section_time_spent', { 
              section_name: sectionId,
              time_spent_seconds: timeSpentSeconds 
            });
          }
          delete sectionEntryTimes[sectionId];
        }
      }
    });
  }, sectionObserverOptions);

  document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Offset for fixed header
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // Theme Toggle Logic
  const themeToggleBtn = document.getElementById('themeToggle');
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let currentTheme = document.documentElement.getAttribute('data-theme');
      let targetTheme = 'light';
      
      if (currentTheme === 'dark') {
        targetTheme = 'light';
        document.documentElement.removeAttribute('data-theme');
      } else {
        targetTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      
      localStorage.setItem('theme', targetTheme);
      
      // Analytics: Track theme toggling
      if (window.firebaseLogEvent) {
        window.firebaseLogEvent('theme_change', {
          theme: targetTheme
        });
      }
    });
  }

  // Analytics: Track outbound link clicks (like GitHub buttons)
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.firebaseLogEvent) {
        const url = this.getAttribute('href');
        const linkText = this.innerText.trim();
        window.firebaseLogEvent('outbound_click', {
          link_url: url,
          link_text: linkText
        });
      }
    });
  });

  // Analytics: Track contact interactions (Email and Phone clicks)
  document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
      if (window.firebaseLogEvent) {
        const type = this.getAttribute('href').startsWith('mailto:') ? 'email' : 'phone';
        window.firebaseLogEvent('contact_click', {
          contact_type: type
        });
      }
    });
  });
});
