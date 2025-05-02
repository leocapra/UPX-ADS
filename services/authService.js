import api from "./api";

export const authService = {
  
  async registerUser(data) {
    return await api.post("/register", data);
  },

  async loginUser(data) {
    return await api.post("/login", data);
  },

};
