import { matchedUsersActionTypes } from "../types";
import _ from "lodash";
/**
 * initial stat for reducer
 */
const initialState = {
    loading: false,
    status: 0,
    error: "",
    matchedUsers: [],
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Match User screen
 */
const matchedReducer = (state, action) => {
    switch (action.type) {
        case matchedUsersActionTypes.MATCHED_USERS_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case matchedUsersActionTypes.MATCHED_USERS_FAILURE:
            return {
                ...state,
                loading: false,
            }
        case matchedUsersActionTypes.MATCHED_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                matchedUsers: action.payload && action.payload.matchedUsers ? _.uniqBy(action.payload.matchedUsers, "user_id") : [],
            }
        case matchedUsersActionTypes.MATCHED_USERS_RESET_DATA:
            return initialState;
        default:
            return state || initialState;
    }
}

export default matchedReducer;