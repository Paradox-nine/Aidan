/* ============================================================
   WEST YANGON TECHNOLOGICAL UNIVERSITY (WYTU)
   ADMIN JS & BACKEND-READY SERVICE LAYER (js/admin.js)
   ============================================================ */

const authService = {
  login: async function(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email && password && password.length >= 6) {
          const user = {
            id: "usr-001",
            name: "WYTU Administrator",
            email: email,
            role: "admin"
          };
          localStorage.setItem('wytu_admin_session', JSON.stringify(user));
          resolve(user);
        } else {
          reject(new Error("Invalid email or password. Password must be at least 6 characters."));
        }
      }, 300);
    });
  },

  logout: function() {
    localStorage.removeItem('wytu_admin_session');
    window.location.href = '../adminwytulogin/index.html';
  },

  getCurrentUser: function() {
    const session = localStorage.getItem('wytu_admin_session');
    return session ? JSON.parse(session) : null;
  },

  isAuthenticated: function() {
    return this.getCurrentUser() !== null;
  },

  requireAuth: function() {
    if (!this.isAuthenticated()) {
      window.location.href = '../adminwytulogin/index.html';
    }
  }
};

const eventService = {
  STORAGE_KEY: 'wytu_events_db',

  _getStore: function() {
    let data = localStorage.getItem(this.STORAGE_KEY);
    if (data && data.includes('../images/events/')) {
      localStorage.removeItem(this.STORAGE_KEY);
      data = null;
    }
    if (!data) {
      const initial = (typeof INITIAL_EVENTS !== 'undefined') ? INITIAL_EVENTS : [];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  _saveStore: function(events) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(events));
  },

  getAllEvents: function() {
    return this._getStore();
  },

  getPublishedEvents: function() {
    return this._getStore().filter(e => e.status === 'published');
  },

  getEventById: function(id) {
    return this._getStore().find(e => e.id === id);
  },

  createEvent: function(eventData) {
    const events = this._getStore();
    const newId = `event-${Date.now().toString().slice(-6)}`;
    const newSlug = eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newEvent = {
      id: newId,
      slug: newSlug,
      title: eventData.title,
      description: eventData.description,
      fullContent: eventData.fullContent || eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      category: eventData.category,
      images: eventData.images && eventData.images.length > 0 ? eventData.images : ['images/events/sample-1.svg'],
      status: eventData.status || 'published',
      createdAt: new Date().toISOString()
    };

    events.unshift(newEvent);
    this._saveStore(events);
    return newEvent;
  },

  updateEvent: function(id, updatedData) {
    const events = this._getStore();
    const index = events.findIndex(e => e.id === id);
    if (index === -1) return null;

    events[index] = {
      ...events[index],
      ...updatedData,
      slug: updatedData.title ? updatedData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : events[index].slug,
      updatedAt: new Date().toISOString()
    };

    this._saveStore(events);
    return events[index];
  },

  deleteEvent: function(id) {
    let events = this._getStore();
    events = events.filter(e => e.id !== id);
    this._saveStore(events);
    return true;
  },

  togglePublishStatus: function(id) {
    const events = this._getStore();
    const event = events.find(e => e.id === id);
    if (event) {
      event.status = event.status === 'published' ? 'draft' : 'published';
      this._saveStore(events);
      return event.status;
    }
    return null;
  }
};

const storageService = {
  uploadImage: function(file) {
    return new Promise((resolve, reject) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type.toLowerCase())) {
        return reject(new Error('Invalid file type. Only JPG, PNG, and WEBP images are allowed.'));
      }

      if (file.size > 5 * 1024 * 1024) {
        return reject(new Error('File size exceeds the 5MB limit. Please select a smaller image.'));
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }
};

