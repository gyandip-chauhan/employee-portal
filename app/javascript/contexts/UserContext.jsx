import React, { createContext, useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApiService from "../components/common/apiService";
import { API_LOGOUT } from "../components/common/apiEndpoints";

export const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      try {
        const parsedUser = JSON.parse(storedUserData);
        if (parsedUser?.expires_at && new Date(parsedUser.expires_at) < new Date()) {
          handleLogout();
          return;
        }
        setCurrentUser(parsedUser);
        setDepartmentId(parsedUser.department_id);
      } catch (error) {
        console.error("Error parsing user data:", error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = async () => {
    try {
      await ApiService.delete(API_LOGOUT);
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      localStorage.clear();
      setCurrentUser(null);
      setDepartmentId(null);
      navigate("/login");
      toast.success("You have been logged out.");
    }
  };

  const userContextValue = useMemo(() => ({
    currentUser,
    setCurrentUser, // ✅ Added setter
    departmentId,
    setDepartmentId, // ✅ Added setter
    handleLogout,
  }), [currentUser, departmentId]);

  return <UserContext.Provider value={userContextValue}>{children}</UserContext.Provider>;
};

export default UserProvider;
