import { loginActionTypes } from "../types";

/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   userDetails: {},
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Login module
 */
const loginReducer = (state, action) => {
   switch (action.type) {
      case loginActionTypes.LOGIN_REQUEST:
         return {
            ...state,
            loading: true
         }
      case loginActionTypes.LOGIN_SUCCESS:
         return {
            ...state,
            loading: false,
            userDetails: action.payload.userDetails
         }
      case loginActionTypes.LOGIN_FAILURE:
         return {
            ...state,
            loading: false
         }
      case loginActionTypes.LOGIN_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default loginReducer;