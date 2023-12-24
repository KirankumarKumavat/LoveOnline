import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, StyleSheet, FlatList, TouchableOpacity, Image, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';
import RNModal from 'react-native-modal';
import { fonts } from '../assets';
import { colors, constants } from '../common';
import { isIphoneX } from '../utils/iPhoneXHelper';

class UserProfileViewer extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   render() {
      const { onRequestClose, modalVisible, headerTitle, imageSource, showBlurPics } = this.props;
      let blurRadius = showBlurPics ? Platform.OS == "android" ? 3 : 8 : 0;
      return (
         <View style={{ flex: 1, position: "absolute", width: constants.screenWidth }}>
            <RNModal
               testID={'modal'}
               isVisible={modalVisible}
               animationIn="fadeInLeftBig"
               animationOut="fadeOutLeftBig"
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
               <TouchableHighlight
                  underlayColor={"transparent"}
                  onPress={onRequestClose}
                  style={styles.outerViewModalStyle}
               >
                  <TouchableOpacity activeOpacity={1} style={styles.modal} onPress={() => null}>
                     <Image
                        resizeMode={'cover'}
                        style={styles.imageView}
                        source={{ uri: imageSource }}
                        blurRadius={blurRadius}
                     />
                  </TouchableOpacity>
               </TouchableHighlight>
            </RNModal>
         </View>
      );
   }
}

export default UserProfileViewer;

/**component styling */
const styles = StyleSheet.create({
   outerViewModalStyle: {
      flex: 1,
      backgroundColor: colors.transparent,
      justifyContent: "center",
      paddingBottom: isIphoneX() ? 125 : 85
   },
   modal: {
      backgroundColor: colors.blueShade1,
      marginHorizontal: 10,
      borderRadius: 10,
      // paddingVertical: 10,
      // paddingTop: 20,
      padding: 10
   },
   camera: {
      color: colors.white,
      fontFamily: fonts.muliSemiBold,
      fontSize: 16
   },
   imageView: {
      height: 300,
      width: "100%",
      alignSelf: "center"
   }
})