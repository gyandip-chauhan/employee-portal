import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ErrorPage from '../components/common/ErrorPage';
import Home from "../components/Home";
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LoginPage from '../components/Authentication/Login';
import SignupPage from '../components/Authentication/Signup';
import ResetPasswordPage from '../components/Authentication/ResetPassword';
import ChangePasswordPage from '../components/Authentication/ChangePassword';
import AttendancePage from '../components/Attendance/List';
import ChatPage from '../components/Chat/List'

const App = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      const parsedUserData = JSON.parse(userDataString);
      if (parsedUserData) {
        setUserData(parsedUserData);
      } else {
        localStorage.removeItem('userData');
      }
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="top-center" />
      <Header userData={userData} setUserData={setUserData} />
      <main className="container mt-5">
        <Routes>
          <Route path="/" element={<Home userData={userData} />} />
          <Route path="/login" element={<LoginPage setUserData={setUserData} />} />
          <Route path="/signup" element={<SignupPage setUserData={setUserData} />} />
          <Route path="/forgot-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/attendance" element={<AttendancePage userData={userData} />} />
          <Route path="/chat" element={<ChatPage userData={userData} />} />
          {/* Catch all undefined routes */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
