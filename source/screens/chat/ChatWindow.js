import { NavigationEvents } from '@react-navigation/compat';
import React, { Component } from 'react';
import {
   View, Text, StyleSheet, Platform, TouchableOpacity,
   Modal, Keyboard, TouchableHighlight, Button, InputAccessoryView, Alert,
   BackHandler,
} from 'react-native';
import { GiftedChat, Send, Composer, LoadEarlier } from 'react-native-gifted-chat';
import Socket from '../../api/Socket';
import { fonts, icons } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, ReportUserModal, SvgIcon } from '../../components';
import { convetCapital, showSimpleAlert } from '../../utils/HelperFunction';
import { getHeight } from '../../utils/iPhoneXHelper';
import StorageService from '../../utils/StorageService';
import UserUtils from '../../utils/UserUtils';
import CustomActions from './CustomActions';
import CustomMessage from './CustomMessage';
export let chatWindowRef;


/**Chat window-(where User can perform chatting with other user) Screen component */
class ChatWindow extends Component {
   isOnline = false;
   constructor(props) {
      super(props);
      chatWindowRef = this
      this.state = {
         id: '',
         page: 1,
         name: '',
         profile_pic: '',
         loadEarlier: false,
         isTyping: false,
         composerHeight: 50,
         isOnline: false,
         showSearchField: false,
         InputToolbarHeight: 50,
         menuVisible: false,
         loggedInUser: {},
         batchModalVisible: false,
         selectedResonIndex: null,
         selectedResonValue: "",
         badges: [],
         menuArray: [
            {
               id: 1,
               title: commonText.blockUserText,
               onPress: () => this.onPressBlockUser(),
               color: colors.black,
            },
            {
               id: 1,
               title: commonText.unblockUserText,
               onPress: () => this.onPressUnblockUser(),
               color: colors.black,
            },
            {
               id: 2,
               title: commonText.howYouFinduser,
               isModal: true,
               onPress: () => { this.toggleBatchModal(); this.setState({ menuVisible: false }) },
               color: colors.black,
            }
         ],
         isUserSubscribed: false,
         isReceiverLikedByYou: false,
         isMatched: 0,
         isReceiverIgnoredByYou: false,
         gender: commonText.male,
         // isLoadingEarlier: false
      };
   }

   /**badges list */
   badgeData = [
      {
         id: 0,
         title: commonText.serios,
      },
      {
         id: 1,
         title: commonText.polite,
      },
      {
         id: 3,
         title: commonText.recommended,
      }
   ]

   UNSAFE_componentWillMount() {
      this.props.resetChatMessages();
      this.getAndSetMessages();

   }

