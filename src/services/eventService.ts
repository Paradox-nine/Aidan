import { Event } from '../types/event';

/**
 * Event Service Abstraction
 * -------------------------
 * Handles CRUD operations and publishing status for WYTU Events.
 *
 * NOTE: Uses localStorage for persistence in dev/mock mode.
 * When Supabase Database is connected, update these methods to query the
 * `events` table via `supabase.from('events')`.
 */

const STORAGE_KEY = 'wytu_events_data';

// Initial Mock Events for WYTU
const INITIAL_EVENTS: Event[] = [
  {
    id: 'evt_101',
    slug: 'annual-tech-symposium-2025',
    title: 'WYTU Annual Technology Symposium 2025',
    description: 'Join industry experts, faculty, and student innovators for keynote presentations, robotics exhibitions, and software demos across all engineering departments.',
    date: '2025-04-15',
    time: '09:00 AM - 04:30 PM',
    location: 'Main Auditorium, WYTU Campus',
    category: 'Technology',
    images: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'published',
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z',
  },
  {
    id: 'evt_102',
    slug: 'inter-department-hackathon',
    title: 'Inter-Department Hackathon & AI Sprint',
    description: 'A 24-hour intensive coding competition challenging student teams to build solutions for smart campus management and sustainable energy usage.',
    date: '2025-05-02',
    time: '10:00 AM Onwards',
    location: 'Computer Center Lab 3 & 4',
    category: 'Hackathon',
    images: [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'published',
    createdAt: '2025-01-15T10:30:00.000Z',
    updatedAt: '2025-01-15T10:30:00.000Z',
  },
  {
    id: 'evt_103',
    slug: 'engineering-career-fair-2025',
    title: 'Engineering & Technology Career Fair',
    description: 'Connect with top tech recruiters, telecom enterprises, and engineering companies offering internships and graduate entry positions.',
    date: '2025-06-12',
    time: '09:30 AM - 03:00 PM',
    location: 'Student Recreation Center',
    category: 'Career',
    images: [
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=800&q=80',
    ],
    status: 'draft',
    createdAt: '2025-02-01T14:00:00.000Z',
    updatedAt: '2025-02-01T14:00:00.000Z',
  },
];

function loadLocalEvents(): Event[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
      return INITIAL_EVENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_EVENTS;
  }
}

function saveLocalEvents(events: Event[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  } catch (err) {
    console.error('Failed to save events to local storage:', err);
  }
}

function generateSlug(title: string): string {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${cleanTitle}-${Math.random().toString(36).substring(2, 6)}`;
}

export const eventService = {
  /**
   * Retrieves all events (Drafts & Published) for Admin Management.
   */
  async getEvents(): Promise<Event[]> {
    await new Promise((res) => setTimeout(res, 200));
    return loadLocalEvents();
  },

  /**
   * Retrieves ONLY published events for Public View.
   */
  async getPublishedEvents(): Promise<Event[]> {
    await new Promise((res) => setTimeout(res, 200));
    const events = loadLocalEvents();
    return events.filter((e) => e.status === 'published');
  },

  /**
   * Get single event by ID.
   */
  async getEventById(id: string): Promise<Event | null> {
    await new Promise((res) => setTimeout(res, 150));
    const events = loadLocalEvents();
    return events.find((e) => e.id === id) || null;
  },

  /**
   * Get single event by Slug.
   */
  async getEventBySlug(slug: string): Promise<Event | null> {
    await new Promise((res) => setTimeout(res, 150));
    const events = loadLocalEvents();
    return events.find((e) => e.slug === slug) || null;
  },

  /**
   * Creates a new Event.
   */
  async createEvent(eventData: Omit<Event, 'id' | 'slug' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    await new Promise((res) => setTimeout(res, 300));
    const events = loadLocalEvents();

    const newEvent: Event = {
      ...eventData,
      id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug: generateSlug(eventData.title),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    events.unshift(newEvent);
    saveLocalEvents(events);
    return newEvent;
  },

  /**
   * Updates an existing event by ID.
   */
  async updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<Event> {
    await new Promise((res) => setTimeout(res, 300));
    const events = loadLocalEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Event with ID "${id}" was not found.`);
    }

    const updatedEvent: Event = {
      ...events[index],
      ...updates,
      slug: updates.title ? generateSlug(updates.title) : events[index].slug,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updatedEvent;
    saveLocalEvents(events);
    return updatedEvent;
  },

  /**
   * Deletes an event by ID.
   */
  async deleteEvent(id: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    const events = loadLocalEvents();
    const filtered = events.filter((e) => e.id !== id);
    saveLocalEvents(filtered);
  },

  /**
   * Publishes an event (Status -> published).
   */
  async publishEvent(id: string): Promise<Event> {
    return this.updateEvent(id, { status: 'published' });
  },

  /**
   * Unpublishes an event (Status -> draft).
   */
  async unpublishEvent(id: string): Promise<Event> {
    return this.updateEvent(id, { status: 'draft' });
  },
};
