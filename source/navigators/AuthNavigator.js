import React, { } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginContainer from '../screens/login/LoginContainer';
import ForgotPasswordContainer from '../screens/forgotPassword/ForgotPasswordContainer';
import GenderSelectionContainer from '../screens/genderSelection/GenderSelectionContainer';
import commonText from '../common/commonText';
import SignUpContainer from '../screens/signup/SignUpContainer';
import SignUpDateOfBirthContainer from '../screens/signup/SignUpDateOfBirthContainer';
import VerificationContainer from '../screens/verification/VerificationContainer';
import EnterPasswordContainer from '../screens/enterPassword/EnterPasswordContainer';
import DescriptionProfileContainer from '../screens/descriptionProfile/DescriptionProfileContainer';
import commonWebViewContainer from '../screens/termsAndPrivacy/CommonWebViewContainer'
import SelectPromptContainer from '../screens/selectPrompt/SelectPromptContainer';
import WriteAnswerContainer from '../screens/writeAnswer/WriteAnswerContainer';
import ProfilePicsContainer from '../screens/profilePics/ProfilePicsContainer';
import UserProfessionContainer from '../screens/profileSetup/UserProfessionContainer';
import UserMaritalStatusContainer from '../screens/profileSetup/UserMaritalStatusContainer';
import UserHeightContainer from '../screens/profileSetup/UserHeightContainer';
import UserChildrenContainer from '../screens/profileSetup/UserChildrenContainer';
import UserCountryContainer from '../screens/profileSetup/UserCountryContainer';
import UserCityContainer from '../screens/profileSetup/UserCityContainer';
import UserEthnicityContainer from '../screens/profileSetup/UserEthnicityContainer';
import UserSectContainer from '../screens/profileSetup/UserSectContainer';
import UserMarriageGoalContainer from '../screens/profileSetup/UserMarriageGoalContainer';
import UserDegreesContainer from '../screens/profileSetup/UserDegreesContainer';
import UserNameContainer from '../screens/profileSetup/UserNameContainer'
import ProfileSetupMainPage from '../screens/profileSetup/ProfileSetupMainPage';
import UserProfileAnswersContainer from '../screens/profileSetup/UserProfileAnswersContainer';
import ProfileSetupStepsContainer from '../screens/profileSetup/ProfileSetupStepsContainer';
import UserPrayContainer from '../screens/profileSetup/UserPrayContainer';
import UserPhoneVerificationContainer from '../screens/profileSetup/UserPhoneVerificationContainer';
import UserPhoneNumberContainer from '../screens/profileSetup/UserPhoneNumberContainer';

const AuthTab = createStackNavigator();

/**
 * navigatior for auth flow ,i.e ->login,signup,create profile
 */
function AuthNavigator() {
   return (
      <AuthTab.Navigator
         headerMode={'none'}
         initialRouteName={commonText.loginRoute}
      >
         <AuthTab.Screen name={commonText.loginRoute} component={LoginContainer} />
         <AuthTab.Screen name={commonText.signUpRoute} component={SignUpContainer} />
         <AuthTab.Screen name={commonText.forgotPasswordRoute} component={ForgotPasswordContainer} />
         <AuthTab.Screen name={commonText.genderSelectionRoute} component={GenderSelectionContainer} />
         <AuthTab.Screen name={commonText.signupDateOfBirthRoute} component={SignUpDateOfBirthContainer} />
         <AuthTab.Screen name={commonText.verificationRoute} component={VerificationContainer} />
         <AuthTab.Screen name={commonText.enterPasswordRoute} component={EnterPasswordContainer} />
         <AuthTab.Screen name={commonText.profileSetUpRoute} component={ProfileSetupMainPage} />
         <AuthTab.Screen name={commonText.descriptionProfileRoute} component={DescriptionProfileContainer} />
         <AuthTab.Screen name={commonText.termsAndPrivacyRoute} component={commonWebViewContainer} />
         <AuthTab.Screen name={commonText.selectPromptRoute} component={SelectPromptContainer} />
         <AuthTab.Screen name={commonText.writeAnswerRoute} component={WriteAnswerContainer} />
         <AuthTab.Screen name={commonText.profilePicsRoute} component={ProfilePicsContainer} />
         <AuthTab.Screen name={commonText.profileSetupStepsRoute} component={ProfileSetupStepsContainer} />
         <AuthTab.Screen name={commonText.userNameRoute} component={UserNameContainer} />
         <AuthTab.Screen name={commonText.userProfessionRoute} component={UserProfessionContainer} />
         <AuthTab.Screen name={commonText.userHeightRoute} component={UserHeightContainer} />
         <AuthTab.Screen name={commonText.userMaritalStatusRoute} component={UserMaritalStatusContainer} />
         <AuthTab.Screen name={commonText.userChildrenRoute} component={UserChildrenContainer} />
         <AuthTab.Screen name={commonText.userCountryRoute} component={UserCountryContainer} />
         <AuthTab.Screen name={commonText.userCityRoute} component={UserCityContainer} />
         <AuthTab.Screen name={commonText.userEthnicityRoute} component={UserEthnicityContainer} />
         <AuthTab.Screen name={commonText.userSectRoute} component={UserSectContainer} />
         <AuthTab.Screen name={commonText.userPrayRoute} component={UserPrayContainer} />
         <AuthTab.Screen name={commonText.userMarriageGoalRoute} component={UserMarriageGoalContainer} />
         <AuthTab.Screen name={commonText.userDegreesRoute} component={UserDegreesContainer} />
         <AuthTab.Screen name={commonText.userProfileAnswersRoute} component={UserProfileAnswersContainer} />
         <AuthTab.Screen name={commonText.userPhoneNumberRoute} component={UserPhoneNumberContainer} />
         <AuthTab.Screen name={commonText.userPhoneVerificationRoute} component={UserPhoneVerificationContainer} />
      </AuthTab.Navigator>
   )
}

export default AuthNavigator;