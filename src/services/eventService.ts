import { Event } from '../types/event';
import { MOCK_EVENTS } from '../data/events';

/**
 * EventService Interface / Abstraction
 * Currently powered by local mock data.
 * Designed to be swapped with Supabase/Backend API without changing UI components.
 */

export const eventService = {
  /**
   * Retrieves all published events sorted by creation/date.
   */
  async getPublishedEvents(): Promise<Event[]> {
    // Simulating asynchronous service call
    const published = MOCK_EVENTS.filter((e) => e.status === 'published');
    return Promise.resolve(published);
  },

  /**
   * Retrieves a single published event matching the specified slug.
   */
  async getEventBySlug(slug: string): Promise<Event | null> {
    const event = MOCK_EVENTS.find(
      (e) => e.slug === slug && e.status === 'published'
    );
    return Promise.resolve(event || null);
  },

  /**
   * Retrieves related published events excluding the current event.
   */
  async getRelatedEvents(currentSlug: string, limit: number = 3): Promise<Event[]> {
    const related = MOCK_EVENTS.filter(
      (e) => e.slug !== currentSlug && e.status === 'published'
    ).slice(0, limit);
    return Promise.resolve(related);
  }
};
