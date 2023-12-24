import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Switch, FlatList, TouchableOpacity, Platform, BackHandler, } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, icons, fonts } from '../../assets';
import { CustomButton, TitleHeader, Loader, TitleDescription } from '../../components';
import SvgIcon from '../../components/SvgIcon'
import Header from '../../components/Header';
import ImageCropPicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import { connectActionSheet } from '@expo/react-native-action-sheet'
import { showSimpleAlert } from '../../utils/HelperFunction';
import CustomAlertBox from '../../components/CustomAlertBox';
import { buttonTheme } from '../../components/CustomButton';
import DefaultImage from '../../components/DefaultImage';

export let profilePicRef;
/**Profile Pic screen component */
class ProfilePics extends Component {
   selectedButtonIndex = null;
   constructor(props) {
      super(props);
      profilePicRef = this
      this.state = {
         isEnabled: false,
         selectedImage: null,
         data: [
            {
               profilePic: '',
               position: 1,
               loading: false,
            },
            {
               profilePic: '',
               position: 2,
               loading: false,
            },
            {
               profilePic: '',
               position: 3,
               loading: false,
            },
            {
               profilePic: '',
               position: 4,
               loading: false,
            },
            {
               profilePic: '',
               position: 5,
               loading: false,
            },
            {
               profilePic: '',
               position: 6,
               loading: false,
            },
         ],
         cancelPressed: false,
         profile_photo_id: '',
         visible: false,
         showWarning: false,
         selectedPicIndex: null,
         imageSize: null,
      };
   }

   /**componet life cycle method */
   async componentDidMount() {
      await this.props.getUserProfileData();
      this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
      this.subscribeBlur = this.props.navigation.addListener('blur', this.onScreenBlur);
   }

   /**reset all data */
   resetAllData = () => {
      this.state.data.map((obj) => obj.loading = false);
      this.state.data.map((obj) => obj.profilePic = "");
      this.setState({ data: this.state.data }, () => console.log('"Datta-->', this.state.data))
   }

   /**action when screen blur */
   onScreenBlur = () => {
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
   }
   /**componet life cycle method */
   componentWillUnmount() {
      this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
      this.subscribeBlur()
   }

   /**back button handling */
   androidBackPress = async () => {
      if (this.props.route.params && this.props.route.params.isFromSettingStack) {
         if (this.props.userProfileSetupDetails.pictures && this.props.userProfileSetupDetails.pictures.length !== 6) {
            showSimpleAlert(commonText.pleaseSelectAllImage)
         }
         else {
            this.props.navigation.goBack();
         }
      }
      else {
         this.props.navigation.goBack();
      }
      return true;
   }

