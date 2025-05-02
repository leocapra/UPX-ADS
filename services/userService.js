// src/services/userService.ts
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userService = {
  async getUserProfile() {
    const response = await api.get("/profile");
    return response.data;
  },

  async updateAvatar(avatarIndex) {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await api.put(
      "/avatar",
      { avatarIndex },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  async updateUser(data) {
    const token = await AsyncStorage.getItem("token");
    if (!token) throw new Error("Token não encontrado");

    const response = await api.put("/user", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
  },
};
