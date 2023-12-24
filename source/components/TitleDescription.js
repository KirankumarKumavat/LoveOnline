import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { fonts } from '../assets';
import { colors } from '../common';

/**
 * 
 * @param {*} param0 
 * Custom Component to show some description text
 */
const TitleDescription = ({
   description,
   textStyle,
   mainStyle,
}) => (
   <View style={[styles.container, mainStyle]}>
      <Text style={[styles.textStyle, textStyle]}>{description}</Text>
   </View>
);

export default TitleDescription;

/**component styling */
const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      marginHorizontal: 15
   },
   textStyle: {
      fontSize: 15,
      color: colors.textColor,
      textAlign: 'center',
      fontFamily: fonts.muli
   }
})