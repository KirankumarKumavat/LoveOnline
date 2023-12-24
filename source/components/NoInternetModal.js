import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { fonts, images, } from '../assets';
import { colors, commonText, constants, } from '../common';
import { isIphoneX } from '../utils/iPhoneXHelper';
import CustomButton from './CustomButton';
import RNModal from 'react-native-modal';

export default class NoInternetModal extends Component {
   /**component render method */
   render() {
      const { onRequestClose, modalVisible, headerTitle, onPressTryAgain, onPressExit } = this.props;
      if (modalVisible) {
         return (
            <Modal
               animationType='fade'
               transparent={true}
               visible={modalVisible}
               statusBarTranslucent
               onRequestClose={onRequestClose}
            >
               <TouchableHighlight
                  underlayColor={"transparent"}
                  onPress={onRequestClose}
                  style={styles.outerViewModalStyle}
               >
                  <TouchableOpacity activeOpacity={1} style={styles.modal} onPress={() => null}>
                     <Image
                        source={images.noInternetIcon}
                        resizeMode={'contain'}
                        style={{ alignSelf: "center", height: 50, width: 50 }}
                     />
                     <Text style={styles.title}>{commonText.noNetworkAlert}</Text>
                     <Text style={styles.title1}>{commonText.networkMessage}</Text>
                     <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 30 }}>
                        <CustomButton
                           title={"Try Again"}
                           onPress={onPressTryAgain}
                           mainStyle={{ width: 140, marginHorizontal: 0 }}
                        />
                        <CustomButton
                           title={"Exit"}
                           onPress={onPressExit}
                           mainStyle={{ width: 140, marginHorizontal: 0 }}
                        />
                     </View>
                  </TouchableOpacity>
               </TouchableHighlight>
            </Modal>)
      }
      else {
         return null;

      }
   }
}

/**component styling */
const styles = StyleSheet.create({
   outerViewModalStyle: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      justifyContent: 'center',
      paddingBottom: isIphoneX() ? 25 : 0
   },
   modal: {
      backgroundColor: colors.white,
      marginHorizontal: 20,
      borderRadius: 10,
      paddingVertical: 10,
      paddingTop: 30
   },
   title: {
      fontSize: 16,
      fontFamily: fonts.muliBold,
      color: colors.blueShade1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: "center",
      textAlign: "center"
   },
   cancel: {
      fontSize: 16,
      fontFamily: fonts.muliSemiBold,
      color: colors.grayShadeDark,
   },
   cancelView: {
      marginHorizontal: 20,
      alignSelf: 'center'
   },
   title1: {
      fontSize: 14,
      fontFamily: fonts.muliLight,
      color: colors.blueShade1,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignSelf: "center",
      textAlign: "center"
   }
})