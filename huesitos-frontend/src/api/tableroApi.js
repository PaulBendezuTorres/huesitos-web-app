import axios from "axios";

const tableroApi = axios.create({
  baseURL: "http://localhost:8080/api/dashboard",
  headers: { "Content-Type": "application/json" },
});

tableroApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default tableroApi;