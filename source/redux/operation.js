import {
   signUpRequest, signUpFailure, signUpSuccess, profileSetupRequest,
   profileSetupFailure, profileSetupGetProffestionSuccess,
   profileSetupSuccess, profileSetupIncreaseIndex,
   profileSetupGetEthinicitySuccess, profileSetupGetCasteSuccess,
   profileSetupGetEducationSuccess, userProfileSetupSaveDetails,
   profileSetupGetPromptQueSuccess, forgotPasswordRequest,
   forgotPasswordFailure,
   forgotPasswordSuccess, loginRequest, loginFailure,
   loginSuccess, userProfileRequest,
   uesrProfileSuccess, userProfileFailure, userProfileGetProfileDetails,
   exploreRequest, exploreSuccess,
   exploreFailure, exploreGetOppositeGenderData, filterRequest,
   filterFailure, filterGetProffestionData,
   filterGetEducationData, likeRequest, likeFailure, likeSuccess,
   likeLoadDataForUserList, chatRequest, chatSuccess,
   chatLoadUserList, chatSetMessageList, chatGetOldMessageList,
   chatFailure, exploreSetNoUserProfileFound, profileSetupResetData,
   exploreResetData, filterResetData, likeResetData, chatResetData,
   matchUsersFailure, matchUsersRequest, matchUsersSuccess,
   exploreSetEmptyData, exploreLoadUserList, expoloreReduceUserList,
   notificationRequest, notificationSuccess, notificationFailure,
   notificationPermissionRequest, notificationPermissionSuccess,
   notificationPermissionFailure, exploreSetNoMoreDataForList,
   subscribtionRequest, subscribtionLoadProductList,
   subscribtionFailure, notificationDataSuccess,
   userProfileResetData, exploreLoadUserProfileDetails, notificationLoadMoreRequest, notificationLoadMoreFailure
} from "./action"
import r from "../api/Request";
import notifications from "../utils/notifications";
import NavigationService from "../utils/NavigationService";
import { commonText, constants } from "../common";
import UserUtils from "../utils/UserUtils";
import { Store } from '../redux/reduxStore';
import StorageService from "../utils/StorageService";
import { GoogleSignin, } from '@react-native-google-signin/google-signin';
import { checkLocationAvaibility, imageConvertTobase64, showSimpleAlert } from "../utils/HelperFunction";
import { LoginManager } from "react-native-fbsdk-next";
import { exploreRef } from "../screens/explore/Explore";
import Socket from '../api/Socket';
import { liketabRef } from "../screens/like/Like";
import { chatListRef } from "../screens/chat/Chat";
import { chatWindowRef } from "../screens/chat/ChatWindow";
import { profilePicRef } from "../screens/profilePics/ProfilePics";
import { Alert, } from "react-native";
import { settingTabRef } from "../screens/setting/Setting";
import { filterRef } from "../screens/explore/Filter";
import { showToastMessage } from "../components/ToastUtil";
import { CustomSettingsIconRef } from "../components/CustomSettingsIcon";
import BackgroundTimer from 'react-native-background-timer';

/**action for sign up with email address */
export const signUpWithEmail = ({ email }) => (
   async (dispatch) => {
      dispatch(signUpRequest());
      const response = await r.post("sendVerificationCode", { email });
      if (response.code === 1) {
         dispatch(signUpSuccess(response.data));
         if (response.data.password == null) {
            notifications.alert({ message: response.message })
            NavigationService.navigate(commonText.genderSelectionRoute, { email })
         }
         else if (response.data.password && response.data.is_profile_complete == 0) {
            r.setToken(response.auth_token);
            await UserUtils.setUserDetailsToAsyncStorage(response.data);
            NavigationService.resetAction(commonText.profileSetUpRoute)
         }
         else {
            // notifications.alert({ message: response.message })
         }
      }
      else {
         dispatch(signUpFailure());
         notifications.alert({ message: response.message })
      }
   }
)

/**action for  verify code */
export const verifyCode = (params, navParams) => (
   async (dispatch) => {
      dispatch(signUpRequest());
      const response = await r.post('verifyCode', params);
      if (response.code === 1) {
         dispatch(signUpSuccess(response.data));
         NavigationService.resetAction(commonText.enterPasswordRoute, { ...navParams })
      }
      else {
         dispatch(signUpFailure());
         notifications.alert({ message: response.message })
      }
   }
)

