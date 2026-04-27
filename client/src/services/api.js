import { TOKEN_STORAGE_KEY } from "../utils/constants";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getHeaders = (customHeaders = {}) => {
  const token = getStoredToken();
  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json") ? await response.json() : {};

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const getStoredToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

export const setStoredToken = (token) => {
  window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
};

export const removeStoredToken = () => {
  window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(options.headers),
  });

  return parseResponse(response);
};

export const signupUser = (payload) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const loginUser = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getProfile = () => request("/auth/me");

export const getGrids = () => request("/grids");
export const getLastGrid = () => request("/grids/last");
export const getGridById = (id) => request(`/grids/${id}`);
export const saveGrid = (payload) =>
  request("/grids", {
    method: "POST",
    body: JSON.stringify(payload),
  });
export const updateGrid = (id, payload) =>
  request(`/grids/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
export const activateGrid = (id) =>
  request(`/grids/${id}/activate`, {
    method: "POST",
  });
export const deleteGrid = (id) =>
  request(`/grids/${id}`, {
    method: "DELETE",
  });

