import _ from 'lodash';
import axios from 'axios';
import NetInfo from "@react-native-community/netinfo";
import crashlytics from '@react-native-firebase/crashlytics';

import apiConfigs from './apiConfig';
import { commonText, constants } from '../common';
import { showSimpleAlert } from '../utils/HelperFunction';
import StorageService from '../utils/StorageService';
import { Alert } from 'react-native';
import { Store } from '../redux/reduxStore';
import { removeBlockeduser, sendAppStatus } from '../redux/operation';
import Socket from './Socket';
import UserUtils from '../utils/UserUtils';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { chatResetData, exploreResetData, filterResetData, likeResetData, userProfileResetData } from '../redux/action';
import NavigationService, { } from '../utils/NavigationService';
import { showToastMessage } from '../components/ToastUtil';

/**
 * Header for Api calls
 */
const getHeaders = async () => ({
   'Accept': 'application/json',
   "Content-Type": "application/json",
   'android_app_version': apiConfigs.android_app_version,
   "device_id": apiConfigs.device_id,
   "device_type": apiConfigs.device_type,
   "os": apiConfigs.os,
   "app_version": apiConfigs.app_version,
   "language": apiConfigs.language,
   "auth_token": await getToken(),
});

const getHeader2 = async () => ({
   'Accept': 'application/json',
   "Content-Type": "application/json",
   'android_app_version': apiConfigs.android_app_version,
   "device_id": apiConfigs.device_id,
   "device_type": apiConfigs.device_type,
   "os": apiConfigs.os,
   "app_version": apiConfigs.app_version,
   "language": apiConfigs.language,
   "auth_token": await getToken(),
   "refresh_token": "LOVEjmLOV6G9Earypa9y5OhG3NpwLIanNEwbgaatfu3d"
});

/**Gets the User Auth token */
export const getToken = async () => {
   const authToken = await StorageService.getItem(StorageService.STORAGE_KEYS.AUTH_TOKEN);
   if (authToken) {
      return authToken;
   }
   else {
      return apiConfigs.default_auth_token;
   }
}

/**Sets the User Auth token */
const setToken = async (token) => {
   return await StorageService.saveItem(StorageService.STORAGE_KEYS.AUTH_TOKEN, token)
}

/**Set the device token */
const setDeviceToken = async (token) => {
   return await StorageService.saveItem(StorageService.STORAGE_KEYS.DEVICE_TOKEN, token)
}

/**Get the device token */
const getDeviceToken = async () => {
   const deviceToken = await StorageService.getItem(StorageService.STORAGE_KEYS.DEVICE_TOKEN);
   return deviceToken;
}

/**
 * Check Internet Connectivity Status
 */
export const checkNetInfo = async () => {
   const state = await NetInfo.fetch();
   return state.isConnected;
}

/**
 * 
 * @param {*} promise 
 * Time Out method 
 */
const timeOut = (promise) => {
   return new Promise((resolve, reject) => {
      const timerId = setTimeout(() => {
         reject({
            message: 'timeoutMessage',
            status: apiConfigs.TIMEOUT,
            timerId,
         });
      }, 120 * 1000);
      promise.then(resolve, reject);
   });
}

/**action for update user auth token */
const updateAuthToken = async (endpoint, params) => {
   const result = await r.post('refreshToken');

   await setToken(result.data.auth_token);
   return await buildRequest(endpoint, params);
}

/**
 * 
 * @param {*} endpoint 
 * @param {*} params 
 * @param {*} options 
 * Application related  Api request will be perform(Call) from here
 */
const buildRequest = async (endpoint, params = {}, options = undefined) => {
   const headers = endpoint === "refreshToken" ? await getHeader2() : await getHeaders();
   if (await checkNetInfo() === false) {
      // showSimpleAlert(commonText.noNetworkAlert)
      showToastMessage(commonText.noNetworkAlert)
      return false;
   }

   const source = axios.CancelToken.source();
   const request = { endpoint, params: params.data };
   try {
      console.log("%c REQUEST::", 'background: #222; color: #bada55', { url: `${apiConfigs.LIVE_SERVER_API_URL}/${endpoint}`, ...params });
      const response = await timeOut(axios({
         url: `${apiConfigs.LIVE_SERVER_API_URL}/${endpoint}`,
         headers,
         ...params,
      }))
      const result = response.data
      console.log("Result----->", result);
      console.log("headers----->", headers);

      if (result.code === apiConfigs.BLOCK_USER_CODE_BY_ADMIN) {
         Alert.alert(
            constants.AppName,
            result.message,
            [
               {
                  text: "Okay",
                  onPress: () => Store.dispatch(removeBlockeduser())
               }
            ],
            { cancelable: false }
         )
         return false;
      }
      else {
         return checkValidatinoResponse(response, endpoint, params);
      }
   }
   catch (error) {
      console.log("Error----->", error);
      crashlytics().recordError(error);
      if (error) {
         // alert(JSON.stringify(error))
         /**
          * 111 TimeOut Error
          */
         if (error.status == apiConfigs.TIMEOUT) {
            showSimpleAlert(commonText.requestTimeoutMessage);
            clearTimeout(error.timerId);
            return false;
         }
         else if (error.message == "Network Error" || error.message == "Network error") {
            // showSimpleAlert("Network error.please try after sometime.");
            Alert.alert(commonText.netTitle, commonText.networkErrorMessage)
            return false;
         }
         else {
            /**
             * Handle Unexpected errors
             */
            showSimpleAlert(commonText.somethingWrongText);
            return false;
         }
      }
   }
};

