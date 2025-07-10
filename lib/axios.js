import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_BACKEND_URL || "http://localhost:5000"}/api`,
  withCredentials: true,
});
