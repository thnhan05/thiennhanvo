/**
 * Vo Thien Nhan — Personal Academic Website
 * Interactions: Dark mode toggle, Smooth navigation & BibTeX toggles
 */

(function () {
  'use strict';

  // 1. Dark Mode Theme Controller
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-sun';
      }
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.className = 'fa-solid fa-moon';
      }
    }
  }

  // Detect initial theme: saved in localStorage or system preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    applyTheme('dark');
  }

  // Toggle button event listener
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // Listen to OS preference changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // 2. Smooth Scrolling with Offset for Anchor Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const headerOffset = 70; // Header height offset
        const elemPosition = targetElem.getBoundingClientRect().top;
        const offsetPosition = elemPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        if (history.pushState) {
          history.pushState(null, null, targetId);
        } else {
          window.location.hash = targetId;
        }
      }
    });
  });

  // 3. BibTeX Accordion Toggle & Copy Functionality
  document.querySelectorAll('.bibtex-toggle-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-target');
      if (!targetId) return;

      const bibtexBox = document.getElementById(targetId);
      if (bibtexBox) {
        const isShown = bibtexBox.classList.contains('show');
        bibtexBox.classList.toggle('show');
        this.setAttribute('aria-expanded', !isShown);
      }
    });
  });

  document.querySelectorAll('.btn-copy-bibtex').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const codeElem = this.closest('.bibtex-box').querySelector('pre');
      if (!codeElem) return;

      const textToCopy = codeElem.innerText;
      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalHtml = this.innerHTML;
        this.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
        this.classList.add('copied');
        setTimeout(() => {
          this.innerHTML = originalHtml;
          this.classList.remove('copied');
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy BibTeX: ', err);
      });
    });
  });

})();
