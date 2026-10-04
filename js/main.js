/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   GLOBAL MAIN JAVASCRIPT (js/main.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initSearchSystem();
  initScrollEffects();
});

/* Search Interface Logic */
function initSearchSystem() {
  const searchTriggers = document.querySelectorAll('.btn-search-trigger, [data-action="open-search"]');

  if (searchTriggers.length === 0) return;

  // Create search modal HTML if it doesn't already exist in DOM
  if (!document.getElementById('search-modal-backdrop')) {
    const modalHTML = `
      <div id="search-modal-backdrop" class="search-modal-backdrop" role="dialog" aria-modal="true" aria-label="Website Search">
        <div class="search-modal">
          <div class="search-modal-header">
            <span style="font-size:1.2rem; margin-right:0.5rem;"></span>
            <input type="text" id="global-search-input" class="search-modal-input" placeholder="Search departments, programs, events, scholarships..." autocomplete="off" />
            <button type="button" id="search-modal-close" class="search-modal-close" aria-label="Close search">&times;</button>
          </div>
          <div id="global-search-results" class="search-modal-results">
            <div style="text-align:center; color:var(--text-muted); padding:2rem 0;">Type at least 2 characters to search...</div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  const modalBackdrop = document.getElementById('search-modal-backdrop');
  const searchInput = document.getElementById('global-search-input');
  const searchResults = document.getElementById('global-search-results');
  const closeBtn = document.getElementById('search-modal-close');

  function openSearchModal() {
    modalBackdrop.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
  }

  function closeSearchModal() {
    modalBackdrop.classList.remove('open');
    searchInput.value = '';
    searchResults.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:2rem 0;">Type at least 2 characters to search...</div>';
  }

  searchTriggers.forEach(btn => btn.addEventListener('click', openSearchModal));
  if (closeBtn) closeBtn.addEventListener('click', closeSearchModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeSearchModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
      closeSearchModal();
    }
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      if (query.length < 2) {
        searchResults.innerHTML = '<div style="text-align:center; color:var(--text-muted); padding:2rem 0;">Type at least 2 characters to search...</div>';
        return;
      }
      performGlobalSearch(query, searchResults);
    });
  }
}

/* Global Search Execution across Departments, Events, Programs, Scholarships, Research */
function performGlobalSearch(query, container) {
  let matches = [];

  // Search Departments
  if (typeof DEPARTMENTS_DATA !== 'undefined' && Array.isArray(DEPARTMENTS_DATA)) {
    DEPARTMENTS_DATA.forEach(dept => {
      if (dept.name.toLowerCase().includes(query) ||
          dept.myanmarName.includes(query) ||
          dept.description.toLowerCase().includes(query)) {
        matches.push({
          type: 'Department',
          title: dept.name,
          subTitle: dept.myanmarName,
          desc: dept.description,
          url: getCorrectPath(`departments/${dept.slug}.html`)
        });
      }
    });
  }

  // Search Events
  let eventsList = [];
  if (typeof eventService !== 'undefined') {
    eventsList = eventService.getPublishedEvents();
  } else if (typeof INITIAL_EVENTS !== 'undefined') {
    eventsList = INITIAL_EVENTS.filter(e => e.status === 'published');
  }

  eventsList.forEach(event => {
    if (event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)) {
      matches.push({
        type: 'Event',
        title: event.title,
        subTitle: `${event.date} | ${event.category}`,
        desc: event.description,
        url: getCorrectPath(`events/event.html?id=${event.id}`)
      });
    }
  });

  // Search Programs, Scholarships, Research static keywords
  const staticFeatures = [
    { type: 'Programs', title: 'Bachelor of Engineering Degree Programs', desc: 'WYTU 6-Year B.E. programs in 11 core engineering fields.', url: getCorrectPath('programs.html') },
    { type: 'Admissions', title: 'WYTU Undergraduate Admissions', desc: 'Admission requirements, entry qualifications, and application process.', url: getCorrectPath('admissions.html') },
    { type: 'Scholarships', title: 'University Scholarships & Financial Support', desc: 'Scholarships, academic awards, and student grants.', url: getCorrectPath('scholarships.html') },
    { type: 'Research', title: 'Research & Innovation Laboratories', desc: 'Advanced engineering research labs and student capstone projects.', url: getCorrectPath('research.html') }
  ];

  staticFeatures.forEach(item => {
    if (item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query)) {
      matches.push(item);
    }
  });

  if (matches.length === 0) {
    container.innerHTML = `<div class="empty-state" style="padding:1.5rem 0; border:none;"><div class="empty-state-title">No matching information found.</div><div class="empty-state-desc">Try searching for keywords like "Civil", "Robotics", "Scholarships", or "Admissions".</div></div>`;
    return;
  }

  let html = '';
  matches.forEach(item => {
    html += `
      <a href="${item.url}" class="search-result-item">
        <span class="search-result-type">${item.type}</span>
        <div class="search-result-title">${escapeHTML(item.title)} ${item.subTitle ? `<small style="color:var(--primary); font-weight:normal;">(${escapeHTML(item.subTitle)})</small>` : ''}</div>
        <div class="search-result-desc">${escapeHTML(item.desc.substring(0, 110))}...</div>
      </a>
    `;
  });

  container.innerHTML = html;
}

/* Helper to generate relative path whether currently inside a subfolder or root */
function getCorrectPath(targetRelativePath) {
  const currentPath = window.location.pathname;
  const isSubfolder = currentPath.includes('/departments/') || currentPath.includes('/events/') || currentPath.includes('/admin/');
  return isSubfolder ? `../${targetRelativePath}` : targetRelativePath;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function initScrollEffects() {
  // Sticky header animation or scroll tweaks if needed
}
