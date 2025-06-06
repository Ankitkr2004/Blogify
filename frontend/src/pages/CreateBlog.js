import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    coverImage: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'coverImage') {
      setFormData({
        ...formData,
        coverImage: e.target.files[0]
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('body', formData.body);
    if (formData.coverImage) {
      formDataToSend.append('coverImage', formData.coverImage);
    }

    try {
      const response = await axios.post('/api/blog', formDataToSend, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      });

      // If successful, redirect to the new blog post
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      setError('Failed to create blog post');
      console.error('Error creating blog:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-lg border-0" style={{borderRadius: '20px'}}>
              <div className="card-body p-5">
                <div className="text-center mb-5">
                  <div className="mb-3">
                    <i className="bi bi-pencil-square" style={{fontSize: '3rem', color: '#667eea'}}></i>
                  </div>
                  <h2 className="card-title mb-2" style={{color: '#2c3e50'}}>
                    ✍️ Create Your Story
                  </h2>
                  <p className="text-muted">Share your thoughts and inspire others</p>
                </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="form-label fw-semibold">📝 Story Title</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="What's your story about?"
                      required
                      style={{borderRadius: '15px'}}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="coverImage" className="form-label fw-semibold">🖼️ Cover Image</label>
                    <input
                      type="file"
                      className="form-control form-control-lg"
                      id="coverImage"
                      name="coverImage"
                      onChange={handleChange}
                      accept="image/*"
                      required
                      style={{borderRadius: '15px'}}
                    />
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Choose a beautiful image that represents your story
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="body" className="form-label fw-semibold">📖 Your Story</label>
                    <textarea
                      className="form-control"
                      id="body"
                      name="body"
                      rows="15"
                      value={formData.body}
                      onChange={handleChange}
                      placeholder="Tell your story... What inspired you? What did you learn? Share your journey with the world!"
                      required
                      style={{
                        borderRadius: '15px',
                        fontSize: '1.1rem',
                        lineHeight: '1.6'
                      }}
                    />
                    <div className="form-text text-muted mt-2">
                      <i className="bi bi-lightbulb me-1"></i>
                      Write from your heart - authentic stories connect with readers
                    </div>
                  </div>

                  <div className="d-grid gap-3 d-md-flex justify-content-md-end">
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg me-md-2"
                      onClick={() => navigate('/')}
                      style={{borderRadius: '25px', padding: '12px 30px'}}
                    >
                      <i className="bi bi-arrow-left me-2"></i>
                      Back to Home
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                      style={{borderRadius: '25px', padding: '12px 30px'}}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Publishing your story...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Publish Story 🚀
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlog;
