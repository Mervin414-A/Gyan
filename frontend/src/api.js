
const API_BASE_URL = "https://gyanmatrix-backend.onrender.com";

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const makeRequest = async (token) => {
    const headers = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else {
      delete headers.Authorization;
    }

    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    });
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(
      `${API_BASE_URL}/api/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
      }
    );

    const refreshData = await refreshResponse.json();

    if (refreshResponse.ok) {
      accessToken = refreshData.access;
      localStorage.setItem("access_token", accessToken);
      response = await makeRequest(accessToken);
    } else {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";
      return null;
    }

  }

  return response;
};
