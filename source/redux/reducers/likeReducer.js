import { likeActionTypes } from "../types";
import _ from 'lodash';

/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   selectedTabIndex: 2,
   likedYouData: [],
   passedByYouData: [],
   likedByYouData: [],
   blockedByYouData: [],
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Like Tab  module
 */
const likeReducer = (state, action) => {
   switch (action.type) {
      case likeActionTypes.LIKE_CHANGE_SELECTED_TAB_INDEX:
         return {
            ...state,
            selectedTabIndex: action.payload.selectedTabIndex,
         }
      case likeActionTypes.LIKE_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case likeActionTypes.LIKE_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case likeActionTypes.LIKE_FAILURE:
         return {
            ...state,
            loading: false,
         }
      case likeActionTypes.LIKE_LOAD_USER_LIST_DATA:
         let totalArrayList = [...state[action.payload.arrayName], ...action.payload.userList]
         let keyName = action.payload.arrayName == "likedYouData" ? "user_id" :
            action.payload.arrayName == "passedByYouData" ? "ignored_user_id" :
               action.payload.arrayName == "likedByYouData" ? "liked_user_id" :
                  action.payload.arrayName == "blockedByYouData" ? "blocked_user_id" : "";

         let isFromRemoveList = action.payload && action.payload.isFromRemoveList
         let finalArray = isFromRemoveList ? action.payload && action.payload.userList : _.uniqBy(totalArrayList, keyName)
         return {
            ...state,
            loading: false,
            [action.payload.arrayName]: finalArray,
         }
      case likeActionTypes.LIKE_SET_SEARCHED_VALUE:
         return {
            ...state,
            loading: false,
            [action.payload.arrayName]: action.payload.searchedArray,
         }
      case likeActionTypes.LIKE_RESET_SPECIFIC_TAB_LIST:
         return {
            ...state,
            [action.payload.arrayName]: [],
         }
      case likeActionTypes.LIKE_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default likeReducer;