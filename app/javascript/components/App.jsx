import React, { useState, useEffect, useMemo, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CssBaseline, Box } from "@mui/material"; // Material UI Components
import ErrorPage from "../components/common/ErrorPage";
import Home from "../components/Home";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import LoginPage from "../components/Authentication/Login";
import ForgetPasswordPage from "../components/Authentication/ForgetPassword";
import ResetPasswordPage from "../components/Authentication/ResetPassword";
import ChangePasswordPage from "../components/Authentication/ChangePassword";
import AttendancePage from "../components/Attendance/List";
import ChatPage from "../components/Chat";
import TeamSummaryPage from "../components/Team/Summary";
import PdfUploader from "./Pdf/PdfUploader";
import { UserContext } from "./contexts/UserContext";

const App = () => {
  const [userData, setUserData] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);

  // Load user data from localStorage
  useEffect(() => {
    try {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        if (parsedUserData) {
          setUserData(parsedUserData);
          setDepartmentId(parsedUserData.department_id);
        }
      }
    } catch (error) {
      console.error("Error reading user data from localStorage:", error);
      localStorage.removeItem("userData");
    }
  }, []);

  // Memoize context value
  const userContextValue = useMemo(() => ({ currentUser: userData }), [userData]);

  // UseCallback for state setters
  const handleSetUserData = useCallback((data) => setUserData(data), []);
  const handleSetDepartmentId = useCallback((id) => setDepartmentId(id), []);

  return (
    <UserContext.Provider value={userContextValue}>
      <Router>
        <CssBaseline /> {/* Resets default browser styling */}
        <ToastContainer position="top-center" />
        
        {/* Fixed Header */}
        <Header userData={userData} setUserData={handleSetUserData} setDepartmentId={handleSetDepartmentId} />

        {/* Full-width main content */}
        <Box
          component="main"
          sx={{
            width: "100vw",
            minHeight: "calc(100vh - 120px)", // Adjusted to leave space for the fixed footer
            overflowX: "hidden",
            paddingTop: "70px", // Space for fixed header
            paddingBottom: "50px", // Space for fixed footer
          }}
        >
          <Routes>
            <Route path="/" element={<Home userData={userData} />} />
            <Route path="/login" element={<LoginPage setUserData={handleSetUserData} setDepartmentId={handleSetDepartmentId} />} />
            <Route path="/forgot-password" element={<ForgetPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
            <Route path="/attendance" element={<AttendancePage userData={userData} />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/team" element={<TeamSummaryPage departmentId={departmentId} />} />
            <Route path="/pdf-uploader" element={<PdfUploader />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Box>

        {/* Fixed Footer */}
        <Footer />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
