import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputField, CustomButton } from '../../components';
import { commonText, constants } from '../../common';
import { showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';

let userDetails;

/**ProfileSetup:UserMarriageGoal selection Screen component */
class UserName extends Component {
   state = {
      userName: "",
   }
   /**componet life cycle method */
   async componentDidMount() {
      userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetails.name) {
         this.setState({ userName: userDetails.name }, () => {
         })
      }
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <KeyboardAwareScrollView
               keyboardShouldPersistTaps={'always'}
               contentContainerStyle={{ flexGrow: 1 }}
               bounces={false}
               showsVerticalScrollIndicator={false}>
               <View style={{ flex: 1 }} >
                  <InputField
                     value={this.state.userName}
                     InputRef={(ref) => this.emailRef = ref}
                     placeholder={commonText.nameText}
                     onChangeText={(userName) => this.setState({ userName })}
                     returnKeyType={constants.doneReturnKeyType}
                     onSubmitEditing={() => Keyboard.dismiss()}
                     autoCapitalize={'words'}
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
      Keyboard.dismiss();
      if (!this.state.userName.trim()) showSimpleAlert(commonText.enterNameMessage)
      else {
         const params = { name: this.state.userName.trim() }
         if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
         }
         else {
            this.props.saveProfileSetupData(params)
         }
      }
   }
}

export default UserName;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 20
   },
   buttonWrap: { flex: 1, justifyContent: 'flex-end', marginBottom: 10 }
})
