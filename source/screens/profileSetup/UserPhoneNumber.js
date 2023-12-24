import React, { Component } from 'react';
import { View, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { commonText, constants } from '../../common';
import { CustomButton, InputField } from '../../components';
import { showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';

/**ProfileSetup:UserMarriageGoal selection Screen component */
class UserPhoneNumber extends Component {
   state = {
      countryCode: "",
      phoneNumber: "",
   }

   /**componet life cycle method */
   async componentDidMount() {
      await this.props.getUserProfileData();
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetails.country_code && userDetails.mobile_number) {
         this.setState({ country_code: userDetails.country_code, phoneNumber: userDetails.mobile_number }, () => {
         })
      }
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
                     leftCountryCode
                     keyboardType={constants.numericKeyboardType}
                     valueCode={this.props.userProfileSetupDetails && this.props.userProfileSetupDetails.country_code ? '+' + this.props.userProfileSetupDetails.country_code : ""}
                     countryCodeEditable={false}
                     placeholder={commonText.phoneNumberplaceHolder}
                     placeholderForCode={'+1'}
                     onChangeTextCode={(countryCode) => this.setState({ countryCode })}
                     value={this.state.phoneNumber}
                     onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
                     returnKeyType={constants.doneReturnKeyType}
                     onSubmitEditing={() => Keyboard.dismiss()}
                  />
                  <View style={styles.buttonWrap}>
                     <CustomButton
                        title={commonText.continue}
                        onPress={this.onPress}
                     />
                  </View>
               </View>
            </KeyboardAwareScrollView>
         </View>
      );
   }

   /**action handling for continue button click */
   onPress = () => {
      Keyboard.dismiss()
      if (this.state.phoneNumber.trim() == "") {
         showSimpleAlert(commonText.pleaseEnterPhone)
      }
      else {
         const params = {
            mobile_number: this.state.phoneNumber,
            country_code: this.props.userProfileSetupDetails.country_code
         }
         this.props.sendOtpToPhone(params)
      }
   }
}

export default UserPhoneNumber;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 20
   },
   buttonWrap: {
      flex: 1,
      justifyContent: 'flex-end', marginBottom: 10
   }
})
