import React, { useState } from 'react';
import ApiService from '../common/apiService';
import { API_RESET_PASSWORD } from '../common/apiEndpoints';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const userLocation = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const searchParams = new URLSearchParams(userLocation.search);
  const resetToken = searchParams.get('token');
  const isNewUser = searchParams.get('new');
  const label = isNewUser ? "Set" : "Reset"


  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const response = await ApiService.put(API_RESET_PASSWORD, { user: { password: newPassword, password_confirmation: confirmNewPassword }, token: resetToken });
      navigate('/login');
      toast.success(`${response.data.notice}`);
    } catch (error) {
      const err = error;
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error);
      } else {
        toast.error(`${err}`);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">{label} Password Page</h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmNewPassword"
                    placeholder="Confirm new password"
                    value={confirmNewPassword}
                    onChange={handleConfirmNewPasswordChange}
                  />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">{label} Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
