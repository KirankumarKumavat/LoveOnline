import { Alert } from "react-native";
import { constants } from "../common";
import { onPermissionCheckAgain } from "./CurrentLocationFinder";
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from "rn-fetch-blob";

/**
 * 
 * @param {*} message 
 * Show simple alert
 */
export function showSimpleAlert(message) {
   Alert.alert(
      constants.AppName,
      message,
      [
         { text: "OK", onPress: () => { } }
      ],
      { cancelable: false }
   );
}

/**
 * @param string
 * check email is valid or not
 */
export function isValidEmail(string) {
   string = string.replace(/\s/g, '')
   // let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
   const reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   if (reg.test(string) === true) {
      return true
   }
   return false
}

/**
 * @param string
 * check email is valid or not
 */
export function isValidPassword(string) {
   string = string.replace(/\s/g, '')
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
   const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{6,18})");
   const mediumRegex = new RegExp("r'(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])([a-zA-Z0-9@$!% *?&]{6,18})';")
   if (strongRegex.test(string) === true) {
      return true
   }
   return false;
}

/**
 * Age Calculate Function to help calculate age of user.
 */
export function calculate_age(dob1) {
   var today = new Date();
   var birthDate = new Date(dob1);  // create a date object directly from `dob1` argument
   var age_now = today.getFullYear() - birthDate.getFullYear();
   var m = today.getMonth() - birthDate.getMonth();
   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
   }
   return age_now;
}

/**
 * 
 * @param {*} birth_month 
 * @param {*} birth_day 
 * @param {*} birth_year 
 * @returns User age based on birthdate
 */
export function get_age(birth_month, birth_day, birth_year) {
   let today_date = new Date();
   let today_year = today_date.getFullYear();
   let today_month = today_date.getMonth();
   let today_day = today_date.getDate();
   let age = today_year - birth_year;

   if (today_month < (birth_month - 1)) {
      age--;
   }
   if (((birth_month - 1) == today_month) && (today_day < birth_day)) {
      age--;
   }
   return age;
}

/**
 * 
 * @param {*} time 
 * @returns formatted time
 */
export function formatTimeString(time) {
   let msecs = time % 1000;
   if (msecs < 10) msecs = `00${msecs}`;
   else if (msecs < 100) msecs = `0${msecs}`;
   let seconds = Math.floor(time / 1000);
   let minutes = Math.floor(time / 60000);
   seconds = seconds - minutes * 60;
   let formatted;
   formatted = `${minutes < 10 ? 0 : ""
      }${minutes}:${seconds < 10 ? 0 : ""}${seconds}`;
   return formatted;
}

/**
 * 
 * @param {*} lat1 
 * @param {*} lon1 
 * @param {*} lat2 
 * @param {*} lon2 
 * @returns distance from lat-long
 */
export function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
   var R = 6371; // Radius of the earth in km
   var dLat = deg2rad(lat2 - lat1);  // deg2rad below
   var dLon = deg2rad(lon2 - lon1);
   var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   var d = R * c; // Distance in km
   return d;
}

/**
 * 
 * @param {*} deg 
 * @returns radion from degree
 */
export function deg2rad(deg) {
   return deg * (Math.PI / 180)
}

/**
 * 
 * @returns param based on location availibility
 */
export const checkLocationAvaibility = async () => {
   let params = {}
   const location = await onPermissionCheckAgain().then(async (value) => {
      if (value.isGoBack == 1) {
      }
      else if (value.status == "Blocked" || value.status == "Denied" ||
         value.status == "Cancel" || value.status == "SETTINGS_NOT_SATISFIED" ||
         value.status == "POSITION_UNAVAILABLE") {
      }
      else {
         let latitude = value.latitude.toFixed(4).toString();
         let longitude = value.longitude.toFixed(4).toString();
         params.latitude = latitude;
         params.longitude = longitude;

      }
   }).catch(async (error) => {
   })
   return params;
}

/**
 * 
 * @param {*} isBase64 
 * @returns image picker component
 */
export const pickImage = async (isBase64) => {
   const options = {
      title: 'Select Image',
      storageOptions: {
         skipBackup: true,
         path: 'images',
      },
      quality: 1,
      allowsEditing: true
   };

   return new Promise(async (resolve) => {
      ImagePicker.showImagePicker(options, async (response) => {

         if (response && response.uri) {
            if (isBase64) {
               const base64Data = 'data:' + response.type + ';base64,' + response.data;
               resolve([{ base64Data, image: response.uri }]);
            }
            resolve(response.uri);
         } else return false;
      });
   });
};

/**
   * 
   * @param {*} filename 
   * return extention of Any kind of file 
   */
export const getFileExtension = async (filename) => {
   const response = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
   return response;
}

/**
 * 
 * @param {*} remoteImage 
 * function which convert image into BASE64
 */
export const imageConvertTobase64 = async (remoteImage) => {
   const fs = RNFetchBlob.fs;
   let imagePath = null;
   return new Promise((resolve) => {
      RNFetchBlob.config({
         fileCache: true
      }).fetch("GET", remoteImage)
         .then(resp => {
            imagePath = resp.path();
            return resp.readFile("base64");
         }).then(base64Data => {
            resolve(base64Data)
         }).catch((error) => {
            console.log("Error Base64-->", error)
         });
   })
}

/**
 * 
 * @param {*} str 
 * function which convert First character into Capital letter of String
 */
export function convetCapital(str) {
   return str.charAt(0).toUpperCase() + str.slice(1);
}


export function formatDate(date) {
   var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

   if (month.length < 2)
      month = '0' + month;
   if (day.length < 2)
      day = '0' + day;

   return [year, month, day].join('-');
}
