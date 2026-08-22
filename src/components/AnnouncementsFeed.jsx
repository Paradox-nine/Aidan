import React from 'react';
import { Calendar, Megaphone, Info, Image as ImageIcon } from 'lucide-react';

export default function AnnouncementsFeed({ posts = [], loading = false, isDemoMode = false }) {
  if (loading) {
    return (
      <section id="announcements" className="feed-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">
              <Megaphone size={16} />
              <span>Announcements & Events</span>
            </div>
            <h2 className="section-title">Latest Club News</h2>
          </div>
          <div className="feed-grid">
            {[1, 2, 3].map((n) => (
              <div key={n} className="post-card skeleton-card">
                <div className="skeleton-image"></div>
                <div className="skeleton-content">
                  <div className="skeleton-line skeleton-title"></div>
                  <div className="skeleton-line skeleton-date"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line short"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="feed-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">
            <Megaphone size={16} />
            <span>Announcements & Events</span>
          </div>
          <h2 className="section-title">Latest Club Updates</h2>
          <p className="section-subtitle">
            Stay in the loop with our upcoming workshops, coding challenges, and community meetups.
          </p>
          {isDemoMode && (
            <div className="demo-notice">
              <Info size={16} />
              <span>Displaying sample posts. Configure Firebase credentials in <code>src/firebase.js</code> to connect live Firestore data.</span>
            </div>
          )}
        </div>

        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">
              <Megaphone size={32} />
            </div>
            <h3>No Announcements Yet</h3>
            <p>Check back soon for upcoming events and announcements!</p>
          </div>
        ) : (
          <div className="feed-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-image-container">
                  {post.imageUrl ? (
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="post-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                  ) : (
                    <div className="post-image-placeholder">
                      <ImageIcon size={40} />
                    </div>
                  )}
                  {post.category && (
                    <span className={`post-category badge-${post.category.toLowerCase()}`}>
                      {post.category}
                    </span>
                  )}
                </div>

                <div className="post-body">
                  <div className="post-date">
                    <Calendar size={14} />
                    <span>{post.date || 'Recent'}</span>
                  </div>

                  <h3 className="post-title">{post.title}</h3>

                  <p className="post-description">{post.description}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
