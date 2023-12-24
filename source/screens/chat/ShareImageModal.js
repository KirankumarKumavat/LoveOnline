import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import RNModal from 'react-native-modal';
import { fonts, images } from '../../assets';
import { colors, constants } from '../../common';
import { isIphoneX } from '../../utils/iPhoneXHelper';

class ShareImageModal extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   render() {
      const { onRequestClose, modalVisible, headerTitle, onPressCamera, onPressGallary } = this.props;
      return (
         <View style={{ flex: 1, position: "absolute", width: constants.screenWidth }}>
            <RNModal
               testID={'modal'}
               isVisible={modalVisible}
               animationIn="fadeInUpBig"
               animationOut="fadeOutDownBig"
               animationInTiming={300}
               animationOutTiming={400}
               backdropTransitionInTiming={600}
               backdropTransitionOutTiming={600}
               backdropOpacity={1}
               backdropColor={colors.transparent}
               onBackButtonPress={onRequestClose}
               supportedOrientations={['portrait']}
               style={{ padding: 0, margin: 0 }}
            >
               {/* <Modal
               animationType='fade'
               transparent={true}
               visible={modalVisible}
               statusBarTranslucent
               onRequestClose={onRequestClose}
            > */}
               <TouchableHighlight
                  underlayColor={"transparent"}
                  onPress={onRequestClose}
                  style={styles.outerViewModalStyle}
               >
                  <TouchableOpacity activeOpacity={1} style={styles.modal} onPress={() => null}>
                     <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <TouchableOpacity
                           activeOpacity={constants.activeOpacity}
                           onPress={onPressCamera}
                           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                        >
                           <Image source={images.cameraIconForShare}
                              style={{ height: 50, width: 50 }}
                              resizeMode={'contain'}
                           />
                           <Text style={styles.camera}>{"Camera"}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                           style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
                           activeOpacity={constants.activeOpacity}
                           onPress={onPressGallary}
                        >
                           <Image source={images.gallaryIcon}
                              style={{ height: 50, width: 50 }}
                              resizeMode={'contain'}
                           />
                           <Text style={styles.camera}>{"Gallery"}</Text>
                        </TouchableOpacity>
                     </View>
                  </TouchableOpacity>
               </TouchableHighlight>
            </RNModal>
            {/* </Modal> */}
         </View>
      );
   }
}

export default ShareImageModal;

/**component styling */
const styles = StyleSheet.create({
   outerViewModalStyle: {
      flex: 1,
      backgroundColor: colors.transparent,
      justifyContent: "flex-end",
      paddingBottom: isIphoneX() ? 125 : 85
   },
   modal: {
      backgroundColor: colors.blueShade1,
      marginHorizontal: 10,
      borderRadius: 10,
      paddingVertical: 10,
      paddingTop: 20
   },
   camera: {
      color: colors.white,
      fontFamily: fonts.muliSemiBold,
      fontSize: 16
   }
})