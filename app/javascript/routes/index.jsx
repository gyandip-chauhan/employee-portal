import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LoginPage from '../components/Authentication/Login';
import SignupPage from '../components/Authentication/Signup';
import ResetPasswordPage from '../components/Authentication/ResetPassword';
import ChangePasswordPage from '../components/Authentication/ChangePassword';
import { ToastContainer } from 'react-toastify';
import ErrorPage from '../components/common/ErrorPage';

export default (
  <Router>
    <ToastContainer position="top-center"/>
    <Header />
    <main className="container mt-5">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} />
        {/* Catch all undefined routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </main>
    <Footer />
  </Router>
);

