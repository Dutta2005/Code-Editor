import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

const authClient = axios.create({
  baseURL: `${SERVER_URL}/api`,
});

export const registerUser = async (payload) => {
  const response = await authClient.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload) => {
  const response = await authClient.post("/auth/login", payload);
  return response.data;
};

export const fetchHistory = async (token) => {
  const response = await authClient.get("/history", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const saveHistory = async (token, payload) => {
  const response = await authClient.post("/history", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateHistory = async (token, id, payload) => {
  const response = await authClient.put(`/history/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
