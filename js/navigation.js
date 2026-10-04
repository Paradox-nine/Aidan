/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   NAVIGATION JAVASCRIPT (js/navigation.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNavigation();
  highlightActiveNavLink();
});

function initMobileNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');

  if (!hamburger || !navMenu) return;

  // Ensure hamburger icon content is present
  if (!hamburger.querySelector('.hamburger-box')) {
    hamburger.innerHTML = `
      <span class="hamburger-box">
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </span>
    `;
  }

  // Create mobile overlay backdrop if missing
  let mobileOverlay = document.querySelector('.mobile-nav-overlay');
  if (!mobileOverlay) {
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-nav-overlay';
    document.body.appendChild(mobileOverlay);
  }

  // Create mobile menu close button inside menu if missing
  if (!navMenu.querySelector('.mobile-menu-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-menu-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close Menu');
    navMenu.prepend(closeBtn);

    closeBtn.addEventListener('click', toggleMobileMenu);
  }

  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('active');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    hamburger.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu when clicking standard nav links or dropdown items
  const menuLinks = navMenu.querySelectorAll('a:not(.dropdown > .nav-link)');
  menuLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  // Mobile Dropdown Accordion Behavior for "Departments"
  const dropdownToggleLinks = document.querySelectorAll('.dropdown > .nav-link');
  dropdownToggleLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const dropdownParent = link.closest('.dropdown');
        dropdownParent.classList.toggle('mobile-open');
      }
    });
  });

  // Handle window resize back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
      closeMobileMenu();
    }
  });
}

function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Check match
    if (currentPath.endsWith(href) || (href === 'index.html' && (currentPath.endsWith('/') || currentPath.endsWith('/WYTU/')))) {
      link.classList.add('active');
      const dropdownParent = link.closest('.dropdown');
      if (dropdownParent) {
        const parentLink = dropdownParent.querySelector('.nav-link');
        if (parentLink) parentLink.classList.add('active');
      }
    }
  });
}
