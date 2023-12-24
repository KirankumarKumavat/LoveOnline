import React from 'react';
import { StyleSheet, TouchableOpacity, } from 'react-native';
import { icons } from '../assets';
import { colors, constants } from '../common';
import SvgIcon from './SvgIcon';

/**
 * 
 * @param {*} param0 
 * button used to perform some special actions
 */
const ActionButton = ({
   onPressActionButton,
   isCross,
   isMessage,
   mainStyle,
}) => {
   return (
      <TouchableOpacity delayPressIn={0}
         activeOpacity={constants.activeOpacity}
         onPress={onPressActionButton}
         style={[styles.container, mainStyle]}
      >
         {isCross ? <SvgIcon
            name={icons.grayCloseIcon}
            height={25} width={25}
         /> : null}
         {isMessage ? <SvgIcon
            name={icons.messageIcon}
            color={colors.blueShade1}
            height={45} width={45}
         /> : null}
      </TouchableOpacity>
   );
}

export default ActionButton;

/**component styling */
const styles = StyleSheet.create({
   container: {
      position: 'absolute',
      bottom: 70,
      left: 15,
      height: 52,
      width: 52,
      backgroundColor: colors.white,
      shadowColor: colors.grayShade1,
      shadowOpacity: 1,
      elevation: 4,
      shadowRadius: 6,
      shadowOffset: {
         height: 4,
         width: 0,
      },
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      paddingTop: 5
   }
})