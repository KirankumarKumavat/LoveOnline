import {
   Platform,
   Linking,
   Alert
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import { openSettings, PERMISSIONS, request, check } from 'react-native-permissions';

import { showSimpleAlert } from './HelperFunction'
import { constants, commonText } from '../common'

/**
 * Used for check Location Permission and Current Location
 */
export async function onPermissionCheckAgain() {
   const locationPermission = Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
   });

   return new Promise((resolve) => {
      check(locationPermission).then(async (response) => {
         if (response == 'unavailable') {
            request(locationPermission)
               .then(async (response) => {
                  if (response == 'unavailable') {
                     Alert.alert(
                        constants.AppName,
                        commonText.msgDeviceLocationPermission,
                        [
                           {
                              text: 'Okay',
                              onPress: () => {
                                 let res = { isGoBack: 1 }
                                 resolve(res)
                              }
                           }
                        ]
                     )
                  }

                  if (response == 'denied') {
                     request(locationPermission)
                        .then(async (response) => {
                           if (response == 'granted') {
                              let res = await getCurruntLocation()
                              resolve(res)
                           }
                        })
                  }
                  else if (response == 'granted') {
                     let res = await getCurruntLocation()
                     resolve(res)
                  }
               })
         }

         else if (response == 'granted') {
            let res = await getCurruntLocation()
            resolve(res)
         }

         else if (response == 'denied') {
            request(locationPermission)
               .then(async (response) => {
                  if (response == 'granted') {
                     let res = await getCurruntLocation()
                     resolve(res)
                  }
                  else if (response == 'blocked') {
                     let res = {
                        status: "Blocked"
                     }
                     resolve(res)
                  }
                  else if (Platform.OS == 'android' && response == 'denied') {
                     let res = {
                        status: "Denied"
                     }
                     resolve(res)
                  }
               })
         }
         else {
            Alert.alert(
               constants.AppName,
               commonText.msgPermissionLocation,
               Platform.OS == 'ios' ?
                  [
                     {
                        text: 'Cancel', onPress: () => {
                           let res = {
                              status: "Cancel"
                           }
                           resolve(res)
                        }
                     },
                     {
                        text: 'Okay', onPress: () => {
                           let res = { isGoBack: 1 }
                           resolve(res)
                           Linking.openURL('app-settings:').then(
                              (value) => {
                                 // onPermissionCheckAgain()
                              }
                           );
                        }
                     },
                  ] :
                  [
                     {
                        text: 'Cancel', onPress: () => {
                           let res = {
                              status: "Cancel"
                           }
                           resolve(res)
                        }
                     },
                     {
                        text: 'Okay', onPress: () => {
                           openSettings().catch(() => console.warn('cannot open settings'))
                           let res = { isGoBack: 1 }
                           resolve(res)
                        }
                     },
                  ],
               { cancelable: false }
            )
         }
      })
   })
}

// 7 second timeout
const timeout = () =>
   new Promise(resolve => {
      const timestamp = +new Date();
      setTimeout(() => {
         resolve({ timeout: true, elapsed: +new Date() - timestamp });
      }, 20 * 1000);
   });


//Code-->1   PERMISSION_DENIED	1	Location permission is not granted
//Code-->2   POSITION_UNAVAILABLE	2	Location provider not available
//Code-->3   TIMEOUT	3	Location request timed out
//Code-->4   PLAY_SERVICE_NOT_AVAILABLE	4	Google play service is not installed or has an older version (android only)
//Code-->5   SETTINGS_NOT_SATISFIED	5	Location service is not enabled or location mode is not appropriate for the current request (android only)
//Code-->-1  INTERNAL_ERROR	-1	Library crashed for some reason or the getCurrentActivity() returned null (android only)

/**
 * Used for Device Current Location
 */

let watchID;

export async function getCurruntLocation() {
   //Getting updated Currunt Location
   let reg = {};

   return new Promise((r) => {
      Geolocation.getCurrentPosition(
         (position) => {
            reg = {
               latitude: position['coords']['latitude'],
               longitude: position['coords']['longitude'],
               latitudeDelta: constants.LATITUDE_DELTA,
               longitudeDelta: constants.LONGITUDE_DELTA
            }
            r(reg)
         },
         ((error) => {
            console.log(error.code, error.message),
            {
               enableHighAccuracy: true,
               timeout: 15000,
               maximumAge: 3000,
               interval: 1000,
               fastestInterval: 1500
            }

            if (Platform.OS == 'android') {
               if (error.code == 5) {
                  let res = {
                     status: "SETTINGS_NOT_SATISFIED",
                  }
                  r(res)
                  showSimpleAlert(error.message)
               }
               else if (error.code == 3) {
                  watchID = Geolocation.watchPosition(
                     (position) => {
                        reg = {
                           latitude: position['coords']['latitude'],
                           longitude: position['coords']['longitude'],
                           latitudeDelta: constants.LATITUDE_DELTA,
                           longitudeDelta: constants.LONGITUDE_DELTA
                        }
                        r(reg)
                     }, (error) => {
                        console.log("code 3 error", error.code, error.message),
                        {
                           enableHighAccuracy: false,
                           timeout: 15000,
                           maximumAge: 3000,
                           interval: 1000,
                           fastestInterval: 500,
                           forceRequestLocation: true
                        }
                     }
                  )
               }
               else if (error.code == 2) {
                  showSimpleAlert(error.message)
                  // let res = { isGoBack: 1 }
                  let res = {
                     status: "POSITION_UNAVAILABLE"
                  }
                  r(res)
               }
            }
            else if (Platform.OS == "ios") {
               if (error.code == 3) {
                  Geolocation.watchPosition(
                     (position) => {
                        reg = {
                           latitude: position['coords']['latitude'],
                           longitude: position['coords']['longitude'],
                           latitudeDelta: constants.LATITUDE_DELTA,
                           longitudeDelta: constants.LONGITUDE_DELTA
                        }
                        r(reg)
                     }, (error) => {
                        console.log("code 3 error", error.code, error.message),
                        {
                           enableHighAccuracy: false,
                           timeout: 15000,
                           maximumAge: 3000,
                           interval: 1000,
                           fastestInterval: 500,
                           forceRequestLocation: true
                        }
                     }
                  )
               }
               else if (error.code == 2) {
                  showSimpleAlert(error.message)
                  let res = {
                     status: "POSITION_UNAVAILABLE"
                  }
                  r(res)
               }
            }
         }
         ),
         {
            timeout: 15000,
            maximumAge: 3000,
            enableHighAccuracy: false,
            useSignificantChanges: true,
            showLocationDialog: true,
            forceRequestLocation: true,
         });
   })
}

export const clearWatch = () => {
   Geolocation.clearWatch(watchID);
   watchID = null;
}
