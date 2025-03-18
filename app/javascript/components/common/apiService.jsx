import axios from "axios";

const baseURL = "http://192.168.30.26:3000/api/v1";

// Function to retrieve CSRF token from meta tag
const getCSRFToken = () => {
  return document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || "";
};

// Create an Axios instance
const ApiService = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true, // ✅ Ensure cookies are sent
});

// Interceptor to attach authentication & CSRF headers dynamically
ApiService.interceptors.request.use((config) => {
  const userDataString = localStorage.getItem("userData");
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    config.headers["X-Auth-Email"] = userData.email;
    config.headers["X-Auth-Token"] = userData.token;
  }
  config.headers["X-CSRF-Token"] = getCSRFToken(); // ✅ Attach CSRF token
  return config;
}, (error) => Promise.reject(error));

export default ApiService;
