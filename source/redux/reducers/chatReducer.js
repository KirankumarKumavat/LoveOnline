import JSFunctionUtils from "../../utils/JSFunctionUtils";
import { chatActionTypes } from "../types";

/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   users: [],
   messages: [],
   selectedBadgeList: [],
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Chat and related screens
 */
const chatReducer = (state, action) => {
   switch (action.type) {
      case chatActionTypes.CHAT_REQUEST:
         return {
            ...state,
            loading: true
         }
      case chatActionTypes.CHAT_SUCCESS:
         return {
            ...state,
            loading: false
         }
      case chatActionTypes.CHAT_SUCCESS:
         return {
            ...state,
            loading: false
         }
      case chatActionTypes.CHAT_LOAD_USER_LIST:
         return {
            ...state,
            loading: false,
            users: action.payload.users,
         }
      case chatActionTypes.CHAT_LOAD_USER_CHAT_MESSAGE_LIST:
         return {
            ...state,
            loading: false,
         }
      case chatActionTypes.CHAT_SET_SEARCHED_VALUE:
         return {
            ...state,
            users: action.payload.users,
         }
      case chatActionTypes.CHAT_RESET_MESSAGES:
         return {
            ...state,
            messages: [],
         }
      case chatActionTypes.CHAT_SET_MESSAGES:
         return {
            ...state,
            messages: action.payload.messages,
         }
      case chatActionTypes.CHAT_GET_OLD_MESSAGES:
         return {
            ...state,
            messages: [
               ...state.messages,
               ...action.payload.messages,
            ]
         }
      case chatActionTypes.CHAT_GET_NEW_MESSAGE:
         return {
            ...state,
            messages: [
               action.payload.message,
               ...state.messages,
            ]
         }
      case chatActionTypes.CHAT_ADD_BADGE_TO_LIST:
         return {
            ...state,
            selectedBadgeList: JSFunctionUtils.uniqueArray(state.selectedBadgeList, [action.payload.badge], "id")
         }
      case chatActionTypes.CHAT_REMOVE_BADGE_FROM_LIST:
         return {
            ...state,
            selectedBadgeList: state.selectedBadgeList.filter((obj) => obj.title !== action.payload.badge.title)
         }
      case chatActionTypes.RESET_CHAT_BADGE_LIST:
         return {
            ...state,
            selectedBadgeList: [],
         }
      case chatActionTypes.CHAT_RESET_DATA:
         return initialState;
      default:
         return state || initialState
   }
}

export default chatReducer;