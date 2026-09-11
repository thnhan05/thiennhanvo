// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-list li a');
  const sections = [];

  // Map links to section targets
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        sections.push({ link, target, id: href });
      }
    }
  });

  let isClickScrolling = false;
  let clickScrollTimeout = null;

  function setActiveLink(activeLink) {
    navLinks.forEach(l => l.classList.remove('active'));
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Handle Tab Click
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      e.preventDefault();

      const target = document.querySelector(href);
      if (!target) return;

      // 1. Create Ripple Effect at Click Coordinates
      const rect = link.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.classList.add('nav-ripple');
      const size = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      link.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      // 2. Add Pop Bounce Animation
      link.classList.remove('tab-pop');
      void link.offsetWidth; // Force reflow
      link.classList.add('tab-pop');

      // 3. Immediately set Active State
      setActiveLink(link);
      isClickScrolling = true;
      clearTimeout(clickScrollTimeout);

      // 4. Smooth Scroll with Fixed Header Offset
      const headerOffset = 70;
      let targetTop = 0;
      if (href !== '#top') {
        const rectTop = target.getBoundingClientRect().top;
        targetTop = rectTop + window.pageYOffset - headerOffset;
      }

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });

      // 5. Trigger Target Section Title Highlight Animation
      const sectionTitle = target.querySelector('.section-title') || target;
      if (sectionTitle) {
        setTimeout(() => {
          sectionTitle.classList.remove('section-highlight-title');
          void sectionTitle.offsetWidth;
          sectionTitle.classList.add('section-highlight-title');
        }, 350);
      }

      // Re-enable scroll tracking after smooth scroll completes
      clickScrollTimeout = setTimeout(() => {
        isClickScrolling = false;
      }, 750);
    });
  });

  // Scrollspy: Automatically highlight active tab during manual scrolling
  function updateActiveOnScroll() {
    if (isClickScrolling) return;

    const scrollY = window.pageYOffset;
    const headerOffset = 90;

    // Check if near top
    if (scrollY < 120) {
      const topLink = document.querySelector('.nav-list li a[href="#top"]');
      if (topLink) setActiveLink(topLink);
      return;
    }

    // Check if scrolled near bottom of page
    if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 50) {
      const lastSection = sections[sections.length - 1];
      if (lastSection) {
        setActiveLink(lastSection.link);
        return;
      }
    }

    // Find section currently in view
    let currentLink = null;
    for (const { link, target, id } of sections) {
      if (id === '#top') continue;
      const top = target.getBoundingClientRect().top + scrollY - headerOffset;
      const height = target.offsetHeight;
      if (scrollY >= top - 20 && scrollY < top + height) {
        currentLink = link;
        break;
      }
    }

    if (currentLink) {
      setActiveLink(currentLink);
    }
  }

  window.addEventListener('scroll', updateActiveOnScroll, { passive: true });
  updateActiveOnScroll(); // Initial call
});
