import React, { Component } from 'react';
import {
   View,
   StyleSheet,
   TouchableHighlight,
   StatusBar,
   Image,
   BackHandler
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ImageZoom from 'react-native-image-pan-zoom';
import { icons, images } from '../../assets';
import { colors, constants } from '../../common';
import { SvgIcon } from '../../components';

/**Custom Zoomableimage component */
class ZoomableImage extends Component {
   constructor(props) {
      super(props)
      this.state = {
         imageUrl: this.props.route.params.imageUrl,
         showCloseIcon: true,
         isHidden: false,
      }
   }

   componentDidMount() {
      // StatusBar.setBackgroundColor(colors.black)
      // StatusBar.setBarStyle("light-content")
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
   }

   /**action when back button click */
   handleBackPress = () => {
      this.props.navigation.goBack()
      return true;
   }

   componentWillUnmount() {
      // StatusBar.setBackgroundColor(colors.white)
      // StatusBar.setBarStyle("dark-content")
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
   }

   /**component render method */
   render() {
      return (
         <View style={styles.container}>
            {this.state.showCloseIcon ? <View style={styles.closeBtnWrapView}>
               <TouchableHighlight onPress={() => this.props.navigation.goBack()} underlayColor={'transparent'}>
                  <View style={styles.closeIconWrapView}>
                     <SvgIcon width={25} height={25} name={icons.closeIconDark} />
                     {/* <Image source={images.close} style={{ width: 30, height: 30, }} /> */}
                  </View>
               </TouchableHighlight>
            </View> : null}
            <View style={{ flex: 1, alignItems: 'center' }}>
               <ImageZoom
                  imageHeight={400}
                  cropWidth={constants.screenWidth}
                  cropHeight={constants.screenHeight}
                  imageWidth={constants.screenWidth - 7}
                  pinchToZoom={true}
                  enableDoubleClickZoom
                  onClick={() => {
                     this.setState({ showCloseIcon: !this.state.showCloseIcon, isHidden: !this.state.isHidden }, () => {
                        // StatusBar.setHidden(this.state.isHidden)
                     })
                  }}
               >
                  <FastImage
                     source={{ uri: this.state.imageUrl }}
                     style={styles.imageView}
                     resizeMode={'cover'}
                  />
               </ImageZoom>
            </View>
         </View>
      )
   }
}

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
   closeBtnWrapView: {
      zIndex: 1,
      right: 0,
      marginTop: 30,
      position: 'absolute',
      marginHorizontal: 15,
      flexDirection: 'row',
   },
   closeIconWrapView: {
      padding: 10,
      borderRadius: 5,
      alignItems: 'flex-start',
      justifyContent: 'center',
   },
   shareIconWrapView: {
      width: 30,
      height: 30,
   },
   imageView: {
      height: 400,
      width: constants.screenWidth - 7
   }
});

export default ZoomableImage;