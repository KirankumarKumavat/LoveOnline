import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, StatusBar } from 'react-native';
import { colors, commonText } from '../../common';
import { Header, CustomButton, Loader } from '../../components';
import { fonts, images } from '../../assets';
import CustomDatePicker from '../../components/CustomDatePicker';
import { showSimpleAlert, calculate_age, formatDate } from '../../utils/HelperFunction';
import NavigationService from '../../utils/NavigationService';
const moment = require('moment');

/**SignUpDateOfBirth Screen Component */
class SignUpDateOfBirth extends Component {

   /**date of birth */
   birthDate = this.props.route.params.selectedDate ? new Date(this.props.route.params.selectedDate) : new Date(new Date().setFullYear(new Date().getFullYear() - 18));
   // birthDate = new Date();

   /**componet life cycle method */
   componentDidMount() {
      if (this.props.route.params.selectedDate) {
         this.birthDate = new Date(this.props.route.params.selectedDate)
      }
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
            <Header backButton middleText={this.props.route.params && this.props.route.params.isFromSettingsStack ? commonText.editProfile : commonText.signUp} />
            <ScrollView bounces={false} contentContainerStyle={{ flex: 1 }} showsVerticalScrollIndicator={false}>
               <View style={{ flex: 1 }}>
                  <Text style={styles.headingText}>{commonText.signupDOBMessage}</Text>
                  <Image source={images.bigCake} style={styles.cakeIcon} resizeMode={'cover'} />
                  <Text style={styles.genderText}>{commonText.whenoubornTitle}</Text>
                  <CustomDatePicker
                     pickerMode={'date'}
                     onDateChange={this.onDateChange}
                     selectedDate={this.birthDate ? this.birthDate : new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
                  // selectedDate={this.props.route.params.selectedDate ? new Date(this.props.route.params.selectedDate) : new Date()}
                  />
                  <View style={styles.lastView}>
                     <CustomButton
                        title={commonText.continue}
                        onPress={this.onPressContinue}
                     />
                  </View>
               </View>
            </ScrollView>
            <Loader loading={this.props.loading} />
            {/* <Loader loading={this.props.editProfileLoading} /> */}
         </View>
      );
   }

   /**handling date change */
   onDateChange = (date) => {
      // let newDate = moment(date).format("YYYY-MM-DD");
      // let newDate = formatDate(date);
      this.birthDate = date;
   }

   /**action handle for continue button click */
   onPressContinue = () => {
      console.log("birthdate-->", this.birthDate);
      const { gender, email, google_id, isSocialLogin, facebook_id, apple_id } = this.props.route.params;
      if (this.birthDate) {
         const age = calculate_age(this.birthDate)
         if (age < 18) { showSimpleAlert(commonText.selectDOBMessage); return false; }
         else {
            // let userBirthDate = this.birthDate;
            let userBirthDate = formatDate(this.birthDate);
            if (isSocialLogin) {
               const params = {
                  date_of_birth: userBirthDate,
                  gender,
               }
               if (facebook_id) params.facebook_id = facebook_id;
               else if (google_id) params.google_id = google_id;
               else if (apple_id) params.apple_id = apple_id;
               if (email) params.email = email
               this.props.signUp(params)
            }
            else if (this.props.route.params && this.props.route.params.isFromSettingsStack) {
               const params = {
                  date_of_birth: userBirthDate
               }
               this.props.saveProfileSetupData(params)
            }
            else {
               NavigationService.resetAction(commonText.verificationRoute, {
                  date_of_birth: userBirthDate, gender, email
               })
            }
         }
      }
   }
}

export default SignUpDateOfBirth;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white
   },
   headingText: {
      fontSize: 14,
      textAlign: 'center',
      fontFamily: fonts.muli,
      color: colors.textColor,
      paddingHorizontal: 30,
      paddingVertical: 20,
   },
   cakeIcon: {
      alignSelf: 'center',
   },
   genderText: {
      fontSize: 28,
      color: colors.black,
      fontFamily: fonts.sukhumvitSetBold,
      textAlign: 'center',
      paddingVertical: 20
   },
   lastView: {
      flex: 1,
      justifyContent: 'center',
   }
})
