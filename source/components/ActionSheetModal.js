import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { fonts } from '../assets';
import { commonText } from '../common';

/**action sheet modal component to show Popup for select video or record video */
class ActionSheetModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   /**component render method */
   render() {
      const { onRequestClose, modalVisible,
         headerTitle, onPressReport, buttonTitle,
         onSelectOption,
      } = this.props;
      return (
         <View>
            <Modal
               animationType="slide"
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
                     <Text style={styles.title}>{headerTitle || commonText.selctProfilePicText}</Text>
                     <TouchableOpacity activeOpacity={0.5} onPress={() => onSelectOption(0)}>
                        <Text style={styles.smallText}>{commonText.takePhotoText}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity activeOpacity={0.5} onPress={() => onSelectOption(1)}>
                        <Text style={styles.smallText}>{commonText.chooseImageText}</Text>
                     </TouchableOpacity>
                     <TouchableOpacity activeOpacity={0.5} onPress={onRequestClose}>
                        <Text style={styles.smallText}>{commonText.cancel}</Text>
                     </TouchableOpacity>
                  </TouchableOpacity>
               </TouchableHighlight>
            </Modal>
         </View>
      );
   }
}

export default ActionSheetModal;

/**component styling */
const styles = StyleSheet.create({
   outerViewModalStyle: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      justifyContent: 'center',
      // marginBottom: isIphoneX() ? 25 : 0
   },
   modal: {
      backgroundColor: '#ffffff',
      marginHorizontal: 20,
      borderRadius: 10,
      paddingVertical: 10
   },
   title: {
      fontSize: 20,
      color: '#000000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontFamily: fonts.muliBold,
   },
   cancel: {
      fontSize: 16,
   },
   cancelView: {
      marginHorizontal: 20,
      alignSelf: 'center'
   },
   smallText: {
      fontSize: 16,
      color: '#000000',
      paddingVertical: 10,
      paddingHorizontal: 20,
      fontFamily: fonts.muli
   }
})