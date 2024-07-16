import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorPage from '../components/common/ErrorPage';
import Home from "../components/Home";
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LoginPage from '../components/Authentication/Login';
import ForgetPasswordPage from '../components/Authentication/ForgetPassword';
import ResetPasswordPage from '../components/Authentication/ResetPassword';
import ChangePasswordPage from '../components/Authentication/ChangePassword';
import AttendancePage from '../components/Attendance/List';
import ChatPage from '../components/Chat';
import TeamSummaryPage from '../components/Team/Summary';
import { UserContext } from './contexts/UserContext';

const App = () => {
  const [userData, setUserData] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const isAuthenticated = !!userData; // Check if user data exists

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      if (parsedUserData) {
        setUserData(parsedUserData);
        setDepartmentId(parsedUserData.department_id);
      } else {
        localStorage.removeItem('userData');
        setUserData(null);
        setDepartmentId(null);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ currentUser: userData }}>
      <Router>
        <ToastContainer position="top-center" />
        <Header userData={userData} setUserData={setUserData} setDepartmentId={setDepartmentId} />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home userData={userData} />} />
            <Route path="/login" element={<LoginPage setUserData={setUserData} setDepartmentId={setDepartmentId} />} />
            <Route path="/forgot-password" element={<ForgetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/attendance" element={<AttendancePage userData={userData} />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/team" element={<TeamSummaryPage departmentId={departmentId} />} />
            {/* Catch all undefined routes */}
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </ UserContext.Provider >
  );
};

export default App;
