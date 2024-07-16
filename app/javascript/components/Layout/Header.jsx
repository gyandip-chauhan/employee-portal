import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../common/apiService';
import { API_LOGOUT } from '../common/apiEndpoints';
import { toast } from 'react-toastify';
import { Avatar, Menu, MenuItem } from '@mui/material';

const Header = ({ userData, setUserData, setDepartmentId }) => {
  const isLoggedIn = userData !== null && userData !== undefined;
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleLogout = async () => {
    try {
      const response = await ApiService.delete(API_LOGOUT);
      console.log("Logout API response:", response);
      localStorage.removeItem('userData');
      setUserData(null);
      setDepartmentId(null);
      navigate('/');
      toast.success(`${response.data.notice}`);
    } catch (error) {
      toast.error(`${error}`);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const fullName = isLoggedIn ? `${userData.first_name} ${userData.last_name}` : '';

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-header sticky-top">
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
                <li className="nav-item mt-2">
                  <Link className="nav-link text-light" to="/attendance">Home</Link>
                </li>
                <li className="nav-item mt-2">
                  <Link className="nav-link text-light" to="/team">Team</Link>
                </li>
                <li className="nav-item mt-2">
                  <Link className="nav-link text-light" to="/chat">Chat</Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-link text-light nav-link d-flex align-items-center"
                    onClick={handleMenuOpen}
                  >
                    <Avatar>{getInitials(fullName)}</Avatar>
                    <span className="ms-2">{fullName}</span>
                  </button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <MenuItem onClick={() => navigate('/edit-profile')}>Edit Profile</MenuItem>
                    <MenuItem onClick={() => navigate('/change-password')}>Change Password</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
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
