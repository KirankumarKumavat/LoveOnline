import { Platform } from "react-native";
import DeviceInfo from 'react-native-device-info';
import { constants } from "../common";

/**
 * Error code found in app
 */
const errorCodes = {
   TIMEOUT: "111",
   NOTFOUNDCODE: 404,
   SERVERERRORCODE: 500,
   TOKENEXPIRECODE: 401,
   BLOCK_USER_CODE_BY_ADMIN: 403,
   LOWER_APP_VERSION_CODE: 304,
}
// default_auth_token: @#Llsjpoq$S1o08#OnbViE%ONLI&N*5Eu@exS1o!08l9tslsjpo#LOVE
// refresh_token: LOVEjmLOV6G9Earypa9y5OhG3NpwLIanNEwbgaatfu3d
/**
 * api header related data
 */
const apiHeaderData = {
   android_app_version: "1.0.0",
   device_type: constants.isIOS ? "0" : "1",
   os: DeviceInfo.getSystemVersion(),
   app_version: DeviceInfo.getVersion(),
   language: "en",
   device_id: DeviceInfo.getUniqueId(),
   default_auth_token: "@#Llsjpoq$S1o08#OnbViE%ONLI&N*5Eu@exS1o!08l9tslsjpo#LOVE",
   device_token: 'cdM92ZwXwUedvpfsPyUErR:APA91bGnnBtY8yAzviXw0TdJESND8la-Ajhdhurj7K5_EYKI7MnROU1OltjHU21_L-lgb5fIvaoQjna0Wotx4ubN71SAFy6fztGRwVuDqLMOR1UNz-YuNcEt_1HS0fgtSF5fN9brCRhp'
}

/**
 * required key for google login
 */
const googleLoginData = {
   iosClientID: "570940003114-33kt5ql9000k1m5guncfu90uscvdkjjn.apps.googleusercontent.com",
   // webClientDFORANDROID: "570940003114-29clqv0v6n551hhvuqh2vgshg1gep7gs.apps.googleusercontent.com",
   webClientDFORANDROID: "570940003114-3jpilu2luubfgjt58vtrqk6nrgd4viq2.apps.googleusercontent.com"
}

/**
 * all url used in app
 */
const apiUrl = {
   LOCAL_SERVER_API_URL: "http://9ad5b13481b2.ngrok.io/api/v1",
   LOCAL_SERVER_SOCKET_URL: "http://1b4a0edd0853.ngrok.io/",

   LIVE_SERVER_API_URL: "http://52.9.178.69:3000/api/v1",
   LIVE_SERVER_SOCKET_URL: "http://52.9.178.69:3001",

   // LIVE_SERVER_API_URL: "https://api-loveonline.tristatetechnology.com/api/v1",
   // LIVE_SERVER_SOCKET_URL: "https://socket-loveonline.tristatetechnology.com:8443",
}

/**
 * web pages urls in app
 */

const webPageUrls = {
   refresh_token: "",
   // privacyPolicyUrl: "http://52.9.178.69/privacy",
   // termsAndConditionUrl: "http://52.9.178.69/terms",
   // cancelSubscribtionUrlForIos: "http://52.9.178.69/cancel-ios-IAP",
   // cancelSubscribtionUrlForAndroid: "http://52.9.178.69/cancel-android-IAP",
   // switchPlanUrlForIos: "http://52.9.178.69/switch-paln-ios",

   privacyPolicyUrl: "https://loveonline.tristatetechnology.com/privacy",
   termsAndConditionUrl: "https://loveonline.tristatetechnology.com/terms",
   cancelSubscribtionUrlForIos: "https://loveonline.tristatetechnology.com/cancel-ios-IAP",
   cancelSubscribtionUrlForAndroid: "https://loveonline.tristatetechnology.com/cancel-android-IAP",
   switchPlanUrlForIos: "https://loveonline.tristatetechnology.com/switch-paln-ios",
}

/**
 * in app purchase SKUID
 */
export const IAPID = {
   WEEKLY_SUBSCRIPTION_IOS: "com.loveonline.weeklysubsciption",
   MONTHLY_SUBSCRIPTION_IOS: "com.loveonline.onemonthlysubsciption",
   THREE_MONTHLY_SUBSCRIPTION_IOS: "com.loveonline.threemonthlysubsciption",

   WEEKLY_SUBSCRIPTION_ANDROID: "com.loveonline.weeklysubsciption",
   MONTHLY_SUBSCRIPTION_ANDROID: "com.loveonline.onemonthlysubsciption",
   THREE_MONTHLY_SUBSCRIPTION_ANDROID: "com.loveonline.threemonthlysubsciption",
}

/**
 * Types of push notification
 */
export const notificationTypes = {
   MATCHED_TYPE: "1",
   GET_MESSAGE_TYPE: "2",
   LIKE_PROFILE_TYPE: "3",
   SUBSCRIPTION_EXPIRE_TYPE: "4",
   UNMATCH_USER_TYPE: "5",
}

/**
 * api related configuration set
 */
const apiConfigs = {
   ...errorCodes,
   ...apiUrl,
   ...apiHeaderData,
   ...googleLoginData,
   ...notificationTypes,
   ...IAPID,
   ...webPageUrls,
}

export default apiConfigs;