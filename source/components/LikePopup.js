import React, { Component } from 'react';
import { View, Text, Modal } from 'react-native';

import LikeCommentContainer from '../screens/explore/LikeCommentContainer';
import RNModal from 'react-native-modal';
import { colors, constants } from '../common';

/**Component for Like User Image Or question  */
class LikePopup extends Component {
   constructor(props) {
      super(props);
      this.state = {
      };
   }

   /**render method */
   render() {
      const { visible, onRequestClose, headerTitle, imageUrl, question, isBlurPhoto, likeData, onPressSendLike, onBackButtonPress } = this.props;
      return (
         // <Modal
         //    visible={visible}
         //    animationType={'slide'}
         //    onRequestClose={onRequestClose}
         //    transparent={true}
         // >
         //    <View style={{ flex: 1 }}>
         //       <LikeCommentContainer
         //          likeData={likeData}
         //          onRequestClose={onRequestClose}
         //          onPressSendLike={onPressSendLike}
         //          isBlurPhoto={isBlurPhoto}
         //       />
         //    </View>
         // </Modal>
         <View style={{ flex: 1, position: "absolute", width: constants.screenWidth }}>
            <RNModal
               testID={'modal'}
               isVisible={visible}
               animationIn="zoomInUp"
               animationOut="zoomOut"
               animationInTiming={1500}
               animationOutTiming={1500}
               backdropTransitionInTiming={600}
               backdropTransitionOutTiming={600}
               backdropOpacity={1}
               backdropColor={colors.white}
               onBackButtonPress={onRequestClose}
               supportedOrientations={['portrait']}
               style={{ padding: 0, margin: 0 }}
            >
               <View style={{
                  flex: 1, height: constants.screenHeight,
                  width: constants.screenWidth
               }}>
                  <LikeCommentContainer
                     likeData={likeData}
                     onRequestClose={onRequestClose}
                     onPressSendLike={onPressSendLike}
                     isBlurPhoto={isBlurPhoto}
                  />
               </View>
            </RNModal>
         </View>
      );
   }
}

export default LikePopup;
