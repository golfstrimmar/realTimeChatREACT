export const setUser = (user, token) => {
  localStorage.setItem(
    "auth",
    JSON.stringify({ user, token, isAuthenticated: true })
  );
  return {
    type: "SET_USER",
    payload: { user, token, isAuthenticated: true },
  };
};
export const logoutUser = () => {
  localStorage.removeItem("auth");
  return {
    type: "LOGOUT_USER",
  };
};

export const restoreAuth = () => {
  const authData = JSON.parse(localStorage.getItem("auth"));
  if (authData && authData.user && authData.token) {
    return {
      type: "RESTORE_AUTH",
      payload: {
        user: authData.user,
        token: authData.token,
        isAuthenticated: true,
      },
    };
  }
  return { type: "LOGOUT_USER" };
};
