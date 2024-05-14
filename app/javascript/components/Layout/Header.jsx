import React from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../common/apiService';
import { API_LOGOUT } from '../common/apiEndpoints';

const Header = ({ userData, setUserData }) => {
  const isLoggedIn = userData !== null && userData !== undefined;

  const handleLogout = async () => {
    try {
      const response = await ApiService.delete(API_LOGOUT);
      console.log("Logout API response:", response);
      localStorage.removeItem('userData');
      setUserData(null);
      navigate('/login');
      toast.success(`${response.data.notice}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-primary sticky-top"> {/* Added sticky-top class here */}
      <div className="container">
        <Link className="navbar-brand text-light" to="/">Employee Directory</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/attendance">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/chat">Chat</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/edit-profile">Edit Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/change-password">Change Password</Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-link text-light nav-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to="/signup">Signup</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
