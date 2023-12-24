/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { Store } from './source/redux/reduxStore';
import Route from './source/navigators/Route';
import { AppState, BackHandler, Image, NativeModules, Platform, } from 'react-native';
import { sendAppStatus, sendTypingStatus } from './source/redux/operation';
import UserUtils from './source/utils/UserUtils';
import FlashMessage, { renderFlashMessageIcon } from "react-native-flash-message";
import { colors, } from './source/common';
import crashlytics from '@react-native-firebase/crashlytics';
import { images } from './source/assets';
import { Notifications } from 'react-native-notifications';
import ToastUtil from './source/components/ToastUtil';
import r, { checkNetInfo } from './source/api/Request';
import NoInternetModal from './source/components/NoInternetModal';
import NetInfo from "@react-native-community/netinfo";
import BackgroundTimer from 'react-native-background-timer';
import StorageService from './source/utils/StorageService';
import messaging from '@react-native-firebase/messaging';
import { notificationPermission, } from './source/redux/operation';

/**
 * App class Component(The main app starts from this class)
 */
export default class App extends Component {

  /**local app state */
  state = {
    appState: AppState.currentState,
    showModal: false,
  }

  UNSAFE_componentWillMount() {
    this.checkNetworkAvaibility()
  }

  /**componet life cycle method */
  async componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);

    this.checkNetworkAvaibility()

    const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
    this.unsubscribe = NetInfo.addEventListener(state => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      if (state.isConnected) {
        this.setState({ showModal: false })
        if (userDetails && userDetails.is_profile_complete === 1) {
          const params = {
            sender_id: userDetails.user_id,
            is_typing: 0
          }
          Store.dispatch(sendAppStatus({ status: 1 }))
          Store.dispatch(sendTypingStatus(params))
        }
      } else {
        this.setState({ showModal: true })
        if (userDetails && userDetails.is_profile_complete === 1) {
          const params = {
            sender_id: userDetails.user_id,
            is_typing: 0
          }
          Store.dispatch(sendAppStatus({ status: 0 }))
          Store.dispatch(sendTypingStatus(params))
        }
      }
    });

    Notifications.ios.setBadgeCount(0);
    Notifications.removeAllDeliveredNotifications();
    // if (pushNotificationRef) {
    //   pushNotificationRef.checkPermission();
    // }
    this.checkPermission()
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


  checkNetworkAvaibility = async () => {
    if (await checkNetInfo() === false) {
      this.setState({ showModal: true })
    }
    else {
      this.setState({ showModal: false })
    }
  }

  /**componet life cycle method */
  componentWillUnmount() {
    this.removeAllNotificationListners();
    this.unsubscribe()
  }

  /**remove handle app state change */
  removeAllNotificationListners() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  /**
   * 
   * @param {*} nextAppState 
   * handle app state changing
   */
  _handleAppStateChange = async (nextAppState) => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.state.appState = nextAppState;
    const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
    if (userDetails && userDetails.is_profile_complete === 1) {
      console.log("appState-->", this.state.appState);
      if (this.state.appState == "active") {
        Store.dispatch(sendAppStatus({ status: 1 }))
        BackgroundTimer.stopBackgroundTimer(); //after this call all code on background stop run.

      }
      else if (this.state.appState == "inactive") {
        const params = {
          sender_id: userDetails.user_id,
          is_typing: 0
        }
        BackgroundTimer.runBackgroundTimer(() => {
          //code that will be called every 1 seconds 
          // this.storeUserLastDuration(false)
          Store.dispatch(sendAppStatus({ status: 0 }))
          Store.dispatch(sendTypingStatus(params))
        }, 1000);

      }
      else if (this.state.appState == "background") {
        const params = {
          sender_id: userDetails.user_id,
          is_typing: 0
        }
        BackgroundTimer.runBackgroundTimer(() => {
          //code that will be called every 1 seconds 
          // this.storeUserLastDuration(false)
          Store.dispatch(sendAppStatus({ status: 0 }))
          Store.dispatch(sendTypingStatus(params))
        }, 1000);
      }
    }
  };

  /**
   * 
   * @param {*} icon 
   * @param {*} style 
   * @param {*} customProps 
   * @returns render flash message icon
   */
  renderFlashMessageIcon(icon = 'success', style = {}, customProps = {}) {
    switch (icon) {
      case 'appIcon': // casting for your custom icons and render then
        return (
          <Image source={images.appLogoWithNameWhite} />
        );
      default:
        // if not a custom icon render the default ones...
        return renderFlashMessageIcon(icon, style, customProps);
    }
  }

  /**componet render method */
  render() {
    try {
      if (this.state.showModal) {
        return (
          <NoInternetModal
            modalVisible={this.state.showModal}
            onPressExit={() => {
              if (Platform.OS == "ios") {
                NativeModules.RNExitApp.exitApp();
              }
              else {
                BackHandler.exitApp()
              }
            }}
            onPressTryAgain={() => this.checkNetworkAvaibility()}
          />
        )
      }
      else {
        return (
          <Provider store={Store}>
            <Route />
            <FlashMessage
              style={{ backgroundColor: colors.blueShade1, borderRadius: 20 }}
              floating={true}
              hideStatusBar={false}
              duration={5000}
              position="top"
              renderFlashMessageIcon={this.renderFlashMessageIcon.bind(this)}
            />
            {/* <PushNotification /> */}
            <ToastUtil />
          </Provider>
        )
      }

    }
    catch (error) {
      //* error handling
      crashlytics().recordError(error);
    }
  }
}
