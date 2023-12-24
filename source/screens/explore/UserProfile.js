import React, { Component } from 'react';
import {
   View,
   Text,
   StyleSheet,
   StatusBar,
   TouchableOpacity,
   ScrollView,
   FlatList,
   Animated,
   Modal,
   TouchableHighlight,
   BackHandler,
   Alert,
} from 'react-native';
import Socket from '../../api/Socket';
import { fonts, icons, } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { ActionButton, Header, Loader, QueAnsBox, SvgIcon, TitleHeader, CustomImage, LikePopup, ReportUserModal, } from '../../components';
import { calculate_age, convetCapital, showSimpleAlert } from '../../utils/HelperFunction';
import { getHeight } from '../../utils/iPhoneXHelper';
import { verticalScale } from '../../utils/scale';
import UserUtils from '../../utils/UserUtils';
import crashlytics from '@react-native-firebase/crashlytics';
export let userProfileRef;
import { getAbroadGoals, getMarraigeGoals } from '../profileSetup/UserMarriageGoal';
import { getPrayById } from '../profileSetup/UserPray';
import { getSpiritualityById } from '../profileSetup/UserSect';

/**User Profile Component */
class UserProfile extends Component {
   keyExtractor = (i, j) => j.toString();

   constructor(props) {
      super(props);
      userProfileRef = this;
      this.animatedValue3 = new Animated.Value(0)
   }
   /**report user-reason types list */
   reportContent = [
      {
         id: 1,
         reason: commonText.reportUserreason1
      },
      {
         id: 2,
         reason: commonText.reportUserreason2
      },
      {
         id: 3,
         reason: commonText.reportUserreason3
      },
      {
         id: 4,
         reason: commonText.reportUserreason4
      }
   ]

   /**like user data */
   likeData = null;

   state = {
      selectedResonIndex: null,
      selectedResonValue: "",
      showIcons: false,
      menuArray: [
         {
            id: 2,
            title: commonText.blockUserText,
            onPress: () => this.onPressBlockUser(),
            color: colors.black,
         },
         {
            id: 3,
            title: commonText.unblockUserText,
            onPress: () => this.onPressUnBlockUser(),
            color: colors.black,
         },
         {
            id: 1,
            title: commonText.reportuserText,
            onPress: () => { this.toggleReportModal(); this.setState({ menuVisible: false }) },
            color: colors.black,
         },
      ],
      menuVisible: false,
      reportModalVisible: false,
      region: {
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.4,
         longitudeDelta: 0.4,
      },
      userProfileDetails: [
         {
            id: "marital_status",
            value: "",
            icon: icons.maritalGrayIcon,
            iconHeight: 19,
            iconWidth: 15,
         },
         {
            id: "height",
            value: "",
            icon: icons.heightGrayIcon,
            iconHeight: 20,
            iconWidth: 14,
         },
         {
            id: "date_of_birth",
            value: "",
            isDate: true,
            icon: icons.cakeGrayIcon,
            iconHeight: 20,
            iconWidth: 17,
         },
         {
            id: "distance",
            isDistance: true,
            value: "",
            icon: icons.locationGrayIcon,
            iconHeight: 19,
            iconWidth: 16,
         },
      ],
      userProfileMainArray: [
         {
            id: "educations",
            value: "",
            icon: icons.educationGrayIcon,
            isEducation: true,
            iconHeight: 11,
            iconWidth: 15,
         },
         {
            id: "profession_name",
            value: "",
            icon: icons.professionGrayIcon,
            iconHeight: 10,
            iconWidth: 11,
         },
         {
            id: "spirituality",
            value: "",
            icon: icons.islamGrayIcon,
            iconHeight: 13,
            iconWidth: 13,
         },
         {
            id: "ethnicity",
            value: "",
            icon: icons.islamGrayIcon,
            iconHeight: 13,
            iconWidth: 13,
         },
         {
            id: "pray",
            value: "",
            icon: icons.prayIconGray,
            iconHeight: 16,
            iconWidth: 16,
         },
         {
            id: "country_name",
            value: "",
            icon: icons.ethnicityGrey,
            iconHeight: 13,
            iconWidth: 13,
         },
         {
            id: "marriage_goal",
            value: "",
            icon: icons.calanderGrayIcon,
            isGoal: true,
            iconHeight: 12,
            iconWidth: 12,
         },
      ],
      profilePicAndQueAnsArray: [
         {
            id: "",
            position: 2,
            profilePic: "",
            question: "",
            answer: "",
         },
         {
            id: "",
            position: 3,
            profilePic: "",
            question: "",
            answer: "",
         },
         {
            id: "",
            position: 4,
            profilePic: "",
            question: "",
            answer: "",
         },
         {
            id: "",
            position: 5,
            profilePic: "",
            question: "",
            answer: "",
         },
         {
            id: "",
            position: 6,
            profilePic: "",
            question: "",
            answer: "",
         },
      ],
      visible: false,
      likeVisible: false,
      scrollDone: false,
      isMale: false,
   }

