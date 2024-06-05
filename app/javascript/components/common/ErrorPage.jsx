import React from 'react';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600">
      <div className="max-w-md p-4 bg-white rounded-lg shadow text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Oops!</h1>
        <p className="text-lg text-gray-600 mb-4">The page you're looking for doesn't exist.</p>
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
