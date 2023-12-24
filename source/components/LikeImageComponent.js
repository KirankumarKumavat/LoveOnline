import React from 'react';
import { Text, View, Image, ImageBackground, TouchableOpacity, Platform, StyleSheet } from 'react-native';

import { colors, constants } from '../common';
import { fonts, images } from '../assets';
import { scale, verticalScale } from '../utils/scale';

/**custom image component for like tab */
const LikeImageComponent = ({
   onPressImage,
   source,
   userName,
   userAge,
   isCancelButton,
   isUnblockButton,
   onPressCancel,
   isBlurPhoto,
   onPressUnBlockButton,
   isMale,
}) => {
   let blurRadius = isBlurPhoto ? Platform.OS == "android" ? 3 : 8 : 0;
   let placeHolderSource = isMale ? images.malePlaceHolderImage : images.femalePlaceHolderImage

   /**render method */
   return (
      <View style={[styles.container, {}]}>
         <>
            <TouchableOpacity
               style={styles.imageView}
               activeOpacity={constants.activeOpacity}
               onPress={onPressImage}
               delayPressIn={0}
            >
               <ImageBackground
                  source={placeHolderSource}
                  resizeMode={'cover'}
                  style={[styles.imageStyle, styles.newimageStyle]}
                  imageStyle={{
                     borderRadius: 15,
                  }}
               >
                  <Image
                     resizeMode="cover"
                     source={{ uri: source }}
                     style={[styles.imageStyle, styles.newWrap]}
                     blurRadius={blurRadius}
                  >
                  </Image>
                  <Image
                     resizeMode="stretch"
                     source={images.blackOverlay}
                     style={[styles.overlay, {}]}
                  />
               </ImageBackground>
               <View style={styles.userName}>
                  <Text style={[styles.nameStyleText, { maxWidth: '75%', }]} numberOfLines={1}>{userName}</Text>
                  {<Text style={[styles.nameStyleText, { marginLeft: 5 }]} numberOfLines={1}>,{userAge}</Text>}
               </View>
               {
                  isCancelButton &&
                  <TouchableOpacity
                     onPress={onPressCancel}
                     delayPressIn={0}
                     style={styles.button}
                  >
                     <Image source={images.close} resizeMode={'cover'} />
                  </TouchableOpacity>
               }
               {
                  isUnblockButton &&
                  <TouchableOpacity
                     onPress={onPressUnBlockButton}
                     delayPressIn={0}
                     style={[styles.button, styles.wrapText]}
                  >
                     <Image style={{ height: 18, width: 18 }} source={images.blockUser} resizeMode={'cover'} />
                  </TouchableOpacity>
               }
            </TouchableOpacity>
         </>
      </View>
   )
}

export default LikeImageComponent;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      borderRadius: 15,
      marginHorizontal: 7,
      marginVertical: 7,
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
   contentContainerStyle: {
      marginHorizontal: 10,
      paddingBottom: scale(20),
      flexGrow: 1,
   },
   imageStyle: {
      borderRadius: 15,
      height: '100%',
      width: '100%',
      overflow: 'hidden'
   },
   imageView: {
      width: constants.screenWidth / 2 - 20,
      height: verticalScale(175),
   },
   nameStyleText: {
      maxWidth: '80%',
      marginLeft: 10,
      color: colors.white,
      fontFamily: fonts.muliBold,
      fontSize: 16,
      overflow: 'hidden'
   },
   userName: {
      flexDirection: 'row', position: 'absolute',
      bottom: 20, justifyContent: 'center', alignItems: 'center'
   },
   button: {
      flexDirection: 'row',
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      right: 10,
      top: 10
   },
   overlay: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      left: 0,
      height: verticalScale(100),
      opacity: 1,
      borderRadius: 10,
      transform: [{ rotate: '180deg' }]
   },
   newimageStyle: {
      width: constants.screenWidth / 2 - 20,
      height: verticalScale(175),
   },
   newWrap: {
      width: constants.screenWidth / 2 - 20,
      height: verticalScale(175),
   },
   wrapText: {
      top: 10, left: 10,
      bottom: 10, height: 25,
      width: 25, borderRadius: 30,
      backgroundColor: colors.white
   }
})