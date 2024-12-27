export const setAllUsers = (users) => {
  return {
    type: "SET_ALL_USERS",
    payload: users,
  };
};
export const setGoPrivat = (user) => {
  return {
    type: "SET_GO_PRIVAT",
    payload: user,
  };
};
