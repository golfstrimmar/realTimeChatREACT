const initialState = {
  socket: null, // Здесь хранится объект сокета
};

const socketReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SOCKET":
      return {
        ...state,
        socket: action.payload, // Сохраняем сокет в состоянии
      };
    case "DISCONNECT_SOCKET":
      if (state.socket) {
        state.socket.disconnect(); // Отключаем сокет
      }
      return {
        ...state,
        socket: null, // Обнуляем сокет
      };
    default:
      return state;
  }
};

export default socketReducer;
