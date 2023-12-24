import React, { Component } from 'react';
import { Platform, AppState, View } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { showMessage } from "react-native-flash-message";
import r from '../../api/Request';
import apiConfigs from '../../api/apiConfig';
import NavigationService, { } from '../../utils/NavigationService';
import { colors, commonText } from '../../common';
import { liketabRef } from '../like/Like';
import { settingTabRef } from '../setting/Setting';
import { Store } from '../../redux/reduxStore';
import { notificationPermission, readNotification } from '../../redux/operation';
import StorageService from '../../utils/StorageService';
import UserUtils from '../../utils/UserUtils';
import { fonts, images } from '../../assets';
import { CustomSettingsIconRef } from '../../components/CustomSettingsIcon';
export let pushNotificationRef;

/**
 * Push Notification Component
 */
export default class PushNotification extends Component {
   constructor(props) {
      super(props)
      pushNotificationRef = this;
      this.state = {
         appState: AppState.currentState,
      }
   }

   /**componet life cycle method */
   componentWillMount() {
      this.checkPermission();
   }
   /**componet life cycle method */
   async componentDidMount() {
      AppState.addEventListener('change', this._handleAppStateChange);

      messaging().onTokenRefresh(async (fcmToken) => {
         const deviceToken = await r.getDeviceToken();
         if (deviceToken !== fcmToken) {
            this.setFCMToken(fcmToken)
         }
      })
      // forground ( when app open ) in firebase notification
      messaging().onMessage(async remoteMessage => {
         if (this.state.appState == "active") {
            showMessage({
               type: "default",
               description: remoteMessage.notification.body,
               message: remoteMessage.notification.title,
               color: colors.white,
               autoHide: true,
               titleStyle: { color: colors.white, fontSize: 16, marginHorizontal: 10, fontFamily: fonts.muliSemiBold },
               textStyle: { color: colors.white, fontSize: 14, marginHorizontal: 10, fontFamily: fonts.muli },
               onPress: () => this.handleNotificationRedirection(remoteMessage.data),
               type: 'success',
               icon: 'appIcon',
            }, () => { })
            if (settingTabRef) {
               settingTabRef.getNotificationData()
            }
            if (CustomSettingsIconRef) {
               CustomSettingsIconRef.getNotifications()
            }
         }
         this.checkForPlanExpireNotification(remoteMessage.data)
      });

      // Assume a message-notification contains a "type" property in the data payload of the screen to open
      messaging().onNotificationOpenedApp(remoteMessage => {
         console.log("remoteMessage onNotificationOpenedApp-->", remoteMessage);
         this.handleNotificationRedirection(remoteMessage.data)
      });

      // executes when application is in background state.
      messaging().setBackgroundMessageHandler(async remoteMessage => {
         console.log("remoteMessage setBackgroundMessageHandler-->", remoteMessage);
         this.checkForPlanExpireNotification(remoteMessage.data)
      });

      //If your app is closed
      this.remoteInitialNotification = messaging().getInitialNotification().then((notificationOpen) => {
         console.log("remoteMessage getInitialNotification-->", notificationOpen);
         if (notificationOpen) {
            this.handleNotificationRedirection(notificationOpen.data, true)
            this.checkForPlanExpireNotification(notificationOpen.data)
         }
      });
      this.checkForIOS();
   }

   /**
    * 
    * @param {*} notification 
    * @param {*} isFromKilledApp 
    * Handling notification tap and redireaction
    */
   handleNotificationRedirection = (notification, isFromKilledApp) => {
      console.log("remoteMessage handleNotificationRedirection-->", notification);
      const params = {
         notification_id: notification.notification_id
      }
      Store.dispatch(readNotification(params))
      if (notification) {
         if (notification) {
            let { notify_type } = notification;
            switch (notify_type) {
               case apiConfigs.MATCHED_TYPE:
                  this.handleMatchUserNotification(notification, isFromKilledApp)
                  break;
               case apiConfigs.GET_MESSAGE_TYPE:
                  this.handleGetMessageNotification(notification, isFromKilledApp)
                  break;
               case apiConfigs.LIKE_PROFILE_TYPE:
                  this.handleLikeProfileNotification(notification, isFromKilledApp)
                  break;
            }
         }
      }
   }

