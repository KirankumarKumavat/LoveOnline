import { profileSetupActionTypes, signupActionTypes, loginActionTypes, forgotPasswordActionTypes, userProfileActionTypes, exploreActionTypes, filterActionTypes, likeActionTypes, chatActionTypes, matchedUsersActionTypes, notificationActionTypes, notificationPermissionActionTypes, subscribtionActionTypes } from "./types";

/** login module related actions */
export const loginRequest = (payload) => ({
   type: loginActionTypes.LOGIN_REQUEST,
   payload,
})

export const loginSuccess = (payload) => ({
   type: loginActionTypes.LOGIN_SUCCESS,
   payload,
})

export const loginFailure = (payload) => ({
   type: loginActionTypes.LOGIN_FAILURE,
   payload,
})

export const loginResetData =
   () => ({
      type: loginActionTypes.LOGIN_RESET_DATA,
   })

/** Signup module related actions  */
export const signUpRequest = () => ({
   type: signupActionTypes.SIGNUP_REQUEST,
})

export const signUpSuccess = (payload) => ({
   type: signupActionTypes.SIGNUP_SUCCESS,
   payload,
})

export const signUpFailure = (payload) => ({
   type: signupActionTypes.SIGNUP_FAILURE,
   payload,
})

export const signUpResetData = () => ({
   type: signupActionTypes.SIGNUP_RESET_DATA,
})

/** Profile Setup Related action  */
export const profileSetupIncreaseIndex = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_INCREASE_INDEX,
   payload,

})

export const profileSetupIncreaseEditIndex = (payload) => {
   return ({

      type: profileSetupActionTypes.PROFILESETUP_INCREASE_EDIT_INDEX,
      payload,
   })
}

export const profileSetupDecreaseIndex = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_DECREASE_INDEX,
   payload,
})

export const profileSetupRequest = () => ({
   type: profileSetupActionTypes.PROFILESETUP_REQUEST,
})

export const profileSetupFailure = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_FAILURE,
   payload,
})

export const profileSetupSuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_SUCCESS,
   payload,
})

export const profileSetupGetProffestionSuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_GET_PROFESSTION_SUCCESS,
   payload,
})

export const profileSetupGetEthinicitySuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_GET_ETHNICITY_SUCCESS,
   payload,
})

export const profileSetupGetCasteSuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_GET_CASTS_SUCCESS,
   payload,
})

export const profileSetupGetEducationSuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_GET_EDUCATION_SUCCESS,
   payload,
})

export const profileSetupAddDegreeToList = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_ADD_EDUCATION_DEGREE,
   payload,
})

export const profileSetupRemoveDegreeFromList = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_REMOVE_EDUCATION_DEGREE,
   payload,
})

export const userProfileSetupSaveDetails = (payload) => ({
   type: profileSetupActionTypes.PROFILESETUP_GET_USER_PROFILE_DETAILS,
   payload,
})

export const profileSetupGetPromptQueSuccess = (payload) => ({
   type: profileSetupActionTypes.PROFILE_SETUP_GET_PROMPT_QUE_SUCCESS,
   payload,
})

export const profileSetupResetData = (payload) => ({
   type: profileSetupActionTypes.PROFILSETUP_RESET_DATA,
})

/**Forgot password and reset password related actions */
export const forgotPasswordRequest = () => ({
   type: forgotPasswordActionTypes.FORGOT_PASSWORD_REQUEST
})

export const forgotPasswordSuccess = () => ({
   type: forgotPasswordActionTypes.FORGOT_PASSWORD_SUCCESS
})

export const forgotPasswordFailure = () => ({
   type: forgotPasswordActionTypes.FORGOT_PASSWORD_FAILURE
})

export const forgotPasswordResetData = () => ({
   type: forgotPasswordActionTypes.FORGOT_PASSWORD_RESET_DATA
})

/**  User Profile related actions */

export const userProfileRequest = (payload) => ({
   type: userProfileActionTypes.USER_PROFILE_REQUEST,
   payload,
})

