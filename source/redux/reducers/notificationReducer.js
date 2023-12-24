import { notificationActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
    loading: false,
    status: 0,
    error: "",
    notificationList: [],
    isLoadMoreLoading: false,
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Notification Screen
 */
const notificationReducer = (state, action) => {
    switch (action.type) {
        case notificationActionTypes.NOTIFICATION_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case notificationActionTypes.NOTIFICATION_FAILURE:
            return {
                ...state,
                loading: false,
                isLoadMoreLoading: false,
            }
        case notificationActionTypes.NOTIFICATION_SUCCESS:
            return {
                ...state,
                loading: false,
                notificationList: action.payload.notificationList,
                isLoadMoreLoading: false,
            }
        case notificationActionTypes.NOTIFICATION_DATA_SUCCESS:
            return {
                ...state,
                loading: false,
                isLoadMoreLoading: false,
            }
        case notificationActionTypes.NOTIFICATION_LOAD_MORE_REQUEST:
            return {
                ...state,
                isLoadMoreLoading: true,
            }
        case notificationActionTypes.NOTIFICATION_LOAD_MORE_FAILURE:
            return {
                ...state,
                isLoadMoreLoading: false,
            }
        case notificationActionTypes.NOTIFICATION_RESET_DATA:
            return initialState;
        default:
            return state || initialState;
    }
}

export default notificationReducer;