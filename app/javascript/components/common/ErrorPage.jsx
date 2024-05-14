import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-gradient">
      <div className="max-w-md p-4 bg-light rounded-lg shadow text-center">
        <h1 className="text-4xl font-weight-bold text-dark mb-4">Oops!</h1>
        <p className="text-lg text-secondary mb-4">The page you're looking for doesn't exist.</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => window.location.href = '/'}
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
