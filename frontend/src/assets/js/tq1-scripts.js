// TQ1 Sports Field Booking System - Landing Page Scripts

// Navbar Toggle
document.addEventListener('DOMContentLoaded', function() {
  // Get all "navbar-toggler" elements
  const navbarTogglers = document.querySelectorAll('.navbar-toggler');
  
  // Add a click event listener to each toggler
  navbarTogglers.forEach(toggler => {
    toggler.addEventListener('click', function() {
      // Toggle the "show" class on the navbar-collapse
      const target = document.querySelector(this.getAttribute('data-target'));
      if (target) {
        target.classList.toggle('show');
        
        // Toggle aria-expanded attribute
        const expanded = this.getAttribute('aria-expanded') === 'true' || false;
        this.setAttribute('aria-expanded', !expanded);
      }
    });
  });
  
  // Close the menu when a nav-link is clicked
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
        
        // Reset aria-expanded on all togglers
        const togglers = document.querySelectorAll('.navbar-toggler');
        togglers.forEach(toggler => {
          toggler.setAttribute('aria-expanded', 'false');
        });
      }
    });
  });
  
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 70, // Adjust for navbar height
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Active link highlighting based on scroll position
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Adjust for navbar height
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  // Update active link on scroll
  window.addEventListener('scroll', updateActiveLink);
  
  // Initialize active link on page load
  updateActiveLink();
});
