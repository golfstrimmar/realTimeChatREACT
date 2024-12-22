const initialState = {
  onlineUsers: [],
};

const onlineUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ONLINE_USERS":
      return {
        ...state,
        onlineUsers: action.payload,
      };
    default:
      return state;
  }
};

export default onlineUsersReducer;
