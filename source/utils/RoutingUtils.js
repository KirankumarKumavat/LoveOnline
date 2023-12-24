import NavigationService, { } from "./NavigationService";
import commonText from "../common/commonText";
import UserUtils from "./UserUtils";
import { Store } from '../redux/reduxStore';
import { profileSetupIncreaseIndex } from "../redux/action";

/**
 * Utility to help managing commom navigations.
 */
export default class RoutingUtils {
   /**
    * Determines the navigation path based on given user details.
    * @param {object} userDetails Used to determine user navigation path.
    * 
    */
   static setupUserNavigation(userDetails) {
      let route = "";
      let globalRoute = NavigationService.getGlobalNavigator();
      console.log("globalRoute====>", globalRoute);
      if (userDetails) {
         if (userDetails.is_profile_complete === 0) {
            globalRoute.navigate("Auth", { screen: commonText.profileSetUpRoute })
         }
         else if (userDetails.is_profile_complete === 1) {
            globalRoute.navigate("App")
         }
      }
      else {
         globalRoute.navigate("Auth", { screen: commonText.loginRoute })
      }
   }

   /**
    * 
    * @param {*} userDetails 
    * User Profile setup handling and provide navigation when user last left
    */
   static async setupuserProfileSetupNavigation(userDetails) {
      let route = "";
      let globalRoute = NavigationService.getGlobalNavigator();
      const userProfileDetails = await UserUtils.getUserProfileSetupDetailsFromAsyncStorage();
      if (userDetails) {
         if (userProfileDetails) {
            if (userProfileDetails >= 0 || userProfileDetails < 15) {
               if (userProfileDetails == 3) {
                  if (userDetails && userDetails.marital_status == commonText.single) {
                     Store.dispatch(profileSetupIncreaseIndex({ specificIndex: 4 }))
                     globalRoute.navigate(commonText.profileSetupStepsRoute, { isFromEdit: true })
                  }
                  //user is diveorsed
                  else {
                     Store.dispatch(profileSetupIncreaseIndex({ specificIndex: 3 }))
                     globalRoute.navigate(commonText.profileSetupStepsRoute, { isFromEdit: true })
                  }
               }
               else if (userProfileDetails == 14) {
                  //if user given all 5 que-ans
                  if (userDetails && userDetails.questions && userDetails.questions.length == 5) {
                     globalRoute.navigate(commonText.descriptionProfileRoute, { isFromEdit: true })
                  }
                  //if user not given all 5 -ans
                  else {
                     Store.dispatch(profileSetupIncreaseIndex({ specificIndex: 13 }))
                     globalRoute.navigate(commonText.profileSetupStepsRoute, { isFromEdit: true })
                  }
               }
               else {
                  Store.dispatch(profileSetupIncreaseIndex({ specificIndex: userProfileDetails }))
                  globalRoute.navigate(commonText.profileSetupStepsRoute, { isFromEdit: true })
               }
            }
            else if (userProfileDetails == "ABOUTME") {
               globalRoute.navigate(commonText.profilePicsRoute, { isFromEdit: true })
            }
            else if (userProfileDetails == "MYPROFILEPICS") {
               globalRoute.navigate(commonText.profilePicsRoute, { isFromEdit: true })
            }
            else {
               Store.dispatch(profileSetupIncreaseIndex({ specificIndex: -1 }))
               globalRoute.navigate(commonText.profileSetupStepsRoute)
            }
         }
         else {
            Store.dispatch(profileSetupIncreaseIndex({ specificIndex: -1 }))
            globalRoute.navigate(commonText.profileSetupStepsRoute)
         }
      }
      else {
         Store.dispatch(profileSetupIncreaseIndex({ specificIndex: -1 }))
         globalRoute.navigate(commonText.profileSetupStepsRoute)
      }
   }
}