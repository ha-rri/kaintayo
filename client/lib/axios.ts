import axios from "axios";
import { DeviceEventEmitter } from "react-native";
import * as SecureStore from "expo-secure-store";
import Config from "@/constants/Config";

// Create Axios Instance
const api = axios.create({
  baseURL: Config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10s timeout
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 (Logout)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Skip session expiry check for Login/Register endpoints
    if (
      error.config?.url?.includes("/auth/login") ||
      error.config?.url?.includes("/auth/register")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync("token");
      console.log("Session expired. Logging out...");
    }

    // Handle Rate Limiting (429) w/ Friendly Toast
    if (error.response?.status === 429) {
      DeviceEventEmitter.emit("SHOW_TOAST", {
        message: "Whoa! Too many requests. Please slow down.",
        type: "error",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
