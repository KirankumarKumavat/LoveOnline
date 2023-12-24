import { userProfileActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   userProfileSetupDetails: {},
   mainProfileImage: null,
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for User Profile module
 */
const userProfileReducer = (state, action) => {
   switch (action.type) {
      case userProfileActionTypes.USER_PROFILE_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case userProfileActionTypes.USER_PROFILE_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case userProfileActionTypes.USER_PROFILE_FAILURE:
         return {
            ...state,
            loading: false,
         }
      case userProfileActionTypes.USER_PROFILE_GET_PROFILE_DATA:
         let mainImage;
         action.payload.userProfileDetails && action.payload.userProfileDetails.pictures &&
            action.payload.userProfileDetails.pictures.length && action.payload.userProfileDetails.pictures.map((obj) => {
               if (obj.position === 1) {
                  mainImage = obj.profile_pic
               }
            })
         return {
            ...state,
            loading: false,
            userProfileSetupDetails: action.payload.userProfileDetails,
            mainProfileImage: mainImage
         }
      case userProfileActionTypes.USER_PROFILE_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default userProfileReducer;