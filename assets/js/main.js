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

  // Analytics: Track when sections are viewed
  const sectionObserverOptions = {
    threshold: 0.3 // Trigger when 30% of the section is visible
  };

  const sectionObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        if (sectionId && window.firebaseLogEvent) {
          window.firebaseLogEvent('section_view', { section_name: sectionId });
          // Only track each section once per page load
          observer.unobserve(entry.target);
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
    });
  }
});
