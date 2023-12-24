import React from 'react';
import { Image, ImageBackground, Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgIcon } from '.';
import { icons, images } from '../assets';
import { colors, constants } from '../common';

/**
 * 
 * @param {*} param0 
 * Custom image component 
 */
const CustomImage = ({
   source,
   onPressLike,
   isBlurPhoto,
   isLikeButton,
   isMale,
}) => {
   let blurRadius = isBlurPhoto ? Platform.OS == "android" ? 3 : 8 : 0;
   let placeHolderSource = isMale ? images.malePlaceHolderImage : images.femalePlaceHolderImage
   return (
      <ImageBackground
         style={styles.container}
         source={placeHolderSource}
         imageStyle={{ borderRadius: 20 }}
         resizeMode={'contain'}
      >
         <Image
            source={source ? { uri: source } : placeHolderSource}
            resizeMode={source ? 'cover' : "contain"}
            style={styles.profilePicStyle}
            blurRadius={blurRadius}
         />
         {
            isLikeButton
               ?
               <TouchableOpacity
                  onPress={onPressLike}
                  delayPressIn={0}
                  style={styles.likeButtonView}>
                  <SvgIcon name={icons.emptyHearticon} height={21 + 15} width={25 + 15} />
               </TouchableOpacity>
               : null
         }
      </ImageBackground>
   );
}

export default CustomImage;

/**component styling */
const styles = StyleSheet.create({
   container: {
      height: 370,
      width: constants.screenWidth - 40,
      marginLeft: 20,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      shadowColor: colors.grayShade1,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 5,
      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff',
      borderRadius: 20,
      shadowColor: colors.grayShade1,
      shadowOpacity: 1,
      shadowRadius: 10,
      elevation: 5,

      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff'
   },
   profilePicStyle: {
      height: 370,
      width: constants.screenWidth - 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 20,
   },
   likeButtonView: {
      height: 36,
      width: 36,
      position: 'absolute',
      backgroundColor: colors.white,
      borderRadius: 12,
      bottom: 10,
      right: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 2
   }
})