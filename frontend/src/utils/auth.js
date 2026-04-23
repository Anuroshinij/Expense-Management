export const getToken = () => {
  return localStorage.getItem("token");
};

// decode JWT (simple)
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = parseJwt(token);

  // ⚠️ adjust based on your backend
  return decoded?.role || decoded?.authorities?.[0];
};