/**
* Fires only when an api caught the lower apllication version.
* @returns {Promise<{status:string,message:null}>}
*/
const handleLowerAppVersion = async (message) => {
   return new Promise((resolve, reject) => {
      Alert.alert(
         constants.AppName,
         message,
         [{
            text: 'Ok',
            onPress: async () => {
               let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
               await StorageService.clear();
               // NavigationService.resetAction('App');
               // resolve({ status: "0", message: null });
               Socket.sendRequest('logoutChat');
               Store.dispatch(sendAppStatus({ status: 0 }))
               if (userDetails.google_id) { GoogleSignin.signOut(); }
               else if (userDetails.facebook_id) { LoginManager.logOut() }
               else if (userDetails.apple_id) { }
               let globalRoute = NavigationService.getGlobalNavigator();

               globalRoute.navigate("Auth");
               globalRoute.navigate("Auth", { screen: commonText.loginRoute });

               Store.dispatch(exploreResetData())
               Store.dispatch(filterResetData())
               Store.dispatch(userProfileResetData())
               Store.dispatch(likeResetData())
               Store.dispatch(chatResetData())

               // await StorageService.deleteItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
               //   await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
               //   await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
               // await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
            },
         }],
         { cancelable: false },
      );
      resolve(false);
   });
};


/**
 * 
 * @param {*} response 
 * check validation of response return values
 */
const checkValidatinoResponse = async (response, endpoint, params) => {
   const result = response.data

   /**
     * 500 Server Error 
     */
   if (result.code == apiConfigs.SERVERERRORCODE) {
      showSimpleAlert(commonText.serverErrorMessage)
      return false;
   }

   /**
   * 404 Not Found Error
   */
   if (result.code == apiConfigs.NOTFOUNDCODE) {
      if (result.code == 0 && result.message) {
         showSimpleAlert(result.message)
      }
   }

   /**
    * 401 Token Expire Error
    */
   if (result.code === apiConfigs.TOKENEXPIRECODE) {
      return await updateAuthToken(endpoint, params)
   }

   /**
    * Handle lower app version for Update App.
    */
   if (result.code === apiConfigs.LOWER_APP_VERSION_CODE) {
      return await handleLowerAppVersion(result.message);
   }

   return result;

}

/**
 * 
 * @param {*} endpoint 
 * @param {*} params 
 * @param {*} options 
 * GET method related api calls Start from here
 */
const get = async (endpoint, params) => (buildRequest(
   endpoint,
   {
      method: 'GET',
      data: params,
   },
))

/**
 * 
 * @param {*} endpoint 
 * @param {*} params 
 * @param {*} options 
 * POST method related api calls Start from here
 */
const post = async (endpoint, params) => (
   buildRequest(
      endpoint,
      {
         method: 'POST',
         data: params,
      }
   )
);
/**
 * 
 * @param {*} endpoint 
 * @param {*} params 
 * @param {*} options 
 * PUT method related api calls Start from here
 */
const put = (endpoint, params, options = undefined) =>
   buildRequest(
      endpoint,
      {
         method: 'PUT',
         data: params,
      },
      options,
   );

/**
 * 
 * @param {*} endpoint 
 * @param {*} params 
 * @param {*} options 
 * DELETE method related api calls Start from here
 */
const deleteRequest = (endpoint, params = {}, options = undefined) =>
   buildRequest(
      endpoint,
      {
         method: 'DELETE',
         data: params,
      },
      options,
   );



/**
 * api call module
 */
const r = {
   get,
   post,
   put,
   // refreshTokenCall,
   delete: deleteRequest,
   getToken,
   setToken,
   setDeviceToken,
   getDeviceToken,
};

export { getHeaders, };

export default r;