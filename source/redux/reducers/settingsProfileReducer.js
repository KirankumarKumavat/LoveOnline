import { profileSetupActionTypes } from "../types";
/**
 * initial stat for reducer
 */
const initialState = {
    loading: false,
    status: 0,
    error: "",
    activeProfileSetupStepIndex: 0,
    proffestionData: [],
    ethnicityData: [],
    casteData: [],
    educationData: [],
    selectedDegreeList: [],
    userProfileSetupDetails: {},
    promptQueData: [],
};

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Setting screen and related screens
 */
const settingsProfileReducer = (state, action) => {
    switch (action.type) {
        case profileSetupActionTypes.PROFILESETUP_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case profileSetupActionTypes.PROFILESETUP_FAILURE:
            return {
                ...state,
                loading: false,
            }
        case profileSetupActionTypes.PROFILESETUP_SUCCESS:
            return {
                ...state,
                loading: false,
            }
        default:
            return state || initialState;
    }
}

export default settingsProfileReducer;