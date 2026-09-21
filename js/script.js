document.addEventListener('DOMContentLoaded', () => {
  initHeaderScrollState();
  initMobileNav();
  initSmoothScroll();
  initActiveNavOnScroll();
  initRevealOnScroll();
  initScrollTopButton();
  initCurrentYear();
});

/* Adds a border/background state to the header once the page is scrolled. */
function initHeaderScrollState() {
  const header = document.getElementById('site-header');
  if (!header) return;

  const updateState = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 8);
  };

  updateState();
  window.addEventListener('scroll', updateState, { passive: true });
}

/* Toggles the accessible mobile navigation menu. */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('primary-nav');
  if (!toggle || !nav) return;

  const closeNav = () => {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

/* Smoothly scrolls to in-page sections, accounting for the sticky header height. */
function initSmoothScroll() {
  const header = document.getElementById('site-header');
  const headerOffset = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* Highlights the nav link matching the section currently in view. */
function initActiveNavOnScroll() {
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = navLinks
    .map((link) => document.getElementById(link.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navLinks.find((item) => item.getAttribute('href') === `#${entry.target.id}`);
        if (!link) return;

        if (entry.isIntersecting) {
          navLinks.forEach((item) => item.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach((section) => observer.observe(section));
}

/* Reveals elements as they scroll into the viewport. */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

/* Shows a scroll-to-top button after the user scrolls past the hero. */
function initScrollTopButton() {
  const button = document.getElementById('scroll-top');
  if (!button) return;

  const updateVisibility = () => {
    button.classList.toggle('is-visible', window.scrollY > 480);
  };

  updateVisibility();
  window.addEventListener('scroll', updateVisibility, { passive: true });

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Keeps the footer copyright year current without manual edits. */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
