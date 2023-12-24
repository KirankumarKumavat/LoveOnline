import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../common';
import { fonts } from '../assets';

/**
 * 
 * @param {*} param0 
 * Custom Component to show some header bold text
 */
const TitleHeader = ({
    title,
    mainStyle,
    textStyle,
    numberOfLinesForTitle,
}) => (
    <View style={[styles.container, mainStyle]}>
        <Text numberOfLines={numberOfLinesForTitle || 1} style={[styles.titleText, textStyle]}>{title}</Text>
    </View>
);

export default TitleHeader;

/**component styling */
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    titleText: {
        fontSize: 30,
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        lineHeight: 38,
    }
})