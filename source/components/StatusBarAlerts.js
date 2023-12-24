import React, { Component } from 'react';
import { Platform, StatusBar, View } from 'react-native';

import NetInfo from "@react-native-community/netinfo";
import StatusBarAlert from "./StatusBarComponent";

import { colors, constants } from '../common';

class StatusBarAlerts extends Component {
   constructor(props) {
      super(props);
      this.state = {
         showAlert: false,
         isUploading: false,
      };
   }
   componentDidMount() {
      this.unsubscribe = NetInfo.addEventListener(state => {
         console.log("Connection type", state.type);
         console.log("Is connected?", state.isConnected);
         if (state.isConnected) {
            this.setState({ showAlert: false })
            // StatusBar.setBackgroundColor(colors.blueShade1)
         } else {
            this.setState({ showAlert: true })
            // StatusBar.setBackgroundColor(colors.white)
         }
      });
   }

   componentWillUnmount() {
      this.unsubscribe()
      // StatusBar.setBackgroundColor(colors.white)
   }

   render() {
      console.log('props---->', this.props);
      const { showAlert, isUploading } = this.state;
      let statusBarHeight = 40;
      if (Platform.OS === 'android') statusBarHeight = 40;
      return (
         <View style={{ position: "absolute", zIndex: 1, width: constants.screenWidth }}>
            <StatusBarAlert
               visible={showAlert}
               message={'No Internet Connection'}
               backgroundColor={colors.blueShade1}
               height={statusBarHeight}
               color={colors.white}
               onPress={() => {
                  console.log("onPress Status bar")
               }}
            />
         </View>
      );
   }
}

export { StatusBarAlerts };
