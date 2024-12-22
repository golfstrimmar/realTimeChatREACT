export const setSocket = (socket) => ({
  type: "SET_SOCKET",
  payload: socket,
});

export const disconnectSocket = () => ({
  type: "DISCONNECT_SOCKET",
});
