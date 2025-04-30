// src/services/auth.ts
import api from "./api";

export const registerUser = async (data: any) => {
  try {
    console.log(data);
    console.log("problema?");

    const response = await api.post("/register", data);
    console.log("problema?");
    return response.data;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Erro ao cadastrar usuário";
    throw new Error(errorMessage);
  }
};

export const loginUser = async (data: { email: string; senha: string; role: number }) => {
  const response = await api.post("/login", data);
  return response.data;
};
