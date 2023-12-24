import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Keyboard, TouchableOpacity, StatusBar, } from 'react-native';
import { colors, constants, commonText } from '../../common';
import { images, icons, fonts } from '../../assets';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputField, CustomButton, SocialLogin, Header, Loader } from '../../components';
import { getBottomMoreSpace } from '../../utils/iPhoneXHelper';
import { isValidEmail, showSimpleAlert } from '../../utils/HelperFunction';
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';
import apiConfigs from '../../api/apiConfig';
import { AccessToken, LoginManager } from 'react-native-fbsdk-next';
import StorageService from '../../utils/StorageService';
import { appleAuth } from '@invertase/react-native-apple-authentication';


/**SignUp Screen Component */
class SignUp extends Component {
   /**email  */
   email = ""

   /**componet life cycle method */
   componentDidMount() {
      this._configureGoogleSignIn();
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.props.resetData();
   }

   /**sets configuration for google signin */
   async _configureGoogleSignIn() {
      GoogleSignin.configure({
         offlineAccess: false,
         webClientId: apiConfigs.webClientDFORANDROID,
         iosClientId: apiConfigs.iosClientID,
      });
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
               <View style={styles.mainContainer}>
                  <View style={styles.innerWrap}>
                     <Header showShadow={false} backButton middleText={commonText.signUpText} />
                     <View style={styles.appLogoView}>
                        <Image source={images.appLogoBlue} style={{ marginLeft: 0 }} resizeMode={'cover'} />
                     </View>
                     <View style={{ marginTop: 30 }}>
                        <InputField
                           value={this.email}
                           placeholder={commonText.email}
                           onChangeText={(email) => this.changeText(email)}
                           onSubmitEditing={() => Keyboard.dismiss()}
                           keyboardType={constants.emailKeyboardType}
                           rightIcon={icons.emailGrey}
                           rightIconHeight={13}
                           rightIconWidth={17}
                           returnKeyType={constants.doneReturnKeyType}
                           containerStyle={{ borderColor: colors.inputBorder2, }}
                        />
                        <CustomButton
                           onPress={this.onPressSignUp}
                           title={commonText.submit}
                           mainStyle={{ marginVertical: 10, }}
                        />
                     </View>
                  </View>
                  <View style={styles.socialView}>
                     <SocialLogin
                        onPressSocial={this.onPressSocial}
                        mainContainer={{}}
                     />
                  </View>
                  <View style={styles.lastView}>
                     <Text style={styles.bottomText}>{commonText.byContinueAgeText + ' '}</Text>
                     <View style={styles.wrapView}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate(commonText.termsAndPrivacyRoute, { terms: true }) }} delayPressIn={0}
                           style={styles.termsWrap}>
                           <Text style={[styles.bottomText, { color: colors.white }]}>{'Terms'}</Text>
                        </TouchableOpacity>
                        <Text style={styles.bottomText}>{' ' + commonText.andText + ' '}</Text>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate(commonText.termsAndPrivacyRoute, { policy: true }) }} delayPressIn={0}
                           style={styles.termsWrap}>
                           <Text style={[styles.bottomText, { color: colors.white }]}>{commonText.privacyPolicyText}</Text>
                        </TouchableOpacity>
                     </View>
                  </View>
                  <View style={{ height: 10 }} />
               </View>
            </KeyboardAwareScrollView>
            <Loader loading={this.props.loading} />
         </View>
      );
   }

   /**handle email text change  */
   changeText = (text) => {
      this.email = text;
      this.forceUpdate();
   }

   /**action handle for click submit button */
   onPressSignUp = () => {
      Keyboard.dismiss()
      if (!this.email) {
         showSimpleAlert(commonText.enterEmailMessage)
         return false;
      }
      else {
         const checkEmail = isValidEmail(this.email)
         if (checkEmail) {
            let email = this.email.trim()
            const params = { email: email }
            this.props.signUpWithEmail(params)
         }
         else {
            showSimpleAlert(commonText.enterValidEmail)
            return false;
         }
      }
   }

   /**click event for Social login icon press */
   onPressSocial = (key) => {
      switch (key) {
         case commonText.facebookKey:
            this.onPressFaceBook();
            break;
         case commonText.googleKey:
            this.onPressGoogle();
            break;
         case commonText.appleKey:
            this.onPressApple();
            break;
         default: null;
      }
   }

   /**action when user click on apple login */
   onPressApple = async () => {
      try {
         this.props.signUpRequest();
         const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
         });
         if (appleAuthRequestResponse) {
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
               // user is authenticated
               if (appleAuthRequestResponse.user) {
                  this.appleLoginApicall(appleAuthRequestResponse)
               }
            }
            else if (credentialState === appleAuth.State.NOT_FOUND) {
               this.props.signupFailure();
            }
            else if (credentialState === appleAuth.State.REVOKED) {
               this.props.signupFailure();
            }
            else if (credentialState === appleAuth.State.TRANSFERRED) {
               this.props.signupFailure();
            }
            else {
               console.log("credentialState", credentialState)
            }
         }
      } catch (error) {
         this.props.signupFailure();
      }
   }

   /**action for api call for apple login */
   appleLoginApicall = (appleAuthRequestResponse) => {
      let isSocialLogin = true;
      let params = {};
      if (appleAuthRequestResponse.email) {
         params = {
            email: appleAuthRequestResponse.email,
            apple_id: appleAuthRequestResponse.user,
         }
      }
      else {
         params = {
            apple_id: appleAuthRequestResponse.user,
         }
      }
      this.props.login(params, isSocialLogin)
   }

   /**action when user click on facebook login */
   onPressFaceBook = async () => {
      // Attempt login with permissions
      if (Platform.OS === "android") {
         LoginManager.setLoginBehavior("web_only")
      }
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log("result==>", result);
      if (result.isCancelled) {
         throw 'User cancelled the login process';
      }
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
         // throw 'Something went wrong obtaining access token';
         console.log("Something went wrong obtaining access token")
      }
      const { accessToken } = data;
      await this.initUser(accessToken)
   }

   /**fb login method */
   initUser = async (token) => {
      await fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + token)
         .then((response) => response.json())
         .then(async (json) => {
            await StorageService.saveItem('fbId', json.email);
            await StorageService.saveItem('fbToken', json.id);
            let emailId = json.email;
            let fbToken = json.id
            this.apiCallForFb(fbToken, emailId)
         })
         .catch(() => {
            reject('ERROR GETTING DATA FROM FACEBOOK')
         })
   }

   /**action to perform fb login api call */
   apiCallForFb = (access, emailId) => {
      let email = emailId;
      let facebook_id = access;
      let isSocialLogin = true;
      const params = {
         email, facebook_id,
      }
      this.props.login(params, isSocialLogin)
   }

   /**action fire when google login icon click  */
   onPressGoogle = async () => {
      GoogleSignin.signOut()
      this._signIn()
   }

   /**google login method */
   _signIn = async () => {
      try {
         await GoogleSignin.hasPlayServices();
         this.props.signUpRequest();
         const userInfo = await GoogleSignin.signIn();
         this.props.signUpSuccess();
         this.setState({ userInfo, error: null });
         if (userInfo) this.socialLoginSignupCall(userInfo)
      } catch (error) {
         this.props.signupFailure()
         switch (error.code) {
            case statusCodes.SIGN_IN_CANCELLED:
               break;
            case statusCodes.IN_PROGRESS:
               break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
               break;
            default:
               console.log("Error--->", error)
         }
      }
   };

   /**social login api call action */
   socialLoginSignupCall = (userInfo) => {
      let email = userInfo.user.email;
      let google_id = userInfo.idToken;
      let isSocialLogin = true;
      const params = {
         email,
         google_id,
      }
      this.props.login(params, isSocialLogin)
   }
}

export default SignUp;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.blueShade1,
   },
   imageBackground: {
      height: constants.screenHeight,
      width: constants.screenWidth,
      position: 'absolute'
   },
   mainWrap: {
      flex: 1,
   },
   appLogoView: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      height: constants.screenHeight / 4,
   },
   bottomText: {
      fontFamily: fonts.muliSemiBold,
      color: colors.white,
      textAlign: 'center',
   },
   bottomText2: {
      borderBottomWidth: 1
   },
   mainContainer: {
      flex: 1
   },
   socialView: {
      flex: 1,
      justifyContent: 'center',
   },
   lastView: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: 5,
      paddingBottom: getBottomMoreSpace(10)
   },
   innerWrap: {
      flex: 1, backgroundColor: colors.white,
      borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
      paddingBottom: 60,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 15,
      shadowOffset: {
         height: 5,
         width: 0
      }
   },
   wrapView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center'
   },
   termsWrap: {
      borderBottomWidth: 1,
      borderBottomColor: colors.white
   }
})