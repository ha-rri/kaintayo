// client/utils/api.ts
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
// import Config from "@/constants/Config"; <--- If this causes errors, use the hardcoded URL below

// ⚠️ REPLACE THIS with your computer's local IP address (e.g., 192.168.1.5)
// Do NOT use localhost.
const API_URL = "http://192.168.1.5:5000/api/v1"; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config) => {
    try {
      if (Platform.OS !== 'web') {
        const token = await SecureStore.getItemAsync("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        const token = localStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;