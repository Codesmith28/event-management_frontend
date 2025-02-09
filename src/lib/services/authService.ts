import axios from "axios";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await axios.post("/api/auth/login", { email, password });
    return response.data;
  },

  register: async (name: string, email: string, password: string) => {
    const response = await axios.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  getAuthHeaders: () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
};
