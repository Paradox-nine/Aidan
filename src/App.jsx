import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AnnouncementsFeed from './components/AnnouncementsFeed';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { 
  auth, 
  db, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  onAuthStateChanged, 
  firebaseSignOut,
  isConfigured 
} from './firebase';
import './App.css';

// Initial sample posts used if Firebase config is unconfigured placeholder
const INITIAL_DEMO_POSTS = [
  {
    id: 'demo-1',
    title: 'Spring Hackathon 2025: Code for Good',
    date: '2025-04-15',
    category: 'Hackathon',
    description: 'Join us for 48 hours of collaborative coding, mentorship, and building solutions for local non-profit organizations. Cash prizes and swag for top teams!',
    imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-03-01'
  },
  {
    id: 'demo-2',
    title: 'Mastering Full-Stack React & Node.js',
    date: '2025-03-28',
    category: 'Workshop',
    description: 'An interactive hands-on workshop covering modern frontend architectures, API design, RESTful endpoints, and backend integration. Bring your laptops!',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-02-20'
  },
  {
    id: 'demo-3',
    title: 'Weekly Tech Talk: AI Agents in 2025',
    date: '2025-03-20',
    category: 'Meetup',
    description: 'Explore state-of-the-art autonomous agents, LLM tool integration, and practical software automation techniques with guest speaker Sarah Lin.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    createdAt: '2025-02-15'
  }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // Authentication State Observer
  useEffect(() => {
    if (!isConfigured) return;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Fetch Firestore Posts Real-Time Stream
  useEffect(() => {
    if (!isConfigured) {
      // Use local demo posts if Firebase credentials are placeholders
      const savedDemoPosts = localStorage.getItem('demo_posts');
      if (savedDemoPosts) {
        try {
          setPosts(JSON.parse(savedDemoPosts));
        } catch {
          setPosts(INITIAL_DEMO_POSTS);
        }
      } else {
        setPosts(INITIAL_DEMO_POSTS);
      }
      setLoading(false);
      return;
    }

    setLoading(true);
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      postsQuery, 
      (snapshot) => {
        const postsData = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setPosts(postsData);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore stream error:", error);
        setPosts(INITIAL_DEMO_POSTS);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    if (isConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.error("Sign out error:", err);
      }
    }
    setUser(null);
    setShowDashboard(false);
  };

  const handleDemoLogin = (demoUser) => {
    setUser(demoUser);
    setShowDashboard(true);
  };

  const handleAddPostDemo = (newPost) => {
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('demo_posts', JSON.stringify(updated));
  };

  const handleDeletePostDemo = (postId) => {
    const updated = posts.filter((p) => p.id !== postId);
    setPosts(updated);
    localStorage.setItem('demo_posts', JSON.stringify(updated));
  };

  return (
    <div className="app-layout">
      <Navbar 
        user={user} 
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={() => setShowDashboard(true)}
        onLogout={handleLogout}
      />

      {showDashboard && user ? (
        <main className="main-content dashboard-view">
          <AdminDashboard 
            user={user}
            posts={posts}
            onAddPostDemo={handleAddPostDemo}
            onDeletePostDemo={handleDeletePostDemo}
            onClose={() => setShowDashboard(false)}
          />
        </main>
      ) : (
        <main className="main-content">
          <Hero />
          
          <AnnouncementsFeed 
            posts={posts} 
            loading={loading}
            isDemoMode={!isConfigured} 
          />

          <section id="about" className="about-section">
            <div className="section-container">
              <div className="about-card">
                <h2>About DevClub</h2>
                <p>
                  We are a student-led developer community dedicated to fostering innovation, open-source collaboration, and technology skills. Whether you are writing your first line of code or scaling distributed systems, there is a place for you in our club!
                </p>
                <div className="about-tags">
                  <span className="tag">#WebDev</span>
                  <span className="tag">#OpenSource</span>
                  <span className="tag">#AI_ML</span>
                  <span className="tag">#CyberSecurity</span>
                  <span className="tag">#CloudComputing</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <Footer 
        user={user}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={() => setShowDashboard(true)}
      />

      <AdminLogin 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setShowDashboard(true);
        }}
        onDemoLogin={handleDemoLogin}
      />
    </div>
  );
}
