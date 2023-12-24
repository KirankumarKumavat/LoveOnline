import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgIcon } from '.';
import { fonts, icons } from '../assets';
import { colors } from '../common';

/**
 * 
 * @param {*} param0 
 * Custom Box component
 */
const QueAnsBox = ({
   isLikeButton,
   title,
   description,
   onPressLike,
   theme = 0,
   titleStyle,
   descStyle
}) => {

   /**component render method */
   return (
      <View style={styles.container}>
         <Text style={[styles.title, titleStyle]}>{title || ""}</Text>
         <Text style={[styles.description, descStyle]}>{description || ""}</Text>
         {isLikeButton && <TouchableOpacity
            onPress={onPressLike}
            delayPressIn={0}
            style={styles.likeButtonView}>
            <SvgIcon name={icons.emptyHearticon} height={21 + 15} width={25 + 15} />
         </TouchableOpacity>}
      </View>
   );
}

export default QueAnsBox;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginHorizontal: 20,
      marginTop: 20,
      paddingHorizontal: 15,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder2,
      borderRadius: 10,
      shadowColor: colors.grayShade1,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 3,
      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff'
   },
   title: {
      fontSize: 16,
      fontFamily: fonts.muliBold,
      color: colors.black
   },
   description: {
      fontSize: 26,
      fontFamily: fonts.muliBold,
      color: colors.black,
      paddingVertical: 10,
      lineHeight: 26
   },
   likeButtonView: {
      alignSelf: 'flex-end'
   }
})