export const uesrProfileSuccess = (payload) => ({
   type: userProfileActionTypes.USER_PROFILE_SUCCESS,
   payload
})

export const userProfileFailure = (payload) => ({
   type: userProfileActionTypes.USER_PROFILE_FAILURE,
   payload
})

export const userProfileGetProfileDetails = (payload) => ({
   type: userProfileActionTypes.USER_PROFILE_GET_PROFILE_DATA,
   payload,
})

export const userProfileResetData = () => ({
   type: userProfileActionTypes.USER_PROFILE_RESET_DATA
})

export const selectProffestionIndex = (payload) => ({
   type: profileSetupActionTypes.PROFESSION_INDEX,
   payload
})


/** Explore Screen related actions */
export const exploreRequest = (payload) => ({
   type: exploreActionTypes.EXPLORE_REQUEST,
   payload
})

export const exploreSuccess = (payload) => ({
   type: exploreActionTypes.EXPLORE_SUCCESS,
   payload
})

export const exploreFailure = (payload) => ({
   type: exploreActionTypes.EXPLORE_FAILURE,
   payload
})

export const exploreGetOppositeGenderData = (payload) => ({
   type: exploreActionTypes.EXPLORE_LOAD_USER_DATA,
   payload
})

export const exploreLoadUserProfileDetails = (payload) => ({
   type: exploreActionTypes.EXPLORE_LOAD_USER_PROFILE_DATA,
   payload,
})

export const exploreResetData = () => ({
   type: exploreActionTypes.EXPLORE_RESET_DATA,
})

export const exploreSetNoUserProfileFound = () => ({
   type: exploreActionTypes.EXPLORE_SET_NO_PROFILE_FOUND
})

export const exploreSetEmptyData = () => ({
   type: exploreActionTypes.EXPLORE_SET_BLANK_DATA
})

export const exploreLoadUserList = (payload) => ({
   type: exploreActionTypes.EXPLORE_LOAD_USER_LIST_FROM_BACKEND,
   payload,
})

export const expoloreReduceUserList = () => ({
   type: exploreActionTypes.EXPLORE_REDUCE_USER_LIST,
})

export const exploreResetUserList = () => ({
   type: exploreActionTypes.EXPLORE_RESET_USER_LIST,
})

export const exploreSetNoMoreDataForList = (payload) => ({
   type: exploreActionTypes.EXPLORE_SET_NO_MORE_DATA,
   payload,
})

/** filter related actions */
export const filterRequest = (payload) => ({
   type: filterActionTypes.FILTER_REQEST,
})

export const filterSuccess = (payload) => ({
   type: filterActionTypes.FILTER_SUCCESS,
   payload
})

export const filterFailure = (payload) => ({
   type: filterActionTypes.FILTER_FAILURE,
   payload
})

export const filterResetData = () => ({
   type: filterActionTypes.FILTER_RESET_DATA,
})

export const filterGetProffestionData = (payload) => ({
   type: filterActionTypes.FILTER_LOAD_PROFFESTION_DATA,
   payload
})

export const filterGetEducationData = (payload) => ({
   type: filterActionTypes.FILTER_LOAD_EDUCATION_DATA,
   payload
})

export const filterAddProffestionData = (payload) => ({
   type: filterActionTypes.FILTER_ADD_PROFFESTION_DATA,
   payload
})

export const filterProffestioRemoveData = (payload) => ({
   type: filterActionTypes.FILTER_REMOVE_PROFFESTION_DATA,
   payload
})

export const filterAddEducationData = (payload) => ({
   type: filterActionTypes.FILTER_ADD_EDUCATION_DATA,
   payload
})

export const filterEducationRemoveData = (payload) => ({
   type: filterActionTypes.FILTER_REMOVE_EDUCATION_DATA,
   payload
})

export const filterToggleAnyAge = (payload) => ({
   type: filterActionTypes.FILTER_CHANGE_ANY_AGE_TOGGLE_VALUE,
   payload
})

export const filterSetMinMaxAge = (payload) => ({
   type: filterActionTypes.FILTER_SET_MIN_MAX_AGE_VALUE,
   payload
})

