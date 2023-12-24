import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, BackHandler, Image } from 'react-native';
import { colors, commonText, } from '../../common';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header, TitleDescription, Pivot, TitleHeader, SvgIcon, Loader } from '../../components';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import UserUtils from '../../utils/UserUtils';
import NavigationService from '../../utils/NavigationService';
import { NavigationEvents } from '@react-navigation/compat';

/**profile setup steps unique ids */
export const ProfileStepsID = {
   userName: "userName",
   userProffestion: "userProffestion",
   userHeight: "userHeight",
   userMaritalStatus: "userMaritalStatus",
   userChildren: "userChildren",
   userCountry: "userCountry",
   userPhone: "userPhone",
   userPhoneVerification: "userPhoneVerification",
   userCity: "userCity",
   userEthnicity: "userEthnicity",
   userCaste: "userCaste",
   userPray: "userPray",
   userMarriagegoal: "userMarriagegoal",
   userEducation: "userEducation",
   userProfileQuestion: "userProfileQuestion",
}

/**Profile Setup steps component which handle all profile stpes management */
class ProfileSetupSteps extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   /**componet life cycle method */
   componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
      // this.subscribeFocus = navigation.addListener('focus', async () => await this.onScreenFocus());
      // this.subscribeBlur = this.props.navigation.addListener('blur', this.onScreenBlur);

   }

   /**handle for screen blur */
   onScreenBlur = () => {
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
   }

   /**handle for screen focus */
   onScreenFocus = async () => {

   }

   /**componet life cycle method */
   componentWillUnmount() {
      // this.subscribeBlur();
      // this.subscribeFocus();
      // this.props.resetData()
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
   }

   /**action when back button click */
   androidBackPress = async () => {
      let profileSetupStep = this.props.profileSetupStep || [];
      let activeStepData = profileSetupStep[this.props.activeProfileSetupStepIndex];
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let index;
      console.log("activeStepData-->", activeStepData);
      console.log("userDetails-->", userDetails);
      if (activeStepData.id === ProfileStepsID.userCountry && userDetails.marital_status == "Single") {
         console.log("condition is right");
         if (this.props.route.params && this.props.route.params.isFromSettingsStack) {
            NavigationService.goBack()
         }
         else {
            index = 2;
            this.props.onBackPress(index)
         }
      }
      else if (this.props.activeProfileSetupStepIndex == 0) {
         this.props.navigation.goBack()
      }
      else {
         if (this.props.route.params && this.props.route.params.isFromSettingsStack) {
            NavigationService.goBack()
         }
         else {
            index = 1;
            this.props.onBackPress(index)
         }
      }
      return true
   }

   /**componet render method */
   render() {
      let profileSetupStep = this.props.profileSetupStep || [];
      let activeStepData = profileSetupStep[this.props.activeProfileSetupStepIndex];
      let showBack = true;
      if (this.props.route.params && this.props.route.params.isFromSettingsStack == false) {
         if (this.props.activeProfileSetupStepIndex === 0) showBack = false;
      }
      else {
         showBack = true
      }
      return (
         <SafeAreaView style={styles.container} edges={['bottom']}>
            <NavigationEvents onDidFocus={this.onScreenFocus} onDidBlur={this.onScreenBlur} />
            {/* <SafeAreaView style={styles.container} edges={['bottom']}> */}
            <View style={styles.container}>
               <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
               <Header onBackButtonPress={this.androidBackPress} middleText={this.props.route.params && this.props.route.params.isFromSettingsStack ? commonText.editProfile : commonText.profileSetUp} backButton={showBack} />
               <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false}>
                  <View style={{ flex: 1 }}>
                     {
                        activeStepData && activeStepData.stepDescription ?
                           <View style={styles.topView}>
                              <TitleDescription description={activeStepData.stepDescription} />
                           </View>
                           : null
                     }
                     {this.renderStepIndicator()}
                     {
                        activeStepData && activeStepData.stepTitle ?
                           <TitleHeader title={activeStepData.stepTitle} numberOfLinesForTitle={3} mainStyle={{ padding: 15 }} />
                           : null
                     }
                     {activeStepData.setpBody ?
                        React.cloneElement(activeStepData.setpBody, { navigation: this.props.navigation, isFromSettingsStack: this.props.route.params && this.props.route.params.isFromSettingsStack })
                        : null
                     }
                     <View style={{ height: 20 }} />
                  </View>
               </KeyboardAwareScrollView>
            </View>
            <Loader loading={this.props.loading} />
         </SafeAreaView>
      );
   }

   /**render method for display step indicator at top */
   renderStepIndicator = () => {
      let profileSetupStep = this.props.profileSetupStep || [];
      let activeStepData = profileSetupStep[this.props.activeProfileSetupStepIndex];
      const frontDots = [];
      let backDots = [{ id: 0 }, { id: 1 }, { id: 2 }];
      if (this.props.activeProfileSetupStepIndex == 1) frontDots.push({ id: 0 })
      else if (this.props.activeProfileSetupStepIndex == 2) frontDots.push({ id: 0 }, { id: 1 })
      else if (this.props.activeProfileSetupStepIndex >= 2) frontDots.push({ id: 0 }, { id: 1 }, { id: 2 })
      if (this.props.activeProfileSetupStepIndex == profileSetupStep.length - 1) backDots = [];
      else if ((this.props.activeProfileSetupStepIndex == profileSetupStep.length - 2) && !(this.props.route.params && this.props.route.params.isFromSettingsStack)) { backDots.pop(); backDots.pop(); }
      else if (this.props.activeProfileSetupStepIndex == profileSetupStep.length - 3) { backDots.pop(); }
      const isFromSettingsStack = this.props.route && this.props.route.params && this.props.route.params.isFromSettingsStack
      return (
         <View style={styles.pivotContainer}>
            {
               isFromSettingsStack ?
                  <View style={styles.dotmainView}>
                     {[{ id: 0 }, { id: 1 }, { id: 2 }].map((i, j) => (<View key={j} style={styles.leftDots} />))}
                  </View>
                  :
                  <View style={styles.dotmainView}>
                     {frontDots.map((i, j) => (<View key={j} style={styles.leftDots} />))}
                  </View>
            }
            {
               <View style={styles.wrap1}>
                  {/* <View style={styles.stepIcon}>
                  </View> */}
                  {/* {activeStepData && activeStepData.stepIcon ? <SvgIcon name={activeStepData.stepIcon}
                     height={activeStepData.id == ProfileStepsID.userCountry ? 35 : 50} width={activeStepData.id == ProfileStepsID.userCountry ? 35 : 50}
                  /> : null} */}
                  {activeStepData && activeStepData.stepIcon
                     ?
                     <Image
                        source={activeStepData.stepIcon}
                        resizeMode={'contain'}
                     />
                     : null}
               </View>
            }
            {  isFromSettingsStack ?
               <View style={[styles.dotmainView, { justifyContent: 'flex-start', }]}>
                  {[{ id: 0 }, { id: 1 }, { id: 2 }].map((i, j) => (<View key={j} style={styles.leftDots} />))}
               </View>
               : <View style={[styles.dotmainView, { justifyContent: 'flex-start' }]}>
                  {backDots.map((i, j) => (<View key={j} style={[styles.leftDots, { backgroundColor: colors.lightDotColor }]} />))}
               </View>}
         </View>
      )
   }

   /**action when back button click */
   backPressButton = () => {
      this.props.onBackPress()
   }

}

export default ProfileSetupSteps;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
   pivotContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: 70,
   },
   topView: {
      height: 80,
      alignItems: 'center', justifyContent: 'center'
   },
   leftDots: {
      height: 5, width: 5,
      marginHorizontal: 2,
      borderRadius: 20,
      backgroundColor: colors.blueShade1
   },
   dotmainView: {
      flexDirection: 'row',
      height: 20, width: 40,
      alignItems: 'center', justifyContent: 'flex-end'
   },
   wrap1: {
      height: 55, width: 55,
      alignItems: 'center', justifyContent: 'center',
   },
   stepIcon: {
      backgroundColor: colors.grayShade1,
      opacity: 0.5, position: 'absolute',
      height: 35, width: 35, borderRadius: 17.5,
      alignItems: 'center', justifyContent: 'center'
   }
})
