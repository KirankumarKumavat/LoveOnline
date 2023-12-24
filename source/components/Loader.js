import React from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, constants } from '../common';
import { getBottomMoreSpace } from '../utils/iPhoneXHelper';
var Spinner = require('react-native-spinkit');
/**
 * 
 * @param {*} param0 
 * custom loading component
 */
const Loader = ({
   loading,
   style,
   size,
   color,
   innerStyle
}) => {
   return (
      <>
         {
            loading && <View style={[styles.container, style]}>
               <View style={[styles.bgWrap, innerStyle]}>
                  {/* <ActivityIndicator
                     size={size || "large" || 45}
                     animating={loading || false}
                     color={color || colors.blueShade1}
                  /> */}
                  <Spinner
                     type={'Circle'}
                     color={colors.blueShade1}
                  />
               </View>
            </View>
         }
      </>
   )
}
export default Loader;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: constants.screenHeight,
      width: '100%',
      position: 'absolute',
      backgroundColor: colors.transparent,
   },
   bgWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: "'rgba(0, 0, 0, 0.8)'",
      padding: 20,
      borderRadius: 15
   }
})