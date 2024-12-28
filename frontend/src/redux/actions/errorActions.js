export const setErrorMessage = (message) => ({
  type: "SET_ERROR_MESSAGE",
  payload: message,
});

// Экшен для очистки сообщения об ошибке
export const clearErrorMessage = () => ({
  type: "CLEAR_ERROR_MESSAGE",
});
