import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { CssBaseline, Box } from "@mui/material";
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
import UserProvider, { UserContext } from "../contexts/UserContext";

const AppContent = () => {
  const { currentUser, departmentId } = useContext(UserContext);

  return (
    <>
      <CssBaseline />
      <ToastContainer position="top-center" />
      <Header />

      <Box component="main" sx={{ width: "100vw", minHeight: "calc(100vh - 120px)", overflowX: "hidden", paddingTop: "70px", paddingBottom: "50px" }}>
        <Routes>
          <Route path="/" element={<Home userData={currentUser} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgetPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/change-password" element={<ChangePasswordPage />} />
          <Route path="/attendance" element={<AttendancePage userData={currentUser} />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/team" element={<TeamSummaryPage departmentId={departmentId} />} />
          <Route path="/pdf-uploader" element={<PdfUploader />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Box>

      <Footer />
    </>
  );
};

const App = () => {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
};

export default App;
