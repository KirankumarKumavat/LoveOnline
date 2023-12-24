import React, { Component } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { fonts, icons } from '../../assets';
import { colors, commonText } from '../../common';
import { Header, SvgIcon } from '../../components';

/**FilterMarriageGoal Component */
class FilterMarriageGoal extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }
   /**array list for marriage goal */
   marriageArray = [
      { id: 1, title: commonText.marriageOption1 },
      { id: 2, title: commonText.marriageOption2 },
      { id: 3, title: commonText.preferNotSay },
   ]
   /**array list for abroad goal */
   abroadArray = [
      { id: 1, title: commonText.marriageOption3 },
      { id: 2, title: commonText.marriageOption4 }
   ]

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <Header
               backButton
               middleText={commonText.marriageGoal}
            />
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false}>
               <View style={{ flex: 1 }}>
                  <Text style={styles.titleText}>{commonText.marriagePrefrences}:</Text>
                  <View>
                     {
                        this.marriageArray.map((obj, index) => {
                           let selected = false;
                           this.props.selectedMarriageGoalsList && this.props.selectedMarriageGoalsList.length
                              ? this.props.selectedMarriageGoalsList.map((i) => {
                                 if (i.goal_name == obj.title) selected = true
                              })
                              : null;
                           return (
                              <>
                                 <TouchableOpacity
                                    activeOpacity={0.8}
                                    delayPressIn={0}
                                    onPress={() => this.onPressMarriage(obj, index, selected)}
                                    style={styles.casteView}
                                 >
                                    <Text style={styles.modalText}>{obj.title}</Text>
                                    {selected ? <SvgIcon
                                       name={icons.checkMarkIcon}
                                       height={20}
                                       width={20}
                                    /> : null}
                                 </TouchableOpacity>
                                 {index != this.marriageArray.length - 1 && this.itemSeparator()}
                              </>
                           )
                        })
                     }
                  </View>
                  <Text style={[styles.titleText, { marginTop: 10 }]}>{commonText.abroadPrefrences}:</Text>
                  <View>
                     {
                        this.abroadArray.map((obj, index) => {
                           let selected = false;
                           this.props.selectedAboradGoalList && this.props.selectedAboradGoalList.length
                              ? this.props.selectedAboradGoalList.map((i) => {
                                 if (i.abroad_name == obj.title) selected = true
                              })
                              : null;
                           return (
                              <>
                                 <TouchableOpacity
                                    activeOpacity={0.8}
                                    delayPressIn={0}
                                    onPress={() => this.onPressAbroad(obj, index, selected)}
                                    style={styles.casteView}
                                 >
                                    <Text style={styles.modalText}>{obj.title}</Text>
                                    {selected ? <SvgIcon
                                       name={icons.checkMarkIcon}
                                       height={20}
                                       width={20}
                                    /> : null}
                                 </TouchableOpacity>
                                 {index != this.abroadArray.length - 1 && this.itemSeparator()}
                              </>
                           )
                        })
                     }
                  </View>
               </View>
            </ScrollView>
         </View>
      );
   }

   /**item separator component */
   itemSeparator = () => (
      <View style={{ height: 1, backgroundColor: colors.textInputBorder, marginHorizontal: 10 }} />
   )

   /**action handling when marriage option is selected */
   onPressMarriage = (item, index, selected) => {
      let key = "goal_name";
      let arrayName = "selectedMarriageGoalsList";
      const params = { [key]: item.title, id: item.id }
      this.ChangeReduxValue(selected, params, key, arrayName)
   }

   /**action handling when abroad option is selected */
   onPressAbroad = (item, index, selected) => {
      let key = "abroad_name";
      let arrayName = "selectedAboradGoalList";
      const params = { [key]: item.title, id: item.id }

      this.ChangeReduxValue(selected, params, key, arrayName)

   }

   /**action handling for redux event */
   ChangeReduxValue = (selected, params, key, arrayName) => {
      if (selected) this.props.filterRemoveValueFromSpecificList(key, arrayName, params)
      else this.props.filterAddValueToSpecificList(key, arrayName, params);
   }
}

export default FilterMarriageGoal;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
   titleText: {
      fontSize: 18,
      color: colors.black,
      paddingHorizontal: 20,
      fontFamily: fonts.muliSemiBold,
      paddingVertical: 20
   },
   casteView: {
      paddingLeft: 20,
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginRight: 20,
      flex: 1
   },
   modalText: {
      color: colors.black,
      fontFamily: fonts.muli,
      fontSize: 16,
      paddingRight: 20
   },
})