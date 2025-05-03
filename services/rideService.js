import api from "./api";

export const rideService = {
  async createRide(data) {
    console.log('service ', data)
    return await api.post("/corridas", data);
  },
};
