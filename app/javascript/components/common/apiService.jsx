// src/services/apiService.tsx
import axios from 'axios';

const baseURL = 'http://192.168.31.169:3000/api/v1';
// const baseURL = 'http://0.0.0.0:3000/api/v1';

const ApiService = axios.create({
  baseURL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document
      .querySelector('[name="csrf-token"]')
      ?.getAttribute('content') ?? '',
    'X-Auth-Email': null,
    'X-Auth-Token': null,
  },
});

// Add an interceptor to update headers after login
ApiService.interceptors.request.use((config) => {
  const userDataString = localStorage.getItem('userData');
  if (userDataString) {
    const userData = JSON.parse(userDataString);
    config.headers['X-Auth-Email'] = userData.email;
    config.headers['X-Auth-Token'] = userData.token;
  }
  return config;
});

export default ApiService;