   /**component life cycle method */
   async componentDidMount() {
      const loggedInUser = await UserUtils.getUserDetailsFromAsyncStorage();
      // this.props.resetChatMessages();
      this.getAndSetMessages();
      this.getcurrentSubscription()

      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      console.log("userDetails-->", userDetails);
      if (userDetails) {
         const { id = "", profile_pic = "", name = "", badges, is_blocked, is_blocked_by_you, is_typing, receiver_liked_by_you, receiver_ignored_by_you } = userDetails;
         if (is_blocked && !is_blocked_by_you) {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title !== commonText.unblockUserText) })
         }
         else if (!is_blocked && is_blocked_by_you) {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title !== commonText.blockUserText) })
         }
         else if (is_blocked && is_blocked_by_you) {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title !== commonText.blockUserText) })
         }
         else {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title !== commonText.unblockUserText) })
         }
         if (is_typing === 1) {
            this.setState({ isTyping: true })
         }
         else {
            this.setState({ isTyping: false })
         }
         this.setState({ id, profile_pic, name, loggedInUser, badges, isReceiverLikedByYou: receiver_liked_by_you, isReceiverIgnoredByYou: receiver_ignored_by_you });
         // this.getAndSetMessages();
         this.getMatchedStatus()
      }

      await this.getOnlineStatus();

      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => this._keyboardDidShow());
      this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => this._keyboardDidHide());

      const userDetail = await UserUtils.getUserDetailsFromAsyncStorage();
      if (userDetail) this.setState({ gender: userDetail.gender })
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

   }

   /**get the user current subscription details*/
   getcurrentSubscription = async () => {
      let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
      if (isActive == "1") {
         this.setState({ isUserSubscribed: true })
      }
   }

   /**action when keyboard open */
   _keyboardDidShow = () => {
      this.isTypingApi(1)
   }

   /**action when keyboard hide */
   _keyboardDidHide = () => {
      this.isTypingApi(0)
   }

   /**get the online status of user with whom loggedin user is chatting */
   getOnlineStatus = async () => {
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      if (userDetails) {
         const receiver_id = userDetails.chat_user_id;
         const params1 = {
            receiver_id
         }
         const response = await this.props.getAppStatus(params1)
         let statusvaliue = response.is_online === 1 ? true : response.is_online === 0 ? false : false;
         this.setState({ isOnline: statusvaliue })
      }
   }

   /**get the match status of loggedin user and other user  */
   getMatchedStatus = async () => {
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      if (userDetails) {
         const matched_user_id = userDetails.chat_user_id;
         const params1 = {
            matched_user_id
         }
         const response = await this.props.checkMatchStatus(params1);
         if (response) {
            if (response.is_matched == 1) {
               this.state.menuArray.push({
                  id: 4,
                  title: commonText.unmatchUser,
                  onPress: () => {
                     this.onPressUnmatchUser()
                  },
                  color: colors.black,
               })
            }
            this.setState({ isMatched: response.is_matched, menuArray: this.state.menuArray })
         }
      }
   }

   /**set the typing status based on keyboard event */
   setTypingValue = (data) => {
      let chat_user_id = this.props.route.params?.chat_user_id ?? '';
      if (chat_user_id === data.sender_id) {
         this.setState({ isTyping: data.is_typing === 1 ? true : false })
      }
   }

   /**action fire when back button click */
   handleBackPress = () => {
      // this.props.navigation.jumpTo(commonText.chatRoute);
      this.props.navigation.navigate(commonText.chatRoute)
      return true;
   }

   /**component life cycle method */
   componentWillUnmount() {
      this.isTypingApi(0);
      Socket.sendRequest('logoutChat');
      this.props.chatBadGeListReset();
      this.keyboardDidShowListener.remove();
      this.keyboardDidHideListener.remove();
      Keyboard.dismiss();
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
      this.props.resetChatMessages();
   }

   getShowDataValue = () => {
      const isMatched = this.state.isMatched;
      let isShowData = false;
      if (isMatched === 1) {
         isShowData = true;
      }
      else if (isMatched === 0) {
         if (this.state.isUserSubscribed) {
            isShowData = true;
         }
         else if (this.state.isReceiverLikedByYou || this.state.isReceiverIgnoredByYou) {
            isShowData = true;
         }
         else {
            isShowData = false;
         }
      }
      return isShowData;
   }

   getImageBlurValue = () => {
      const want_blur_pics = this.props.route.params && this.props.route.params.want_blur_pics;
      let showBlurPics = false;
      const isMatched = this.state.isMatched;
      if (want_blur_pics == commonText.yes) {
         showBlurPics = true
      }
      else if (want_blur_pics == commonText.no) {
         if (this.state.isUserSubscribed || isMatched === 1 || this.state.isReceiverLikedByYou || this.state.isReceiverIgnoredByYou) {
            showBlurPics = false
         }
         else {
            showBlurPics = true
         }
      }
      return showBlurPics;
   }

   /**component render method */
   render() {
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      const { loggedInUser_id } = userDetails
      const { InputToolbarHeight, isLoadingEarlier, loadEarlier } = this.state;
      const isMatched = this.state.isMatched;
      const isBlocked = this.props.route.params && this.props.route.params.is_blocked;
      const isBlockedByYou = this.props.route.params && this.props.route.params.is_blocked_by_you;
      let isShowData = this.getShowDataValue();
      let showBlurPics = this.getImageBlurValue();

      return (
         <>
            <View style={styles.container}>
               <NavigationEvents onWillBlur={() => {
                  this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
               }} />
               <Header
                  isBlurPhoto={showBlurPics}
                  backButton
                  activeOpacity={constants.activeOpacity}
                  onPressName={this.onPressProfilePic}
                  gender={this.state.gender}
                  isOnline={this.state.isOnline}
                  isMatched={isMatched == 1 ? true : false}
                  middleText={convetCapital(userDetails.name)}
                  onBackButtonPress={() => this.props.navigation.goBack()}
                  threeDotsView={true}
                  onPressThreeDots={this.onPressThreeDots}
                  isProfilePicView={true}
                  profilePicSource={userDetails.profile_pic}
                  onPressProfilePic={this.onPressProfilePic}
                  mainStyle={{ height: getHeight(90) }}
                  showTypingIndicator={this.state.isTyping}
                  isStarText={!isShowData}
               />
               <GiftedChat
                  messages={this.props.messages}
                  renderAvatar={null}
                  onSend={this.onSend}
                  alwaysShowSend={true}
                  showUserAvatar={false}
                  renderAvatarOnTop={false}
                  loadEarlier={loadEarlier}
                  renderSend={this.renderSend}
                  user={{ _id: loggedInUser_id }}
                  placeholder={commonText.typeMessagePlaceHolder}
                  showAvatarForEveryMessage={false}
                  renderMessage={this.renderMessage}
                  onLoadEarlier={this.onLoadEarlier}
                  textInputProps={{ multiline: true, }}
                  isLoadingEarlier={isLoadingEarlier}
                  listViewProps={{ marginBottom: isBlockedByYou || isBlocked ? 0 : 25, paddingHorizontal: 5, showsVerticalScrollIndicator: false, contentContainerStyle: { flexGrow: 1, }, bounces: false }}
                  renderComposer={this.renderComposer}
                  renderLoadEarlier={this.renderLoadEarlier}
                  minInputToolbarHeight={InputToolbarHeight}
                  minComposerHeight={50}
                  maxComposerHeight={130}
                  onInputTextChanged={() => {
                  }}
                  keyboardShouldPersistTaps={'never'}
               />
               {
                  <ReportUserModal
                     modalVisible={this.state.batchModalVisible}
                     headerTitle={commonText.howYouFinduser}
                     buttonTitle={'Assign'}
                     data={this.badgeData}
                     renderItem={this.renderAssignBadgeItem}
                     onPressReport={this.onPressReport}
                     onRequestClose={this.toggleBatchModal}
                  />
               }
            </View>
            {this.state.menuVisible
               ?
               <Modal
                  transparent={true}
                  onRequestClose={() => this.setState({ menuVisible: false })}
                  statusBarTranslucent
               >
                  <TouchableHighlight
                     activeOpacity={0}
                     style={{ flex: 1 }}
                     underlayColor={"transparent"}
                     onPress={() => this.setState({ menuVisible: false })}
                  >
                     <View style={styles.menuView}>
                        {
                           this.state.menuArray.map((obj, i) => {
                              return (
                                 <TouchableOpacity key={obj.id}
                                    delayPressIn={0} style={[{
                                       paddingHorizontal: 10,
                                       paddingVertical: 8,
                                    }, i == 0 ? {
                                       borderBottomWidth: 1, borderColor: colors.grayShade2
                                    } : {}]}
                                    onPress={obj.onPress} activeOpacity={constants.activeOpacity}>
                                    <Text style={[styles.menuTitle, { color: obj.color }]}>{obj.title}</Text>
                                 </TouchableOpacity>
                              )
                           })
                        }
                     </View>
                  </TouchableHighlight>
               </Modal>
               : null
            }
         </>
      );
   }

   /**action when report user is clicked */
   onPressReport = () => {
      if (this.props.selectedBadgeList.length) {
         const badge = Array.prototype.map.call(this.props.selectedBadgeList, function (item) { return item.title; }).join(",");
         const assigned_user_id = this.props.route.params && this.props.route.params.chat_user_id;
         const params = {
            badge, assigned_user_id
         }
         this.props.assignBadgeToUser(params);
         this.toggleBatchModal()
      }
      else {
         showSimpleAlert(commonText.assignBadgeWaringText)
      }
   }

   /**render assign badge  */
   renderAssignBadgeItem = ({ item, index }) => {
      let selected = false;
      let disabled = false;
      this.props.selectedBadgeList && this.props.selectedBadgeList.length
         ? this.props.selectedBadgeList.map((obj) => {
            if (obj.title === item.title) selected = true;
         })
         : null
      let badges = this.state.badges || [];
      if (badges && badges.length) {
         badges.map((obj) => {
            if (obj.badge == item.title) disabled = true;
         })
      }
      return (
         <TouchableOpacity
            activeOpacity={constants.activeOpacity}
            delayPressIn={0}
            disabled={disabled}
            onPress={() => this.onPressItem(item, index, selected)}
            style={[styles.modalWrap, { justifyContent: 'space-between' }]}
         >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <View style={[styles.deactive, selected ? { borderColor: colors.blueShade1, paddingLeft: 2 } : disabled ? { borderColor: colors.grayShadeDark } : {}]}>
                  {selected || disabled ? <Text style={{ fontSize: 14, fontFamily: fonts.muliBold, color: disabled ? colors.grayShadeDark : colors.blueShade1 }}>{'✓'}</Text> : null}
               </View>
               <Text style={[styles.reason, { paddingHorizontal: 10 }]}>{item.title}</Text>
            </View>
            {disabled ?
               <View style={{}}>
                  <Text style={styles.already}>{commonText.alreadyAssignText}</Text>
               </View>
               : null
            }
         </TouchableOpacity>
      )
   }

   /**set the assing badges to local state */
   setBadgeToState = (badges) => {
      this.setState({ badges: [...this.state.badges, ...badges] })
   }

   /**action for assign badge to user */
   onPressItem = (item, index, selected) => {
      let badge = item
      if (selected) this.props.chatRemoveBadgeFromList(badge)
      else this.props.chatAddBadgeToList(badge)
   }

   /**action when click on block user button */
   onPressBlockUser = async () => {
      const chat_user_id = this.props.route.params && this.props.route.params.chat_user_id;
      let blocked_user_id = chat_user_id;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const likeParams = this.props.route.params && this.props.route.params.likeParams
      const params = {
         blocked_user_id
      }
      this.setState({ menuVisible: false })
      await this.props.blockUser(params, isFromLike, likeParams)
   }

   /**action when user wants to unmatch  */
   onPressUnmatchUser = () => {
      const chat_user_id = this.props.route.params && this.props.route.params.chat_user_id;
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      let userName = convetCapital(userDetails.name)
      const params = {
         unmatch_user_id: chat_user_id
      }
      Alert.alert(
         constants.AppName,
         `${commonText.younolongerText} ${userName} ${commonText.andChatText} ${userName} ${commonText.willRemoveText}`,
         [
            {
               text: commonText.cancel,
               onPress: () => null,
            },
            {
               text: commonText.confirm,
               onPress: () => {
                  this.props.proformUnmatchUser(params)
                  this.setState({ menuVisible: false })
               }
            }
         ],
         {
            cancelable: false
         }
      )
   }

   /**toggle badge modal */
   toggleBatchModal = () => {
      this.setState({ batchModalVisible: !this.state.batchModalVisible })
      this.props.chatBadGeListReset()
   }

   /**action for send data to socket for chat */
   onlySendData = async () => {
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      if (userDetails) {
         const receiver_id = userDetails.chat_user_id;
         const messagesLength = await this.props.getMessagsList(receiver_id, 1);
         if (messagesLength < 20) this.setState({ loadEarlier: false });
         else this.setState({ loadEarlier: true });
      }
   }

   /**get the message list and set to screen */
   getAndSetMessages = async () => {
      const { page } = this.state;
      const userDetails = this.props.route.params && this.props.route.params.userDetails;
      if (userDetails) {
         const receiver_id = userDetails.chat_user_id;
         const messagesLength = await this.props.getMessagsList(receiver_id, page);
         if (messagesLength < 20) this.setState({ loadEarlier: false });
         else this.setState({ loadEarlier: true });
         this.setState({ page: page + 1, isLoadingEarlier: false })
      }
   }

   /**action for send message/image to opposite user */
   sendMessage = async (messages = []) => {
      let message = messages[0];
      const receiver_id = this.props.route.params?.chat_user_id ?? ''
      if (message) {
         const messageObj = {
            receiver_id, type: 0,
            is_read: this.state.isOnline ? 2 : 0,
            on_like: 0,
         };
         if (message.image) {
            const ext = message.image.substring(message.image.lastIndexOf(".") + 1);
            const fileName = `${Date.now()}.${ext}`;
            messageObj.type = 1;
            messageObj.image = {
               name: fileName,
               data: message.base64Data,
            };
         } else {
            if (!message.text.trim().length) return false;
            messageObj.text = message.text;
         }
         this.props.sendNewMessage(message);
         const response = await Socket.sendRequest('sendMessage', messageObj);
         if (response.code == 1) {
            this.onlySendData()
         }
      }
   }

   /** action fired when on press send button by sender */
   onSend = (messages = []) => {
      this.sendMessage(messages);
   }

   /**render send button component */
   renderSend = (props) => {
      const isBlocked = this.props.route.params && this.props.route.params.is_blocked;
      const isBlockedByYou = this.props.route.params && this.props.route.params.is_blocked_by_you;
      const isMatched = this.state.isMatched;
      if (this.state.isUserSubscribed) {
         if (isBlocked || isBlockedByYou) {
            return null;
         }
         else {
            return (
               <Send {...props}
                  sendButtonProps={{ delayPressIn: 0, activeOpacity: constants.activeOpacity, hitSlop: { top: 10, right: 10, bottom: 10, left: 10 } }}
               >
                  <View style={styles.sentIconStyle}>
                     <SvgIcon name={icons.chatSentIcon} height={20} width={21} />
                  </View>
               </Send>
            )
         }
      }
      else {
         if (isMatched) {
            if (isBlocked || isBlockedByYou) {
               return null;
            }
            else {
               return (
                  <Send {...props} sendButtonProps={{ delayPressIn: 0, activeOpacity: constants.activeOpacity, hitSlop: { top: 10, right: 10, bottom: 10, left: 10 } }}>
                     <View style={styles.sentIconStyle}>
                        <SvgIcon name={icons.chatSentIcon} height={20} width={21} />
                     </View>
                  </Send>
               )
            }
         }
         else {
            return null;
         }
      }
   }

   /**render custom message component */
   renderMessage = (props) => {
      const { route } = this.props;
      const { loggedInUser, isOnline } = this.state;
      let onlineUserProps = {
         isOnline: isOnline
      }
      return <CustomMessage {...props} navigationProps={route}
         userStateProps={loggedInUser}
         onlineUserProps={onlineUserProps}
      />;
   }

   /**action for load earlier messages */
   onLoadEarlier = () => {
      this.getAndSetMessages();
   }

   /**render custom composer component */
   renderComposer = (props) => {
      const isBlocked = this.props.route.params && this.props.route.params.is_blocked;
      const isBlockedByYou = this.props.route.params && this.props.route.params.is_blocked_by_you;
      const isMatched = this.state.isMatched;
      const inputAccessoryViewID = "doneBtn";
      if (this.state.isUserSubscribed) {
         if (isBlocked || isBlockedByYou) {
            return (
               <View style={styles.blockUserView}>
                  {isBlocked && !isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage1}</Text> : null}
                  {!isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage2}</Text> : null}
                  {isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage3}</Text> : null}
               </View>
            )
         }
         else {
            return (
               <View style={styles.composerViewWrap}>
                  <Composer
                     {...props}
                     placeholder={commonText.typeMessagePlaceHolder}
                     textInputProps={{
                        style: styles.composerText,
                        underlineColorAndroid: 'transparent',
                        inputAccessoryViewID: inputAccessoryViewID
                     }}
                  />
                  <CustomActions
                     {...props}
                     renderIcon={() => <SvgIcon name={icons.cameraGrayIcon} />}
                  />
                  {
                     Platform.OS === "ios" &&
                     <InputAccessoryView nativeID={inputAccessoryViewID}>
                        <View style={styles.inputAccessory}>
                           <Button onPress={() => Keyboard.dismiss()} title={commonText.done} />
                        </View>
                     </InputAccessoryView>
                  }
               </View>
            )
         }
      }
      else {
         if (isMatched) {
            if (isBlocked || isBlockedByYou) {
               return (
                  <View style={styles.blockUserView}>
                     {isBlocked && !isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage1}</Text> : null}
                     {!isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage2}</Text> : null}
                     {isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage3}</Text> : null}
                  </View>
               )
            }
            else {
               return (
                  <View style={styles.composerViewWrap}>
                     <Composer
                        {...props}
                        placeholder={commonText.typeMessagePlaceHolder}
                        textInputProps={{
                           style: styles.composerText,
                           underlineColorAndroid: 'transparent',
                           inputAccessoryViewID: inputAccessoryViewID
                        }}
                     />
                     <CustomActions
                        {...props}
                        renderIcon={() => <SvgIcon name={icons.cameraGrayIcon} />}
                     />
                     {
                        Platform.OS === "ios" &&
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                           <View style={styles.inputAccessory}>
                              <Button onPress={() => Keyboard.dismiss()} title={commonText.done} />
                           </View>
                        </InputAccessoryView>
                     }
                  </View>
               )
            }
         }
         else {
            if (isBlocked || isBlockedByYou) {
               return (
                  <View style={styles.blockUserView}>
                     {isBlocked && !isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage1}</Text> : null}
                     {!isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage2}</Text> : null}
                     {isBlocked && isBlockedByYou ? <Text style={styles.mediumText}>{commonText.blockedMessage3}</Text> : null}
                  </View>
               )
            }
            else {
               return (
                  <View style={styles.blockUserView}>
                     <Text style={styles.mediumText}>{commonText.notSubscribedTextMessage}</Text>
                  </View>
               )
            }
         }
      }
   }

   /**action for sending typing status  */
   isTypingApi = async (typing_value) => {
      const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      if (this.state.loggedInUser) {
         const params = {
            receiver_id: this.props.route.params?.chat_user_id ?? '',
            sender_id: userDetails.user_id,
            is_typing: typing_value
         }
         await this.props.sendTypingStatus(params)
      }
   }

   /**render load earlier component for get messages */
   renderLoadEarlier = (props) => {
      return <LoadEarlier label={'Click to load earlier messages'} {...props} />;
   }

   /**action for click 3 menu dots */
   onPressThreeDots = () => {
      this.setState({ menuVisible: true }, () => { })
   }

   /**action for click profile picture */
   onPressProfilePic = () => {
      const user_id = this.props.route.params?.chat_user_id ?? ''
      const isFromExplore = this.props.route.params?.isFromExplore ?? false
      const isMatched = this.state.isMatched;
      if (isFromExplore) {
      }
      else {
         if (isMatched) {
            this.props.navigation.navigate(commonText.exploreRoute, {
               user_id,
               isFromChat: true,
            })
         }
         else if (this.state.isUserSubscribed) {
            this.props.navigation.navigate(commonText.exploreRoute, {
               user_id,
               isFromChat: true,
            })
         }
         else if (this.state.isReceiverLikedByYou) {
            this.props.navigation.navigate(commonText.exploreRoute, {
               user_id,
               isFromChat: true,
            })
         }
         else {
            showSimpleAlert(commonText.notSubscribedTextMessage)
         }
      }
   }

   /**action when unblock user button is clicked */
   onPressUnblockUser = () => {
      let blocked_user_id = this.props.route.params && this.props.route.params.chat_user_id;
      const params = {
         blocked_user_id
      }
      this.props.unblockUserForLikeTab(params)
   }
}