   /**componet render method */
   render() {
      return (
         <View style={styles.container}>
            <Header
               theme={0}
               backButton
               onBackButtonPress={() => { this.androidBackPress() }}
               middleText={commonText.profileSetUp} />
            <TitleHeader mainStyle={{ marginTop: 30 }} title={commonText.photos} />
            <TitleDescription description={"(Profile photos allowed up to 8 MB)"} />
            <View style={{ flex: 0.9 }}>
               <FlatList
                  style={{ flex: 1, }}
                  contentContainerStyle={styles.flatlistContainer}
                  data={this.state.data}
                  renderItem={this.renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  bounces={false}
                  showsVerticalScrollIndicator={false}
                  extraData={this.state.data}
                  numColumns={3}
                  ListFooterComponent={this.footer}
               />
            </View>
            <View style={styles.submitView}>
               <CustomButton
                  title={commonText.submit}
                  onPress={this.onPressSubmit}
               />
            </View>
            {this.state.visible
               ?
               <CustomAlertBox
                  visible={this.state.visible}
                  message="Are you sure you want to delete this image?"
                  cancelText="No"
                  okayText="Yes"
                  onPressLeftView={() => this.onPressLeftView(0)}
                  onPressRightView={() => this.onPressLeftView(1)}
                  onRequestClose={() => { this.setState({ visible: false }, () => { this.selectedButtonIndex = null }) }}
                  theme={this.selectedButtonIndex === 0 ? buttonTheme.dark : buttonTheme.light}
                  themeSecond={this.selectedButtonIndex === 1 ? buttonTheme.dark : buttonTheme.light}
               />
               : null}
            <Loader loading={this.props.loading} />
         </View>

      );
   }

   /**render method for component footer portion */
   footer = () => {
      return (
         <>
            <View style={styles.blurPicView}>
               <Text style={styles.blurText}>{commonText.blurMyPhotoText}</Text>
               <Switch
                  trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                  thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                  onValueChange={this.toggleSwitch}
                  value={this.state.isEnabled}
                  style={[styles.switchStyle]}
               />
            </View>
            {
               this.state.showWarning ?
                  <View style={styles.warningMainWrap}>
                     <View style={styles.warningInnerWrap}>
                        <SvgIcon name={icons.infoIcon} height={20} width={20} />
                     </View>
                     <View style={styles.infoView} >
                        <Text style={styles.infoText}>{commonText.infoText}</Text>
                        <Text style={styles.blurPhotoView}>{commonText.blurPhotoWarning}</Text>
                     </View>
                  </View>
                  : null
            }
         </>
      )
   }

   /**handle toggle switch */
   toggleSwitch = () => {
      this.setState({ isEnabled: !this.state.isEnabled }, () => {
         if (this.state.isEnabled) {
            this.setState({
               showWarning: true,
            })
         }
         else {
            this.setState({
               showWarning: false,
            })
         }
      })
   }

   /**render all profile picture images */
   renderItem = ({ item, index }) => {
      let profilePic = item.profilePic;
      let profile_photo_id;
      let loaderStatus = item.loading;
      if (this.props.userProfileSetupDetails) {
         if (this.props.userProfileSetupDetails.pictures && this.props.userProfileSetupDetails.pictures.length) {
            this.props.userProfileSetupDetails.pictures.map((obj) => {
               if (obj.position === item.position) {
                  profilePic = obj.profile_pic;
                  profile_photo_id = obj.profile_photo_id;
                  loaderStatus = false;
               }
            })
         }
      }
      if (profilePic == "") {
         return (
            <View style={{ flex: 1 }}>
               {
                  loaderStatus ?
                     <View style={[styles.boxStyle, { alignSelf: 'center', alignItems: 'center', }]}>
                        <Text style={styles.uploadingText}>{commonText.uploadingText}</Text>
                        <Progress.Bar
                           indeterminate={true}
                           color={colors.blueShade1}
                           width={75}
                           animationType={'spring'}
                           borderRadius={10}
                        />
                     </View>
                     :
                     <TouchableOpacity
                        disabled={loaderStatus}
                        activeOpacity={constants.activeOpacity}
                        delayPressIn={0} style={styles.boxStyle} onPress={() => this.onPressImage(item, index)}>
                        <Image style={styles.addImageStyle} resizeMode={'contain'} source={images.add} />
                        <Text style={styles.addPhotoText}>{commonText.addPhoto}</Text>
                     </TouchableOpacity>
               }
            </View>
         )
      }
      else {
         return (
            <View style={{ flex: 1 }}>
               <DefaultImage
                  source={profilePic}
                  onPressDeleteProfile={() => this.onPressDeleteProfile(profile_photo_id, index)}
               />
            </View>
         )
      }
   }

   /**click event when delete icon is pressed */
   onPressDeleteProfile = (profile_photo_id, selectedPicIndex) => {
      this.setState({ cancelPressed: true, profile_photo_id, visible: true, selectedPicIndex })
   }

   /**click event for  button press */
   onPressLeftView = (id) => {
      this.selectedButtonIndex = id;
      this.forceUpdate();
      if (id === 1) {
         this.setState({ visible: false }, () => {
            this.selectedButtonIndex = null
         })
      }
      if (id === 0) {
         const params = {
            profile_photo_id: this.state.profile_photo_id
         }
         this.props.deleteProfilePicture(params);
         this.state.data[this.state.selectedPicIndex].loading = false;
         this.setState({
            visible: false, cancelPressed: false,
            data: this.state.data
         }, () => {
            this.selectedButtonIndex = null
         })
      }
   }

   /**click event for image press */
   onPressImage = (item, id) => {
      this._onOpenActionSheet(item, id)
   }

   /**action sheet method */
   _onOpenActionSheet = (item, id) => {
      const options = ['Take photo from Camera', 'Choose image', 'Cancel'];
      this.props.showActionSheetWithOptions(
         {
            options,
         },
         buttonIndex => {
            switch (buttonIndex) {
               case 0:
                  this.pickCropImageFromCamera(item, id, true)
                  break;
               case 1:
                  this.pickCropImagedFromLibrary(item, id);
                  break;

               case 2:
                  return;
            }
         },
      );
   };

   /**User can pick image from camera */
   pickCropImageFromCamera = (item, id, isCamera) => {
      ImageCropPicker.openCamera({
         width: 300,
         height: 400,
         cropping: true,
         mediaType: 'photo',
         writeTempFile: true,
         compressImageQuality: 1,
      }).then(image => {
         if (image.size > 8000000) {
            showSimpleAlert(commonText.profilePicWarning);
            return false;
         }
         else {
            if (image) { this.upoadProfilePicture(item, id, image, isCamera) }
         }
      }).catch((error) => console.log("Error-->", error));
   }

   /**User can pick image from gallry */
   pickCropImagedFromLibrary = (item, id) => {
      ImageCropPicker.openPicker({
         width: 300,
         height: 400,
         cropping: true,
         mediaType: 'photo',
         writeTempFile: true,
         compressImageQuality: 1,
      }).then(image => {
         if (image.size > 8000000) {
            showSimpleAlert(commonText.profilePicWarning);
            return false;
         }
         else {
            if (image) { this.upoadProfilePicture(item, id, image) }
         }
      }).catch((error) => console.log("Error-->", error));
   }

   /**action for uplad profile picture to server */
   upoadProfilePicture = async (item, id, image, isCamera) => {
      let profile_pic = [];
      let position = [];
      profile_pic.push({
         ...image
      })
      let positionID = item.position
      position.push(positionID)
      let uri;
      if (isCamera) {
         uri = Platform.OS == 'ios' ? "file://" + image.path : image.path
      }
      else {
         uri = Platform.OS == 'ios' ? image.sourceURL : image.path
      }
      let formData = new FormData();
      let imageObj = {
         name: 'image.jpg',
         type: image.mime,
         uri: uri,
      }
      formData.append(`profile_pic`, imageObj)
      formData.append(`position`, positionID)
      this.props.uploadProfilePicture(formData)
      this.state.data[id].loading = true;
      this.setState({ data: this.state.data })
   }

   /**acion handle for submit button click */
   onPressSubmit = () => {
      if (this.props.userProfileSetupDetails.pictures && this.props.userProfileSetupDetails.pictures.length !== 6) {
         showSimpleAlert(commonText.pleaseSelectAllImage)
      }
      else {
         const params = {
            want_blur_pics: this.state.isEnabled
               ? commonText.yes : commonText.no
         }
         this.props.saveProfileSetupData(params);
      }
   }

}

/**action sheet wrap component */
export default connectActionSheet(ProfilePics);

/**component styling */
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: colors.white
   },
   mainStyle: {
      marginHorizontal: 30,
      marginTop: 30
   },
   headingText: {
      fontSize: 16,
      textAlign: 'center',
      fontFamily: fonts.muli,
      color: colors.textColor
   },
   genderImageStyle: {
      alignSelf: 'center',
      marginTop: 20
   },
   genderText: {
      fontSize: 32,
      color: colors.black,
      fontFamily: fonts.sukhumvitSetBold,
      textAlign: 'center',
      marginTop: 35
   },
   InputButtonStyle: {
      marginTop: 5,
      justifyContent: 'center'
   },
   maleText: {
      marginHorizontal: 30,
      marginTop: 10
   },
   email: {
      color: colors.grayShadeDark,
      fontSize: 16,
      fontFamily: fonts.muli,
      textAlign: 'center'
   },
   resend: {
      marginTop: 20,
      color: colors.blueShade1,
      fontFamily: fonts.muli,
      fontSize: 16,
      textAlign: 'center'
   },
   boxStyle: {
      borderWidth: 1,
      borderColor: colors.grayShade3,
      width: constants.screenWidth / 3 - 27,
      height: constants.screenHeight / 7,
      // margin: 15
      marginVertical: 10,
      marginHorizontal: 7,
      borderRadius: 15,
      backgroundColor: colors.offWhite,
      justifyContent: 'center'
   },
   profilePicStyle: {
      width: constants.screenWidth / 3 - 25,
      height: constants.screenHeight / 7,
      borderRadius: 15,
   },
   flatlistContainer: {
      flexGrow: 1,
      marginVertical: 10,
      marginHorizontal: 20,
      paddingBottom: 20
   },
   addPhotoText: {
      color: colors.textInputBorder,
      fontFamily: fonts.muliSemiBold,
      fontSize: 14,
      textAlign: 'center'
   },
   addImageStyle: {
      alignSelf: 'center'
   },
   blurText: {
      fontSize: 16,
      fontFamily: fonts.muli,
      color: colors.textColor,
      marginHorizontal: 15
   },
   switchStyle: {
      marginRight: 5,
      transform: Platform.OS == 'ios' ? [{ scaleX: .9 }, { scaleY: .9 }] : [{ scaleX: 1.1 }, { scaleY: 1.1 }]
   },
   closeIcon: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      right: 5, top: 8,
   },
   submitView: {
      flex: 0.2, justifyContent: 'flex-end',
      paddingBottom: 20
   },
   blurPicView: {
      flexDirection: 'row',
      marginTop: 20, justifyContent: 'space-between'
   },
   warningMainWrap: {
      flexDirection: 'row', backgroundColor: colors.white, borderRadius: 10,
      margin: 10,
      shadowColor: colors.grayShade1,
      shadowOpacity: 1,
      shadowRadius: 10,
      shadowOffset: {
         height: 5,
         width: 0,
      },
      elevation: 4
   },
   warningInnerWrap: {
      alignItems: 'center',
      justifyContent: 'center', paddingHorizontal: 5,
      backgroundColor: colors.blueShade1,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10
   },
   infoView: {
      padding: 5,
      paddingLeft: 10, flex: 1
   },
   infoText: {
      fontSize: 18,
      fontFamily: fonts.muliBold, color: colors.black
   },
   blurPhotoView: {
      fontSize: 14,
      fontFamily: fonts.muli,
      color: colors.grayShadeDark
   },
   uploadingText: {
      fontSize: 14, marginBottom: 10,
      fontFamily: fonts.muli, color: colors.blueShade1
   }
})

