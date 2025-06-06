import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/blogs');
      if (response.data.success) {
        setBlogs(response.data.blogs);
      }
    } catch (error) {
      setError('Failed to fetch blogs');
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="error-message">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      {/* Hero Section */}
      <div className="hero-section py-5" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4" style={{color: 'white'}}>
                📝 Welcome to Blogify
              </h1>
              <p className="lead mb-4" style={{color: 'rgba(255,255,255,0.9)', fontSize: '1.3rem'}}>
                Discover amazing stories, share your thoughts, and connect with writers from around the world
              </p>
              <div className="d-flex justify-content-center gap-3">
                <div className="text-center">
                  <h4 className="fw-bold">{blogs.length}</h4>
                  <small>Stories Published</small>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold">∞</h4>
                  <small>Ideas Shared</small>
                </div>
                <div className="text-center">
                  <h4 className="fw-bold">🌟</h4>
                  <small>Community</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Content */}
      <div className="container py-5">
        {blogs.length === 0 ? (
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="bi bi-journal-plus" style={{fontSize: '4rem', color: '#667eea'}}></i>
            </div>
            <h3 className="mb-3" style={{color: '#2c3e50'}}>No stories yet</h3>
            <p className="text-muted mb-4">Be the first to share your amazing story with the world!</p>
            <a href="/create" className="btn btn-primary btn-lg">
              <i className="bi bi-plus-circle me-2"></i>
              Write Your First Story
            </a>
          </div>
        ) : (
          <>
            <div className="row mb-5">
              <div className="col text-center">
                <h2 className="mb-3" style={{color: '#2c3e50'}}>✨ Latest Stories</h2>
                <p className="text-muted">Fresh perspectives and inspiring tales from our community</p>
              </div>
            </div>
            <div className="row">
              {blogs.map(blog => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
