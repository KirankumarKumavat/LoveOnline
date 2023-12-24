import { exploreActionTypes } from "../types";
import _ from 'lodash';

/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   mainUserList: [],
   userDetails: {},
   isNoProfileFound: false,
   isNoMoreData: false,
   userProfileDetails: {},
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for explre screen and related screens
 */
const exploreReducer = (state, action) => {
   switch (action.type) {
      case exploreActionTypes.EXPLORE_REQUEST:
         return {
            ...state,
            loading: true,
         }
      case exploreActionTypes.EXPLORE_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case exploreActionTypes.EXPLORE_FAILURE:
         return {
            ...state,
            loading: false,
         }
      case exploreActionTypes.EXPLORE_LOAD_USER_DATA:
         return {
            ...state,
            loading: false,
            userDetails: action.payload && (action.payload.isFromLike || action.payload.isFromChat) ? action.payload.userDetails : state.mainUserList[0],
            isNoProfileFound: false,
         }
      case exploreActionTypes.EXPLORE_LOAD_USER_PROFILE_DATA:
         return {
            ...state,
            loading: false,
            userProfileDetails: action.payload.userDetails,
         }
      case exploreActionTypes.EXPLORE_LOAD_USER_LIST_FROM_BACKEND:
         let mainArray = [...state.mainUserList, ...action.payload.userList];
         return {
            ...state,
            loading: false,
            isNoProfileFound: false,
            mainUserList: _.uniqBy(mainArray, "user_id"),
         }
      case exploreActionTypes.EXPLORE_SET_NO_PROFILE_FOUND:
         return {
            ...state,
            loading: false,
            isNoProfileFound: true,
            userDetails: {},
         }
      case exploreActionTypes.EXPLORE_REDUCE_USER_LIST:
         return {
            ...state,
            mainUserList: state.mainUserList.length == 1 ? [] : state.mainUserList.slice(1)
         }
      case exploreActionTypes.EXPLORE_RESET_USER_LIST:
         return {
            ...state,
            mainUserList: [],
         }
      case exploreActionTypes.EXPLORE_SET_BLANK_DATA:
         return {
            ...state,
            userDetails: {},
         }
      case exploreActionTypes.EXPLORE_SET_NO_MORE_DATA:
         return {
            ...state,
            isNoMoreData: action.payload.isNoMoreData,
         }
      case exploreActionTypes.EXPLORE_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default exploreReducer;