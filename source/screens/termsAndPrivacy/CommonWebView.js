import React, { Component } from 'react';
import { View, StyleSheet, StatusBar, BackHandler } from 'react-native';
import AutoHeightWebView from 'react-native-autoheight-webview'
import { Header, Loader } from '../../components';
import { commonText, constants, colors } from '../../common';
import apiConfigs from '../../api/apiConfig';
import { isIphoneX } from '../../utils/iPhoneXHelper';

export const webKey = {
   Terms: 0,
   Privacy: 1,
}

/**CommonWebView Screen Component */
class CommonWebView extends Component {
   state = {
      loading: false,
   }

   /**componet life cycle method */
   componentDidMount() {
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
      this.setState({ loading: true })
   }

   /**action fire when back button click */
   handleBackPress = () => {
      this.props.navigation.goBack()
      return true;
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
   }

   getTitle = () => {
      const middleText = this.props.route.params.terms ? commonText.terms
         : this.props.route.params.policy ? commonText.privacyPolicy
            : this.props.route.params.cancelSubscription ? commonText.cancelSubscription
               : this.props.route.params.switchplan ? commonText.switchplan
                  : "";
      return middleText;
   }

   getWebviewSourceURL = () => {
      const webUrl = this.props.route.params.terms ? apiConfigs.termsAndConditionUrl
         : this.props.route.params.policy ? apiConfigs.privacyPolicyUrl
            : this.props.route.params.cancelSubscription ?
               constants.isIOS ? apiConfigs.cancelSubscribtionUrlForIos : apiConfigs.cancelSubscribtionUrlForAndroid
               : this.props.route.params.switchplan ? apiConfigs.switchPlanUrlForIos
                  : null
      return webUrl;
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.safeAreaView}>
            <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
            <Header
               theme={0}
               backButton
               middleText={this.getTitle()}
            />
            <AutoHeightWebView
               originWhitelist={['*']}
               bounces={false}
               style={styles.containerStyle}
               source={{ uri: this.getWebviewSourceURL() }}
               // showsVerticalScrollIndicator={false}
               scrollEnabled={true}
               onLoadStart={() => this.setState({ loading: true })}
               onLoad={() => this.setState({ loading: false })}
               onLoadEnd={() => this.setState({ loading: false })}
               onError={() => this.setState({ loading: false })}
               onHttpError={() => this.setState({ loading: false })}
            />
            <Loader loading={this.state.loading} />
         </View>
      );
   }
}

export default CommonWebView;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1
   },
   safeAreaView: {
      flex: 1,
      backgroundColor: colors.white
   },
   containerStyle: {
      paddingVertical: 20,
      backgroundColor: colors.white,
      paddingBottom: isIphoneX() ? 40 : 20
   }
})