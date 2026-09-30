const API_BASE_URL = "http://127.0.0.1:8000";

export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const makeRequest = async (token) => {
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  };

  let response = await makeRequest(accessToken);

  // Access token expired
  if (response.status === 401 && refreshToken) {
    const refreshResponse = await fetch(
      `${API_BASE_URL}/api/auth/token/refresh/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      }
    );

    const refreshData = await refreshResponse.json();

    if (refreshResponse.ok) {
      accessToken = refreshData.access;

      localStorage.setItem(
        "access_token",
        accessToken
      );

      // Try original request again
      response = await makeRequest(accessToken);
    } else {
      // Refresh token also expired
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      window.location.href = "/login";

      return null;
    }
  }

  return response;
};