import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api/v1",
});

export const shortenUrl = async (originalUrl) => {
  try {
    const response = await api.post("/shorten", { url: originalUrl });
    return response.data;
  } catch (error) {
    console.error("Erro ao encurtar URL", error);
    throw error;
  }
};

export const getAnalytics = async (shortCode) => {
  try {
    const response = await api.get(`/analytics/${shortCode}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar analytics", error);
    return null;
  }
};

export default api;
