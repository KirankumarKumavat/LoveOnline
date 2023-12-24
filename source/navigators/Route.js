import React from 'react';
import { StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createSwitchNavigator } from '@react-navigation/compat';
import NavigationService from '../utils/NavigationService';
import AuthLoading from './AuthLoading';
import AuthNavigator from './AuthNavigator';
import { colors } from '../common';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import AppNavigator from './AppNavigator';

/**
 * root tab for app
 */
const RootTab = createSwitchNavigator(
   {
      AuthLoading: AuthLoading,
      Auth: AuthNavigator,
      App: AppNavigator
   },
   {
      initialRouteName: "AuthLoading",
      defaultNavigationOptions: { header: null },
      backBehavior: 'none'
   }
)

/**
 * root navigator for app
 */
const RootNavigator = () => {
   /**render method */
   return (
      <ActionSheetProvider>
         <NavigationContainer
            onStateChange={(prevState, currentState) => { }}
            ref={navigator => NavigationService.setTopLevelNavigator(navigator)}
         >
            <RootTab />
         </NavigationContainer>
      </ActionSheetProvider>
   )
}

/**
 * 
 * @param {*} props 
 * start routing of app
 */
const Route = props => {
   return (
      <View style={{ flex: 1 }}>
         <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
         <RootNavigator />
      </View>
   )
}

export default Route;