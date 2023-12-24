import React, { Component } from 'react';
import { View, ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity, Image, Text } from 'react-native';
import * as Progress from 'react-native-progress';

import _ from 'lodash';
import FastImage from 'react-native-fast-image';
import { constants, colors, commonText } from '../common';
import { fonts, icons, images } from '../assets';
import SvgIcon from './SvgIcon';

/**custom image component */
class DefaultImage extends Component {
   constructor(props) {
      super(props);
      this.state = {
         failToLoad: false,
         loadComplete: false,
      };
   }

   /**component render method */
   render() {
      const { containerStyle, style } = this.props;
      return (
         <View style={[styles.boxStyle, containerStyle ? containerStyle : style]}>
            {this.renderImageView()}
         </View>
      );
   }

   /**render image component and progress bar */
   renderImageView() {
      const { loadComplete, failToLoad } = this.state;
      const {
         source,
         resizeMode,
         style = {}, // while style is set it will overright all image styles
         imageStyle = {},
         errorImageStyle = {},
         defaultImageStyle = {},
         defaultImageResizeMode,
         onPressDeleteProfile,
         gender,
      } = this.props;
      console.log("state--->", this.state);
      if (failToLoad) {
         // renders while image load failed
         return (
            <>
               <FastImage
                  source={gender == commonText.male ? images.profilePlaceHolder : images.placeHolderFemale}
                  resizeMode={resizeMode || 'cover'}
                  style={styles.profilePicStyle}
               />
               {
                  this.props.isFromSetting == true
                     ?
                     <TouchableOpacity onPress={onPressDeleteProfile} style={styles.closeIcon} delayPressIn={0} >
                        <View style={styles.newWrap}>
                           <SvgIcon height={13} width={13} name={icons.pencilIconGrey} />
                        </View>
                     </TouchableOpacity>
                     : null
               }
               <Text style={styles.photosText}>{commonText.picFailedText}</Text>
            </>
         )
      } else if (loadComplete) {
         return (
            <>
               <FastImage
                  source={{ uri: source }}
                  resizeMode={resizeMode || 'cover'}
                  style={styles.profilePicStyle}
               />
               <TouchableOpacity onPress={onPressDeleteProfile} style={styles.closeIcon} delayPressIn={0} >
                  {this.props.isFromSetting !== true
                     ?
                     <Image resizeMode={'contain'}
                        source={images.close} />
                     : <View style={styles.newWrap}>
                        <SvgIcon height={13} width={13} name={icons.pencilIconGrey} />
                     </View>
                  }
               </TouchableOpacity>
            </>
         )
      } else {
         // default image rendering
         return (
            <ImageBackground
               source={gender == commonText.male ? images.profilePlaceHolder : images.placeHolderFemale}
               resizeMode={defaultImageResizeMode || 'cover'}
               style={styles.profilePicStyle}
               imageStyle={styles.imageNewStyle}
            >
               {source ?
                  <View style={[styles.profilePicStyle, { alignItems: 'center', justifyContent: 'center' }]}>
                     <FastImage
                        source={{ uri: source }}
                        resizeMode={resizeMode || 'cover'}
                        onError={() => this.setState({ failToLoad: true })}
                        onLoad={(event) => {
                           this.setState({ loadComplete: true })
                        }}
                        onLoadStart={() => this.setState({ loadComplete: false })}
                        style={{ height: 2, width: 2 }} // I know, Hack for load image! :)
                     />
                     <View style={styles.loaderStyle}>

                        <Text style={styles.loadingText}>{commonText.loadingText}</Text>
                        <Progress.Bar
                           indeterminate={true}
                           color={colors.blueShade1}
                           width={75}
                           animationType={'spring'}
                           borderRadius={10}
                        />
                     </View>
                  </View> : null
               }
            </ImageBackground>
         )
      }
   }
}

/**component styling */
const styles = StyleSheet.create({
   container: {
      borderWidth: 4,
      overflow: 'hidden',
      alignSelf: 'center',
      justifyContent: 'center',
      borderColor: colors.white,
   },
   imageStyle: {
      width: 128,
      height: 128,
      alignItems: 'center',
      justifyContent: 'center',
   },
   defaultImageStyle: {
      width: 128,
      height: 128,
      alignItems: 'center',
      justifyContent: 'center',
   },
   errorImageStyle: {
      width: 128,
      height: 128,
   },
   loaderStyle: {
      alignSelf: 'center',
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
   },
   boxStyle: {
      borderWidth: 1,
      borderColor: colors.grayShade3,
      width: constants.screenWidth / 3 - 27,
      height: constants.screenHeight / 7,
      marginVertical: 10,
      marginHorizontal: 7,
      borderRadius: 15,
      backgroundColor: colors.offWhite,
      justifyContent: 'center'
   },
   profilePicStyle: {
      width: constants.screenWidth / 3 - 25,
      height: constants.screenHeight / 7,
      borderRadius: 15,
   },
   closeIcon: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      right: 5, top: 8,

   },
   imageNewStyle: {
      borderRadius: 15, width: constants.screenWidth / 3 - 30,
      height: constants.screenHeight / 7,
   },
   newWrap: {
      backgroundColor: colors.white,
      height: 20, width: 20,
      borderRadius: 10, justifyContent: 'center',
      alignItems: 'center'
   },
   loadingText: {
      fontSize: 14, marginBottom: 10,
      fontFamily: fonts.muli, color: colors.blueShade1
   },
   photosText: {
      color: colors.blueShade1,
      fontSize: 12,
      fontFamily: fonts.muliSemiBold,
      position: "absolute",
      textAlign: "center"
   },
});

export default DefaultImage;