/**action for resend verification code  */
export const resendOtpVerificationCode = (params) => (
   async (dispatch) => {
      dispatch(signUpRequest());
      const response = await r.post('resendVerificationCode', params);
      if (response.code === 1) {
         notifications.alert({ message: response.message })
         dispatch(signUpSuccess(response.data));
      }
      else {
         dispatch(signUpFailure());
         notifications.alert({ message: response.message })
      }
   }
)
/**action for signup */
export const signUp = (params) => (
   async (dispatch) => {
      const deviceToken = await r.getDeviceToken();
      dispatch(signUpRequest());
      const response = await r.post('signup', params);
      if (response.code === 1) {
         dispatch(signUpSuccess(response.data));
         await r.setToken(response.auth_token);
         r.post("setDeviceToken", { device_token: deviceToken, })
         await UserUtils.setUserDetailsToAsyncStorage(response.data);
         NavigationService.resetAction(commonText.profileSetUpRoute)
      }
      else {
         dispatch(signUpFailure());
         notifications.alert({ message: response.message })
      }
   }
)
/**action for get the user professtion details */
export const getUserProfesstionData = (isFromFilter) => (
   async (dispatch) => {
      let actions;
      if (isFromFilter) {
         actions = {
            request: filterRequest,
            success: filterGetProffestionData,
            failure: filterFailure
         }
      }
      else {
         actions = {
            request: profileSetupRequest,
            success: profileSetupGetProffestionSuccess,
            failure: profileSetupFailure
         }
      }
      dispatch(actions.request())
      const response = await r.get("professions");
      if (response.code === 1) {
         dispatch(actions.success({
            proffestionData: response.data
         }))
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for save user profile setup details */
export const saveProfileSetupDetails = (params, userIsSingle, isLastStep, isAboutSelf, isFinalStep, isFromHome, isFromSettingsStack, isFromSettingTab, isFromEditDOB) => (
   async (dispatch) => {
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      const finalParams = { ...params, user_id: userDetails.user_id, }
      let activeStepIndex = Store.getState().profileSetupState.activeProfileSetupStepIndex;
      let profileStatus;
      let actions;
      if (isFromHome) {
         actions = {
            success: exploreSuccess,
            failure: exploreFailure
         }
      }
      else if (isFromSettingTab) {
         actions = {
            success: uesrProfileSuccess,
            failure: userProfileFailure,
         }
      }
      else {
         actions = {
            success: profileSetupSuccess,
            failure: profileSetupFailure
         }
      }
      if (isAboutSelf) {
         profileStatus = "ABOUTME"
      }
      else {
         profileStatus = activeStepIndex
      }
      if (isFromHome) {
         // dispatch()
      }
      else if (isFromSettingTab) {
         dispatch(uesrProfileSuccess())
      }
      else {
         dispatch(profileSetupRequest())
      }
      const response = await r.post("profile", finalParams);
      if (response.code === 1) {
         if (isFromHome) {
            dispatch(exploreSuccess())
         }
         else if (isFromSettingTab) {
            dispatch(uesrProfileSuccess())
            dispatch(getUserProfileSetupData(true))
         }
         else {
            if (isFromEditDOB) {

            }
            else {
               dispatch(profileSetupSuccess())
            }
            await UserUtils.setUserDetailsToAsyncStorage(response.data);
            await UserUtils.setUserProfileSetupDetailsToAsyncStorage(profileStatus)
            if (userIsSingle) {
               dispatch(profileSetupIncreaseIndex({ index: 2 }));
            }
            else if (isLastStep) {
               if (isFromSettingsStack) {
                  NavigationService.goBack()
                  showToastMessage(response.message)
               }
               else {
                  dispatch(profileSetupIncreaseIndex({ specificIndex: 13 }))
                  NavigationService.navigate(commonText.profileSetupStepsRoute)
               }
            }
            else if (isAboutSelf) {
               if (isFromSettingsStack) {
                  NavigationService.goBack()
                  showToastMessage(response.message)
               }
               else {
                  NavigationService.navigate(commonText.profilePicsRoute)
               }
            }
            else if (isFinalStep) {
               if (profilePicRef) {
                  profilePicRef.resetAllData()
               }
               dispatch(notificationPermission({}, true));
               dispatch(profileSetupResetData())
               NavigationService.resetAction("App")
               dispatch(sendAppStatus({ status: 1 }))
            }
            else {
               if (isFromSettingsStack) {
                  NavigationService.goBack()
                  showToastMessage(response.message)
               }
               else {
                  dispatch(profileSetupIncreaseIndex())
               }
            }
         }
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for save blue data of user */
export const saveBlurData = (params, isFromSetting) => (
   async (dispatch) => {
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      const finalParams = { ...params, user_id: userDetails.user_id, }
      let actions = {
         request: profileSetupRequest,
         success: profileSetupSuccess,
         failure: profileSetupFailure
      }
      if (isFromSetting) {
         actions = {
            request: userProfileRequest,
            success: uesrProfileSuccess,
            failure: userProfileFailure
         }
      }
      else {
         actions = {
            request: profileSetupRequest,
            success: profileSetupSuccess,
            failure: profileSetupFailure
         }
      }
      dispatch(actions.request())
      const response = await r.post("profile", finalParams);
      if (response.code === 1) {
         dispatch(uesrProfileSuccess())
         dispatch(getUserProfileSetupData(true))
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for send verification code Mobile number verification  */
export const sendOtpToPhone = (params, isFromResend) => (
   async (dispatch) => {
      dispatch(profileSetupRequest());
      let activeStepIndex = Store.getState().profileSetupState.activeProfileSetupStepIndex;
      const response = await r.post("sendOTP", params);
      if (response.code === 1) {
         dispatch(profileSetupSuccess())
         notifications.alert({ message: response.message })
         if (isFromResend) {
         }
         else {
            await UserUtils.setUserProfileSetupDetailsToAsyncStorage(activeStepIndex)
            dispatch(profileSetupIncreaseIndex())
         }
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for verify otp for mobile no */
export const verifyOTPOfPhone = (params) => (
   async (dispatch) => {
      dispatch(profileSetupRequest());
      let activeStepIndex = Store.getState().profileSetupState.activeProfileSetupStepIndex;
      const response = await r.post("verifyOTP", params);
      if (response.code === 1) {
         dispatch(profileSetupSuccess())
         notifications.alert({ message: response.message })
         await UserUtils.setUserProfileSetupDetailsToAsyncStorage(activeStepIndex)
         dispatch(profileSetupIncreaseIndex())
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the ethinicity details */
export const getEthnicityData = () => (
   async (dispatch) => {
      dispatch(profileSetupRequest());
      const response = await r.get("ethnicities");
      if (response.code === 1) {
         dispatch(profileSetupGetEthinicitySuccess({
            ethnicityData: response.data
         }))
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the cast details */
export const getCastData = () => (
   async (dispatch) => {
      dispatch(profileSetupRequest());
      const response = await r.get("casts");
      if (response.code === 1) {
         dispatch(profileSetupGetCasteSuccess({
            casteData: response.data
         }))
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the educaion details */
export const getEducationData = (isFromFilter) => (
   async (dispatch) => {
      let actions;
      if (isFromFilter) {
         actions = {
            request: filterRequest,
            success: filterGetEducationData,
            failure: filterFailure
         }
      }
      else {
         actions = {
            request: profileSetupRequest,
            success: profileSetupGetEducationSuccess,
            failure: profileSetupFailure
         }
      }
      dispatch(actions.request())
      const response = await r.get("educations");
      if (response.code === 1) {
         dispatch(actions.success({
            educationData: response.data
         }))
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**get the user profile setup details */
export const getUserProfileSetupData = (isFromSettings, isFromPic) => (
   async (dispatch) => {
      let actions;
      if (isFromSettings) {
         actions = {
            request: userProfileRequest,
            success: userProfileGetProfileDetails,
            failure: userProfileFailure
         }
      }
      else {
         if (isFromPic) {
            actions = {
               request: profileSetupRequest,
               success: userProfileSetupSaveDetails,
               failure: profileSetupFailure
            }
         }
         else {
            actions = {
               request: profileSetupRequest,
               success: userProfileSetupSaveDetails,
               failure: profileSetupFailure
            }
         }
      }
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let user_id = userDetails.user_id;
      let endPoint = `profile?user_id=${user_id}`
      if (isFromPic) {
      }
      else {
         dispatch(actions.request())
      }
      const response = await r.get(endPoint);
      if (response.code === 1) {
         dispatch(actions.success({
            userProfileDetails: response.data
         }))
         await UserUtils.setUserDetailsToAsyncStorage(response.data)
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the matched user details */
export const getMatchedUserProfileData = () => (
   async (dispatch) => {
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let user_id = userDetails.user_id;
      let endPoint = `matchedUsers?user_id=${user_id}`
      dispatch(matchUsersRequest());
      const response = await r.get(endPoint);
      if (response.code === 1) {
         dispatch(matchUsersSuccess({
            matchedUsers: response.data
         }))
      }
      else {
         dispatch(matchUsersFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the notification related details */
export const getNotificationData = (params, FromSettings, isFromLoadMore) => (
   async (dispatch) => {
      let page = 1;
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let user_id = userDetails.user_id;
      let endPoint;
      if (FromSettings) {
         endPoint = `getNotifications?user_id=${user_id}&page_no=${1}`
      }
      else {
         endPoint = `getNotifications?user_id=${user_id}&page_no=${params}`
      }
      if (isFromLoadMore) {
         dispatch(notificationLoadMoreRequest())
      }
      else {
         dispatch(notificationRequest());
      }
      const response = await r.get(endPoint);
      if (response.code === 1) {
         dispatch(notificationSuccess({
            notificationList: response.data
         }))
      }
      else {
         dispatch(notificationFailure())
         dispatch(notificationLoadMoreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**get the all question for profile setup */
export const getPromptQuestionArray = () => (
   async (dispatch) => {
      dispatch(profileSetupRequest());
      const response = await r.get("questions");
      if (response.code === 1) {
         dispatch(profileSetupGetPromptQueSuccess({
            promptQueData: response.data
         }))
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for upload user profile picture */
export const uploadProfilePicture = (params, isFromEdit) => (
   async (dispatch) => {
      let actions;
      if (isFromEdit) {
         actions = {
            request: userProfileRequest,
            success: uesrProfileSuccess,
            failure: userProfileFailure
         }
      }
      else {
         actions = {
            request: profileSetupSuccess,
            failure: profileSetupFailure,
            success: uesrProfileSuccess,
         }
      }
      dispatch(actions.request())
      const response = await r.post("profilePicture", params)
      if (response.code === 1) {
         dispatch(actions.success())
         if (isFromEdit) {
            dispatch(getUserProfileSetupData(true, null));
         }
         else {
            dispatch(getUserProfileSetupData(null, true));
         }
         let profileStatus = "MYPROFILEPICS";
         await UserUtils.setUserProfileSetupDetailsToAsyncStorage(profileStatus)
         showToastMessage("Your Profile Picture uploaded successfully.")
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for delete user profile picture */
export const deleteProfilePicture = (params, isFromEdit) => (
   async (dispatch) => {
      let endPoint = `profilePicture?profile_photo_id=${params.profile_photo_id}`
      const response = await r.delete(endPoint, params);
      if (response.code === 1) {
         dispatch(profileSetupSuccess())
         if (isFromEdit) {
            dispatch(getUserProfileSetupData(true, null))
         }
         else {
            dispatch(getUserProfileSetupData(null, true))
         }
      }
      else {
         dispatch(profileSetupFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for forgot password  */
export const forgotPassword = (params) => (
   async (dispatch) => {
      dispatch(forgotPasswordRequest())
      const response = await r.post("forgotPassword", params);
      if (response.code === 1) {
         dispatch(forgotPasswordSuccess());
         showSimpleAlert(commonText.resetLinkMessage)
         NavigationService.goBack();
      }
      else {
         dispatch(forgotPasswordFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for reset password */
export const resetPassword = (params) => (
   async (dispatch) => {
      dispatch(forgotPasswordRequest())
      const response = await r.post("resetPassword", params);
      if (response.code === 1) {
         dispatch(forgotPasswordSuccess());
         NavigationService.resetAction(commonText.loginRoute)
      }
      else {
         dispatch(forgotPasswordFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for perform login via email address and Social login-google,facebook,apple.. */
export const login = (params, isSocialLogin, isFromSignup) => (
   async (dispatch) => {
      let action;
      if (isFromSignup) {
         action = {
            request: signUpRequest,
            success: signUpSuccess,
            failure: signUpFailure,
         }
      }
      else {
         action = {
            request: loginRequest,
            success: loginSuccess,
            failure: loginFailure,
         }
      }
      const deviceToken = await r.getDeviceToken();
      dispatch(action.request());
      const response = await r.post("signin", params);
      if (response.code === 1) {
         dispatch(action.success({
            userDetails: response.data
         }))
         dispatch(notificationPermission({}, true));
         if (isSocialLogin) {
            if (response && response.data) {
               if (response.data.gender && response.data.date_of_birth) {
                  await r.setToken(response.auth_token)
                  await UserUtils.setUserDetailsToAsyncStorage(response.data);
                  if (response.data.is_profile_complete == 1) {
                     NavigationService.resetAction("App");
                     dispatch(sendAppStatus({ status: 1 }));
                     await r.post("setDeviceToken", { device_token: deviceToken })
                  }
                  else if (response.data.is_profile_complete == 0) {
                     NavigationService.resetAction(commonText.profileSetUpRoute)
                  }
               }
               else {
                  //GO TO GENDER
                  NavigationService.navigate(commonText.genderSelectionRoute, {
                     email: response.data.email,
                     google_id: response.data.google_id,
                     facebook_id: response.data.facebook_id,
                     apple_id: response.data.apple_id,
                     isSocialLogin,
                     isOnlygoogle: params.google_id ? true : false,
                     isOnlyApple: params.apple_id ? true : false,
                     isOnlyFaceBook: params.facebook_id ? true : false,
                  })
               }
            }
         }
         else {
            await r.setToken(response.auth_token)
            await UserUtils.setUserDetailsToAsyncStorage(response.data);
            r.post("setDeviceToken", { device_token: deviceToken })
            if (response.data.is_profile_complete == 0) {
               NavigationService.resetAction(commonText.profileSetUpRoute)
            }
            else {
               NavigationService.resetAction("App");
               dispatch(sendAppStatus({ status: 1 }))
            }
         }
      }
      else {
         dispatch(action.failure());
         notifications.alert({ message: response.message })
      }
   }
)

/**action for logout  */
export const logout = (params) => (
   async (dispatch) => {
      dispatch(userProfileRequest());
      const response = await r.post("logout");
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (response.code === 1) {
         const params = {
            sender_id: userDetails.user_id,
            is_typing: 0
         }
         await dispatch(sendAppStatus({ status: 0 }))
         await Socket.sendRequest('logoutChat');
         await dispatch(sendTypingStatus(params))
         await StorageService.clear();
         dispatch(uesrProfileSuccess());
         if (userDetails.google_id) { GoogleSignin.signOut(); }
         else if (userDetails.facebook_id) { LoginManager.logOut() }
         else if (userDetails.apple_id) { }
         dispatch(exploreResetData())
         dispatch(filterResetData())
         dispatch(userProfileResetData())
         dispatch(likeResetData())
         dispatch(chatResetData())
         // dispatch(sendAppStatus({ status: 0 }));
         let globalRoute = NavigationService.getGlobalNavigator();
         globalRoute.navigate("Auth");
         globalRoute.navigate("Auth", { screen: commonText.loginRoute });
         //  await StorageService.deleteItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
         // await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
         // await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
         // await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
         return true;
      }
      else {
         dispatch(userProfileFailure());
         notifications.alert({ message: response.message })
      }
   }
)

/**action for Remove block user by admin and reset app to login screen */
export const removeBlockeduser = () => (
   async (dispatch) => {
      // await StorageService.clear();
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();

      const params = {
         sender_id: userDetails.user_id,
         is_typing: 0
      }
      await dispatch(sendAppStatus({ status: 0 }))
      await Socket.sendRequest('logoutChat');
      await dispatch(sendTypingStatus(params))
      await StorageService.clear();
      dispatch(uesrProfileSuccess());
      if (userDetails.google_id) { GoogleSignin.signOut(); }
      else if (userDetails.facebook_id) { LoginManager.logOut() }
      else if (userDetails.apple_id) { }
      dispatch(exploreResetData())
      dispatch(filterResetData())
      dispatch(userProfileResetData())
      dispatch(likeResetData())
      dispatch(chatResetData())
      // dispatch(sendAppStatus({ status: 0 }));
      let globalRoute = NavigationService.getGlobalNavigator();
      globalRoute.navigate("Auth");
      globalRoute.navigate("Auth", { screen: commonText.loginRoute });
      //  await StorageService.deleteItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
      // await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
      // await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
      // await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
      return true;

   }
)

/**action for change password */
export const changePassword = (params) => (
   async (dispatch) => {
      dispatch(userProfileRequest());
      const response = await r.post("changePassword", params);
      if (response.code === 1) {
         dispatch(uesrProfileSuccess());
         NavigationService.goBack();
         showToastMessage(response.message)
      }
      else {
         dispatch(userProfileFailure());
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the Users which are showing in Explore screen */
export const getOppositeGenderDetails = (params, isFromFilter, isClearFilter, isNoLoader) => (
   async (dispatch) => {
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      params.gender = userDetails.gender == commonText.male ? commonText.female : commonText.male;
      let filterDetails = {};
      if (isClearFilter) {
         filterDetails = {};
      }
      else {
         filterDetails = Store.getState().filterState.filterDetails;
      }
      let isDefaultFilterSetup = Store.getState().filterState.isDefaultFilterSetup;
      let is_filter_applied = isDefaultFilterSetup ? false : true
      let location = await checkLocationAvaibility();
      dispatch(saveProfileSetupDetails({ ...location }, null, null, null, null, true));
      if (isNoLoader) {
      }
      else {
         dispatch(exploreRequest());
      }
      const response = await r.post('userProfile', { ...params, ...location, ...filterDetails, is_filter_applied });
      if (response.code === 1) {
         dispatch(exploreSuccess());
         let dataLength = Object.keys(response.data).length || response.data.length;
         if (dataLength > 0) {
            dispatch(exploreLoadUserList({
               userList: response.data
            }))
            dispatch(exploreSetNoMoreDataForList({
               isNoMoreData: false
            }))
         }
         else {
            let isNoMoreData = Store.getState().exploreState.isNoMoreData;
            if (isNoMoreData == false) {
               dispatch(getOppositeGenderDetails({ ...params, no_more_data: true }, isFromFilter, isClearFilter, isNoLoader))
            }
            dispatch(exploreSetNoMoreDataForList({
               isNoMoreData: true
            }))
         }
         const mainUserList = Store.getState().exploreState.mainUserList;
         if (mainUserList.length > 0) {
            dispatch(exploreGetOppositeGenderData({
               userDetails: response.data
            }))
         }
         else {
            if (mainUserList.length == 0) {
               dispatch(exploreSetNoUserProfileFound())
            }
         }
      }
      else {
         dispatch(exploreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for send like for image/question */
export const sendLike = (params, isQuestion, otherParams) => (
   async (dispatch) => {
      const response = await r.post("likeProfile", params);
      if (response.code === 1) {
         dispatch(exploreSuccess());
         if (exploreRef) {
            exploreRef.onRequestClose();
         }
         showToastMessage(response.message)
         dispatch(reduceExploreUserList())
         const method_name = 'loginChat';
         let user_id = params.liked_user_id;
         const responseObj = await Socket.sendRequest(method_name, { receiver_id: user_id });
         if (responseObj.method_name == method_name && responseObj.code === 1) {
            let messageObj = { receiver_id: user_id, on_like: 1 };
            if (isQuestion) {
               messageObj.text = "Question: " + otherParams.question + '\n' + "Answer: " + otherParams.answer;
               messageObj.type = 0;
            }
            else {
               const fileName = `${Date.now()}.${otherParams.ext}`;
               let base64Data = await imageConvertTobase64(encodeURI(otherParams.imageurl));
               if (base64Data) {
                  messageObj.image = {
                     name: fileName,
                     data: base64Data
                  }
                  messageObj.type = 1;
               }
            }
            const responseObj2 = await Socket.sendRequest('sendMessage', messageObj);
            let messageObj2 = {
               receiver_id: user_id,
               text: `Comment: ${params.comment}`,
               type: 0,
               on_like: 1
            }
            if (responseObj2.code === 1) {
               const responseObj3 = await Socket.sendRequest('sendMessage', messageObj2);
               if (responseObj3.code === 1) {
                  if (chatListRef) {
                     await chatListRef.getUserList();
                  }
               }
            }
         }
      }
      else {
         dispatch(exploreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for ignore user profile using cross button in Explore screen */
export const ignoreProfile = (params) => (
   async (dispatch) => {
      const response = await r.post("ignoreProfile", params);
      if (response.code === 1) {
         dispatch(exploreSuccess());
         dispatch(reduceExploreUserList())
      }
      else {
         dispatch(exploreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**reduce Explore Userlist to show user one by one in explore screen */
export const reduceExploreUserList = () => (
   async (dispatch) => {
      dispatch(exploreSetEmptyData())
      dispatch(expoloreReduceUserList())
      const mainUserList = Store.getState().exploreState.mainUserList;
      if (mainUserList.length !== 0) {
         dispatch(exploreGetOppositeGenderData())
      }
      let isNoMoreData = Store.getState().exploreState.isNoMoreData;
      if (mainUserList && mainUserList.length == 0 && isNoMoreData) {
         dispatch(getOppositeGenderDetails({ per_page: 3, offset: 0, no_more_data: true }, null, null))
      }
      else if (mainUserList && mainUserList.length < 4 /*&& mainUserList.length != 0*/) {
         let userIdArray = [];
         mainUserList.map((obj) => {
            if (obj) {
               userIdArray.push(obj.user_id)
            }
         })
         let userIdArrayFinal = userIdArray.join(",");
         dispatch(getOppositeGenderDetails({ per_page: 3, offset: mainUserList.length /*+ 1*/, no_more_data: mainUserList.length > 0 ? false : true, users_in_queue: userIdArrayFinal }, null, null, true))
      }
   }
)

/**action for block user */
export const blockUser = (params, isFromLike, likeParams, isFromChat, isFromMatches, isFromNotification, isFromMatch) => (
   async (dispatch) => {
      if (isFromChat) {
         dispatch(chatRequest())
      }
      if (isFromLike || isFromChat || isFromMatch || isFromNotification) {
         dispatch(exploreRequest());
      }
      else {
         // dispatch(exploreRequest());
      }
      const response = await r.post("blockUser", params);
      if (response.code === 1) {
         if (isFromChat) {
            dispatch(chatSuccess())
         }
         else if (isFromNotification) {
            NavigationService.navigate(commonText.noticationsRoute);
            return true;
         }
         else if (isFromMatch) {
            NavigationService.goBack()
            return true;
         }
         else {
            if (!isFromMatches) {
               dispatch(exploreSuccess());
            }
         }

         if (isFromLike) {
            liketabRef.resetValues()
            dispatch(likeResetData())
            NavigationService.popToTop()
            dispatch(getUserListForLikeTab(likeParams))
         }
         else if (isFromChat) {
            NavigationService.popToTop()
            if (chatListRef) await chatListRef.getUserList()
         }
         else {
            //TODO need to verify this
            if (!isFromMatches) {
               dispatch(reduceExploreUserList())
            }
         }
         // notifications.alert({ message: response.message })
         showToastMessage(response.message)
      }
      else {
         dispatch(exploreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for to submit report for any user */
export const reportUser = (params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch) => (
   async (dispatch) => {
      if (isFromLike || isFromChat || isFromNotification || isFromMatch) {
         dispatch(exploreRequest());
      }
      else {

      }
      const response = await r.post("reportUser", params);
      if (response.code === 1) {
         dispatch(exploreSuccess());
         if (isFromLike) {
            liketabRef.resetValues()
            dispatch(likeResetData())
            NavigationService.goBack()
            dispatch(getUserListForLikeTab(likeParams))
         }
         else if (isFromChat) NavigationService.popToTop()
         else if (isFromNotification) NavigationService.navigate(commonText.noticationsRoute)
         else if (isFromMatch) NavigationService.goBack()
         else {
            dispatch(reduceExploreUserList())
         }
         notifications.alert({ message: response.message })
      }
      else {
         dispatch(exploreFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the userlist for LikeTab's all 4 tabs i.e liked,passed,blocked,likedyou */
export const getUserListForLikeTab = (params, isClearFilter, apiKeyForUniqueNess, isFromRemoveList) => (
   async (dispatch) => {
      let apiName = params.apiName;
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let user_id = userDetails.user_id;
      let endPoint = `${apiName}?`;
      let filterDetails = {};
      if (isClearFilter) {
         filterDetails = {};
      }
      else {
         filterDetails = Store.getState().filterState.filterDetails;
      }
      let location = await checkLocationAvaibility();
      dispatch(likeRequest())
      const response = await r.post(endPoint, { user_id: user_id, ...location, ...filterDetails, page_no: params.page_no });
      if (response.code === 1) {
         dispatch(likeSuccess())
         dispatch(likeLoadDataForUserList({
            arrayName: params.arrayName,
            userList: response.data.users,
            isFromRemoveList: isFromRemoveList,
         }))
         if (liketabRef) {
            liketabRef.setTotalPage(+response.data.totalPages)
            liketabRef.setArrayValueToArrayHolder();
         }
      }
      else {
         dispatch(likeFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for unblock the user */
export const unblockUserForLikeTab = (params, isFromUserProfile, isFromChat, isFromMatches, isFromNotification, isFromMatch) => (
   async (dispatch) => {
      let actions;
      if (isFromUserProfile || isFromNotification, isFromMatch) {
         actions = {
            request: exploreRequest,
            success: exploreSuccess,
            failure: exploreFailure,
         }
      }
      else if (isFromChat) {
         actions = {
            request: chatRequest,
            success: chatSuccess,
            failure: chatFailure,
         }
      }
      else {
         actions = {
            request: likeRequest,
            success: likeSuccess,
            failure: likeFailure,
         }
      }
      dispatch(actions.request())
      let unblocked_user_id;
      let response;
      if (isFromMatches) {
         response = await r.post("unblockUser", params);
      }
      else {
         unblocked_user_id = params.blocked_user_id
         response = await r.post("unblockUser", { unblocked_user_id });
      }
      if (response.code === 1) {
         dispatch(actions.success());
         if (isFromChat) {
            NavigationService.popToTop();
         }
         else {
            if (isFromUserProfile) {
               NavigationService.goBack();
            }
            else if (isFromNotification) {
               NavigationService.navigate(commonText.noticationsRoute)
            }
            else if (isFromMatch) {
               NavigationService.goBack();
            }
            if (isFromMatch || isFromMatches || isFromNotification || isFromChat) {
            }
            else {
               dispatch(getUserListForLikeTab(params, null, null, true))
            }
         }
         // notifications.alert({ message: response.message })
         showToastMessage(response.message)
      }
      else {
         dispatch(actions.failure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for remove/hide user from list in like tab using cross button */
export const removeUserFromListForLikeTab = (params, finalParams) => (
   async (dispatch) => {
      dispatch(likeRequest())
      const response = await r.post(finalParams.hideApiName, params);
      if (response.code === 1) {
         dispatch(likeSuccess())
         dispatch(getUserListForLikeTab(finalParams, null, null, true))
      }
      else {
         dispatch(likeFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the user profile */
export const getLikeTabUserProfiles = (params, isFromUserProfile) => (
   async (dispatch) => {
      let endPoint = "";
      let location = await checkLocationAvaibility();
      if (location && location.latitude && location.longitude) {
         endPoint = `profile?user_id=${params.user_id}&latitude=${location.latitude}&longitude=${location.longitude}`;
      }
      else {
         endPoint = `profile?user_id=${params.user_id}`
      }
      dispatch(exploreRequest());
      const response = await r.get(endPoint);
      if (response.code === 1) {
         dispatch(exploreSuccess());
         if (isFromUserProfile) {
            dispatch(exploreLoadUserProfileDetails({
               userDetails: response.data,
            }))
         }
         else {
            dispatch(exploreGetOppositeGenderData({
               userDetails: response.data,
               isFromLike: true,
            }))
         }
      }
      else {
         dispatch(exploreFailure()())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the list of users whom with we have perfomed chat  */
export const getChatUsers = () => (
   async (dispatch) => {
      dispatch(chatRequest())
      const responseObj = await Socket.sendRequest('getChatUsers');
      if (responseObj.method_name == 'getChatUsers') {
         const users = responseObj.data || [];
         dispatch(chatSuccess())
         dispatch(chatLoadUserList({
            users: responseObj.data
         }));
         return users;
      }
      else return false;
   }
)

/**action for get the all messages for each user one at time */
export const getMessagsList = (receiver_id = 1, page_no = 1) => (
   async (dispatch) => {
      const method_name = 'getMessages';
      const responseObj = await Socket.sendRequest(method_name, { receiver_id, page_no });
      if (responseObj.method_name == method_name && responseObj.code == 1) {
         const messages = responseObj.data || [];
         if (page_no == 1) { dispatch(chatSetMessageList({ messages })) }
         else { dispatch(chatGetOldMessageList({ messages })) }
         return messages.length;
      }
      else return false;
   }
)

/**action for assign badge to any user in chatwindow screen */
export const assignBadgeToUser = (params) => (
   async (dispatch) => {
      const badges = Store.getState().chatState.selectedBadgeList || [];
      let fialBadge = [];
      badges && badges.length && badges.map((obj) => {
         fialBadge.push({
            badge: obj.title
         })
      })
      const response = await r.post('badge', params);
      if (response.code == 1) {
         dispatch(chatSuccess());
         if (chatWindowRef && fialBadge && fialBadge.length) chatWindowRef.setBadgeToState(fialBadge)
      }
      else {
         dispatch(chatFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for send app status for show use online/offline availibility */
export const sendAppStatus = (params) => (
   async (dispatch) => {
      const method_name = "editAppStatus";
      const responseObj = await Socket.sendRequest(method_name, params);
      if (responseObj.code == 1) {
      }
      else {
         notifications.alert({ message: response.message })
      }
   }
)

/**get the app status  */
export const getAppStatus = (params) => (
   async (dispatch) => {
      const method_name = "getUserStatus";
      const responseObj = await Socket.sendRequest(method_name, params);
      if (responseObj.code == 1) {
         return responseObj.data;
      }
      else {
         notifications.alert({ message: response.message })
      }
   }
)

/**action for sending typing status of loggedin user to other user */
export const sendTypingStatus = (params) => (
   async (dispatch) => {
      const method_name = "typing";
      const responseObj = await Socket.sendRequest(method_name, params);
      if (responseObj.code == 1) {

      }
      else {
         notifications.alert({ message: response.message })
      }
      BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.
   }
)

/**action for notification permission */
export const notificationPermission = (params, isFromBackground) => (
   async (dispatch) => {
      if (isFromBackground) {
         const NOTIFICATION_PERMISSION_ENABLED = await StorageService.getItem(StorageService.STORAGE_KEYS.NOTIFICATION_PERMISSION_ENABLED);
         params.notification_permission = Number(NOTIFICATION_PERMISSION_ENABLED);
      }
      else {
         dispatch(notificationPermissionRequest());
      }
      const response = await r.put('notificationPermission', params);
      if (response.code === 1) {
         if (isFromBackground) {
         }
         else {
            dispatch(notificationPermissionSuccess(response.data));
         }
      }
      else {
         if (isFromBackground) {
         }
         else {
            dispatch(notificationPermissionFailure());
         }
         notifications.alert({ message: response.message })
      }
   }
)

/**action for get the subscription planlist from backend */
export const getPlanList = () => (
   async (dispatch) => {
      dispatch(subscribtionRequest());
      const response = await r.get("plans");
      if (response.code === 1) {
         dispatch(subscribtionLoadProductList({
            subscribtionProductList: response.data
         }))
      }
      else {
         dispatch(subscribtionFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**acion for valida receipt for subcsribed user */
export const validReceipt = (params, isfromRestorePurchase, isFromFilter, isFromSettings, isFromLike) => (
   async (dispatch) => {
      dispatch(subscribtionRequest());
      const response = await r.post("receiptValidate", params);
      const subscribedDetails = {};
      const planList = Store.getState().subscribtionState.subscribtionPlanListFromIAP;
      if (response.code === 1) {
         let planData = {}
         if (constants.isIOS) {
            let receiptData = response.data.validation_response.latest_receipt_info
            planData = receiptData[0]
         }
         else {
            let receiptData = response.data
            planData = receiptData.validation_response
         }
         if (response.data.is_expired == false) {
            /** get responce from server for purchase is 
             * expired or not in is_expired key
            *  if not expired then store purchase data and allow to app usage 
            */
            await StorageService.saveItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA, planData);
            await StorageService.saveItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED, '1');
            if (planList && planList.length) {
               planList.map(async (obj) => {
                  if (constants.isIOS) {
                     if (obj.productId == planData.product_id) {
                        await StorageService.saveItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS, obj);
                     }
                  }
                  else {
                     if (obj.productId == planData.productId) {
                        await StorageService.saveItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS, obj);
                     }
                  }
               })
            }
            if (isFromSettings) settingTabRef.closeSubscribeModal()
            else if (isFromFilter) filterRef.closeSubscribeModal()
            else if (liketabRef) liketabRef.closeSubscribeModal()
            /** display message based on purchase or restore purchase */
            if (isfromRestorePurchase) {
               // showSimpleAlert(commonText.restorePurchaseSucess)
               Alert.alert(constants.AppName,
                  commonText.restorePurchaseSucess,
                  [
                     {
                        text: "Okay",
                        onPress: () => {
                           if (isFromSettings) settingTabRef.closeSubscribeModal()
                           else if (isFromFilter) filterRef.closeSubscribeModal()
                           else if (liketabRef) liketabRef.closeSubscribeModal()
                        }
                     }
                  ],
                  { cancelable: false }
               )
            }
            else {
               Alert.alert(constants.AppName,
                  commonText.purchaseSucess,
                  [
                     {
                        text: "Okay",
                        onPress: () => {
                           if (isFromSettings) settingTabRef.closeSubscribeModal()
                           else if (isFromFilter) filterRef.closeSubscribeModal()
                           else if (liketabRef) liketabRef.closeSubscribeModal()
                        }
                     }
                  ],
                  { cancelable: false }
               )
            }
            if (isFromSettings) settingTabRef.getcurrentSubscription()
            else if (isFromFilter) filterRef.getcurrentSubscription()
            else if (isFromLike) liketabRef.getcurrentSubscription()
         }
         else {
            if (isfromRestorePurchase) {
               showSimpleAlert(commonText.restorePurchaseReceiptValidation)
            }
            await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
            await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
            await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
         }
      }
      else {
         dispatch(subscribtionFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for read notification */
export const readNotification = (params) => (
   async (dispatch) => {
      const response = await r.put("readNotification", params);
      if (response.code === 1) {
         dispatch(notificationDataSuccess())
         if (settingTabRef) {
            settingTabRef.getNotificationData()
         }
         if (CustomSettingsIconRef) {
            CustomSettingsIconRef.getNotifications()
         }
      }
      else {
         dispatch(notificationFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**acion for valida receipt for subcsribed user */
export const validateReceiptApicall = () => (
   async (dispatch) => {
      let purchaseData = await StorageService.getItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
      let param = {}
      if (purchaseData) {
         param = {
            "receipt": purchaseData.transactionReceipt
         }
         const response = await r.post("receiptValidate", param)
         if (response.code === 1) {
            let planData = {}
            if (constants.isIOS) {
               let receiptData = response.data.validation_response.latest_receipt_info
               planData = receiptData[0]
            }
            else {
               let receiptData = response.data
               planData = receiptData.validation_response
            }
            if (response.data.is_expired == false) {
               await StorageService.saveItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA, planData);
               await StorageService.saveItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED, '1');
            }
            else {
               await StorageService.deleteItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
               await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
               await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
               await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
            }
         }
         else {
            console.log('Something wrong with validation')
         }
      }
   }
)

/**action for check the match status for loggedin user with other user */
export const checkMatchStatus = (params) => (
   async (dispatch) => {
      const method_name = "checkMatch";
      const responseObj = await r.post(method_name, params);
      if (responseObj.code == 1) {
         return responseObj.data;
      }
      else {
         notifications.alert({ message: response.message })
      }
   }
)

/**action  for clear all notifcation list */
export const clearAllNotificationFromList = (params) => (
   async (dispatch) => {
      dispatch(notificationRequest());
      const response = await r.delete("removeNotifications", params);
      if (response.code === 1) {
         dispatch(notificationSuccess({
            notificationList: [],
         }))
         // notifications.alert({ message: response.message })
         showToastMessage(response.message)
      }
      else {
         dispatch(notificationFailure())
         notifications.alert({ message: response.message })
      }
   }
)

/**action for unmatch user for loggedin user with matched user */
export const proformUnmatchUser = (params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams, isFromMatches) => (
   async (dispatch) => {
      if (isFromChat) {
         dispatch(chatRequest())
      }
      if (isFromLike || isFromChat || isFromMatch || isFromNotification) {
         dispatch(exploreRequest());
      }
      else if (isFromMatches) {
         dispatch(matchUsersRequest())
      }
      else {
      }
      const response = await r.post("unmatchUser", params);
      if (response.code === 1) {
         if (isFromChat) {
            dispatch(chatSuccess())
         }
         else if (isFromNotification) {
            NavigationService.navigate(commonText.noticationsRoute);
            return true;
         }
         else if (isFromMatch) {
            NavigationService.goBack()
            return true;
         }
         else {
            if (!isFromMatches) {
               dispatch(exploreSuccess());
            }
         }
         if (isFromLike) {
            liketabRef.resetValues()
            dispatch(likeResetData())
            NavigationService.goBack()
            dispatch(getUserListForLikeTab(likeParams))
         }
         else if (isFromChat) {
            NavigationService.popToTop()
            if (chatListRef) await chatListRef.getUserList()
         }
         // notifications.alert({ message: response.message })
         showToastMessage(response.message)
      }
      else {
         notifications.alert({ message: response.message })
      }
   }
)