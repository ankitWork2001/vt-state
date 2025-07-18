import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_BACKEND_URL || "https://vt-state-backend.onrender.com"}/api`,
  withCredentials: true,
});
