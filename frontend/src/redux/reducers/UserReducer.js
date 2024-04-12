import { SET_USER, CLEAR_SESSION } from "../Types";

export const initialState = {
  // @TODO: Set isLoggedIn to false
  isLoggedIn: false,
};

export default function UserReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case CLEAR_SESSION:
      return initialState;
    default:
      return state;
  }
}
