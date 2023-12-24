import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Image, Keyboard, TouchableOpacity, Platform } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, icons, fonts } from '../../assets';
import { InputField, CustomButton, SocialLogin, Loader } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getBottomMoreSpace } from '../../utils/iPhoneXHelper';
import { isValidEmail, showSimpleAlert } from '../../utils/HelperFunction';
import { GoogleSignin, statusCodes, } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import apiConfigs from '../../api/apiConfig';
import StorageService from '../../utils/StorageService';
import { appleAuth } from '@invertase/react-native-apple-authentication';

/**Login Screen Component */
class Login extends Component {
   constructor(props) {
      super(props);
      this.state = {
         email: "",
         password: "",
      };
   }

   /**componet life cycle method */
   componentDidMount() {
      Settings.initializeSDK();
      this._configureGoogleSignIn();
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.props.resetData()
   }

   /**sets configuration for google signin */
   _configureGoogleSignIn() {
      GoogleSignin.configure({
         offlineAccess: false,
         webClientId: apiConfigs.webClientDFORANDROID,
         iosClientId: apiConfigs.iosClientID,
      });
   }

   /**componet render method */
   render() {
      const { email, password } = this.state;
      return (
         <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
            <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
               <View style={styles.mainWrap}>
                  <View style={styles.newWrap}>
                     <View style={styles.appLogoView}>
                        <Image source={images.appLogoBlue} style={{ marginLeft: 0 }} resizeMode={'cover'} />
                     </View>
                     <View style={{ marginTop: 30 }}>
                        <InputField
                           value={email}
                           InputRef={(ref) => this.emailRef = ref}
                           placeholder={commonText.email}
                           returnKeyType={constants.nextReturnKeyType}
                           onChangeText={(email) => this.setState({ email })}
                           onSubmitEditing={() => this.passwordRef.focus()}
                           keyboardType={constants.emailKeyboardType}
                           rightIcon={icons.emailGrey}
                           rightIconHeight={13}
                           rightIconWidth={17}
                           blurOnSubmit={false}
                           containerStyle={{ borderColor: colors.inputBorder2, }}
                        />
                        <InputField
                           InputRef={(ref) => this.passwordRef = ref}
                           returnKeyType={constants.doneReturnKeyType}
                           blurOnSubmit={false}
                           value={password}
                           placeholder={commonText.password}
                           onChangeText={(password) => this.setState({ password })}
                           onSubmitEditing={() => Keyboard.dismiss()}
                           secureTextEntry={true}
                           rightIcon={icons.passwordNewIcon}
                           rightIconHeight={19}
                           rightIconWidth={14}
                           maxLength={18}
                           containerStyle={{ borderColor: colors.inputBorder2, }}
                        />
                     </View>
                     <TouchableOpacity
                        style={styles.forgotPasswordView}
                        activeOpacity={constants.activeOpacity} delayPressIn={0}
                        onPress={() => this.onPressRoute(commonText.forgotPasswordRoute)}
                     >
                        <Text style={styles.forgotPasswordText}>{commonText.forgotPasswordText}</Text>
                     </TouchableOpacity>
                     <CustomButton
                        onPress={this.onPressSignIn}
                        title={commonText.signIn}
                        mainStyle={{ marginVertical: 10, }}
                     />
                  </View>
                  {/* <View style={styles.socialView}> */}
                  <SocialLogin
                     onPressSocial={this.onPressSocial}
                     mainContainer={{}}
                  />
                  {/* </View> */}
                  <View style={styles.bottomView}>
                     <TouchableOpacity
                        style={styles.noaccountView}
                        activeOpacity={constants.activeOpacity} delayPressIn={0}
                        onPress={() => this.onPressRoute(commonText.signUpRoute)}
                     >
                        <Text style={styles.notAccount}>{commonText.nothaveAccount}</Text>
                        <Text style={styles.signUp}>{" " + commonText.signUp}</Text>
                     </TouchableOpacity>
                  </View>
               </View>
            </KeyboardAwareScrollView>
            <Loader loading={this.props.loading} />
         </View>
      );
   }

   /**route navigation handling */
   onPressRoute = (routeName) => {
      this.props.navigation.navigate(routeName)
   }