   /**componet life cycle method */
   async componentDidMount() {
      crashlytics().log('UserProfile Tab mounted.');
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

      const userProfileDetails = await UserUtils.getUserDetailsFromAsyncStorage();
      let isMale = userProfileDetails.gender == commonText.male ? false : true;
      this.setState({ isMale })
      this.props.resetData()
      this.props.exploreSetEmptyData()
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification;
      if (isFromNotification) {
         let user_id = this.props.route.params && this.props.route.params.user_id
         await this.props.getLikeTabUserProfiles({ user_id: Number(user_id) });
         const { is_blocked_by_you, is_matched } = this.props.userProfileDetails;
         if (is_matched == 1) {
            this.state.menuArray.push({
               id: 4,
               title: commonText.unmatchUser,
               onPress: () => {
                  this.onPressUnmatchUser()
               },
               color: colors.black,
            })
         }
         if (is_blocked_by_you) {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.blockUserText) })
         }
         else {
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.unblockUserText) })
         }
      }
   }

   /**get the details for display users in explore screen */
   getDetailsOFOppositeGender = async (params) => {
      params.per_page = 2
      params.offset = 0;
      await this.props.getOppositeGenderDetails(params)
      this.scrollRef.scrollTo({ x: 0 })
   }

   /**handle back press event */
   handleBackPress = () => {
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification;
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch;
      if (isFromNotification) {
         this.props.navigation.navigate(commonText.noticationsRoute)
         return true;
      }
      else if (isFromMatch) {
         this.props.navigation.navigate(commonText.matchesRoute)
         return true;
      }
      else {
         this.props.navigation.goBack()
      }
   }

   /**componet render method */
   render() {
      let blurPhoto = this.props.userProfileDetails && this.props.userProfileDetails.want_blur_pics
         ? this.props.userProfileDetails.want_blur_pics == commonText.yes ? true : false : null;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      const isMessageButton = this.props.route.params && this.props.route.params.isMessageButton
      let dataLength = Object.keys(this.props.userProfileDetails).length;
      return (
         <>
            <View style={styles.container}>
               <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
               <Header
                  showShadow={this.state.scrollDone ? true : false}
                  backButton={isFromLike || isFromChat || isFromNotification || isFromMatch ? true : false}
                  onBackButtonPress={this.handleBackPress}
                  leftIcon={icons.filterBlueIcon}
                  leftIconPress={this.onFilterIconPress}
                  middleText={isFromLike || isFromChat || isFromNotification || isFromMatch ? this.props.userProfileDetails && this.props.userProfileDetails.name && convetCapital(this.props.userProfileDetails.name) : this.state.scrollDone ? this.props.userProfileDetails && this.props.userProfileDetails.name && convetCapital(this.props.userProfileDetails.name) || commonText.exploreTitle : commonText.exploreTitle}
                  threeDotsView={Object.keys(this.props.userProfileDetails).length > 0 ? true : false}
                  onPressThreeDots={this.onPressThreeDots}
                  middleTextStyle={isFromLike || isFromChat || isFromNotification || isFromMatch ? { fontSize: 25 } : this.state.scrollDone ? { fontSize: 25 } : {}}
                  mainStyle={Object.keys(this.props.userProfileDetails).length > 0 ? { height: getHeight(75) } : { height: getHeight(75) }}
               />
               {
                  this.props.loading ?
                     <Loader loading={this.props.loading} />
                     :
                     <>
                        <>
                           <ScrollView
                              onScroll={this.handleScroll}
                              contentContainerStyle={{ flexGrow: 1, paddingBottom: isFromChat || isFromLike || isFromNotification ? 50 : 130, paddingTop: 10 }}
                              bounces={false}
                              showsVerticalScrollIndicator={false}
                              nestedScrollEnabled
                              ref={(ref) => this.scrollRef = ref}
                           >
                              <View style={styles.mainWrapView}>
                                 <FlatList
                                    data={this.state.profilePicAndQueAnsArray}
                                    keyExtractor={this.keyExtractor}
                                    extraData={this.props || this.state}
                                    bounces={false}
                                    renderItem={this.renderPicAndQueAnsItem}
                                    contentContainerStyle={{ flexGrow: 1 }}
                                    ListHeaderComponent={this.renderHeaderComponent}
                                    ListFooterComponent={this.renderFooterComponent}
                                 />
                              </View>
                           </ScrollView>
                           {Object.keys(this.props.userProfileDetails).length ? <View>
                              {
                                 isFromLike ?
                                    isMessageButton ?
                                       <ActionButton isMessage mainStyle={{ bottom: 30 }}
                                          onPressActionButton={this.onPressMessageButton}
                                       />
                                       : null
                                    :
                                    isFromChat || isFromNotification | isFromMatch ? null :
                                       <ActionButton isCross
                                          onPressActionButton={this.onCrossButtonPress}
                                       />
                              }
                           </View> : null}
                        </>
                        {/* } */}
                        <LikePopup
                           visible={this.state.likeVisible}
                           likeData={this.likeData}
                           onRequestClose={this.onRequestClose}
                           isBlurPhoto={blurPhoto}
                        />
                        <ReportUserModal
                           modalVisible={this.state.reportModalVisible}
                           headerTitle={commonText.reportuserText}
                           onRequestClose={this.toggleReportModal}
                           renderItem={this.renderModalItems}
                           data={this.reportContent}
                           onPressReport={this.onPressReport}
                           buttonTitle={'Report'}
                        />
                     </>
               }
            </View>
            <>
               {this.state.menuVisible ?
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
                                       delayPressIn={0} style={[{ paddingHorizontal: 10, paddingVertical: 8, },
                                       i == 0 ? {
                                          borderBottomWidth: 1,
                                          borderColor: colors.grayShade2
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
                  : null}
            </>
         </>
      );
   }

   /**handle scrolling event */
   handleScroll = (event) => {
      if (event.nativeEvent.contentOffset.y > 0) {
         this.setState({ scrollDone: true, menuVisible: false, showIcons: false })
      }
      else if ((event.nativeEvent.contentOffset.y == 0)) {
         this.setState({ scrollDone: false })
      }
   }

   goToNext = () => {
      this.props.navigation.navigate(commonText.likeCommentRoute)
   }

   /**render component header portion */
   renderHeaderComponent = () => {
      crashlytics().log('UserProfile Header component');
      let headerImageUrl = null;
      let photoId;
      this.props.userProfileDetails && this.props.userProfileDetails.pictures
         && this.props.userProfileDetails.pictures.length
         &&
         this.props.userProfileDetails.pictures.map((obj) => {
            if (obj.position === 1) {
               headerImageUrl = obj.profile_pic;
               photoId = obj.profile_photo_id;
            }
         })
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      this.state.userProfileDetails.map((obj) => {
         if (obj.isDate) {
            obj.value = this.props.userProfileDetails ? calculate_age(this.props.userProfileDetails.date_of_birth) : ""
         }
         else if (obj.isDistance) {
            obj.value = this.props.userProfileDetails && Object.keys(this.props.userProfileDetails).length > 0 && this.props.userProfileDetails.distance != null ? this.props.userProfileDetails.distance.toFixed(2).toString() + " miles" : "Not Available"
         }
         else {
            obj.value = this.props.userProfileDetails ? this.props.userProfileDetails[obj.id] : ""
         }
      })
      this.state.userProfileMainArray.map((obj) => {
         if (obj.isEducation) {
            obj.value = this.props.userProfileDetails[obj.id] && this.props.userProfileDetails[obj.id].length
               ? Array.prototype.map.call(this.props.userProfileDetails[obj.id], function (item) { return item.education_degree; }).join(", ") // "A,B,C"
               : ""
         }
         else if (obj.id == "marriage_goal") {
            let marriagegoal = this.props.userProfileDetails ? getMarraigeGoals(this.props.userProfileDetails.marriage_goal) : "";
            let abroadgoal = this.props.userProfileDetails ? getAbroadGoals(this.props.userProfileDetails.abroad_goal) : "";
            obj.value = marriagegoal + ', ' + abroadgoal;
         }
         else if (obj.id == "spirituality") {
            obj.value = this.props.userProfileDetails && this.props.userProfileDetails[obj.id] != null && this.props.userProfileDetails[obj.id] != undefined ?
               getSpiritualityById(this.props.userProfileDetails[obj.id])
               : ""
         }
         else if (obj.id == "pray") {
            obj.value = this.props.userProfileDetails && this.props.userProfileDetails[obj.id] != null && this.props.userProfileDetails[obj.id] != undefined ?
               getPrayById(this.props.userProfileDetails[obj.id])
               : ""
         }
         else {
            if (obj.id != "marriage_goal" && obj.id != "educations") obj.value = this.props.userProfileDetails ? this.props.userProfileDetails[obj.id] : ""
         }
      })
      let blurPhoto = this.props.userProfileDetails && this.props.userProfileDetails.want_blur_pics
         ? this.props.userProfileDetails.want_blur_pics == commonText.yes ? true : false : null;

      return (
         <View style={styles.headerTopView}>
            {
               !this.state.scrollDone && !isFromChat && !isFromNotification && !isFromMatch && !isFromLike ? <TitleHeader
                  mainStyle={styles.userNameView}
                  numberOfLinesForTitle={4}
                  title={this.props.userProfileDetails && this.props.userProfileDetails.name ? convetCapital(this.props.userProfileDetails.name) : ""} />
                  :
                  null
            }
            {headerImageUrl ? <View style={styles.topImageView}>
               <CustomImage
                  isMale={this.state.isMale}
                  source={headerImageUrl}
                  isLikeButton={isFromLike || isFromChat || isFromNotification || isFromMatch ? false : true}
                  isBlurPhoto={blurPhoto}
                  onPressLike={() => this.onPressLikeButton(headerImageUrl, photoId)}
               />
            </View> : null}
            {
               this.props.userProfileDetails && Object.keys(this.props.userProfileDetails).length > 0 ?
                  <View style={styles.middleWrapView}>
                     {
                        this.state.userProfileDetails.map((obj, j) => {
                           return (
                              <>
                                 <View style={styles.innerWrap}>
                                    {obj.icon ? <SvgIcon name={obj.icon} height={obj.iconHeight} width={obj.iconWidth} /> : null}
                                    <Text style={styles.smallText}>{obj.value || ""}</Text>
                                 </View>
                                 {<View style={[styles.divider, j == this.state.userProfileDetails.length - 1 ? { width: 0 } : {}]} />}
                              </>
                           )
                        })
                     }
                  </View>
                  : null
            }
            {
               this.props.userProfileDetails && Object.keys(this.props.userProfileDetails).length > 0
                  ? <View style={styles.mainWrapStyle}>
                     {
                        this.state.userProfileMainArray.map((obj) => {
                           return (
                              <View style={styles.itemView}>
                                 { obj.icon ? <SvgIcon name={obj.icon} height={obj.iconHeight + 2} width={obj.iconWidth + 2} /> : null}
                                 <Text style={styles.itemText}>{obj.value}</Text>
                              </View>
                           )
                        })
                     }
                  </View>
                  : null
            }
         </View>
      )
   }
   /**
       * 
       * @param {*} param0 
       * @render user profile picture and question and answer protion
       */
   renderPicAndQueAnsItem = ({ item }) => {
      let profilePic = item.profilePic;
      let questionTag = "";
      let answerTag = "";
      let photoId;
      let questionId;

      this.props.userProfileDetails && this.props.userProfileDetails.pictures && this.props.userProfileDetails.pictures.length
         && this.props.userProfileDetails.pictures.map((obj) => {
            if (obj.position == item.position) {
               profilePic = obj.profile_pic ? obj.profile_pic : "";
               photoId = obj.profile_photo_id
            }
         })
      this.props.userProfileDetails && this.props.userProfileDetails.questions && this.props.userProfileDetails.questions.length
         && this.props.userProfileDetails.questions.map((obj) => {
            if (obj.position == item.position - 1) {
               questionTag = obj.question ? obj.question : "";
               answerTag = obj.answer ? obj.answer : "";
               questionId = obj.question_id
            }
         })
      let blurPhoto = this.props.userProfileDetails && this.props.userProfileDetails.want_blur_pics
         ? this.props.userProfileDetails.want_blur_pics == commonText.yes ? true : false : null;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      return (
         <View style={styles.mainPicStyle}>
            {profilePic ? <CustomImage
               source={profilePic}
               isMale={this.state.isMale}
               isLikeButton={isFromLike || isFromChat || isFromNotification || isFromMatch ? false : true}
               isBlurPhoto={blurPhoto}
               onPressLike={() => this.onPressLikeButton(profilePic, photoId)}
            /> : null}
            {questionTag ? <QueAnsBox
               isLikeButton={isFromLike || isFromChat || isFromNotification || isFromMatch ? false : true}
               title={questionTag}
               description={answerTag}
               onPressLike={() => this.onPressLikeButton(null, null, questionTag, answerTag, questionId, true)}
            /> : null}
         </View>
      )
   }

   /**render component footer portion */
   renderFooterComponent = () => {
      let aboutUserDescription = "";
      aboutUserDescription = this.props.userProfileDetails && this.props.userProfileDetails.description
         ? this.props.userProfileDetails.description : "";
      let badges = this.props.userProfileDetails && this.props.userProfileDetails.badges && this.props.userProfileDetails.badges.length
         ? this.props.userProfileDetails.badges
         : [];
      return (
         <View style={{ paddingBottom: 10 }}>
            {aboutUserDescription ? <QueAnsBox
               title={commonText.aboutMeText.toUpperCase()}
               description={aboutUserDescription}
               titleStyle={{ color: colors.blueShade1 }}
               descStyle={{ fontSize: 18 }}
            /> : null}
            {badges && badges.length ?
               <View style={styles.batchView}>
                  {
                     badges && badges.length ? badges.map((obj) => {
                        let icon, iconHeight, iconWidth;
                        if (obj.badge == "Recommended") {
                           icon = icons.recommandIcon;
                           iconHeight = 22;
                           iconWidth = 20
                        }
                        else if (obj.badge == "Serious") {
                           icon = icons.seroiusIcon
                           iconHeight = 20;
                           iconWidth = 20
                        }
                        else if (obj.badge == "Polite") {
                           icon = icons.politeIcon
                           iconHeight = 20;
                           iconWidth = 20
                        }
                        return (
                           <View style={styles.iconView}>
                              {icon ?
                                 <View style={styles.svgView}>
                                    <SvgIcon name={icon} height={iconHeight + 2} width={iconWidth + 2} />
                                 </View>
                                 : null
                              }
                              <Text style={[styles.badge, { flex: 1 }]}>{obj.badge}</Text>
                              <Text style={styles.count}>({obj.count})</Text>
                           </View>
                        )
                     })
                        : null
                  }
               </View>
               : null
            }
         </View>
      )
   }

   /**render modal component items */
   renderModalItems = ({ item, index }) => {
      return (
         <TouchableOpacity
            activeOpacity={constants.activeOpacity}
            delayPressIn={0}
            onPress={() => this.onPressItem(item, index)}
            style={styles.modalWrap}
         >
            <View style={styles.deactive}>
               {this.state.selectedResonIndex == index && <View style={styles.reasonView} />}
            </View>
            <Text style={[styles.reason, { paddingHorizontal: 10 }]}>{item.reason}</Text>
         </TouchableOpacity>
      )
   }

   /**action handling for report user reason click */
   onPressItem = (item, index) => {
      this.setState({
         selectedResonIndex: index,
         selectedResonValue: item.reason
      })
   }

   /**action for filter icon click */
   onFilterIconPress = () => {
      this.props.navigation.navigate(commonText.filterRoute)
   }

   /**action for 3 menu dots click */
   onPressThreeDots = () => {
      this.setState({ menuVisible: true }, () => {
      })

   }

   /**action for click like button */
   onPressLikeButton = (imageurl, imageid, question, answer, questionid, isQuestion) => {
      this.setState({ likeVisible: true });
      let liked_user_id = this.props.userProfileDetails && this.props.userProfileDetails.user_id;
      let headetitle = this.props.userProfileDetails && this.props.userProfileDetails.name
      let data = { liked_user_id, headetitle }
      if (isQuestion) data = { ...data, question, answer, questionid, isQuestion }
      else data = { ...data, imageid, imageurl }

      this.likeData = data;
      this.forceUpdate()
   }

   /**action for request to close modal component */
   onRequestClose = () => {
      this.setState({ likeVisible: false })
   }

   onPressSendLike = () => {
   }

   /**action handling for cross button click(Ingore user) */
   onCrossButtonPress = async () => {
      let ignored_user_id = this.props.userProfileDetails.user_id;
      const params = {
         ignored_user_id
      }
      await this.props.ignoreProfile(params)
   }

   /**action for unmatch user */
   onPressUnmatchUser = () => {
      let userName = this.props.userProfileDetails && this.props.userProfileDetails.name && convetCapital(this.props.userProfileDetails.name)
      let user_id = this.props.route.params && this.props.route.params.user_id;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      let arrayName = this.props.route.params && this.props.route.params.arrayName;
      let apiName = this.props.route.params && this.props.route.params.apiName;
      const params = {
         unmatch_user_id: user_id
      }
      let likeParams = {
         arrayName, apiName, page_no: 1
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
                  this.props.proformUnmatchUser(params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams)
                  this.setState({ menuVisible: false })
               }
            }
         ],
         {
            cancelable: false
         }
      )

   }

   /**handling for block user button */
   onPressBlockUser = async () => {
      let blocked_user_id = this.props.userProfileDetails.user_id;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      let arrayName = this.props.route.params && this.props.route.params.arrayName;
      let apiName = this.props.route.params && this.props.route.params.apiName;
      const params = {
         blocked_user_id
      }
      let likeParams = {
         arrayName, apiName, page_no: 1
      }
      this.setState({ menuVisible: false })
      await this.props.blockUser(params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch)
   }

   /**action for toggle report modal */
   toggleReportModal = () => {
      this.setState({
         reportModalVisible: !this.state.reportModalVisible,
         selectedResonIndex: null,
         selectedResonValue: ""
      })
   }

   /**action for report user */
   onPressReport = async () => {
      const { selectedResonIndex, selectedResonValue } = this.state;
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
      let arrayName = this.props.route.params && this.props.route.params.arrayName;
      let apiName = this.props.route.params && this.props.route.params.apiName;

      if (!selectedResonIndex && selectedResonIndex == null && selectedResonValue == "") {
         showSimpleAlert(commonText.selectReasonMessage)
      }
      else {
         let reported_user_id = this.props.userProfileDetails.user_id;
         const params = {
            reported_user_id, reason: selectedResonValue
         }
         let likeParams = {};
         if (isFromLike) {
            likeParams = {
               arrayName, apiName, page_no: 1
            }
         }
         this.toggleReportModal()
         await this.props.reportUser(params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch)
      }
   }

   /**componet life cycle method */
   componentWillUnmount() {
      this.props.resetData()
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
   }

   /**action for message button click */
   onPressMessageButton = async () => {
      const method_name = 'loginChat';
      const loggedInUser = await UserUtils.getUserDetailsFromAsyncStorage();
      let user_id = this.props.route.params && this.props.route.params.user_id;
      const responseObj = await Socket.sendRequest(method_name, { receiver_id: user_id });
      let headerImageUrl;
      let name = this.props.userProfileDetails && this.props.userProfileDetails.name;
      let badges = this.props.userProfileDetails && this.props.userProfileDetails.badges;
      let is_matched = this.props.userProfileDetails && this.props.userProfileDetails.is_matched;
      this.props.userProfileDetails && this.props.userProfileDetails.pictures
         && this.props.userProfileDetails.pictures.length &&
         this.props.userProfileDetails.pictures.map((obj) => {
            if (obj.position === 1) {
               headerImageUrl = obj.profile_pic;
            }
         })
      if (responseObj.code === 1) {
         const id = responseObj.data.user_id;
         const userProfileDetails = {
            id,
            chat_user_id: user_id,
            profile_pic: headerImageUrl,
            name,
            loggedInUser_id: loggedInUser.user_id,
            badges,
            is_matched,
         }
         this.props.navigation.navigate(commonText.chatWindowRoute, {
            userProfileDetails,
            id,
            chat_user_id: user_id,
            profile_pic: headerImageUrl,
            name,
            loggedInUser_id: loggedInUser.user_id,
            badges,
            is_matched,
            isFromExplore: true,
         });
      }
   }

   onPressUnBlockUser = () => {
      let user_id = this.props.route.params && this.props.route.params.user_id;
      let arrayName = this.props.route.params && this.props.route.params.arrayName;
      let apiName = this.props.route.params && this.props.route.params.apiName;
      const isFromChat = this.props.route.params && this.props.route.params.isFromChat
      const isFromLike = this.props.route.params && this.props.route.params.isFromLike;
      const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification;
      const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch;
      const params = {
         blocked_user_id: user_id,
         apiName,
         arrayName,
      }
      this.props.unblockUserForLikeTab(params, isFromLike, isFromChat, isFromNotification, isFromMatch)
   }

}

