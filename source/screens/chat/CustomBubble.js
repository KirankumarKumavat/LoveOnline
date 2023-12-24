import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
   Text,
   View,
   StyleSheet,
   ViewPropTypes,
   TouchableOpacity,
   TouchableWithoutFeedback,
   ImageBackground,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { MessageText, Time, utils } from 'react-native-gifted-chat';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';
import { connectActionSheet } from '@expo/react-native-action-sheet'
import FastImage from 'react-native-fast-image';
import NavigationService from '../../utils/NavigationService';
import { colors, commonText } from '../../common';
import { fonts, icons, images } from '../../assets';
import { SvgIcon } from '../../components';
import { moderateScale, verticalScale } from '../../utils/scale';
import { showToastMessage } from '../../components/ToastUtil';

const { isSameUser, isSameDay } = utils;

/**component styling */
const styles = {
   image: {
      margin: 3,
      width: moderateScale(220),
      height: verticalScale(190),
      borderRadius: 13,
      marginVertical: 12
   },
   left: StyleSheet.create({
      container: {
         flex: 1,
         alignItems: 'flex-start',
      },
      wrapper: {
         minHeight: 20,
         marginRight: 60,
         borderRadius: 15,
         backgroundColor: "white",
         justifyContent: 'flex-end',
      },
      containerToNext: {
         borderBottomLeftRadius: 3,
      },
      containerToPrevious: {
         borderTopLeftRadius: 3,
      },
      bottom: {
         flexDirection: 'row',
         justifyContent: 'flex-start',
         backgroundColor: colors.white,
      },
      bottomTime: {
         marginLeft: 20,
         marginTop: 5
      },
      notchView: {
         left: 0,
         width: 10,
         height: 12,
         bottom: 0,
         borderTopWidth: 10,
         borderRightWidth: 10,
         alignSelf: 'flex-start',
         borderTopColor: colors.blueShade1,
         backgroundColor: 'transparent',
         borderRightColor: 'transparent',
      }
   }),
   right: StyleSheet.create({
      container: {
         flex: 1,
         alignItems: 'flex-end',
      },
      wrapper: {
         minHeight: 20,
         marginLeft: 60,
         borderRadius: 15,
         backgroundColor: 'blue',
         justifyContent: 'flex-end',
      },
      containerToNext: {
         borderBottomRightRadius: 3,
      },
      containerToPrevious: {
         borderTopRightRadius: 3,
      },
      bottom: {
         flexDirection: 'row',
         backgroundColor: colors.white,
         justifyContent: 'flex-end',
      },
      bottomTime: {
         marginRight: 20,
         marginTop: 5
      },
      notchView: {
         width: 10,
         height: 10,
         right: 0,
         bottom: 0,
         borderTopWidth: 10,
         borderRightWidth: 10,
         backgroundColor: 'white',
         justifyContent: 'flex-end',
         borderTopColor: colors.grayShade4,
         transform: [{ rotate: '90deg' }],
         borderRightColor: colors.white,
      }
   }),
   content: StyleSheet.create({
      tick: {
         fontSize: 10,
         color: colors.textInputBorder,
         fontFamily: fonts.muliBold
      },
      tickView: {
         flexDirection: 'row',
         marginRight: 10,
         marginLeft: -5
      },
      username: {
         top: -3,
         left: 0,
         fontSize: 12,
         backgroundColor: 'transparent',
         color: '#aaa',
      },
      usernameView: {
         flexDirection: 'row',
         marginHorizontal: 10,
      },
   }),
};

const DEFAULT_OPTION_TITLES = ['Copy Text', 'Cancel'];

