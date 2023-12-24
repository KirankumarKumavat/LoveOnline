import { profileSetupActionTypes } from "../types";
import JSFunctionUtils from "../../utils/JSFunctionUtils";
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
   selectedProffestionIndex: null
};
/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Profile setup creation
 */
const profileSetupReducer = (state, action) => {
   switch (action.type) {
      case profileSetupActionTypes.PROFILESETUP_INCREASE_INDEX:
         let increaseIndex =
            action.payload
               ? action.payload.specificIndex
                  ? action.payload.specificIndex + 1 :
                  action.payload.index
                     ? state.activeProfileSetupStepIndex + action.payload.index
                     : state.activeProfileSetupStepIndex + 1
               : state.activeProfileSetupStepIndex + 1
         return {
            ...state,
            activeProfileSetupStepIndex: increaseIndex
         }
      case profileSetupActionTypes.PROFILESETUP_INCREASE_EDIT_INDEX:
         let increaseEditIndex =
            action.payload.specificIndex + 1

         return {
            ...state,
            activeProfileSetupStepIndex: increaseEditIndex
         }
      case profileSetupActionTypes.PROFILESETUP_DECREASE_INDEX:
         let decreaseIndex = action.payload && action.payload.index ? state.activeProfileSetupStepIndex - action.payload.index : state.activeProfileSetupStepIndex - 1
         return {
            ...state,
            activeProfileSetupStepIndex: decreaseIndex
         }
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
      case profileSetupActionTypes.PROFILESETUP_GET_PROFESSTION_SUCCESS:
         return {
            ...state,
            loading: false,
            proffestionData: action.payload.proffestionData
         }
      case profileSetupActionTypes.PROFILESETUP_GET_ETHNICITY_SUCCESS:
         return {
            ...state,
            loading: false,
            ethnicityData: action.payload.ethnicityData
         }
      case profileSetupActionTypes.PROFILESETUP_GET_CASTS_SUCCESS:
         return {
            ...state,
            loading: false,
            casteData: action.payload.casteData
         }
      case profileSetupActionTypes.PROFILESETUP_GET_EDUCATION_SUCCESS:
         return {
            ...state,
            loading: false,
            educationData: action.payload.educationData
         }

      case profileSetupActionTypes.PROFILESETUP_ADD_EDUCATION_DEGREE:
         return {
            ...state,
            loading: false,
            selectedDegreeList: JSFunctionUtils.uniqueArray(state.selectedDegreeList, [action.payload.degree], "education_id")
         }
      case profileSetupActionTypes.PROFILESETUP_REMOVE_EDUCATION_DEGREE:
         return {
            ...state,
            loading: false,
            selectedDegreeList: state.selectedDegreeList.filter((obj) => obj.education_id !== action.payload.degree.education_id)
         }
      case profileSetupActionTypes.PROFILESETUP_GET_QUEANS_ARRAY_LIST:
         return {
            ...state,
            loading: false,

         }
      case profileSetupActionTypes.PROFILESETUP_GET_USER_PROFILE_DETAILS:
         return {
            ...state,
            loading: false,
            userProfileSetupDetails: action.payload.userProfileDetails,
            selectedDegreeList: action.payload.userProfileDetails && action.payload.userProfileDetails.educations && action.payload.userProfileDetails.educations.length
               ? action.payload.userProfileDetails.educations : []
         }
      case profileSetupActionTypes.PROFILE_SETUP_GET_PROMPT_QUE_SUCCESS:
         return {
            ...state,
            loading: false,
            promptQueData: action.payload.promptQueData,
         }
      case profileSetupActionTypes.PROFESSION_INDEX:
         return {
            ...state,
            loading: false,
            selectedProffestionIndex: action.payload.selectedProffestionIndex

         }
      case profileSetupActionTypes.PROFILSETUP_RESET_DATA:
         return initialState;
      default:
         return state || initialState;
   }
}

export default profileSetupReducer;