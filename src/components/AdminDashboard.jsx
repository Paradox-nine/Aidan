import React, { useState } from 'react';
import { 
  db, 
  storage, 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  isConfigured 
} from '../firebase';
import { 
  PlusCircle, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Image as ImageIcon, 
  Calendar, 
  FileText, 
  Heading, 
  X,
  Tag,
  ShieldAlert
} from 'lucide-react';

export default function AdminDashboard({ user, posts = [], onAddPostDemo, onDeletePostDemo, onClose }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Announcement');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image file size must be less than 5MB.' });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (!title || !date || !description) {
      setMessage({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (isConfigured) {
        // Upload image to Firebase Storage if provided
        if (imageFile) {
          const fileExtension = imageFile.name.split('.').pop();
          const fileName = `posts/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
          const storageRef = ref(storage, fileName);
          
          const uploadSnapshot = await uploadBytes(storageRef, imageFile);
          imageUrl = await getDownloadURL(uploadSnapshot.ref);
        }

        // Save post data to Firestore posts collection
        const newPost = {
          title,
          date,
          category,
          description,
          imageUrl: imageUrl || null,
          createdAt: serverTimestamp(),
          authorEmail: user?.email || 'admin'
        };

        await addDoc(collection(db, 'posts'), newPost);
      } else {
        // Local/Demo Mode execution
        imageUrl = imagePreview || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80';
        
        const demoPost = {
          id: 'post-' + Date.now(),
          title,
          date,
          category,
          description,
          imageUrl,
          createdAt: new Date().toISOString()
        };

        if (onAddPostDemo) {
          onAddPostDemo(demoPost);
        }
      }

      setMessage({ type: 'success', text: 'Post successfully created and published!' });
      
      // Reset form
      setTitle('');
      setDate(new Date().toISOString().split('T')[0]);
      setCategory('Announcement');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);

    } catch (err) {
      console.error("Error creating post:", err);
      setMessage({ type: 'error', text: `Failed to create post: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      if (isConfigured) {
        await deleteDoc(doc(db, 'posts', postId));
      } else if (onDeletePostDemo) {
        onDeletePostDemo(postId);
      }
      setMessage({ type: 'success', text: 'Post deleted successfully.' });
    } catch (err) {
      console.error("Error deleting post:", err);
      setMessage({ type: 'error', text: 'Failed to delete post: ' + err.message });
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Admin Dashboard</h2>
          <p className="dashboard-welcome">
            Logged in as <span className="highlight-user">{user?.email || 'Admin'}</span>
          </p>
        </div>
        <button onClick={onClose} className="btn btn-outline btn-sm">
          <X size={18} />
          <span>Close Dashboard</span>
        </button>
      </div>

      {!isConfigured && (
        <div className="demo-notice banner-info">
          <ShieldAlert size={18} />
          <div>
            <strong>Firestore & Storage Notice:</strong> Placeholders detected in <code>firebaseConfig</code>. Creating posts will update the local feed in demo mode. Configure your Firebase project in <code>src/firebase.js</code> to persist data live in Firestore and Firebase Storage.
          </div>
        </div>
      )}

      {message.text && (
        <div className={`alert-banner alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="dashboard-grid">
        {/* Post Creation Form */}
        <div className="dashboard-card form-card">
          <div className="card-header">
            <PlusCircle className="card-icon" size={20} />
            <h3>Create New Post</h3>
          </div>

          <form onSubmit={handleCreatePost} className="post-form">
            <div className="form-group">
              <label htmlFor="post-title">
                <Heading size={16} /> Title *
              </label>
              <input
                id="post-title"
                type="text"
                placeholder="e.g., Spring Hackathon 2025 Kickoff"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="post-date">
                  <Calendar size={16} /> Event Date *
                </label>
                <input
                  id="post-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="post-category">
                  <Tag size={16} /> Category
                </label>
                <select 
                  id="post-category"
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Meetup">Meetup</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="post-description">
                <FileText size={16} /> Description / Content *
              </label>
              <textarea
                id="post-description"
                rows="4"
                placeholder="Write the details of the event or news..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="form-group">
              <label>
                <ImageIcon size={16} /> Event Image (Firebase Storage)
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="post-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input-hidden"
                />
                <label htmlFor="post-image" className="file-upload-label">
                  <Upload size={20} />
                  <span>{imageFile ? imageFile.name : "Choose an image file..."}</span>
                </label>
              </div>

              {imagePreview && (
                <div className="image-preview-container">
                  <img src={imagePreview} alt="Preview" className="image-preview" />
                  <button 
                    type="button" 
                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                    className="remove-preview-btn"
                  >
                    <X size={14} /> Remove Image
                  </button>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
            >
              {loading ? 'Publishing to Firestore...' : 'Publish Announcement'}
            </button>
          </form>
        </div>

        {/* Existing Posts Management */}
        <div className="dashboard-card posts-list-card">
          <div className="card-header">
            <FileText className="card-icon" size={20} />
            <h3>Manage Published Posts ({posts.length})</h3>
          </div>

          <div className="posts-manage-list">
            {posts.length === 0 ? (
              <p className="no-posts-text">No posts published yet.</p>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="manage-post-item">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="manage-post-thumb" />
                  ) : (
                    <div className="manage-post-thumb placeholder">
                      <ImageIcon size={20} />
                    </div>
                  )}
                  <div className="manage-post-info">
                    <h4 className="manage-post-title">{post.title}</h4>
                    <span className="manage-post-date">{post.date}</span>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="btn-delete"
                    title="Delete Post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
