import axios from "axios";

const api = axios.create({
  baseURL: "https://marketing-exit-forum-3.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem("user"); // Get the whole user object string
    if (userString) {
      const userData = JSON.parse(userString);
      if (userData && userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`; // Use token from user object
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
