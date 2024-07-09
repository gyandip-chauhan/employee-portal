import React from 'react';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-footer fixed-bottom">
      <div className="container">
        <span className="text-white">
          Employee Directory &copy; {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
