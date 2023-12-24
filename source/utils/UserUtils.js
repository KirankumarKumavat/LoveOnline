import StorageService from "./StorageService";

/**
 * A utility to manage user related operations.
 */
export default class UserUtils {
   /**
    * Saves user details to async storage.
    * @param {*} userDetails User details to save in async storage.
    */
   static async setUserDetailsToAsyncStorage(userDetails) {
      return await StorageService.saveItem(StorageService.STORAGE_KEYS.USER_DETAILS, userDetails);
   }

   /**
     * Returns user details saved in the async storage.
     */
   static async getUserDetailsFromAsyncStorage() {
      const userDetails = await StorageService.getItem(StorageService.STORAGE_KEYS.USER_DETAILS);
      return userDetails;
   }

   /**
    * Save user profile setup related details to async storage
    * value will be stored at each step to maintain user steps 
    * and go to next step when user retry to fill setup
    * @param {*} userProfileDetails 
    */
   static async setUserProfileSetupDetailsToAsyncStorage(userProfileDetails) {
      return await StorageService.saveItem(StorageService.STORAGE_KEYS.USER_PROFILE_SETUP_STATUS, userProfileDetails);
   }

   /**
    * Returs the user profile setup related details when user wants to again fill
    * profile setup related details.
    */
   static async getUserProfileSetupDetailsFromAsyncStorage() {
      const userProfileDetails = await StorageService.getItem(StorageService.STORAGE_KEYS.USER_PROFILE_SETUP_STATUS);
      return userProfileDetails;
   }

}