   /**check for subscription plan expire notification */
   checkForPlanExpireNotification = async (notificationData) => {
      if (notificationData && notificationData.notify_type == apiConfigs.SUBSCRIPTION_EXPIRE_TYPE) {
         await StorageService.deleteItem(StorageService.STORAGE_KEYS.PURCHASE_DATA)
         await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
         await StorageService.deleteItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
         await StorageService.deleteItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
      }
   }

   /**handle match user notification */
   handleMatchUserNotification = (notificationData, isFromKilledApp) => {
      let globalRoute = NavigationService.getGlobalNavigator();
      globalRoute.navigate(commonText.settingsRoute, {
         screen: commonText.settingsRoute,
         params: {
            screen: commonText.userProfileRoute,
            params: {
               isFromNotification: true,
               user_id: notificationData.sender_id,
               notificationData
            }
         }
      })
   }

   /**handle chat message notification */
   handleGetMessageNotification = (notificationData, isFromKilledApp) => {
      NavigationService.navigate(commonText.chatRoute)
   }

   /**handle like profile notification */
   handleLikeProfileNotification = (notificationData, isFromKilledApp) => {
      let globalRoute = NavigationService.getGlobalNavigator();
      globalRoute.navigate(commonText.likeRoute, {
         screen: commonText.likeRoute,
         params: {
            isFromNotification: true,
            activeTabIndex: 0
         }
      })
   }

   /**check config for iOS platform */
   checkForIOS = async () => {
      if (Platform.OS == "ios") {
         await messaging().registerDeviceForRemoteMessages();
         await messaging().setAutoInitEnabled(true);
      }
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.removeAllNotificationListners();
   }

   /**handle app state change  */
   _handleAppStateChange = (nextAppState) => {
      if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
         console.log('App has come to the foreground!');
      }
      this.state.appState = nextAppState;
   }

   /**check the notification permission */
   checkPermission = async () => {
      const hasPermission = await messaging().hasPermission();
      const enabled = hasPermission === messaging.AuthorizationStatus.AUTHORIZED || hasPermission === messaging.AuthorizationStatus.PROVISIONAL;
      if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED || hasPermission === messaging.AuthorizationStatus.PROVISIONAL) {
         await this.getFCMToken();
      }
      else if (hasPermission === messaging.AuthorizationStatus.DENIED || hasPermission === messaging.AuthorizationStatus.NOT_DETERMINED) {
         const isPermission = await this.requestUserPermission();
         if (!isPermission) {
            this.callApiForNotificationPermisssion(false)
            await StorageService.saveItem(StorageService.STORAGE_KEYS.NOTIFICATION_PERMISSION_ENABLED, "0")
            return false;
         }
         else this.getFCMToken();
      }
      else {
         const isPermission = await this.requestUserPermission();
         if (!isPermission) {
            this.callApiForNotificationPermisssion(false)
            await StorageService.saveItem(StorageService.STORAGE_KEYS.NOTIFICATION_PERMISSION_ENABLED, "0")
            return false;
         }
         else this.getFCMToken();
      }
   }

   /**gets the fcm token */
   getFCMToken = async () => {
      const token = await messaging().getToken();
      console.log("token--->", token);
      if (token) {
         this.setFCMToken(token)
         await StorageService.saveItem(StorageService.STORAGE_KEYS.NOTIFICATION_PERMISSION_ENABLED, "1")
         this.callApiForNotificationPermisssion(true)
      }
   }

   /**set the fcm token */
   async setFCMToken(fcmToken) {
      await r.setDeviceToken(fcmToken);
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetails && userDetails.is_profile_complete === 1) {
         r.post("setDeviceToken", { device_token: fcmToken })
      }
      else {
      }
   }

   /**action for call api for notification permission */
   callApiForNotificationPermisssion = async (hasPermission) => {
      let params = {
         on_match: hasPermission == true ? 1 : 0,
         on_get_message: hasPermission == true ? 1 : 0,
         on_profile_like: hasPermission == true ? 1 : 0,
         on_subscription_expire: hasPermission == true ? 1 : 0
      }
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetails && userDetails.is_profile_complete) {
         Store.dispatch(notificationPermission({}, true))
      }
      else {
      }

   }

   /**request notification permission */
   requestUserPermission = async () => {
      const settings = await messaging().requestPermission({
         provisional: false,
      });
      if (settings) {
         return settings;
      }
   }

   /**remove notification all listeners */
   removeAllNotificationListners() {
      AppState.removeEventListener('change', this._handleAppStateChange);
   }

   /**componet render method */
   render() {
      return (<View />)
   }
}