   /**render method for Title */
   renderTitle = (title, routeName) => (
      <TouchableOpacity
         onPress={() => this.props.navigation.navigate(routeName)}
         activeOpacity={constants.activeOpacity} delayPressIn={0}>
         <Text style={styles.bottomText}>{title}</Text>
      </TouchableOpacity>
   )

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
         this.props.loginRequest();
         const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: appleAuth.Operation.LOGIN,
            requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
         });
         if (appleAuthRequestResponse) {
            const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
            if (credentialState === appleAuth.State.AUTHORIZED) {
               if (appleAuthRequestResponse.user) {
                  this.appleLoginApicall(appleAuthRequestResponse)
               }
            }
            else if (credentialState === appleAuth.State.NOT_FOUND) {
               this.props.loginFailure();
            }
            else if (credentialState === appleAuth.State.REVOKED) {
               this.props.loginFailure();
            }
            else if (credentialState === appleAuth.State.TRANSFERRED) {
               this.props.loginFailure();
            }
            else {
               console.log("credentialState", credentialState)
            }
         }
      } catch (error) {
         this.props.loginFailure()
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
      LoginManager.logOut();
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
         throw 'Something went wrong obtaining access token';
      }
      console.log("data==>", data);
      const { accessToken } = data
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
   onPressGoogle = () => {
      GoogleSignin.signOut()
      this._signIn()
   }

   /**google login method */
   _signIn = async () => {
      try {
         await GoogleSignin.hasPlayServices();
         this.props.loginRequest();
         const userInfo = await GoogleSignin.signIn();
         console.log("UserInfo--->", userInfo);
         this.setState({ userInfo, error: null });
         this.props.loginFailure()
         if (userInfo) this.socialLoginCall(userInfo)
      } catch (error) {
         console.log("Error--->", error);
         this.props.loginFailure()
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
   socialLoginCall = (userInfo) => {
      let email = userInfo.user.email;
      let google_id = userInfo.user.id;
      let isSocialLogin = true;
      const params = {
         email, google_id,
      }
      this.props.login(params, isSocialLogin)
   }

   /**action for sign in and validation checking */
   onPressSignIn = () => {
      // this.props.navigation.navigate("App");
      Keyboard.dismiss()
      const checkValid = this.checkValidation();
      if (checkValid) {
         const params = {
            email: this.state.email.trim(),
            password: this.state.password.trim(),
         }
         this.props.login(params)
      }
   }

   /**validation checking for email and password */
   checkValidation = () => {
      const { email, password } = this.state;
      const checkEmail = isValidEmail(this.state.email)
      if (email.trim() === "") {
         showSimpleAlert(commonText.enterEmailMessage)
         return false;
      }
      else if (!checkEmail) {
         showSimpleAlert(commonText.enterValidEmail)
         return false;
      }
      else if (password.trim() == "") {
         showSimpleAlert(commonText.enterPasswordMessage);
         return false;
      }
      else if (password.trim().length < 6) {
         showSimpleAlert(commonText.pleaseEnter6DigitPassword)
         return false;
      }
      else {
         return true;
      }
   }
}

export default Login;

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
      height: constants.screenHeight / 3.5,
   },
   bottomView: {
      justifyContent: 'center',
      paddingBottom: getBottomMoreSpace(20),
   },
   bottomText: {
      fontSize: 15,
      color: colors.white,
      fontFamily: fonts.muliSemiBold
   },
   forgotPasswordText: {
      fontSize: 16,
      color: colors.mediumTextColor,
      fontFamily: fonts.muli
   },
   notAccount: {
      fontSize: 16,
      color: colors.white,
      fontFamily: fonts.muli
   },
   signUp: {
      fontSize: 18,
      color: colors.white,
      fontFamily: fonts.muliSemiBold
   },
   newWrap: {
      flex: 1, backgroundColor: colors.white,
      borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
      paddingBottom: 50,
      shadowColor: colors.black,
      shadowOpacity: 0.2,
      shadowRadius: 15,
      shadowOffset: {
         height: 5,
         width: 0
      }
   },
   forgotPasswordView: {
      alignItems: 'center', alignSelf: 'center',
      justifyContent: 'center', paddingVertical: 10
   },
   noaccountView: {
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center', flexDirection: 'row',
   },
   socialView: {
      flex: 1,
      justifyContent: 'center',
   },
})