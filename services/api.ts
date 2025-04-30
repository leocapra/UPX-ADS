// src/services/api.ts
import axios from "axios";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "android" ? "http://localhost:3000/api" : "http://localhost:3000/api";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Erro na requisição:", error);
    throw error;
  }
);

export default api;
