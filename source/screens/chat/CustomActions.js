import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
   View,
   Text,
   Keyboard,
   StyleSheet,
   ViewPropTypes,
   TouchableOpacity,
} from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { pickCropImagedFromLibrary, pickCropImageFromCamera } from '../../utils/ImageCropPicker';
import ShareImageModal from './ShareImageModal';
const options = ['Take photo from Camera', 'Choose image', 'Cancel'];

/**Custom Component for Fire action event like Choose image */
class CustomActions extends Component {
   // onActionsPress = async () => {
   //    Keyboard.dismiss();
   //    let imageObj;
   //    this.props.showActionSheetWithOptions(
   //       {
   //          options,
   //       }, async (buttonIndex) => {
   //          switch (buttonIndex) {
   //             case 0:
   //                imageObj = await pickCropImageFromCamera(true);
   //                this.sendData(imageObj)
   //                break;
   //             case 1:
   //                imageObj = await pickCropImagedFromLibrary(true)
   //                this.sendData(imageObj)
   //                break;
   //             case 2:
   //                return;
   //          }
   //       }
   //    )
   // }

   chooseImage = async (buttonIndex) => {
      Keyboard.dismiss();
      let imageObj;
      switch (buttonIndex) {
         case 0:
            imageObj = await pickCropImageFromCamera(true);
            this.sendData(imageObj)
            break;
         case 1:
            imageObj = await pickCropImagedFromLibrary(true)
            this.sendData(imageObj)
            break;
         case 2:
            return;
      }
      this.setState({ isTempModalVisible: false })
   }

   onActionsPress = async () => {
      this.setState({ isTempModalVisible: true })
   }

   /**action for send data  */
   sendData = (imageObj) => {
      this.props.onSend(imageObj);
   }

   /**render the icon for action button */
   renderIcon = () => {
      if (this.props.renderIcon) {
         return this.props.renderIcon();
      }
      return (
         <View style={[styles.wrapper, this.props.wrapperStyle]}>
            <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
         </View>
      )
   }

   state = {
      isTempModalVisible: false,
   }

   /**component render method */
   render() {
      return (
         <TouchableOpacity
            delayPressIn={0}
            activeOpacity={.8}
            onPress={this.onActionsPress}
            style={[styles.container, this.props.containerStyle]}
         >
            {this.renderIcon()}
            <ShareImageModal
               onPressCamera={() => this.chooseImage(0)}
               onPressGallary={() => this.chooseImage(1)}
               modalVisible={this.state.isTempModalVisible}
               onRequestClose={() => this.setState({ isTempModalVisible: false })}
            />
         </TouchableOpacity>
      )
   }

}

/**Action sheet wrap with component */
export default connectActionSheet(CustomActions)

/**component styling */
const styles = StyleSheet.create({
   container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
      marginTop: 10
   },
   wrapper: {
      flex: 1,
      borderWidth: 2,
      borderRadius: 13,
      borderColor: '#b2b2b2',
   },
   iconText: {
      fontSize: 16,
      color: '#b2b2b2',
      fontWeight: 'bold',
      textAlign: 'center',
      backgroundColor: 'transparent',
   },
})

CustomActions.contextTypes = {
   actionSheet: PropTypes.func,
}

CustomActions.defaultProps = {
   onSend: () => { },
   options: {},
   renderIcon: null,
   containerStyle: {},
   wrapperStyle: {},
   iconTextStyle: {},
}

CustomActions.propTypes = {
   onSend: PropTypes.func,
   options: PropTypes.object,
   renderIcon: PropTypes.func,
   containerStyle: ViewPropTypes.style,
   wrapperStyle: ViewPropTypes.style,
   iconTextStyle: Text.propTypes.style,
}