export const filterToggleLocationIndex = (payload) => ({
   type: filterActionTypes.FILTER_CHANGE_LOCATION_SELECTED_INDEX,
   payload,
})

export const filterSetMinMaxLocationDistance = (payload) => ({
   type: filterActionTypes.FILTER_LOCATION_SET_MIN_MAX_LOCATION_DISTANCE,
   payload,
})

export const filterAddCountryToList = (payload) => ({
   type: filterActionTypes.FILTER_LOCATION_ADD_COUNTRY_TO_LIST,
   payload,
})

export const filterRemoveCountryFromList = (payload) => ({
   type: filterActionTypes.FILTER_LOCATION_REMOVE_COUNTRY_FROM_LIST,
   payload,
})

export const filterToggleBlurPhoto = () => ({
   type: filterActionTypes.FILTER_TOGGLE_BLUR_PHOTO,
})

export const filterAddValueToSpecificList = (payload) => ({
   type: filterActionTypes.FILTER_ADD_MODAL_VALUE_TO_SPECIFIC_LIST,
   payload,
})

export const filterRemoveValueFromSpecificList = (payload) => ({
   type: filterActionTypes.FILTER_REMOVE_MODAL_VALUE_FROM_SPECIFIC_LIST,
   payload,
})

export const filterSetMinMaxHeightValue = (payload) => ({
   type: filterActionTypes.FILTER_HEIGHT_SET_MIN_MAX_VALUE,
   payload,
})

export const getFilterArray = () => ({
   type: filterActionTypes.FILTER_GET_ARRAY_LIST,
})

export const storeFilterData = (payload) => ({
   type: filterActionTypes.FILTER_STORE_DATA,
   payload,
})

/***Like screen related actions */
export const likeChangeSelectedIndex = (payload) => ({
   type: likeActionTypes.LIKE_CHANGE_SELECTED_TAB_INDEX,
   payload,
})

export const likeRequest = () => ({
   type: likeActionTypes.LIKE_REQUEST,
})

export const likeSuccess = (payload) => ({
   type: likeActionTypes.LIKE_SUCCESS,
   payload
})

export const likeFailure = (payload) => ({
   type: likeActionTypes.LIKE_FAILURE,
   payload
})

export const likeResetData = (payload) => ({
   type: likeActionTypes.LIKE_RESET_DATA,
   payload,
})

export const likeLoadDataForUserList = (payload) => ({
   type: likeActionTypes.LIKE_LOAD_USER_LIST_DATA,
   payload,
})

export const likeSetSearchUserList = (payload) => ({
   type: likeActionTypes.LIKE_SET_SEARCHED_VALUE,
   payload,
})

export const likeResetSpecificTabList = (payload) => ({
   type: likeActionTypes.LIKE_RESET_SPECIFIC_TAB_LIST,
   payload,
})


/** Chat Module Related Actions */
export const chatRequest = () => ({
   type: chatActionTypes.CHAT_REQUEST,
})

export const chatSuccess = () => ({
   type: chatActionTypes.CHAT_SUCCESS,
})

export const chatFailure = () => ({
   type: chatActionTypes.CHAT_FAILURE,
})

export const chatLoadUserList = (payload) => ({
   type: chatActionTypes.CHAT_LOAD_USER_LIST,
   payload,
})

export const chatLaodUserMessageList = (payload) => ({
   type: chatActionTypes.CHAT_LOAD_USER_CHAT_MESSAGE_LIST,
   payload,
})

export const chatSetSearchedArrayList = (payload) => ({
   type: chatActionTypes.CHAT_SET_SEARCHED_VALUE,
   payload,
})

export const resetChatMessages = () => ({
   type: chatActionTypes.CHAT_RESET_MESSAGES
})

export const chatSetMessageList = (payload) => ({
   type: chatActionTypes.CHAT_SET_MESSAGES,
   payload,
})

export const chatGetOldMessageList = (payload) => ({
   type: chatActionTypes.CHAT_GET_OLD_MESSAGES,
   payload,
})

