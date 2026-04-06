import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? '/api' : 'http://localhost:8081/api', // Use the new port 8081 for dev as well
});

// Request interceptor to attach the JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
