const initialState = {
  allUsers: [],
  goPrivat: null,
};

const AllUsersReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_ALL_USERS":
      return {
        ...state,
        allUsers: action.payload,
      };
    case "SET_GO_PRIVAT":
      return {
        ...state,
        goPrivat: action.payload,
      };
    default:
      return state;
  }
};

export default AllUsersReducer;
