import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { fonts, } from '../assets';
import { colors, commonText, constants, } from '../common';
import { isIphoneX } from '../utils/iPhoneXHelper';
import CustomButton from './CustomButton';
import RNModal from 'react-native-modal';

/**
 * Compoent to report any user
 */
class ReportUserModal extends Component {

   /**component render method */
   render() {
      const { onRequestClose, modalVisible, headerTitle, onPressReport, buttonTitle } = this.props;
      if (modalVisible) {
         return (
            <View style={{ position: "absolute", flex: 1, height: constants.screenHeight, width: constants.screenHeight }}>
               {/* <Modal
               animationType='fade'
               transparent={true}
               visible={modalVisible}
               statusBarTranslucent
               onRequestClose={onRequestClose}
            > */}
               <RNModal
                  testID={'modal'}
                  isVisible={modalVisible}
                  animationIn="zoomInUp"
                  animationOut="zoomOut"
                  animationInTiming={1000}
                  statusBarTranslucent
                  animationOutTiming={500}
                  backdropTransitionInTiming={600}
                  backdropTransitionOutTiming={600}
                  backdropOpacity={1}
                  backdropColor={colors.transparent}
                  supportedOrientations={['portrait']}
                  style={{ padding: 0, margin: 0 }}
               >
                  <TouchableHighlight
                     underlayColor={"transparent"}
                     onPress={onRequestClose}
                     style={styles.outerViewModalStyle}
                  >
                     <TouchableOpacity activeOpacity={1} style={styles.modal} onPress={() => null}>
                        <Text style={styles.title}>{headerTitle}</Text>
                        <View>
                           <FlatList
                              data={this.props.data}
                              bounces={false}
                              showsVerticalScrollIndicator={false}
                              renderItem={this.props.renderItem}
                              keyExtractor={(i, j) => j.toString()}
                           />
                        </View>
                        <CustomButton
                           title={buttonTitle}
                           mainStyle={{ marginVertical: 20, }}
                           onPress={onPressReport}
                        />
                        <TouchableOpacity style={styles.cancelView} delayPressIn={0} onPress={onRequestClose}>
                           <Text style={styles.cancel}>{commonText.cancel}</Text>
                        </TouchableOpacity>
                     </TouchableOpacity>
                  </TouchableHighlight>
               </RNModal>
               {/* </Modal> */}
            </View>
         );
      }
      else {
         return null;
      }
   }
}

export default ReportUserModal;

/**component styling */
const styles = StyleSheet.create({
   outerViewModalStyle: {
      flex: 1,
      backgroundColor: colors.modalBackground,
      justifyContent: 'center',
      paddingBottom: isIphoneX() ? 25 : 0
   },
   modal: {
      backgroundColor: colors.white,
      marginHorizontal: 20,
      borderRadius: 10,
      paddingVertical: 10
   },
   title: {
      fontSize: 20,
      fontFamily: fonts.muliBold,
      color: colors.black,
      paddingVertical: 10,
      paddingHorizontal: 20
   },
   cancel: {
      fontSize: 16,
      fontFamily: fonts.muliSemiBold,
      color: colors.grayShadeDark,
   },
   cancelView: {
      marginHorizontal: 20,
      alignSelf: 'center'
   }
})