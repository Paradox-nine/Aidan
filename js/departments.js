/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   DEPARTMENTS JAVASCRIPT (js/departments.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initDepartmentsListing();
  initRelatedDepartments();
});

function initDepartmentsListing() {
  const container = document.getElementById('departments-grid-container');
  if (!container || typeof DEPARTMENTS_DATA === 'undefined') return;

  const filterBtns = document.querySelectorAll('.dept-filter-btn');

  function renderGrid(filter = 'all') {
    container.innerHTML = '';

    let filtered = DEPARTMENTS_DATA;
    if (filter === 'core') {
      filtered = DEPARTMENTS_DATA.filter(d => d.category === 'Core Engineering Major');
    } else if (filter === 'supportive') {
      filtered = DEPARTMENTS_DATA.filter(d => d.category === 'Supportive Academic Department');
    }

    if (filtered.length === 0) {
      container.innerHTML = `<div class="empty-state"><div class="empty-state-title">No matching departments found.</div></div>`;
      return;
    }

    // Render grouped by Category if 'all'
    if (filter === 'all') {
      const coreMajors = filtered.filter(d => d.category === 'Core Engineering Major');
      const supportiveDepts = filtered.filter(d => d.category === 'Supportive Academic Department');

      let html = `
        <div class="dept-category-group">
          <h2 class="dept-category-heading">CORE ENGINEERING MAJORS (${coreMajors.length})</h2>
          <div class="grid-3">
            ${coreMajors.map(renderDepartmentCard).join('')}
          </div>
        </div>
        <div class="dept-category-group" style="margin-top:4rem;">
          <h2 class="dept-category-heading">SUPPORTIVE ACADEMIC DEPARTMENTS (${supportiveDepts.length})</h2>
          <div class="grid-2">
            ${supportiveDepts.map(renderDepartmentCard).join('')}
          </div>
        </div>
      `;
      container.innerHTML = html;
    } else {
      let html = `<div class="grid-3">${filtered.map(renderDepartmentCard).join('')}</div>`;
      container.innerHTML = html;
    }
  }

  function renderDepartmentCard(dept) {
    return `
      <div class="dept-card">
        <div class="dept-card-icon">${dept.icon}</div>
        <h3 class="dept-card-title">${escapeHTML(dept.name)}</h3>
        <div class="dept-card-myanmar">${escapeHTML(dept.myanmarName)}</div>
        <p class="dept-card-desc">${escapeHTML(dept.description)}</p>
        <a href="${dept.slug}.html" class="dept-card-link">Explore Department &rarr;</a>
      </div>
    `;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      renderGrid(filterValue);
    });
  });

  renderGrid('all');
}

function initRelatedDepartments() {
  const relatedContainer = document.getElementById('related-departments-grid');
  if (!relatedContainer || typeof DEPARTMENTS_DATA === 'undefined') return;

  const currentSlug = relatedContainer.getAttribute('data-current-slug');
  const otherDepts = DEPARTMENTS_DATA.filter(d => d.slug !== currentSlug);

  // Pick 3 random related departments
  const shuffled = [...otherDepts].sort(() => 0.5 - Math.random()).slice(0, 3);

  let html = '';
  shuffled.forEach(dept => {
    html += `
      <div class="card">
        <div class="card-body">
          <div style="font-size:1.8rem; margin-bottom:0.5rem;">${dept.icon}</div>
          <h4 class="card-title">${escapeHTML(dept.name)}</h4>
          <div style="color:var(--primary); font-weight:600; font-size:0.85rem; margin-bottom:0.75rem;">${escapeHTML(dept.myanmarName)}</div>
          <p class="card-text">${escapeHTML(dept.description.substring(0, 90))}...</p>
          <a href="${dept.slug}.html" class="btn btn-outline btn-sm">View Department &rarr;</a>
        </div>
      </div>
    `;
  });

  relatedContainer.innerHTML = html;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
