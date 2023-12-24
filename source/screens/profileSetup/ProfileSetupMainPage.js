import React, { Component } from 'react';
import { View, StyleSheet, Image, ScrollView, StatusBar } from 'react-native';

import { Header, CustomButton, TitleHeader } from '../../components';
import { colors, commonText } from '../../common';
import { fonts, images } from '../../assets';
import UserUtils from '../../utils/UserUtils';
import RoutingUtils from '../../utils/RoutingUtils';

/**Profile Setp main page from where profile setup start */
class ProfileSetupMainPage extends Component {

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
            <Header
               theme={0}
               middleText={commonText.profileSetUp} />
            <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flex: 1, justifyContent: 'space-between' }}>
               <View style={styles.mainStyle}>
                  <View>
                     <TitleHeader numberOfLinesForTitle={3} title={commonText.profileSetupMainPageText} mainStyle={{ paddingHorizontal: 10, }} />
                     <Image resizeMode='contain' style={styles.genderImageStyle} source={images.profileSetup} />
                  </View>
               </View>
            </ScrollView>
            <CustomButton
               title={commonText.continue}
               onPress={() => this.onPressContinue()}
               mainStyle={styles.continueButton}
            />
         </View>
      );
   }

   /**handle click event for Continue button press */
   onPressContinue = async () => {
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      await RoutingUtils.setupuserProfileSetupNavigation(userDetails);
   }
}

export default ProfileSetupMainPage;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white
   },
   mainStyle: {
      marginHorizontal: 30,
      marginTop: 45,
      flex: 1
   },
   headingText: {
      fontSize: 32,
      textAlign: 'center',
      fontFamily: fonts.muliBold,
      color: colors.black
   },
   genderImageStyle: {
      alignSelf: 'center',
      marginTop: 30
   },
   genderText: {
      fontSize: 32,
      color: colors.black,
      fontFamily: fonts.sukhumvitSetBold,
      textAlign: 'center',
      marginTop: 35
   },
   InputButtonStyle: {

      marginTop: 5,
      justifyContent: 'center'

   },
   continueButton: {
      marginHorizontal: 30,
      marginTop: 40,
      marginVertical: 20

   },
   email: {
      color: colors.grayShadeDark,
      fontSize: 16,
      fontFamily: fonts.muli,
      textAlign: 'center'
   },
   resend: {
      marginTop: 20,
      color: colors.blueShade1,
      fontFamily: fonts.muli,
      fontSize: 16,
      textAlign: 'center'
   }
})