export default UserProfile;

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white,
   },
   underDevelopment: {
      textAlign: 'center',
      fontSize: 25,
      fontFamily: fonts.sukhumvitSetBold
   },
   menuTitle: {
      fontSize: 14,
      fontFamily: fonts.muliBold,
      color: colors.black,
   },
   menuView: {
      position: 'absolute',
      backgroundColor: colors.white,
      right: 15,
      top: 80,
      borderWidth: 1,
      borderColor: colors.grayShade1,
      borderRadius: 10,
      zIndex: 1
   },
   mainWrapView: {
      flex: 1
   },
   topImageView: {
   },
   userNameView: {
      alignItems: 'flex-start',
      marginHorizontal: 20,
      marginVertical: 10,
   },
   headerTopView: {
   },
   middleWrapView: {
      flex: 1,
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder2,
      borderRadius: 10,

      shadowColor: colors.grayShade1,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 3,

      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff'
   },
   smallText: {
      fontSize: 12,
      fontFamily: fonts.muliSemiBold,
      color: colors.black,
      paddingTop: 5,
   },
   divider: {
      width: 1,
      height: '75%',
      backgroundColor: colors.grayShade1
   },
   innerWrap: {
      flex: 1,
      alignItems: 'center',
      height: '100%',
      justifyContent: 'center',
      paddingVertical: 15,
   },
   mainWrapStyle: {
      flex: 1,
      marginHorizontal: 20,
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder2,
      borderRadius: 10,
      paddingVertical: 10,
      shadowColor: colors.grayShade1,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 3,

      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff'
   },
   itemView: {
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 10,
   },
   itemText: {
      fontSize: 14,
      fontFamily: fonts.muliSemiBold,
      color: colors.black,
      paddingLeft: 15,
   },
   mainPicStyle: {
      flex: 1,
      marginTop: 20
   },
   batchView: {
      flex: 1,
      marginHorizontal: 20,
      marginTop: 20,
      paddingVertical: 20,
      borderWidth: 1,
      borderColor: colors.inputBorder2,
      borderRadius: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',

      shadowColor: colors.grayShade1,
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 3,

      shadowOffset: {
         height: 10,
         width: 0,
      },
      backgroundColor: '#fff'
   },
   badge: {
      fontSize: 15,
      fontFamily: fonts.muliSemiBold,
      color: colors.black,
      paddingVertical: 2,
      textAlign: 'center'
   },
   count: {
      fontSize: 15,
      fontFamily: fonts.muli,
      color: colors.blueShade1,
   },
   reason: {
      fontSize: 16,
      fontFamily: fonts.muliSemiBold,
      color: colors.textColor,
   },
   modalWrap: {
      flexDirection: 'row', alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 5
   },
   deactive: {
      height: 15,
      width: 15,
      borderRadius: 20,
      borderWidth: 1,
      backgroundColor: colors.transparent,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center'
   },
   emptyView: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10
   },
   emptyText: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: fonts.muliSemiBold,
      color: colors.grayShadeDark
   },
   animatedView: {
      position: 'absolute',
      justifyContent: 'flex-end',
      paddingVertical: verticalScale(5),
      right: 30,
      zIndex: 99,
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.borderColorWhite,
      borderRadius: 5,
      elevation: 5,
      shadowColor: colors.grayShade1,
      shadowOpacity: 1,
      shadowRadius: 6,
      shadowOffset: {
         height: 3,
         width: 0,
      },
   },
   iconView: {
      alignItems: 'center',
      justifyContent: 'center', paddingBottom: 0
   },
   svgView: {
      height: 30, width: 30,
      alignItems: 'center', justifyContent: 'center'
   },
   reasonView: {
      height: 8, width: 8, borderRadius: 10,
      backgroundColor: colors.blueShade1
   }
})