import AsyncStorage from '@react-native-async-storage/async-storage';
/**
 * Storage Service class for storing values in local device storage
 */
export default class StorageService {

   /**Different Storage keys */
   static STORAGE_KEYS = {
      TOKENS: 'TOKENS',
      USER_DETAILS: 'USER_DETAILS',
      AUTH_TOKEN: "AUTH_TOKEN",
      USER_PROFILE_SETUP_STATUS: "USER_PROFILE_SETUP_STATUS",
      DEVICE_TOKEN: "DEVICE_TOKEN",
      CURRENT_PLAN_DATA: "CURRENT_PLAN_DATA",
      IS_SUBSCRIBED: "IS_SUBSCRIBED",
      PURCHASE_DATA: "PURCHASE_DATA",
      NOTIFICATION_PERMISSION_ENABLED: "NOTIFICATION_PERMISSION_ENABLED",
      CURRENT_SUBSCRIPTION_DETAILS: "CURRENT_SUBSCRIPTION_DETAILS",
   };

   /**
    * 
    * @param {*} key 
    * @returns get value from local storage
    */
   static getItem(key) {
      return AsyncStorage.getItem(key)
         .then((i) => {
            return JSON.parse(i);
         })
         .catch((e) => console.log(e.message, e));
   }

   /**
    * 
    * @returns get multiple value from local storage
    */
   static getItems() {
      return AsyncStorage.getAllKeys()
         .then((keys) => AsyncStorage.multiGet(keys))
         .then((stores) => {
            var r = stores.map((result, i, store) => {
               return JSON.parse(store[i][1]);
            });
         });
   }

   /**
    * 
    * @returns clear all values from local storage
    */
   static clear() {
      // return AsyncStorage.clear();
      const keys = [this.STORAGE_KEYS.AUTH_TOKEN, this.STORAGE_KEYS.USER_PROFILE_SETUP_STATUS, this.STORAGE_KEYS.USER_DETAILS];
      return AsyncStorage.multiRemove(keys);
   }

   /**
    * 
    * @param {*} key 
    * @returns delete values from local storage
    */
   static deleteItem(key) {
      return AsyncStorage.removeItem(key);
   }

   /**
    * 
    * @param {*} key 
    * @param {*} item 
    * @returns save values to local storage
    */
   static saveItem(key, item) {
      return AsyncStorage
         .setItem(key, JSON.stringify(item))
         .then((value) => item);
   }

}