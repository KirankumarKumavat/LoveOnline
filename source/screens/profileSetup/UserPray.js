import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { commonText } from '../../common';
import { CustomButton } from '../../components';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';

/**
 * 
 * @param {*} id 
 * @returns pray
 */
export const getPrayById = (id) => {
   let pray = "";
   switch (id) {
      case 1:
         pray = commonText.alwayspray;
         break;
      case 2:
         pray = commonText.usuallypray;
         break;
      case 3:
         pray = commonText.sometimespray;
         break;
      case 4:
         pray = commonText.liketostart;
         break;
      default:
         pray = "";
         break;
   }
   return pray;
}

/**ProfileSetup:UserMarriageGoal selection Screen component */
class UserPray extends Component {
   selectedPrayIndex = null;
   /**componet life cycle method */
   async componentDidMount() {
      let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetails && userDetails.pray) {
         this.selectedPrayIndex = userDetails.pray;
         this.forceUpdate()
      }
   }

   /**pray list array */
   userPrayArray = [
      { id: 1, title: commonText.alwayspray, },
      { id: 2, title: commonText.usuallypray, },
      { id: 3, title: commonText.sometimespray, },
      { id: 4, title: commonText.liketostart, }
   ]

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <FlatList
               data={this.userPrayArray}
               keyExtractor={(i, j) => j.toString()}
               renderItem={this.renderItem}
               contentContainerStyle={{ paddingVertical: 10 }}
               bounces={false}
               showsVerticalScrollIndicator={false}
            />
         </View>
      );
   }

   /**render method for praylist item */
   renderItem = ({ item, index }) => {
      return (
         <View style={{ marginTop: 15 }}>
            <CustomButton
               title={item.title}
               key={index}
               isSmall
               selectionButtonTheme={1}
               mainStyle={{ elevation: 0 }}
               onPress={() => this.onPressCell(item)}
               theme={this.selectedPrayIndex === item.id ? buttonTheme.dark : buttonTheme.light}
            />
         </View>
      )
   }

   /**action when user click on any pray */
   onPressCell = (item) => {
      this.selectedPrayIndex = item.id;
      this.forceUpdate();
      const params = { pray: item.id }
      // this.props.saveProfileSetupData(params)
      if (this.props.isFromSettingsStack) {
         this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
      }
      else {
         this.props.saveProfileSetupData(params)
      }
   }

}

export default UserPray;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      marginTop: 20
   },
})
