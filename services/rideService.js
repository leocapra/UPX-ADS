import api from "./api";

export const rideService = {
  async createRide(data) {
    return await api.post("/corridas", data);
  },

  async getRide() {
    return await api.get("/getRide", {});
  },
};
