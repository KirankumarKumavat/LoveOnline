import React, { Component } from 'react';
import { StatusBar, View, } from 'react-native';

import UserUtils from '../utils/UserUtils';
import RoutingUtils from '../utils/RoutingUtils';
import { Loader } from '../components';
import { colors } from '../common';
import SplashScreen from 'react-native-splash-screen';

/**
 * Auth loading compoent to decide user active state for checking User is loggedin or not, profile completed or not OR New User 
 */
class AuthLoading extends Component {

   /**component life cycle method */
   async componentDidMount() {
      SplashScreen.hide();
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      RoutingUtils.setupUserNavigation(userDetails);
   }

   /**component render method */
   render() {
      return (
         <View style={{ flex: 1 }}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
            <Loader loading={true} style={{ backgroundColor: colors.white }} />
         </View>
      );
   }
}

export default AuthLoading;






