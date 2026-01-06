import axios from "axios";
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      await SecureStore.deleteItemAsync("token");
      // Redirect to Auth (Implementation will be in AuthContext, but this is a failsafe)
      // We can emit an event or let AuthContext handle the state check
      console.log("Session expired. Logging out...");
      // router.replace("/profile"); // Optional: Force redirect
    }
    return Promise.reject(error);
  }
);

export default api;
