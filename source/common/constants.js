import { Platform, Dimensions } from 'react-native';
const isIOS = Platform.OS === 'ios';
const isAndroid = Platform.OS === 'android';
const { width, height } = Dimensions.get('window');
const isLandscape = width > height;
const isPortrait = width < height;
const screenWidth = width;
const screenHeight = height;
const AppName = "LoveOnline"
const activeOpacity = 0.5;

/**
 * keyboard related constants
 */

const keyboardConstant = {
   doneReturnKeyType: "done",
   nextReturnKeyType: "next",
   searchReturnKeyType: "search",
   emailKeyboardType: "email-address",
   numericKeyboardType: "numeric",
   LATITUDE_DELTA: 0.4,
   LONGITUDE_DELTA: 0.4,
}

/**
 * common constants used in app for different purpose
 */

const common = {
   isLandscape,
   isPortrait,
   AppName,
   screenWidth,
   screenHeight,
   isIOS,
   isAndroid,
   activeOpacity,
}

/**constants used in app */
const constants = {
   ...common,
   ...keyboardConstant,
}

export default constants;