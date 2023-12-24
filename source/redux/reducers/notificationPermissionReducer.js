import { notificationPermissionActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
    loader: false,
    status: 0,
    error: "",
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Notification Permission state
 */
const notificationPermissionReducer = (state, action) => {
    switch (action.type) {
        case notificationPermissionActionTypes.NOTIFICATION_PERMISSION_REQUEST:
            return {
                ...state,
                loader: true,
            }
        case notificationPermissionActionTypes.NOTIFICATION_PERMISSION_FAILURE:
            return {
                ...state,
                loader: false,
            }
        case notificationPermissionActionTypes.NOTIFICATION_PERMISSION_SUCCESS:
            return {
                ...state,
                loader: false,
            }
        default:
            return state || initialState;
    }
}

export default notificationPermissionReducer;