function resolveAdminImagePath(path) {
  if (!path) return '../images/events/sample-1.svg';
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  const cleanPath = path.replace(/^(\.\.\/|\.\/)+/, '');
  return '../' + cleanPath;
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminHeaderUser();

  if (document.getElementById('admin-login-form')) {
    initAdminLoginPage();
  }
  if (document.getElementById('admin-dashboard-stats')) {
    authService.requireAuth();
    initAdminDashboard();
  }
  if (document.getElementById('admin-events-table-body')) {
    authService.requireAuth();
    initAdminEventsList();
  }
  if (document.getElementById('admin-create-event-form')) {
    authService.requireAuth();
    initAdminCreateEventForm();
  }
  if (document.getElementById('admin-edit-event-form')) {
    authService.requireAuth();
    initAdminEditEventForm();
  }
});

function initAdminHeaderUser() {
  const userNameEl = document.querySelector('.admin-user-name');
  const logoutBtn = document.querySelector('.btn-admin-logout');

  const user = authService.getCurrentUser();
  if (userNameEl && user) {
    userNameEl.textContent = user.name || user.email;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => authService.logout());
  }
}

function initAdminLoginPage() {
  const form = document.getElementById('admin-login-form');
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const passInput = document.getElementById('admin-password-input');
  const alertEl = document.getElementById('admin-login-alert');

  if (togglePassBtn && passInput) {
    togglePassBtn.addEventListener('click', () => {
      const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passInput.setAttribute('type', type);
      togglePassBtn.textContent = type === 'password' ? 'Show Password' : 'Hide Password';
    });
  }


  const directBtn = document.getElementById('login-btn-direct');
  if (directBtn) {
    directBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email-input').value.trim();
      const password = passInput.value.trim();
      try {
        await authService.login(email, password);
        window.location.href = '../admin/index.html';
      } catch (err) {
        if (alertEl) {
          alertEl.textContent = err.message;
          alertEl.className = 'admin-alert admin-alert-danger';
          alertEl.style.display = 'block';
        }
      }
    });
  }

if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('admin-email-input').value.trim();
      const password = passInput.value.trim();
      const submitBtn = form.querySelector('button[type="submit"]');

      if (alertEl) {
        alertEl.style.display = 'none';
        alertEl.className = 'admin-alert';
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Authenticating...';

      try {
        await authService.login(email, password);
        window.location.href = '../admin/index.html';
      } catch (err) {
        if (alertEl) {
          alertEl.textContent = err.message;
          alertEl.className = 'admin-alert admin-alert-danger';
          alertEl.style.display = 'block';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'Login to Dashboard';
      }
    });
  }
}

function initAdminDashboard() {
  const allEvents = eventService.getAllEvents();
  const publishedCount = allEvents.filter(e => e.status === 'published').length;
  const draftCount = allEvents.filter(e => e.status === 'draft').length;

  const totalEl = document.getElementById('stat-total-events');
  const pubEl = document.getElementById('stat-published-events');
  const draftEl = document.getElementById('stat-draft-events');
  const recentTableBody = document.getElementById('admin-recent-events-body');

  if (totalEl) totalEl.textContent = allEvents.length;
  if (pubEl) pubEl.textContent = publishedCount;
  if (draftEl) draftEl.textContent = draftCount;

  if (recentTableBody) {
    const recent = allEvents.slice(0, 5);
    if (recent.length === 0) {
      recentTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No events found.</td></tr>';
      return;
    }

    let html = '';
    recent.forEach(evt => {
      const rawThumb = (evt.images && evt.images.length > 0) ? evt.images[0] : 'images/events/sample-1.svg';
      const thumb = resolveAdminImagePath(rawThumb);
      html += `
        <tr>
          <td><img src="${thumb}" class="admin-table-thumb" alt="${escapeHTML(evt.title)}" /></td>
          <td><strong>${escapeHTML(evt.title)}</strong></td>
          <td>${escapeHTML(evt.date)}</td>
          <td><span class="badge badge-${evt.status}">${evt.status}</span></td>
          <td>
            <a href="edit-event.html?id=${evt.id}" class="btn-action btn-action-edit">Edit</a>
          </td>
        </tr>
      `;
    });
    recentTableBody.innerHTML = html;
  }
}

