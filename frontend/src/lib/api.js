const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "/api";

async function apiRequest(path, { method = "GET", token, body } = {}) {
  const headers = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || "Ha ocurrido un error inesperado.";
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export function registerUser(email, password) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { email, password },
  });
}

export function loginUser(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

export function getAuthenticatedUser(token) {
  return apiRequest("/auth/me", { token });
}

export function logoutUser(token) {
  return apiRequest("/auth/logout", {
    method: "POST",
    token,
  });
}

export function getProfile(token) {
  return apiRequest("/profile", { token });
}

export function patchProfile(token, body) {
  return apiRequest("/profile", {
    method: "PATCH",
    token,
    body,
  });
}

export function putProfile(token, body) {
  return apiRequest("/profile", {
    method: "PUT",
    token,
    body,
  });
}

export function skipProfile(token, body = {}) {
  return apiRequest("/profile/skip", {
    method: "POST",
    token,
    body,
  });
}

export function postSessionRecommend(token, body) {
  return apiRequest("/session/recommend", {
    method: "POST",
    token,
    body,
  });
}
