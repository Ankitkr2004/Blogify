import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BlogDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentLoading, setCommentLoading] = useState(false);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await axios.get(`/api/blog/${id}`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (response.data.success) {
        setBlog(response.data.blog);
        setComments(response.data.comments || []);
      }
    } catch (error) {
      setError('Failed to fetch blog details');
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setCommentLoading(true);
    try {
      await axios.post(`/api/blog/comment/${id}`, {
        content: newComment
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      setNewComment('');
      fetchBlogDetail(); // Refresh to get new comment
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setCommentLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (!blog) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h3>Blog not found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <article>
            <h1 className="display-4 mb-4">{blog.title}</h1>
            
            <div className="author-info mb-4">
              <div className="d-flex align-items-center">
                <img
                  src={`http://localhost:8000${blog.createdBy?.profileImageURL || '/images/default.png'}`}
                  alt="Author"
                  width="50"
                  height="50"
                  className="rounded-circle me-3"
                />
                <div>
                  <h6 className="mb-0">{blog.createdBy?.fullName || 'Anonymous'}</h6>
                  <small className="text-muted">{formatDate(blog.createdAt)}</small>
                </div>
              </div>
            </div>

            <img 
              src={`http://localhost:8000${blog.coverImageURL}`}
              alt={blog.title}
              className="img-fluid rounded mb-4"
              style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            />

            <div className="blog-content">
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {blog.body}
              </pre>
            </div>
          </article>

          <div className="comment-section mt-5">
            <h3 className="mb-4">
              <i className="bi bi-chat-dots me-2"></i>
              Comments ({comments.length})
            </h3>

            {user && (
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Write your comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={commentLoading}
                >
                  {commentLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Posting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-1"></i>
                      Post Comment
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment-item">
                  <div className="d-flex">
                    <img 
                      src={`http://localhost:8000${comment.createdBy?.profileImageURL || '/images/default.png'}`}
                      alt="Commenter"
                      width="40"
                      height="40"
                      className="rounded-circle me-3"
                    />
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="mb-1">{comment.createdBy?.fullName || 'Anonymous'}</h6>
                        <small className="text-muted">{formatDate(comment.createdAt)}</small>
                      </div>
                      <p className="mb-0">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-4">
                <i className="bi bi-chat display-4 text-muted"></i>
                <p className="text-muted mt-2">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