function initAdminEventsList() {
  const tableBody = document.getElementById('admin-events-table-body');
  const statusFilter = document.getElementById('admin-status-filter');
  const deleteModal = document.getElementById('delete-modal');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');

  let pendingDeleteId = null;

  function renderTable() {
    let events = eventService.getAllEvents();
    const filterVal = statusFilter ? statusFilter.value : 'all';

    if (filterVal !== 'all') {
      events = events.filter(e => e.status === filterVal);
    }

    if (events.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem;">No events found matching the selected status.</td></tr>`;
      return;
    }

    let html = '';
    events.forEach(evt => {
      const rawThumb = (evt.images && evt.images.length > 0) ? evt.images[0] : 'images/events/sample-1.svg';
      const thumb = resolveAdminImagePath(rawThumb);
      html += `
        <tr>
          <td><img src="${thumb}" class="admin-table-thumb" alt="${escapeHTML(evt.title)}" /></td>
          <td>
            <div style="font-weight:700; color:var(--navy);">${escapeHTML(evt.title)}</div>
            <div style="font-size:0.8rem; color:var(--text-muted);">${escapeHTML(evt.location)}</div>
          </td>
          <td>${escapeHTML(evt.date)}</td>
          <td><span class="badge badge-navy">${escapeHTML(evt.category)}</span></td>
          <td>
            <span class="badge badge-${evt.status}">${evt.status}</span>
          </td>
          <td>
            <div class="action-btns">
              <button type="button" class="btn-action btn-action-toggle" data-action="toggle-status" data-id="${evt.id}">
                ${evt.status === 'published' ? 'Unpublish' : 'Publish'}
              </button>
              <a href="edit-event.html?id=${evt.id}" class="btn-action btn-action-edit">Edit</a>
              <button type="button" class="btn-action btn-action-delete" data-action="trigger-delete" data-id="${evt.id}">Delete</button>
            </div>
          </td>
        </tr>
      `;
    });

    tableBody.innerHTML = html;

    tableBody.querySelectorAll('[data-action="toggle-status"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        eventService.togglePublishStatus(id);
        renderTable();
      });
    });

    tableBody.querySelectorAll('[data-action="trigger-delete"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        pendingDeleteId = e.target.getAttribute('data-id');
        if (deleteModal) deleteModal.classList.add('active');
      });
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener('change', renderTable);
  }

  if (cancelDeleteBtn && deleteModal) {
    cancelDeleteBtn.addEventListener('click', () => {
      pendingDeleteId = null;
      deleteModal.classList.remove('active');
    });
  }

  if (confirmDeleteBtn && deleteModal) {
    confirmDeleteBtn.addEventListener('click', () => {
      if (pendingDeleteId) {
        eventService.deleteEvent(pendingDeleteId);
        pendingDeleteId = null;
        deleteModal.classList.remove('active');
        renderTable();
      }
    });
  }

  renderTable();
}

function initAdminCreateEventForm() {
  const form = document.getElementById('admin-create-event-form');
  const fileInput = document.getElementById('event-images-input');
  const previewGrid = document.getElementById('image-preview-grid');
  const errorAlert = document.getElementById('form-error-alert');

  let selectedImageUrls = [];

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (errorAlert) errorAlert.style.display = 'none';

      if (selectedImageUrls.length + files.length > 3) {
        if (errorAlert) {
          errorAlert.textContent = 'Maximum 3 images allowed per event announcement.';
          errorAlert.style.display = 'block';
        }
        fileInput.value = '';
        return;
      }

      for (const file of files) {
        try {
          const dataUrl = await storageService.uploadImage(file);
          selectedImageUrls.push(dataUrl);
        } catch (err) {
          if (errorAlert) {
            errorAlert.textContent = err.message;
            errorAlert.style.display = 'block';
          }
        }
      }

      renderImagePreviews();
      fileInput.value = '';
    });
  }

  function renderImagePreviews() {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';

    selectedImageUrls.forEach((url, idx) => {
      const card = document.createElement('div');
      card.className = 'preview-card';
      card.innerHTML = `
        <img src="${url}" alt="Preview ${idx + 1}" />
        <button type="button" class="btn-remove-img" data-idx="${idx}" title="Remove image">&times;</button>
      `;

      card.querySelector('.btn-remove-img').addEventListener('click', () => {
        selectedImageUrls.splice(idx, 1);
        renderImagePreviews();
      });

      previewGrid.appendChild(card);
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value.trim();
    const description = document.getElementById('event-description').value.trim();
    const fullContent = document.getElementById('event-full-content').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value.trim();
    const location = document.getElementById('event-location').value.trim();
    const category = document.getElementById('event-category').value;
    const status = document.getElementById('event-status').value;

    if (!title || !description || !date || !time || !location) {
      if (errorAlert) {
        errorAlert.textContent = 'Please fill out all required fields marked with *';
        errorAlert.style.display = 'block';
      }
      return;
    }

    if (selectedImageUrls.length === 0) {
      selectedImageUrls.push('images/events/sample-1.svg');
    }

    eventService.createEvent({
      title,
      description,
      fullContent,
      date,
      time,
      location,
      category,
      status,
      images: selectedImageUrls
    });

    window.location.href = 'events.html';
  });
}

