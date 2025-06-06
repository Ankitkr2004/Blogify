import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="col-md-6 col-lg-4 mb-4">
      <div className="card blog-card h-100">
        <div className="position-relative">
          <img
            src={`http://localhost:8000${blog.coverImageURL}`}
            className="card-img-top blog-image"
            alt={blog.title}
          />
          <div className="position-absolute top-0 end-0 m-3">
            <span className="badge bg-light text-dark rounded-pill px-3 py-2">
              📖 Story
            </span>
          </div>
        </div>
        <div className="card-body d-flex flex-column p-4">
          <h5 className="card-title mb-3" style={{
            color: '#2c3e50',
            fontWeight: '600',
            lineHeight: '1.4'
          }}>
            {blog.title}
          </h5>

          <div className="blog-meta mb-3">
            <div className="d-flex align-items-center mb-2">
              <img
                src={`http://localhost:8000${blog.createdBy?.profileImageURL || '/images/default.png'}`}
                alt="Author"
                width="24"
                height="24"
                className="rounded-circle me-2"
              />
              <small className="text-muted">
                By <strong>{blog.createdBy?.fullName || 'Anonymous'}</strong>
              </small>
            </div>
            <small className="text-muted">
              <i className="bi bi-calendar3 me-1"></i>
              {formatDate(blog.createdAt)}
            </small>
          </div>

          <div className="mt-auto">
            <Link
              to={`/blog/${blog._id}`}
              className="btn btn-primary w-100"
              style={{borderRadius: '25px'}}
            >
              <i className="bi bi-book-open me-2"></i>
              Read Story
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
