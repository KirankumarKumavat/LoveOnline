import React from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { colors, constants } from '../common';
import SvgIcon from './SvgIcon';

/**input theme */
export const inputTheme = {
   light: 0,
   black: 1
}

/**
 * 
 * @param {*} param0 
 * @param {*} props 
 * Custom input component 
 */
const InputField = ({
   style,
   value,
   InputRef,
   editable,
   multiline,
   keyboardType,
   returnKeyType,
   containerStyle,
   onSubmitEditing,
   theme = 0,
   rightIcon,
   onPressRightIcon,
   rightIconHeight,
   rightIconWidth,
   placeholder,
   rightIconColor,
   placeholderTextColor,
   onChangeText,
   secureTextEntry,
   textAlignVertical,
   blurOnSubmit,
   autoCapitalize,
   selectionColor,
   maxLength,
   autoFocus,
   inputAccessoryViewID,
   valueCode,
   rightIconStyle,
   leftCountryCode, onChangeTextCode, placeholderForCode, countryCodeEditable
}, props) => {
   let bgColor = theme === inputTheme.black ? 'rgba(255,255,255,0.1)' : colors.offWhite;
   let borderColor = theme === inputTheme.black ? 'rgba(255, 255, 255, 0.45)' : colors.textInputBorder;
   let textColor = theme === inputTheme.black ? colors.white : colors.black;
   let placeholderTextColor1 = placeholderTextColor ? placeholderTextColor : theme === inputTheme.black ? colors.white : colors.grayShadeDark
   return (
      <View style={[styles.container, containerStyle, { backgroundColor: bgColor, borderColor: borderColor }]}>

         {leftCountryCode ?
            <View style={styles.leftView}
               pointerEvents={countryCodeEditable ? 'auto' : 'none'}
            >
               <TextInput
                  maxLength={3}
                  editable={countryCodeEditable || true}
                  value={valueCode}
                  returnKeyType={'done'}
                  keyboardType={'numeric'}
                  onChangeText={onChangeTextCode}
                  placeholder={placeholderForCode}
                  placeholderTextColor={placeholderTextColor1}
                  style={[{ fontSize: 16, padding: 0 }]}
               />
            </View> : null
         }

         <TextInput
            {...props}
            placeholder={placeholder}
            value={value}
            blurOnSubmit={blurOnSubmit}
            multiline={multiline}
            autoFocus={autoFocus}
            selectionColor={selectionColor ? selectionColor : colors.selectionColor}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType || 'next'}
            keyboardType={keyboardType || 'default'}
            underlineColorAndroid={colors.transparent}
            editable={editable}
            placeholderTextColor={placeholderTextColor1}
            ref={InputRef}
            inputAccessoryViewID={inputAccessoryViewID}
            style={[styles.textStyle, style, { color: textColor }]}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            textAlignVertical={textAlignVertical}
            maxLength={maxLength || 500}
            autoCapitalize={autoCapitalize || "none"}
         />
         {rightIcon ?
            <TouchableOpacity activeOpacity={onPressRightIcon ? constants.activeOpacity : 1} onPress={onPressRightIcon} style={rightIconStyle}>
               <SvgIcon
                  name={rightIcon}
                  height={rightIconHeight}
                  width={rightIconWidth}
                  color={rightIconColor}
               />
            </TouchableOpacity>
            : null
         }
      </View>
   );
}

export default InputField;

/**component styling */
const styles = StyleSheet.create({
   container: {
      height: 48,
      flexDirection: 'row',
      marginHorizontal: 35,
      borderWidth: 1,
      borderRadius: 15,
      paddingHorizontal: 15,
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 20,
      shadowColor: colors.shadowColor,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: {
         height: 5,
         width: 0,
      },
   },
   textStyle: {
      flex: 1,
      fontSize: 16,
      paddingRight: 10,
      color: colors.white,
   },
   leftView: {
      marginEnd: 15,
      paddingRight: 15,
      marginVertical: 8,
      flexDirection: "row",
      alignItems: 'center',
      borderRightWidth: 0.7,
      borderRightColor: 'gray',
   },
})