import React from "react";
import { ProfileStepsID } from "./ProfileSetupSteps";
import { commonText } from "../../common";
import { icons, images } from "../../assets";
import UserNameContainer from "./UserNameContainer";
import UserProfessionContainer from "./UserProfessionContainer"
import UserHeightContainer from "./UserHeightContainer";
import UserMaritalStatusContainer from "./UserMaritalStatusContainer";
import UserChildrenContainer from "./UserChildrenContainer";
import UserCountryContainer from "./UserCountryContainer";
import UserCityContainer from "./UserCityContainer";
import UserEthnicityContainer from "./UserEthnicityContainer";
import UserSectContainer from "./UserSectContainer";
import UserMarriageGoalContainer from "./UserMarriageGoalContainer";
import UserDegreesContainer from "./UserDegreesContainer";
import UserProfileAnswersContainer from "./UserProfileAnswersContainer";
import UserPrayContainer from "./UserPrayContainer";
import UserPhoneNumberContainer from "./UserPhoneNumberContainer";
import UserPhoneVerificationContainer from "./UserPhoneVerificationContainer";

/**
 *This Screen manage and send list for profile setup all steps
 */
export default class ProfileSetupData {

   static userName = {
      id: ProfileStepsID.userName,
      stepDescription: commonText.profileSetupUserNameDesc,
      stepIcon: images.profileIcon,
      stepTitle: commonText.profileSetupUserNameTitle,
      setpBody: <UserNameContainer />,
   }

   static userProffestion = {
      id: ProfileStepsID.userProffestion,
      stepDescription: commonText.profileSetupUserProfesstionDesc,
      stepIcon: images.bagIcon,
      stepTitle: commonText.profileSetupUserProfesstionTitle,
      setpBody: <UserProfessionContainer />,
   }

   static userHeight = {
      id: ProfileStepsID.userHeight,
      stepDescription: commonText.profileSetupUserHeightDesc,
      stepIcon: images.heightIcon,
      stepTitle: commonText.profileSetupUserheightTitle,
      setpBody: <UserHeightContainer />,
   }

   static userMaritalStatus = {
      id: ProfileStepsID.userMaritalStatus,
      stepDescription: commonText.profileSetupUserMaritalStatusDesc,
      stepIcon: images.maritalStatusIcon,
      stepTitle: commonText.profileSetupUserMaritalStatusTitle,
      setpBody: <UserMaritalStatusContainer />,
   }

   static userChildren = {
      id: ProfileStepsID.userChildren,
      stepDescription: commonText.profileSetupUserChildrenDesc,
      stepIcon: images.childrenIcon,
      stepTitle: commonText.profileSetupUserChildrenTitle,
      setpBody: <UserChildrenContainer />,
   }

   static userCountry = {
      id: ProfileStepsID.userCountry,
      stepDescription: commonText.profileSetupUserCountryDesc,
      stepIcon: images.earthIcon,
      stepTitle: commonText.profileSetupUserCountryTitle,
      setpBody: <UserCountryContainer />,
   }

   static userPhoneNumber = {
      id: ProfileStepsID.userPhone,
      stepTitle: commonText.profileSetupUserPhoneTitle,
      stepIcon: images.phoneNumberIcon,
      stepDescription: commonText.profileSetupUserPhoneDesc,
      setpBody: <UserPhoneNumberContainer />,
   }

   static userPhoneVerification = {
      id: ProfileStepsID.userPhoneVerification,
      stepTitle: commonText.profileSetupUserPhoneVerificationTitle,
      stepIcon: images.phoneOtpIcon,
      stepDescription: commonText.profileSetupUserPhoneVerificationDesc,
      setpBody: <UserPhoneVerificationContainer />,
   }

   static userCity = {
      id: ProfileStepsID.userCity,
      stepDescription: commonText.profileSetupUserCityDesc,
      stepIcon: images.cityIcon,
      stepTitle: commonText.profileSetupUserCityTitle,
      setpBody: <UserCityContainer />,
   }
   static userEthnicity = {
      id: ProfileStepsID.userEthnicity,
      stepDescription: commonText.profileSetupUserEthinicityDesc,
      // stepDescription: commonText.profileSetupUserCasteDesc,
      stepIcon: images.castIcon,
      stepTitle: commonText.profileSetupUserEthinicityTitle,
      setpBody: <UserEthnicityContainer />,
   }
   static userCaste = {
      id: ProfileStepsID.userCaste,
      stepDescription: commonText.profileSetupUserCasteDesc,
      stepIcon: images.castIcon,
      stepTitle: commonText.profileSetupUserCasteTitle,
      setpBody: <UserSectContainer />,
   }
   static userPray = {
      id: ProfileStepsID.userPray,
      stepDescription: commonText.profileSetupUserPrayDesc,
      stepIcon: images.prayIcon,
      stepTitle: commonText.profileSetupUserPrayTitle,
      setpBody: <UserPrayContainer />,
   }
   static userMarriagegoal = {
      id: ProfileStepsID.userMarriagegoal,
      stepDescription: commonText.profileSetupUsermarriagegoalDesc,
      stepIcon: images.aeroplaneIcon,
      stepTitle: commonText.profileSetupUsermarriagegoalTitle,
      setpBody: <UserMarriageGoalContainer />,
   }
   static userEducation = {
      id: ProfileStepsID.userEducation,
      stepDescription: commonText.profileSetupUserEducationDesc,
      stepIcon: images.jobIcon,
      stepTitle: commonText.profileSetupUserEducationTitle,
      setpBody: <UserDegreesContainer />,
   }
   static userProfileQuestion = {
      id: ProfileStepsID.userProfileQuestion,
      stepIcon: images.queAnsIcon,
      stepTitle: commonText.profileSetupUserProfileQuestionTitle,
      setpBody: <UserProfileAnswersContainer />,
   }

   static profileSetupArray = [
      this.userName,//-1
      this.userProffestion,//0
      this.userHeight,//1
      this.userMaritalStatus,//2
      this.userChildren,//3
      this.userCountry,//4
      this.userPhoneNumber,//5
      this.userPhoneVerification,//6
      this.userCity,//7
      this.userEthnicity,//8
      this.userCaste,//9
      this.userPray,//10
      this.userMarriagegoal,//11
      this.userEducation,       //12   
      this.userProfileQuestion,//13
   ]

   /**function returns the profile setup steps array */
   static getProfileStepData() {
      return this.profileSetupArray
   }

}