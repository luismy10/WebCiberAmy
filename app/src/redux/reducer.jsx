import { RESTORE_TOKEN, SIGN_IN, SIGN_OUT } from "./types";

const initialState = {
  isLoading: true,
  isSignout: false,
  isVisible: false,
  userToken: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case RESTORE_TOKEN:
      return {
        ...state,
        userToken: action.token,
        isLoading: false,
        isVisible: true,
      };
    case SIGN_IN:
      return {
        ...state,
        userToken: action.token,
        isSignout: false,
        isVisible: true,
      };
    case SIGN_OUT:
      return {
        ...state,
        isSignout: true,
        isVisible: false,
        userToken: null,
      };
    default:
      return state;
  }
};

export default reducer;