function initAdminEditEventForm() {
  const form = document.getElementById('admin-edit-event-form');
  const fileInput = document.getElementById('event-images-input');
  const previewGrid = document.getElementById('image-preview-grid');
  const errorAlert = document.getElementById('form-error-alert');

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (!eventId) {
    window.location.href = 'events.html';
    return;
  }

  const existingEvent = eventService.getEventById(eventId);
  if (!existingEvent) {
    window.location.href = 'events.html';
    return;
  }

  document.getElementById('event-id-hidden').value = existingEvent.id;
  document.getElementById('event-title').value = existingEvent.title;
  document.getElementById('event-description').value = existingEvent.description;
  document.getElementById('event-full-content').value = existingEvent.fullContent || existingEvent.description;
  document.getElementById('event-date').value = existingEvent.date;
  document.getElementById('event-time').value = existingEvent.time;
  document.getElementById('event-location').value = existingEvent.location;
  document.getElementById('event-category').value = existingEvent.category;
  document.getElementById('event-status').value = existingEvent.status;

  let currentImages = [...(existingEvent.images || [])];

  function renderImagePreviews() {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';

    currentImages.forEach((url, idx) => {
      const card = document.createElement('div');
      card.className = 'preview-card';
      const resolved = resolveAdminImagePath(url);
      card.innerHTML = `
        <img src="${resolved}" alt="Preview ${idx + 1}" />
        <button type="button" class="btn-remove-img" data-idx="${idx}" title="Remove image">&times;</button>
      `;

      card.querySelector('.btn-remove-img').addEventListener('click', () => {
        currentImages.splice(idx, 1);
        renderImagePreviews();
      });

      previewGrid.appendChild(card);
    });
  }

  renderImagePreviews();

  if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (errorAlert) errorAlert.style.display = 'none';

      if (currentImages.length + files.length > 3) {
        if (errorAlert) {
          errorAlert.textContent = 'Maximum 3 images allowed per event announcement.';
          errorAlert.style.display = 'block';
        }
        fileInput.value = '';
        return;
      }

      for (const file of files) {
        try {
          const dataUrl = await storageService.uploadImage(file);
          currentImages.push(dataUrl);
        } catch (err) {
          if (errorAlert) {
            errorAlert.textContent = err.message;
            errorAlert.style.display = 'block';
          }
        }
      }

      renderImagePreviews();
      fileInput.value = '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value.trim();
    const description = document.getElementById('event-description').value.trim();
    const fullContent = document.getElementById('event-full-content').value.trim();
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value.trim();
    const location = document.getElementById('event-location').value.trim();
    const category = document.getElementById('event-category').value;
    const status = document.getElementById('event-status').value;

    if (!title || !description || !date || !time || !location) {
      if (errorAlert) {
        errorAlert.textContent = 'Please fill out all required fields marked with *';
        errorAlert.style.display = 'block';
      }
      return;
    }

    if (currentImages.length === 0) {
      currentImages.push('images/events/sample-1.svg');
    }

    eventService.updateEvent(eventId, {
      title,
      description,
      fullContent,
      date,
      time,
      location,
      category,
      status,
      images: currentImages
    });

    window.location.href = 'events.html';
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g,
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
