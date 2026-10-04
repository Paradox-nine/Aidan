/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   EVENTS PUBLIC JAVASCRIPT (js/events.js)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPublicEventsPage();
  initEventDetailPage();
});

function resolveImagePath(path) {
  if (!path) return '../images/events/sample-1.svg';
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const cleanPath = path.replace(/^(\.\.\/|\.\/)+/, '');
  return typeof getCorrectPath === 'function' ? getCorrectPath(cleanPath) : cleanPath;
}

function initPublicEventsPage() {
  const eventsGrid = document.getElementById('public-events-grid');
  if (!eventsGrid) return;

  const categoryBtns = document.querySelectorAll('.event-cat-btn');
  const searchInput = document.getElementById('events-page-search');

  let currentCategory = 'all';
  let searchQuery = '';

  function renderEvents() {
    let events = [];
    if (typeof eventService !== 'undefined') {
      events = eventService.getPublishedEvents();
    } else if (typeof INITIAL_EVENTS !== 'undefined') {
      events = INITIAL_EVENTS.filter(e => e.status === 'published');
    }

    if (currentCategory !== 'all') {
      events = events.filter(e => e.category === currentCategory);
    }

    if (searchQuery) {
      events = events.filter(e =>
        e.title.toLowerCase().includes(searchQuery) ||
        e.description.toLowerCase().includes(searchQuery) ||
        e.location.toLowerCase().includes(searchQuery)
      );
    }

    if (events.length === 0) {
      eventsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-state-icon"></div>
          <div class="empty-state-title">No events available.</div>
          <div class="empty-state-desc">There are no published events matching your selected filter or search term.</div>
        </div>
      `;
      return;
    }

    let html = '';
    events.forEach(event => {
      const rawImg = (event.images && event.images.length > 0) ? event.images[0] : 'images/events/sample-1.svg';
      const heroImg = resolveImagePath(rawImg);
      const eventDetailUrl = `event.html?id=${event.id}`;

      html += `
        <article class="event-card">
          <div class="event-card-img-wrap">
            <a href="${eventDetailUrl}">
              <img src="${heroImg}" alt="${escapeHTML(event.title)}" loading="lazy" />
            </a>
            <span class="event-card-category">${escapeHTML(event.category)}</span>
          </div>
          <div class="event-card-body">
            <div class="event-card-meta">
              <span class="event-card-meta-item"> ${escapeHTML(event.date)}</span>
              <span class="event-card-meta-item"> ${escapeHTML(event.location.split('&')[0])}</span>
            </div>
            <h3 class="event-card-title">
              <a href="${eventDetailUrl}">${escapeHTML(event.title)}</a>
            </h3>
            <p class="event-card-desc">${escapeHTML(event.description)}</p>
            <div class="event-card-footer">
              <span> ${escapeHTML(event.time)}</span>
              <a href="${eventDetailUrl}" class="btn btn-outline btn-sm">Read More &rarr;</a>
            </div>
          </div>
        </article>
      `;
    });

    eventsGrid.innerHTML = html;
  }

  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderEvents();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      renderEvents();
    });
  }

  renderEvents();
}

function initEventDetailPage() {
  const detailContainer = document.getElementById('event-detail-container');
  if (!detailContainer) return;

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');
  const eventSlug = urlParams.get('slug');

  let event = null;
  if (typeof eventService !== 'undefined') {
    if (eventId) event = eventService.getEventById(eventId);
    else if (eventSlug) event = eventService.getAllEvents().find(e => e.slug === eventSlug);
  } else if (typeof INITIAL_EVENTS !== 'undefined') {
    if (eventId) event = INITIAL_EVENTS.find(e => e.id === eventId);
    else if (eventSlug) event = INITIAL_EVENTS.find(e => e.slug === eventSlug);
  }

  if (!event || event.status !== 'published') {
    detailContainer.innerHTML = `
      <div class="empty-state" style="margin: 4rem 0;">
        <div class="empty-state-icon"></div>
        <div class="empty-state-title">Event Not Found</div>
        <div class="empty-state-desc">The requested event announcement is either unpublished or does not exist.</div>
        <a href="index.html" class="btn btn-primary">&larr; Back to Events</a>
      </div>
    `;
    return;
  }

  document.title = `${event.title} - WYTU Events`;

  let galleryHTML = '';
  const images = (event.images && event.images.length > 0) ? event.images : ['images/events/sample-1.svg'];
  const resolvedImgs = images.map(resolveImagePath);

  if (resolvedImgs.length === 1) {
    galleryHTML = `
      <div class="event-gallery-wrap gallery-layout-1">
        <img src="${resolvedImgs[0]}" alt="${escapeHTML(event.title)}" />
      </div>
    `;
  } else if (resolvedImgs.length === 2) {
    galleryHTML = `
      <div class="event-gallery-wrap gallery-layout-2">
        <img src="${resolvedImgs[0]}" alt="${escapeHTML(event.title)} - Image 1" />
        <img src="${resolvedImgs[1]}" alt="${escapeHTML(event.title)} - Image 2" />
      </div>
    `;
  } else if (resolvedImgs.length >= 3) {
    galleryHTML = `
      <div class="event-gallery-wrap gallery-layout-3">
        <img src="${resolvedImgs[0]}" class="gallery-main-img" alt="${escapeHTML(event.title)} - Main Image" />
        <div class="gallery-sub-grid">
          <img src="${resolvedImgs[1]}" alt="${escapeHTML(event.title)} - Image 2" />
          <img src="${resolvedImgs[2]}" alt="${escapeHTML(event.title)} - Image 3" />
        </div>
      </div>
    `;
  }

  detailContainer.innerHTML = `
    <div class="event-detail-header">
      <span class="event-detail-category">${escapeHTML(event.category)}</span>
      <h1 class="event-detail-title">${escapeHTML(event.title)}</h1>
      <div class="event-meta-bar">
        <div class="event-meta-block">
          <div class="event-meta-icon"></div>
          <div>
            <div class="event-meta-label">Date</div>
            <div class="event-meta-value">${escapeHTML(event.date)}</div>
          </div>
        </div>
        <div class="event-meta-block">
          <div class="event-meta-icon"></div>
          <div>
            <div class="event-meta-label">Time</div>
            <div class="event-meta-value">${escapeHTML(event.time)}</div>
          </div>
        </div>
        <div class="event-meta-block">
          <div class="event-meta-icon"></div>
          <div>
            <div class="event-meta-label">Location</div>
            <div class="event-meta-value">${escapeHTML(event.location)}</div>
          </div>
        </div>
      </div>
    </div>

    ${galleryHTML}

    <div class="event-content-body">
      <p style="font-weight:600; font-size:1.2rem; color:var(--navy); margin-bottom:1.5rem; border-left:4px solid var(--primary); padding-left:1rem;">
        ${escapeHTML(event.description)}
      </p>
      <div style="white-space: pre-line;">
        ${escapeHTML(event.fullContent || event.description)}
      </div>
    </div>

    <div style="margin-top:3rem; padding-top:2rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
      <a href="index.html" class="btn btn-outline">&larr; Back to Events Announcements</a>
    </div>
  `;

  renderRelatedEvents(event.id);
}

function renderRelatedEvents(currentEventId) {
  const relatedGrid = document.getElementById('related-events-grid');
  if (!relatedGrid) return;

  let published = [];
  if (typeof eventService !== 'undefined') {
    published = eventService.getPublishedEvents();
  } else if (typeof INITIAL_EVENTS !== 'undefined') {
    published = INITIAL_EVENTS.filter(e => e.status === 'published');
  }

  const otherEvents = published.filter(e => e.id !== currentEventId).slice(0, 3);

  if (otherEvents.length === 0) {
    relatedGrid.parentElement.style.display = 'none';
    return;
  }

  let html = '';
  otherEvents.forEach(evt => {
    const rawImg = (evt.images && evt.images.length > 0) ? evt.images[0] : 'images/events/sample-1.svg';
    const heroImg = resolveImagePath(rawImg);
    html += `
      <div class="card">
        <div class="card-img-wrap">
          <img src="${heroImg}" alt="${escapeHTML(evt.title)}" />
        </div>
        <div class="card-body">
          <div style="font-size:0.8rem; font-weight:700; color:var(--primary); text-transform:uppercase; margin-bottom:0.25rem;">${escapeHTML(evt.category)}</div>
          <h4 class="card-title" style="font-size:1.05rem;">
            <a href="event.html?id=${evt.id}" style="color:var(--navy);">${escapeHTML(evt.title)}</a>
          </h4>
          <p class="card-text" style="font-size:0.85rem;">${escapeHTML(evt.description.substring(0, 80))}...</p>
          <a href="event.html?id=${evt.id}" class="btn btn-outline btn-sm">Read Announcement &rarr;</a>
        </div>
      </div>
    `;
  });

  relatedGrid.innerHTML = html;
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
