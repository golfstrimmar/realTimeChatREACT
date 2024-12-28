export const setEditMessage = (message) => ({
  type: "SET_EDIT_MESSAGE",
  payload: message,
});
export const setDeliteMessage = (message) => ({
  type: "SET_DELITE_MESSAGE",
  payload: message,
});

export const clearEditMessage = () => ({
  type: "CLEAR_EDIT_MESSAGE",
});
export const clearDeliteMessage = () => ({
  type: "CLEAR_DELITE_MESSAGE",
});
