import axios from "axios";

const api = axios.create({ baseURL: '/' });

// Auto-attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const logout = async () => {
  const refresh = localStorage.getItem("refresh");
  try {
    const response = await api.get("/accounts/logout/", { refresh });
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};

export default logout;