export const chatGetNewMessage = (payload) => ({
   type: chatActionTypes.CHAT_GET_NEW_MESSAGE,
   payload,
})

export const chatAddBadgeToList = (payload) => ({
   type: chatActionTypes.CHAT_ADD_BADGE_TO_LIST,
   payload,
})

export const chatRemoveBadgeFromList = (payload) => ({
   type: chatActionTypes.CHAT_REMOVE_BADGE_FROM_LIST,
   payload,
})

export const chatBadGeListReset = () => ({
   type: chatActionTypes.RESET_CHAT_BADGE_LIST
})

export const chatResetData = () => ({
   type: chatActionTypes.CHAT_RESET_DATA,
})
//Matched users
export const matchUsersRequest = () => ({
   type: matchedUsersActionTypes.MATCHED_USERS_REQUEST,
})

export const matchUsersFailure = () => ({
   type: matchedUsersActionTypes.MATCHED_USERS_FAILURE,
})

export const matchUsersSuccess = (payload) => ({
   type: matchedUsersActionTypes.MATCHED_USERS_SUCCESS,
   payload,
})

export const matchedUserResetData = () => ({
   type: matchedUsersActionTypes.MATCHED_USERS_RESET_DATA
})

//Notification List

export const notificationRequest = () => ({
   type: notificationActionTypes.NOTIFICATION_REQUEST,
})

export const notificationFailure = () => ({
   type: notificationActionTypes.NOTIFICATION_FAILURE,
})

export const notificationSuccess = (payload) => ({
   type: notificationActionTypes.NOTIFICATION_SUCCESS,
   payload,
})

export const notificationDataSuccess = (payload) => ({
   type: notificationActionTypes.NOTIFICATION_DATA_SUCCESS
})

export const notificationResetData = () => ({
   type: notificationActionTypes.NOTIFICATION_RESET_DATA
})

export const notificationLoadMoreRequest = () => ({
   type: notificationActionTypes.NOTIFICATION_LOAD_MORE_REQUEST
})

export const notificationLoadMoreFailure = () => ({
   type: notificationActionTypes.NOTIFICATION_LOAD_MORE_FAILURE
})
//Notification Permission

export const notificationPermissionRequest = () => ({
   type: notificationPermissionActionTypes.NOTIFICATION_PERMISSION_REQUEST,
})

export const notificationPermissionSuccess = (payload) => ({
   type: notificationPermissionActionTypes.NOTIFICATION_PERMISSION_FAILURE,
   payload,
})

export const notificationPermissionFailure = (payload) => ({
   type: notificationPermissionActionTypes.NOTIFICATION_PERMISSION_FAILURE,
   payload,
})

/**Subscribtion Related actions */

export const subscribtionRequest = () => ({
   type: subscribtionActionTypes.SUBSCRIBTION_REQUEST,
})

export const subscribtionFailure = () => ({
   type: subscribtionActionTypes.SUBSCRIBTION_FAILURE,
})

export const subscribtionSuccess = (payload) => ({
   type: subscribtionActionTypes.SUBSCRIBTION_SUCCESS,
   payload
})

export const subscribtionLoadProductList = (payload) => ({
   type: subscribtionActionTypes.SUBSCRIBTION_LOAD_PRODUCT_LIST,
   payload,
})

export const subscribtionResetData = () => ({
   type: subscribtionActionTypes.SUBSCRIBTION_RESET_DATA,
})

export const subscribtionLoadIAPplanList = (payload) => ({
   type: subscribtionActionTypes.SUBSCRIBTION_LOAD_IAP_PRDUCT_LIST,
   payload,
})

export const subsctiontionStoreSelectedPlanDetails = (payload) => ({
   type: subscribtionActionTypes.SUBSCRIBTION_STORE_SELECTED_PLAN_DETAILS,
   payload,
})

export const subscribtionSelectPlanIndex = (payload) => ({
   type: subscribtionActionTypes.SUBSCRIBTION_SELECT_PLAN_INDEX,
   payload,
})