/**Custom component for render bubble message */
class CustomBubble extends Component {
   constructor() {
      super(...arguments);
      this.onLongPress = () => {
         const { currentMessage } = this.props;
         if (this.props.onLongPress) {
            this.props.onLongPress(this.props, this.props.currentMessage);
         }
         else if (currentMessage && currentMessage.text) {
            const { optionTitles } = this.props;
            const options = optionTitles && optionTitles.length > 0
               ? optionTitles.slice(0, 2)
               : DEFAULT_OPTION_TITLES;
            const cancelButtonIndex = options.length - 1;
            this.props.showActionSheetWithOptions({
               options,
               cancelButtonIndex
            }, buttonIndex => {
               switch (buttonIndex) {
                  case 0:
                     Clipboard.setString(currentMessage.text);
                     showToastMessage("Message copied.")
                     break;
                  default:
                     break;
               }
            })
         }
      };
   }
   styledBubbleToNext() {
      const { currentMessage, nextMessage, position, containerToNextStyle, } = this.props;
      if (currentMessage && nextMessage && position &&
         isSameUser(currentMessage, nextMessage) &&
         isSameDay(currentMessage, nextMessage)) {
         return [
            styles[position].containerToNext,
            containerToNextStyle && containerToNextStyle[position],
         ];
      }
      return null;
   }
   styledBubbleToPrevious() {
      const { currentMessage, previousMessage, position, containerToPreviousStyle, } = this.props;
      if (currentMessage && previousMessage && position &&
         isSameUser(currentMessage, previousMessage) &&
         isSameDay(currentMessage, previousMessage)) {
         return [
            styles[position].containerToPrevious,
            containerToPreviousStyle && containerToPreviousStyle[position],
         ];
      }
      return null;
   }
   /**render method for quick replies */
   renderQuickReplies() {
      const { currentMessage, onQuickReply, nextMessage, renderQuickReplySend, quickReplyStyle, } = this.props;
      if (currentMessage && currentMessage.quickReplies) {
         const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
         if (this.props.renderQuickReplies) {
            return this.props.renderQuickReplies(quickReplyProps);
         }
         return (
            <QuickReplies {...{
               currentMessage,
               onQuickReply,
               nextMessage,
               renderQuickReplySend,
               quickReplyStyle,
            }} />
         );
      }
      return null;
   }
   /**render method for message text */
   renderMessageText() {
      if (this.props.currentMessage && this.props.currentMessage.text) {
         const { containerStyle, wrapperStyle, optionTitles, ...messageTextProps } = this.props;
         if (this.props.renderMessageText) {
            return this.props.renderMessageText(messageTextProps);
         }
         const { left, right } = this.props.textStyle;
         return (
            <MessageText
               {...messageTextProps}
               linkStyle={{
                  left: { color: colors.white },
                  right: { color: colors.blue }
               }}
               containerStyle={{
                  left: { backgroundColor: colors.blueShade1, borderRadius: 8, borderBottomStartRadius: 0, },
                  right: { backgroundColor: colors.grayShade4, borderRadius: 8, borderBottomRightRadius: 0 }
               }}
               textStyle={{
                  right: [{ marginBottom: 0, marginTop: 0 }, right],
                  left: [{ marginBottom: 0, marginTop: 0 }, left]
               }}
            />
         );
      }
      return null;
   }

   /**render method for single and double tick mark for message */
   renderTicks() {
      const { currentMessage, renderTicks, user, onlineUserProps } = this.props;

      if (renderTicks && currentMessage) {
         return renderTicks(currentMessage);
      }
      if (currentMessage &&
         user &&
         currentMessage.user &&
         currentMessage.user._id !== user._id) {
         return null;
      }
      if (currentMessage) {

         if (currentMessage.is_read == 1) {
            return (
               <View style={styles.content.tickView}>
                  <SvgIcon name={icons.doubleTick}
                     height={13 - 3}
                     width={22 - 3}
                     style={{ marginTop: 3, }}
                  />
               </View>
            )
         }
         else if (currentMessage.is_read == 2) {
            return (
               <View style={[styles.content.tickView]}>
                  <SvgIcon
                     name={icons.doubleGrayTick}
                     height={13 - 3}
                     width={22 - 3}
                     style={{ marginTop: 3, }}
                  />
               </View>
            )
         }
         else if (currentMessage.is_read == 0) {
            return (
               <View style={[styles.content.tickView,
               ]}
               >
                  <SvgIcon name={icons.singleTick}
                     height={13 - 3}
                     width={22 - 3}
                     style={{ marginTop: 3, }}
                  />
               </View>
            )
         }
         else {
            return (
               <View style={[styles.content.tickView,
               ]}
               >
                  <SvgIcon name={icons.clockIconGray}
                     height={13}
                     width={13}
                     style={{ marginTop: 3, }}
                  />
               </View>
            )
         }
      }
      return null;
   }

   /**render method for message time */
   renderTime() {
      if (this.props.currentMessage && this.props.currentMessage.createdAt) {
         const { containerStyle, wrapperStyle, textStyle, ...timeProps } = this.props;
         if (this.props.renderTime) {
            return this.props.renderTime(timeProps);
         }
         return (
            <Time
               {...timeProps}
               timeTextStyle={{
                  left: {
                     fontSize: 12,
                     color: colors.chatLight,
                     fontFamily: fonts.muli,
                  },
                  right: {
                     fontSize: 12,
                     color: colors.chatLight,
                     fontFamily: fonts.muli,
                  }
               }}
               containerStyle={{
                  left: { marginLeft: 5 }
               }}
            />
         );
      }
      return null;
   }
   /**render method for user name view */
   renderUsername() {
      const { currentMessage, user } = this.props;
      if (this.props.renderUsernameOnMessage && currentMessage) {
         if (user && currentMessage.user._id === user._id) {
            return null;
         }
         return (
            <View style={styles.content.usernameView}>
               <Text style={[styles.content.username, this.props.usernameStyle]}>
                  ~ {currentMessage.user.name}
               </Text>
            </View>
         );
      }
      return null;
   }

