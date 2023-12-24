import React from 'react';
import {
   Text, View, Modal, TouchableOpacity, StyleSheet,
   TouchableWithoutFeedback, Dimensions
} from 'react-native';

import { fonts } from '../assets';
import { constants, colors, } from '../common';
import { moderateScale, } from '../utils/scale';
import CustomButton from './CustomButton';
let { width, height } = Dimensions.get('screen');
import RNModal from 'react-native-modal';

/**
 * 
 * Common customize alert box 
 */
const CustomAlertBox = (
   {
      visible,
      onRequestClose,
      animationType,
      title,
      message,
      cancelText,
      okayText,
      onPressLeftView,
      onPressRightView,
      theme,
      themeSecond
   }) => {

   /**component render method */
   return (
      // <Modal
      //    transparent
      //    visible={visible}
      //    onRequestClose={onRequestClose}
      //    animationType={animationType || 'fade'}
      //    supportedOrientations={['landscape', 'landscape-left', 'landscape-right', 'portrait']}
      // >
      <RNModal
         testID={'modal'}
         isVisible={visible}
         animationIn="pulse"
         animationOut="pulse"
         animationInTiming={800}
         animationOutTiming={800}
         backdropTransitionInTiming={600}
         backdropTransitionOutTiming={600}
         backdropOpacity={1}
         backdropColor={colors.transparent}
         statusBarTranslucent
         supportedOrientations={['portrait']}
         style={{ padding: 0, margin: 0 }}
      >
         <TouchableOpacity
            activeOpacity={1}
            style={styles.container}
            onPress={() => onRequestClose()}
         >
            <TouchableWithoutFeedback>
               <View style={styles.main}>
                  <View style={[styles.titleView, { alignItems: /*Platform.OS == 'android' ? 'flex-start' : */'center' }]}>
                     <Text style={styles.appName}>{title || constants.AppName}</Text>
                     <Text style={styles.message}>{message}</Text>
                  </View>
                  <View style={styles.btnWrap}>

                     <CustomButton
                        isSmall
                        selectionButtonTheme={1}
                        theme={theme}
                        title={okayText}
                        onPress={() => onPressLeftView()}
                        mainStyle={styles.maleText}
                     />
                     <CustomButton
                        isSmall
                        selectionButtonTheme={1}
                        theme={themeSecond}
                        title={cancelText}
                        onPress={() => onPressRightView()}
                        mainStyle={styles.maleText}
                     />
                  </View>
               </View>
            </TouchableWithoutFeedback>
         </TouchableOpacity>
      </RNModal>
      // </Modal>
   )
}

export default CustomAlertBox;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
      justifyContent: 'center',
   },
   main: {
      backgroundColor: colors.white,
      marginHorizontal: width > height ? moderateScale(100) : moderateScale(20),
      borderRadius: moderateScale(20)
   },
   titleView: {
      alignItems: 'center',
      paddingVertical: moderateScale(20),
      paddingHorizontal: moderateScale(20)
   },
   appName: {
      color: colors.black,
      fontSize: moderateScale(18),
      fontFamily: fonts.muliBold,
   },
   message: {
      color: colors.black,
      fontSize: moderateScale(16),
      fontFamily: fonts.muli,
   },
   btnWrap: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: moderateScale(20),
      alignSelf: 'center',
      marginTop: 10
   },
   btnView: {
      flex: 1,
      alignItems: "center",
      paddingVertical: moderateScale(10)
   },
   btnText: {
      color: colors.black,
      fontSize: moderateScale(14),
      fontFamily: fonts.latoMedium,
      textTransform: 'uppercase',
   },
   maleText: {
      width: constants.screenWidth / 2 - 60,
      marginHorizontal: 10,
      shadowColor: colors.transparent,
      elevation: 0,
      borderWidth: 1,
      borderColor: colors.grayShadeDark
   },
})