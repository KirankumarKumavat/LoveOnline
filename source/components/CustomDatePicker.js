import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { colors } from '../common';
import moment from "moment";
/**
 * Date picker component to pick date
 */
class CustomDatePicker extends Component {

   /**component render method */
   render() {
      return (
         <View style={[styles.container, this.props.containerStyle]}>
            <DatePicker
               date={this.props.selectedDate || new Date()}
               mode={this.props.pickerMode}
               onDateChange={this.props.onDateChange}
               // maximumDate={this.props.maxDate || new Date()}
               style={styles.pickerStyle}
               locale={this.props.locale || 'en-UK'}
               textColor={colors.textColor}
               androidVariant={'iosClone'}
               maximumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 18))}
            // maximumDate={this.props.maxDate || moment().subtract(18, "years")}
            // minimumDate={moment().subtract(150, "years")}
            />
         </View>
      );
   }
}

export default CustomDatePicker;

/**component styling */
const styles = StyleSheet.create({
   container: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   pickerStyle: {
      backgroundColor: colors.white,
      elevation: 0,
   },
})
