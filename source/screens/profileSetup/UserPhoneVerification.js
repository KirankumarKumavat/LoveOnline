import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fonts } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { CustomButton, InputField, Timer } from '../../components';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { timerOptions } from '../verification/Verification';

/**ProfileSetup:UserMarriageGoal selection Screen component */
class UserPhoneVerification extends Component {
   state = {
      verificationCode: "",
      timer: false,
      timerStart: false,
      timerReset: false,
      totalDuration: 60000,
   }

   /**componet life cycle method */
   async componentDidMount() {
      this.setState({ timerStart: true, timerReset: false, timer: true });
      await this.props.getUserProfileData()
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.setState({ timerStart: false, timerReset: false, timer: false });
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <KeyboardAwareScrollView
               contentContainerStyle={{ flexGrow: 1 }}
               bounces={false}
               keyboardShouldPersistTaps={'always'}
               showsVerticalScrollIndicator={false}>
               <View style={{ flex: 1 }}>
                  <InputField
                     keyboardType={constants.numericKeyboardType}
                     value={this.state.verificationCode}
                     theme={0}
                     autoFocus={true}
                     maxLength={4}
                     placeholderTextColor={colors.grayShadeDark}
                     onChangeText={(verificationCode) => this.changeText(verificationCode)}
                     onSubmitEditing={() => Keyboard.dismiss()}
                     placeholder={'# # # #'}
                     containerStyle={{ marginVertical: 20 }}
                     style={styles.inputText}
                     secureTextEntry={true}
                     returnKeyType={constants.doneReturnKeyType}
                  />
                  {this.renderResendView()}
                  <View style={styles.buttonWrap}>
                     <CustomButton
                        title={commonText.submit}
                        onPress={this.onPress}
                     />
                  </View>
               </View>
            </KeyboardAwareScrollView>
         </View>
      );
   }

   /**render method for timer and resend button */
   renderResendView = () => {
      const {
         timer,
         timerStart,
         timerReset,
         totalDuration,
      } = this.state;
      return (
         <View style={{ marginVertical: 20 }}>
            {
               timer ?
                  <View style={{ alignSelf: 'center' }}>
                     <Timer
                        msec
                        options={timerOptions}
                        start={timerStart}
                        reset={timerReset}
                        totalDuration={totalDuration}
                        style={styles.bottomTextStyle}
                        handleFinish={() => this.setState({ timer: false })}
                     />
                  </View>
                  :
                  <TouchableOpacity activeOpacity={0.5} delayPressIn={0} onPress={this.resendPress}>
                     <Text style={styles.resend}>{commonText.resend}</Text>
                  </TouchableOpacity>
            }
         </View>
      )
   }

   /**chnage text handle */
   changeText = (text) => {
      if (text.trim().length === 4) Keyboard.dismiss();
      this.setState({ verificationCode: text })
   }

   /**action handling for submit button click */
   onPress = () => {
      Keyboard.dismiss();
      if (!this.state.verificationCode) showSimpleAlert(commonText.enterVerificationCodeMessage)
      else {
         if (this.state.verificationCode.length < 4) {
            showSimpleAlert(commonText.enterValidOtpMessage)
         }
         else {
            const params = {
               mobile_number: this.props.userProfileSetupDetails.mobile_number,
               country_code: this.props.userProfileSetupDetails.country_code,
               otp: this.state.verificationCode.trim(),
            }
            this.props.verifyOTPOfPhone(params)
         }
      }
   }

   /**action for resend button click */
   resendPress = async () => {
      const params = {
         mobile_number: this.props.userProfileSetupDetails.mobile_number,
         country_code: this.props.userProfileSetupDetails.country_code,
      }
      await this.props.sendOtpToPhone(params)
   }
}

export default UserPhoneVerification;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 20
   },
   resend: {
      color: colors.blueShade1,
      fontFamily: fonts.muli,
      fontSize: 16,
      textAlign: 'center'
   },
   inputText: {
      textAlign: 'center',
      color: colors.black, fontSize: 22
   },
   buttonWrap: {
      flex: 1,
      justifyContent: 'flex-end', marginBottom: 10
   }
})