   /**render method for any custom view */
   renderCustomView() {
      if (this.props.renderCustomView) {
         return this.props.renderCustomView(this.props);
      }
      return null;
   }

   /**render method for message bubble content */
   renderBubbleContent() {
      return this.props.isCustomViewBottom ? (
         <View>
            {this.renderMessageImage()}
            {this.renderMessageText()}
            {this.renderCustomView()}
         </View>
      ) : (
         <View>
            {this.renderMessageImage()}
            {this.renderMessageText()}
            {this.renderCustomView()}
         </View>
      );
   }
   renderMessageImage() {
      if (this.props.currentMessage && this.props.currentMessage.image) {
         const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
         if (this.props.renderMessageImage) {
            return this.props.renderMessageImage(messageImageProps);
         }
         const { imageProps, imageStyle, currentMessage } = this.props;
         if (!!currentMessage) {
            return (
               <TouchableOpacity
                  delayPressIn={0}
                  style={[{}, containerStyle]}
                  onPress={() => {
                     NavigationService.navigate(commonText.zoomImageRoute, { imageUrl: currentMessage.image })
                  }}
               >
                  <ImageBackground
                     source={images.chatplaceHolder}
                     resizeMode={'cover'}
                     style={[styles.image, { marginBottom: 2, }, imageStyle]}
                     imageStyle={{ borderRadius: 13 }}
                  >
                     <FastImage
                        style={[styles.image, { margin: 0, marginVertical: 0 }, imageStyle]}
                        source={currentMessage.image ? { uri: currentMessage.image } : images.chatplaceHolder}
                        resizeMode={FastImage.resizeMode.cover}
                     />
                  </ImageBackground>
               </TouchableOpacity>
            );
         }
         return null;
      }
      return null;
   }

   /**component render method */
   render() {
      const { position, containerStyle, currentMessage, wrapperStyle, bottomContainerStyle, timeWrapperStyle, } = this.props;
      return (
         <View style={[
            styles[position].container,
            containerStyle && containerStyle[position],
         ]}>
            <View style={[
               styles[position].wrapper,
               wrapperStyle && wrapperStyle[position],
               this.styledBubbleToNext(),
               this.styledBubbleToPrevious(),
            ]}>
               <TouchableWithoutFeedback onLongPress={this.onLongPress} accessibilityTraits='text' {...this.props.touchableProps}>
                  <View>
                     <View>
                        {this.renderBubbleContent()}

                     </View>
                     <View style={[
                        styles[position].bottom,
                     ]}>
                        {
                           position == "left" && currentMessage.image == null ?
                              <View style={styles.left.notchView} />
                              : null
                        }
                        {this.renderTime()}
                        {this.renderTicks()}

                        {
                           position == "right" && currentMessage.image == null ?
                              <View style={styles.right.notchView} />
                              : null
                        }
                     </View>
                  </View>
               </TouchableWithoutFeedback>
            </View>
            {this.renderQuickReplies()}
         </View>
      );
   }

}

/**Action sheet wrap with component */
export default connectActionSheet(CustomBubble);

CustomBubble.contextTypes = {
   actionSheet: PropTypes.func,
};
CustomBubble.defaultProps = {
   touchableProps: {},
   onLongPress: null,
   renderMessageText: null,
   renderCustomView: null,
   renderUsername: null,
   renderTicks: null,
   renderTime: null,
   renderQuickReplies: null,
   onQuickReply: null,
   position: 'left',
   optionTitles: DEFAULT_OPTION_TITLES,
   currentMessage: {
      text: null,
      createdAt: null,
      image: null,
   },
   nextMessage: {},
   previousMessage: {},
   containerStyle: {},
   wrapperStyle: {},
   bottomContainerStyle: {},
   tickStyle: {},
   usernameStyle: {},
   containerToNextStyle: {},
   containerToPreviousStyle: {},
   timeWrapperStyle: {},
};
CustomBubble.propTypes = {
   user: PropTypes.object.isRequired,
   touchableProps: PropTypes.object,
   onLongPress: PropTypes.func,
   renderMessageText: PropTypes.func,
   renderCustomView: PropTypes.func,
   isCustomViewBottom: PropTypes.bool,
   renderUsernameOnMessage: PropTypes.bool,
   renderUsername: PropTypes.func,
   renderTime: PropTypes.func,
   renderTicks: PropTypes.func,
   renderQuickReplies: PropTypes.func,
   onQuickReply: PropTypes.func,
   position: PropTypes.oneOf(['left', 'right']),
   optionTitles: PropTypes.arrayOf(PropTypes.string),
   currentMessage: PropTypes.object,
   nextMessage: PropTypes.object,
   previousMessage: PropTypes.object,
   containerStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   wrapperStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   bottomContainerStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   tickStyle: PropTypes.any,
   usernameStyle: PropTypes.any,
   containerToNextStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   containerToPreviousStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   timeWrapperStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
};