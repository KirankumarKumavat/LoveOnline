import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { commonText, colors, constants } from '../common';
import { icons } from '../assets';
import SvgIcon from './SvgIcon';
import { moderateScale } from '../utils/scale';

/**
 * 
 * @param {*} param0 
 * Component to show social login buttons like google,FB,apple
 */
const SocialLogin = ({
   onPressSocial,
   mainContainer,
}) => {
   /**component render method */
   return (
      <View style={[styles.container, mainContainer]}>
         <View style={[styles.logoView, Platform.OS === "android" ? { paddingHorizontal: moderateScale(60) } : { paddingHorizontal: moderateScale(40) }]}>
            <TouchableOpacity delayPressIn={0}
               onPress={() => onPressSocial(commonText.facebookKey)}
               activeOpacity={constants.activeOpacity}>
               <SvgIcon name={icons.facebookIconNew} height={100} width={100} />
            </TouchableOpacity>
            <TouchableOpacity delayPressIn={0}
               onPress={() => onPressSocial(commonText.googleKey)}
               activeOpacity={constants.activeOpacity}>
               <SvgIcon name={icons.googleIconNew}
                  height={100} width={100}
               />
            </TouchableOpacity>
            {
               Platform.OS === "ios" &&
               <TouchableOpacity delayPressIn={0}
                  onPress={() => onPressSocial(commonText.appleKey)}
                  activeOpacity={constants.activeOpacity}>
                  <SvgIcon name={icons.appleIconNew} height={100} width={100} color={colors.black} />
               </TouchableOpacity>
            }
         </View>
      </View>
   );
}

export default SocialLogin;

/**component styling */
const styles = StyleSheet.create({
   container: {
   },
   topView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 35
   },
   line: {
      height: 1,
      flex: 1,
      backgroundColor: colors.grayShade2,
      opacity: 0.5
   },
   middleText: {
      fontSize: 14,
      color: colors.white,
      paddingHorizontal: 10,
   },
   logoView: {
      alignItems: 'center',
      flexDirection: 'row',
      paddingHorizontal: 30,
      justifyContent: 'space-evenly',
   },
   iconView: {
      height: 45,
      width: 45,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: colors.whiteShade2,
   }
})
