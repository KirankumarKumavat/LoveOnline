import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, constants } from '../common';
import { fonts } from '../assets';

/**button theme */
export const buttonTheme = {
   light: 0,
   dark: 1,
   isButton: 2,
}

/**
 * 
 * @param {*} param0 
 * Custom button which used commonly in app
 */
const CustomButton = ({
   optionalTheme,
   onPress,
   title,
   theme = 1,
   isSmall = false,
   selectionButtonTheme,
   mainStyle,
   titleStyle,
   textLine
}) => {
   let bgColor = getBackgroundColor(theme, selectionButtonTheme, 0)
   let titleColor = getBackgroundColor(theme, selectionButtonTheme, 1)
   console.log("titleColor--->", titleColor);
   return (
      <TouchableOpacity activeOpacity={constants.activeOpacity} delayPressIn={0} style={[styles.container, mainStyle, { backgroundColor: bgColor }, isSmall ? {
      } : {}]} onPress={onPress}>
         <Text style={[styles.title, { color: titleColor }, isSmall ? { fontSize: 15, paddingHorizontal: 8 } : {}]} numberOfLines={textLine || 2}>{title}</Text>
      </TouchableOpacity>
   );
}

/**
 * 
 * @param {*} theme 
 * @param {*} selectionButtonTheme 
 * @param {*} bgOrTitle 
 * @returns backgroundcolor for component
 */
const getBackgroundColor = (theme, selectionButtonTheme, bgOrTitle) => {

   if (selectionButtonTheme) {
      if (bgOrTitle == 0) {
         if (theme === buttonTheme.dark) {
            return colors.blueShade1
         }
         else {
            return colors.transparentWhite
         }
      }
      else {
         if (theme === buttonTheme.dark) {
            return colors.white
         }
         else {
            return colors.textColor
         }
      }
   }
   else {
      if (bgOrTitle == 0) {
         if (theme === buttonTheme.dark) {
            return colors.blueShade1
         }
         else {
            return colors.white
         }
      }
      else {
         if (theme === buttonTheme.dark) {
            return colors.white
         }
         else {
            return colors.blueShade1
         }
      }
   }

}
export default CustomButton;

/**component styling */
const styles = StyleSheet.create({
   container: {
      height: 50,
      backgroundColor: colors.blue,
      marginHorizontal: 35,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',

      // IOS
      shadowColor: colors.grayShade1,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 5,

      // Android
      elevation: 5,
   },
   title: {
      fontSize: 20,
      color: colors.white,
      textAlign: 'center',
      fontFamily: fonts.muliBold,
   }
})

colors.blueShade1 ? colors.white : colors.textColor