export default ChatWindow;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white
   },
   sentIconStyle: {
      width: 48,
      height: 48,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.blueShade1,
      marginRight: 10,
      marginVertical: 10,
      borderRadius: 30,
   },
   composerViewWrap: {
      flex: 1,
      borderWidth: 2,
      maxHeight: 130,
      borderRadius: 30,
      paddingRight: 20,
      marginVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
      paddingHorizontal: 10,
      justifyContent: 'center',
      borderColor: colors.composerBorder,
   },
   composerText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 18,
      color: colors.black,
      alignItems: 'center',
      fontFamily: fonts.muli,
      minHeight: 50,
      paddingVertical: 5,
      paddingHorizontal: 5,
      paddingTop: Platform.OS == "ios" ? 15 : 5,
   },
   menuView: {
      position: 'absolute',
      backgroundColor: colors.white,
      right: 15,
      top: Platform.OS == "android" ? 70 : 80,
      borderWidth: 1,
      borderColor: colors.grayShade1,
      borderRadius: 10,
      zIndex: 99
   },
   menuTitle: {
      fontSize: 14,
      fontFamily: fonts.muliBold,
      color: colors.black,
   },
   modalWrap: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 5
   },
   deactive: {
      height: 20,
      width: 20,
      borderWidth: 1.5,
      backgroundColor: colors.transparent,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center'
   },
   reason: {
      fontSize: 16,
      fontFamily: fonts.muliSemiBold,
      color: colors.textColor,
   },
   already: {
      fontSize: 12,
      color: colors.grayShadeDark,
      fontFamily: fonts.muli
   },
   blockUserView: {
      flex: 1,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
   },
   mediumText: {
      fontSize: 18,
      fontFamily: fonts.muliSemiBold,
      color: colors.grayShadeDark
   },
   inputAccessory: {
      backgroundColor: colors.inputAccessoryBg,
      alignItems: "flex-end",
      paddingHorizontal: 5,
      height: 35,
   },
})
