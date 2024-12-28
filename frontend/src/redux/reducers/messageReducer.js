const initialState = {
  messageToEdit: null,
  messageToDelite: null,
};

const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_EDIT_MESSAGE":
      return {
        ...state,
        messageToEdit: action.payload,
      };
    case "SET_DELITE_MESSAGE":
      return {
        ...state,
        messageToDelite: action.payload,
      };
    case "CLEAR_EDIT_MESSAGE":
      return {
        ...state,
        messageToEdit: null,
      };
    case "CLEAR_DELITE_MESSAGE":
      return {
        ...state,
        messageToDelite: null,
      };
    default:
      return state;
  }
};

export default messageReducer;
