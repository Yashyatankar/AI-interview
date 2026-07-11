import axios from "axios";

const api = axios.create({ baseURL: '/' });

export const logout = async () => {
  try {
    const response = await api.post(
      "/accounts/logout/",
      {}, 
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  } finally {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
  }
};