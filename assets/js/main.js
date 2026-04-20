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
