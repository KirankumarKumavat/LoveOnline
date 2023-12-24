import { icons } from "../../assets";
import { commonText } from "../../common";
import JSFunctionUtils from "../../utils/JSFunctionUtils";
import { filterActionTypes } from "../types";

/**
 * initial stat for reducer
 */
const initialState = {
   loading: false,
   status: 0,
   error: "",
   proffestionData: [],
   educationData: [],
   selectedEducationData: [],
   isAnyAgeSelected: true,
   minAge: 18,
   maxAge: 35,
   selectedLocationIndex: "0",
   minLocation: 0,
   maxLocation: 250,
   isBlurPhoto: true,
   selectedEthnicityList: [],
   selectedMarriageGoalsList: [],
   selectedAboradGoalList: [],
   selectedMaritalStatusList: [],
   selectedSpiritualityList: [],
   seletedPrayList: [],
   selectedProffestionData: [],
   selectedCountryList: [],
   minHeight: 4,
   maxHeight: 7,
   filterMiniArray: [],
   filterPaidArray: [],
   isDefaultFilterSetup: true,
   filterDetails: {},
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * Reducer for Filter module
 */
const filterRedcer = (state, action) => {
   switch (action.type) {
      case filterActionTypes.FILTER_REQEST:
         return {
            ...state,
            loading: true,
         }
      case filterActionTypes.FILTER_SUCCESS:
         return {
            ...state,
            loading: false,
         }
      case filterActionTypes.FILTER_FAILURE:
         return {
            ...state,
            loading: false,
         }
      case filterActionTypes.FILTER_LOAD_PROFFESTION_DATA:
         return {
            ...state,
            loading: false,
            proffestionData: action.payload.proffestionData
         }
      case filterActionTypes.FILTER_ADD_PROFFESTION_DATA:
         return {
            ...state,
            loading: false,
            selectedProffestionData: JSFunctionUtils.uniqueArray(state.selectedProffestionData, [action.payload.proffestion], "profession_id"),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_REMOVE_PROFFESTION_DATA:
         return {
            ...state,
            loading: false,
            selectedProffestionData: state.selectedProffestionData.filter((obj) => obj.profession_id !== action.payload.proffestion.profession_id),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_LOAD_EDUCATION_DATA:
         return {
            ...state,
            loading: false,
            educationData: action.payload.educationData
         }
      case filterActionTypes.FILTER_ADD_EDUCATION_DATA:
         return {
            ...state,
            loading: false,
            selectedEducationData: JSFunctionUtils.uniqueArray(state.selectedEducationData, [action.payload.education], "education_id"),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_REMOVE_EDUCATION_DATA:
         return {
            ...state,
            loading: false,
            selectedEducationData: state.selectedEducationData.filter((obj) => obj.education_id !== action.payload.education.education_id)
            , isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_CHANGE_ANY_AGE_TOGGLE_VALUE:
         return {
            ...state,
            loading: false,
            isAnyAgeSelected: !state.isAnyAgeSelected,
            minAge: 18,
            maxAge: 55,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_SET_MIN_MAX_AGE_VALUE:
         return {
            ...state,
            loading: false,
            isAnyAgeSelected: false,
            minAge: action.payload.minAge,
            maxAge: action.payload.maxAge,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_CHANGE_LOCATION_SELECTED_INDEX:
         return {
            ...state,
            loading: false,
            selectedLocationIndex: state.selectedLocationIndex == action.payload.selectedLocationIndex
               ? action.payload.selectedLocationIndex == "0" ? "1" : "0"
               : action.payload.selectedLocationIndex,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_LOCATION_SET_MIN_MAX_LOCATION_DISTANCE:
         return {
            ...state,
            loading: false,
            selectedLocationIndex: "0",
            minLocation: action.payload.minLocation,
            maxLocation: action.payload.maxLocation,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_LOCATION_ADD_COUNTRY_TO_LIST:
         return {
            ...state,
            loading: false,
            selectedLocationIndex: "1",
            selectedCountryList: JSFunctionUtils.uniqueArray(state.selectedCountryList, [action.payload.country], "name"),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_LOCATION_REMOVE_COUNTRY_FROM_LIST:
         return {
            ...state,
            loading: false,
            selectedLocationIndex: "1",
            selectedCountryList: state.selectedCountryList.filter((obj) => obj.name !== action.payload.country.name),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_TOGGLE_BLUR_PHOTO:
         return {
            ...state,
            isBlurPhoto: !state.isBlurPhoto,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_ADD_MODAL_VALUE_TO_SPECIFIC_LIST:
         return {
            ...state,
            [action.payload.arrayName]: JSFunctionUtils.uniqueArray(state[action.payload.arrayName], [action.payload.selectedValue], [action.payload.key]),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_REMOVE_MODAL_VALUE_FROM_SPECIFIC_LIST:
         return {
            ...state,
            [action.payload.arrayName]: state[action.payload.arrayName].filter((obj) => obj[action.payload.key] != action.payload.selectedValue[action.payload.key]),
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_HEIGHT_SET_MIN_MAX_VALUE:
         return {
            ...state,
            minHeight: action.payload.minHeight,
            maxHeight: action.payload.maxHeight,
            isDefaultFilterSetup: false,
         }
      case filterActionTypes.FILTER_GET_ARRAY_LIST:
         return {
            ...state,
            filterMiniArray: getFilterArray(state, action),
            filterPaidArray: getFilterPaidArray(state, action),
         }
      case filterActionTypes.FILTER_STORE_DATA:
         return {
            ...state,
            filterDetails: {
               ...action.payload.filterDetails
            }
         }
      case filterActionTypes.FILTER_RESET_DATA:
         return {
            ...state,
            isDefaultFilterSetup: true,
            isAnyAgeSelected: true,
            minAge: 18,
            maxAge: 35,
            selectedLocationIndex: "0",
            minLocation: 0,
            maxLocation: 250,
            isBlurPhoto: true,
            selectedCountryList: [],
            selectedEthnicityList: [],
            selectedMarriageGoalsList: [],
            selectedAboradGoalList: [],
            selectedMaritalStatusList: [],
            selectedSpiritualityList: [],
            seletedPrayList: [],
            selectedProffestionData: [],
            selectedCountryList: [],
            minHeight: 4,
            maxHeight: 7,
            filterDetails: {},
            selectedEducationData: [],
         }
      default:
         return state || initialState;
   }
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * @returns array for default filters
 */
const getFilterArray = (state, action) => {
   let filterAge = {
      isAnyAge: state.isAnyAgeSelected,
      minAge: state.minAge,
      maxAge: state.maxAge,
      title: commonText.age,
      icon: icons.ageIcon,
      iconHeight: 20,
      iconWidth: 17,
      routeName: commonText.ageSliderRoute,
      apiKey1: "min_age",
      apiKey2: "max_age",
   }
   let filterLocation = {
      selectedLocationIndex: state.selectedLocationIndex,
      minLocation: state.minLocation,
      maxLocation: state.maxLocation,
      selectedCountryList: state.selectedCountryList,
      title: commonText.location,
      icon: icons.locationIcon,
      iconHeight: 19,
      iconWidth: 14,
      routeName: commonText.locationRoute,
      apiKey1: "min_distance",
      apiKey2: "max_distance",
      apiKey3: "countries",
   }
   let filterEthnicity = {
      selectedEthnicityList: state.selectedEthnicityList,
      title: commonText.ethnicity,
      icon: icons.casteIconGrey,
      iconHeight: 16,
      iconWidth: 16,
      isModal: true,
      apiKey1: "ethnicity",
   }
   let filterMiniArray = [
      filterAge,
      filterLocation,
      filterEthnicity,
   ]
   return filterMiniArray;
}

/**
 * 
 * @param {*} state 
 * @param {*} action 
 * @returns array for all filter (Paid User)
 */
const getFilterPaidArray = (state, action) => {
   let blurPhoto = {
      title: commonText.blurPhoto,
      isSwitch: true,
      isBlurPhoto: state.isBlurPhoto,
      icon: icons.blurImage,
      iconHeight: 14,
      iconWidth: 18,
      apiKey1: "want_blur_profiles",
   }
   let proffestion = {
      title: commonText.profession,
      icon: icons.ProfessionIconGrey,
      iconHeight: 13,
      iconWidth: 18,
      selectedProffestionData: state.selectedProffestionData,
      routeName: commonText.filterProfessionRoute,
      arrayName: 'selectedProffestionData',
      key: "profession_name",
      isArray: true,
      apiKey1: "profession_id",
      uniqueKey: "profession_id",
   }
   let education = {
      title: commonText.education,
      icon: icons.EducationIconGrey,
      iconHeight: 18,
      iconWidth: 18,
      selectedEducationData: state.selectedEducationData,
      arrayName: 'selectedEducationData',
      key: "education_degree",
      routeName: commonText.filterEducationRoute,
      isArray: true,
      apiKey1: "education_id",
      uniqueKey: "education_id",
   }
   let marriageGoal = {
      title: commonText.marriageGoal,
      icon: icons.MarriageGoalsGrey,
      iconHeight: 16,
      iconWidth: 16,
      // isModal: true,
      selectedMarriageGoalsList: state.selectedMarriageGoalsList,
      selectedAboradGoalList: state.selectedAboradGoalList,
      key: "goal_name",
      arrayName: "selectedMarriageGoalsList",
      arrayName2: "selectedAboradGoalList",
      key2: "abroad_name",
      routeName: commonText.filtermarriageGoalRoute,
      apiKey1: "marriage_goal",
      apiKey2: "abroad_goal",
      uniqueKey: "id",
      uniqueKey2: "id",
   }
   let maritalStatus = {
      title: commonText.maritalStatus,
      icon: icons.MaritalStatusiconGrey,
      iconHeight: 15,
      iconWidth: 15,
      selectedMaritalStatusList: state.selectedMaritalStatusList,
      key: "marital_status_name",
      arrayName: "selectedMaritalStatusList",
      isModal: true,
      apiKey1: "marital_status",
      uniqueKey: "marital_status_name",
   }
   let spirituality = {
      title: commonText.spirituality,
      icon: icons.casteIconGrey,
      iconHeight: 16,
      iconWidth: 16,
      isModal: true,
      arrayName: "selectedSpiritualityList",
      key: "spirituality_name",
      selectedSpiritualityList: state.selectedSpiritualityList,
      apiKey1: "spirituality",
      uniqueKey: "id",
   }
   let pray = {
      title: commonText.pray,
      icon: icons.prayIconGray,
      iconHeight: 16,
      iconWidth: 16,
      isModal: true,
      seletedPrayList: state.seletedPrayList,
      arrayName: "seletedPrayList",
      key: "pray_name",
      apiKey1: "pray",
      uniqueKey: "id",
   }
   let height = {
      title: commonText.height,
      icon: icons.HeightIconGrey,
      routeName: commonText.filterHeightRoute,
      minHeight: state.minHeight,
      maxHeight: state.maxHeight,
      iconHeight: 24,
      iconWidth: 10,
      apiKey1: "min_height",
      apiKey2: "max_height",
      isHeight: true
   }
   let filterPaidArray = [
      blurPhoto,
      proffestion,
      education,
      marriageGoal,
      maritalStatus,
      spirituality,
      pray,
      height,
   ]
   return filterPaidArray;
}

export default filterRedcer;