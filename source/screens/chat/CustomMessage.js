import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes, StyleSheet } from 'react-native';
import { SystemMessage, Day, utils } from 'react-native-gifted-chat';
import CustomBubble from './CustomBubble';
import { colors } from '../../common';
import { fonts } from '../../assets';
const { isSameUser, isSameDay } = utils;

/**Custom component for CustomMessage in Chat module */
export default class CustomMessage extends Component {
   shouldComponentUpdate(nextProps) {
      const next = nextProps.currentMessage;
      const current = this.props.currentMessage;
      const { previousMessage, nextMessage } = this.props;
      const nextPropsMessage = nextProps.nextMessage;
      const nextPropsPreviousMessage = nextProps.previousMessage;
      const shouldUpdate = (this.props.shouldUpdateMessage &&
         this.props.shouldUpdateMessage(this.props, nextProps)) ||
         false;
      return (
         next.sent !== current.sent ||
         next.received !== current.received ||
         next.pending !== current.pending ||
         next.createdAt !== current.createdAt ||
         next.text !== current.text ||
         next.image !== current.image ||
         next.video !== current.video ||
         next.audio !== current.audio ||
         previousMessage !== nextPropsPreviousMessage ||
         nextMessage !== nextPropsMessage ||
         shouldUpdate
      );
   }
   /**render method for message day */
   renderDay() {
      if (this.props.currentMessage && this.props.currentMessage.createdAt) {
         const { containerStyle, ...props } = this.props;
         if (this.props.renderDay) {
            return this.props.renderDay(props);
         }
         return <Day {...props} />;
      }
      return null;
   }

   /**render method for single message bubble */
   renderBubble() {
      const { containerStyle, ...props } = this.props;
      const isFromSameUser = isSameUser(props.currentMessage, props.nextMessage) &&
         isSameDay(props.currentMessage, props.nextMessage);
      const isSameThread = isSameUser(props.currentMessage, props.previousMessage)
         && isSameDay(props.currentMessage, props.previousMessage);
      let isOnlyImage = props.currentMessage && props.currentMessage.image && props.currentMessage.image != null;
      return (
         <CustomBubble
            {...props}
            wrapperStyle={{
               right: [
                  styles.rightBubbleWrapperStyle,
                  isFromSameUser ? !isSameThread ? {} :
                     { marginTop: 12 } : { marginTop: 12 },
                  isOnlyImage ? { backgroundColor: colors.transparent, marginTop: 0, } : {}
               ],
               left: [
                  styles.leftBubbleWrapperStyle,
                  isFromSameUser ? !isSameThread ? {} :
                     { marginTop: 12 } : { marginTop: 12 },
                  isOnlyImage ? { backgroundColor: colors.transparent, marginTop: 0, } : {}
               ],
            }}
            textStyle={{
               left: styles.leftBubbleTextStyle,
               right: styles.rightBubbleTextStyle,
            }}
         />
      );
   }

   /**render methid for display syatem message */
   renderSystemMessage() {
      const { containerStyle, ...props } = this.props;
      if (this.props.renderSystemMessage) {
         return this.props.renderSystemMessage(props);
      }
      return <SystemMessage {...props} />;
   }

   /**component render method */
   render() {
      const { currentMessage, nextMessage, position, containerStyle, navigationProps, userStateProps } = this.props;
      const chat_user_id = navigationProps.params?.chat_user_id ?? ''
      if ((chat_user_id == currentMessage.user._id) || (userStateProps.user_id == currentMessage.user._id)) {
         const sameUser = isSameUser(currentMessage, nextMessage);
         return (
            <View>
               {this.renderDay()}
               {currentMessage.system ? (this.renderSystemMessage()) : (
                  <View
                     style={[
                        styles[position].container,
                        { marginBottom: sameUser ? 2 : 10 },
                        !this.props.inverted && { marginBottom: 2 },
                        containerStyle && containerStyle[position],
                     ]}
                  >
                     {this.renderBubble()}
                  </View>
               )}
            </View>
         );
      }
      return null;
   }
}

/**component styling */
const styles = {
   left: StyleSheet.create({
      container: {
         marginLeft: 8,
         marginRight: 0,
         flexDirection: 'row',
         alignItems: 'flex-end',
         justifyContent: 'flex-start',
      },
   }),
   right: StyleSheet.create({
      container: {
         marginLeft: 0,
         marginRight: 8,
         flexDirection: 'row',
         alignItems: 'flex-end',
         justifyContent: 'flex-end',
      },
   }),
   bottomLeftBubbleStyle: {
      left: -5,
      width: 10,
      height: 12,
      bottom: -10,
      borderTopWidth: 10,
      position: 'absolute',
      borderRightWidth: 10,
      alignSelf: 'flex-start',
      borderTopColor: colors.blueShade1,
      backgroundColor: 'transparent',
      borderRightColor: 'transparent',
   },
   bottomRightBubbleStyle: {
      width: 10,
      right: -5,
      height: 10,
      bottom: -9,
      borderTopWidth: 10,
      borderRightWidth: 10,
      position: 'absolute',
      alignSelf: 'flex-end',
      backgroundColor: 'white',
      justifyContent: 'flex-end',
      borderTopColor: colors.grayShade4,
      transform: [{ rotate: '90deg' }],
      borderRightColor: colors.white,
   },
   rightBubbleWrapperStyle: {
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: colors.white,
   },
   leftBubbleWrapperStyle: {
      marginTop: 10,
      borderRadius: 8,
      backgroundColor: colors.white,
   },
   rightBubbleTextStyle: {
      fontSize: 16,
      paddingVertical: 5,
      color: colors.black,
      fontFamily: fonts.muli,
   },
   leftBubbleTextStyle: {
      fontSize: 16,
      paddingVertical: 5,
      color: colors.white,
      fontFamily: fonts.muli,
   },
};

CustomMessage.defaultProps = {
   renderBubble: null,
   renderDay: null,
   renderSystemMessage: null,
   position: 'left',
   currentMessage: {},
   nextMessage: {},
   previousMessage: {},
   user: {},
   containerStyle: {},
   showUserAvatar: false,
   inverted: true,
   shouldUpdateMessage: undefined,
};
CustomMessage.propTypes = {
   showUserAvatar: PropTypes.bool,
   renderBubble: PropTypes.func,
   renderDay: PropTypes.func,
   renderSystemMessage: PropTypes.func,
   position: PropTypes.oneOf(['left', 'right']),
   currentMessage: PropTypes.object,
   nextMessage: PropTypes.object,
   previousMessage: PropTypes.object,
   user: PropTypes.object,
   inverted: PropTypes.bool,
   containerStyle: PropTypes.shape({
      left: ViewPropTypes.style,
      right: ViewPropTypes.style,
   }),
   shouldUpdateMessage: PropTypes.func,
};