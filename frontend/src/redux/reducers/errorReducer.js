const initialState = {
  messageError: null,
};

const errorReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ERROR_MESSAGE":
      return {
        ...state,
        messageError: action.payload,
      };
    case "CLEAR_ERROR_MESSAGE":
      return {
        ...state,
        messageError: null,
      };

    default:
      return state;
  }
};
export default errorReducer;
