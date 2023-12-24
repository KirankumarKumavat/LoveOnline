import { signupActionTypes, userProfileActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   loader: false,
   status: 0,
   error: "",
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Signup module
 */
const signupReducer = (state, action) => {
   switch (action.type) {
      case signupActionTypes.SIGNUP_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case signupActionTypes.SIGNUP_FAILURE:
         return {
            ...state,
            loading: false
         }
      case signupActionTypes.SIGNUP_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case userProfileActionTypes.USER_PROFILE_REQUEST:
         return {
            ...state,
            loader: true,
         }
      case userProfileActionTypes.USER_PROFILE_SUCCESS:
         return {
            ...state,
            loader: false,
         }
      case userProfileActionTypes.USER_PROFILE_FAILURE:
         return {
            ...state,
            loader: false,
         }
      case signupActionTypes.SIGNUP_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default signupReducer;