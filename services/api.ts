import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "http://192.168.100.53:3000/api",
  timeout: 10000,
});

api.interceptors.request.use(
  async (config) => {
    if (!config.url?.includes("/auth")) {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        console.warn("Failed to get token from storage", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized - Token may be invalid or expired");
    }
    return Promise.reject(error);
  }
);

export default api;
