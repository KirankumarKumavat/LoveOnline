import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch, FlatList, TouchableOpacity, Platform, BackHandler, ScrollView, StatusBar } from 'react-native';

import { constants, colors, commonText } from '../../common';
import { icons, fonts } from '../../assets';
import { Loader, } from '../../components';
import SvgIcon from '../../components/SvgIcon'
import Header from '../../components/Header';

import ImageCropPicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import { NavigationEvents } from '@react-navigation/compat';

import { connectActionSheet } from '@expo/react-native-action-sheet'
import { showSimpleAlert } from '../../utils/HelperFunction';
import DefaultImage from '../../components/DefaultImage';
import { getAbroadGoals, getMarraigeGoals } from '../profileSetup/UserMarriageGoal';
import ActionSheetModal from '../../components/ActionSheetModal';
import { getSpiritualityById } from '../profileSetup/UserSect';
import { getPrayById } from '../profileSetup/UserPray';
import { showToastMessage } from '../../components/ToastUtil';
import UserUtils from '../../utils/UserUtils';

const moment = require('moment');

/**Edit Profile screen component */
class EditProfile extends Component {
    selectedButtonIndex = null;

    keyExtractor = (item, index) => index.toString()

    constructor(props) {
        super(props);
        this.state = {
            isEnabled: this.props.userProfileSetupDetails.want_blur_pics == 'Yes' ? true : false,
            isMale: true,
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
            answers: [
                {
                    title: commonText.selectPromptTitle,
                    answer: commonText.writeAnswerTitle,
                    position: 1,
                    question_id: null,
                },
                {
                    title: commonText.selectPromptTitle,
                    answer: commonText.writeAnswerTitle,
                    position: 2,
                    question_id: null,
                },
                {
                    title: commonText.selectPromptTitle,
                    answer: commonText.writeAnswerTitle,
                    position: 3,
                    question_id: null,
                },
                {
                    title: commonText.selectPromptTitle,
                    answer: commonText.writeAnswerTitle,
                    position: 4,
                    question_id: null,
                },
                {
                    title: commonText.selectPromptTitle,
                    answer: commonText.writeAnswerTitle,
                    position: 5,
                    question_id: null,
                },
            ],
            profilePics: [],
            userProfileMainArray: [

                {
                    id: "educations",
                    value: "",
                    title: "Education",
                    route: commonText.profileSetupStepsRoute, //ProfileSetupStepsContainer
                    index: 12
                },
                {
                    id: "profession_name",
                    value: "",
                    title: "Profession",
                    index: 0
                },
                {
                    id: "city",
                    value: "",
                    title: "City",
                    index: 7,
                },
                {
                    id: "country_name",
                    title: "Country",
                    value: "",
                    index: 4,
                },
                {
                    id: "ethnicity",
                    title: "Ethnicity",
                    value: "",
                    index: 8,
                },
                {
                    id: "spirituality",
                    title: "Spirituality",
                    value: "",
                    index: 9
                },
                {
                    id: "pray",
                    title: "Pray",
                    value: "",
                    index: 10
                },
                {
                    title: 'Marriage goals',
                    id: "marriage_goal",
                    value: "",
                    isGoal: true,
                    index: 11,
                }
            ],

            basicInfoArray: [
                {
                    title: 'Name',
                    value: '',
                    id: "name",
                    index: -1
                },
                {
                    title: 'Date Of Birth',
                    value: '',
                    id: 'date_of_birth',
                    index: 'noIndex'
                },
                {
                    title: 'Gender',
                    value: '',
                    id: "gender",
                    index: 'noIndex'
                },
                {
                    title: 'Marital Status',
                    value: '',
                    id: "marital_status",
                    index: 2
                },

                {
                    title: 'Children',
                    value: '',
                    id: "is_children_available",
                    index: 3
                },
                {
                    title: 'Height',
                    value: '',
                    id: "height",
                    index: 1
                },
            ],
            loadStart: false,

            activeImageDetail: null,
            activeImageIndex: null,
            profilePicModal: false,
            gender: commonText.male,
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        this.subscribeFocus = this.props.navigation.addListener('focus', async () => await this.onScreenFocus());
        this.setState({
            userDetails: this.props.userProfileSetupDetails,
            questions: this.props.userProfileSetupDetails.questions,
            description: this.props.userProfileSetupDetails.description
        })
        if (this.props.userProfileSetupDetails && Object.keys(this.props.userProfileSetupDetails).length > 0) {
            if (this.props.userProfileSetupDetails.pictures && this.props.userProfileSetupDetails.pictures.length) {
                this.props.userProfileSetupDetails.pictures.map((obj) => {
                    this.state.data.map((obj2) => {
                        if (obj.position === obj2.position) {
                            obj2.profilePic = obj.profile_pic
                        }
                    })
                })
                this.setState({ data: this.state.data })
            }
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);

        const userDetail = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetail) this.setState({ gender: userDetail.gender })
    }

    /**action when screen is focued */
    onScreenFocus = async () => {
        await this.props.getUserProfileData();
        await this.setQuestionData();
        this.setState({
            userDetails: this.props.userProfileSetupDetails,
            questions: this.props.userProfileSetupDetails.questions,
            description: this.props.userProfileSetupDetails.description
        })

        if (this.props.userProfileSetupDetails && Object.keys(this.props.userProfileSetupDetails).length > 0) {
            if (this.props.userProfileSetupDetails.pictures && this.props.userProfileSetupDetails.pictures.length) {
                this.props.userProfileSetupDetails.pictures.map((obj) => {
                    this.state.data.map((obj2) => {
                        if (obj.position === obj2.position) {
                            obj2.profilePic = obj.profile_pic
                        }
                    })
                })
                this.setState({ data: this.state.data })
            }
        }
    }

    /**action method to set all question list to component selected by user */
    setQuestionData = () => {
        if (this.props.userProfileSetupDetails) {
            if (this.props.userProfileSetupDetails.questions && this.props.userProfileSetupDetails.questions.length) {
                this.state.answers.map((obj) => {
                    this.props.userProfileSetupDetails.questions.map((obj1) => {
                        if (obj.position === obj1.position) {
                            obj.title = obj1.question;
                            obj.answer = obj1.answer;
                            obj.question_id = obj1.question_id
                        }
                    })
                })
                this.setState({ answer: this.state.answers })
            }
        }
    }
    /**componet life cycle method */
    componentWillUnmount() {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
    }

    /**action fire when back button click */
    androidBackPress = async () => {
        this.props.navigation.goBack();
        return true;
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={() => this.onScreenFocus()} />
                <StatusBar barStyle={'light-content'} backgroundColor={colors.white} />
                <Header
                    theme={0}
                    backButton
                    onBackButtonPress={() => { this.androidBackPress() }}
                    middleText={commonText.editProfile} />
                <ScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                >
                    {this.state.userDetails
                        ?
                        <>
                            <FlatList
                                style={{ flex: 1, }}
                                contentContainerStyle={styles.flatlistContainer}
                                data={this.state.data}
                                renderItem={this.renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                extraData={this.props.userProfileSetupDetails.pictures}
                                numColumns={3}
                                ListHeaderComponent={this.headerPhotos}
                            />
                            <View style={styles.blurPhotoWrap}>
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
                                this.state.isEnabled ?

                                    <View style={styles.wrap}>
                                        <View style={styles.innerWrap}>
                                            <SvgIcon name={icons.infoIcon} height={20} width={20} />
                                        </View>
                                        <View style={styles.infoWrap} >
                                            <Text style={styles.infoText}>{commonText.infoText}</Text>
                                            <Text style={styles.warningText}>{commonText.blurPhotoWarning}</Text>
                                        </View>
                                    </View>
                                    : null
                            }

                            <View style={styles.myAnsWrap}>
                                <Text style={styles.rightText}>{commonText.myAnswers}</Text>
                                <Text style={styles.leftText}>{commonText.answerRequiredText}</Text>
                            </View>
                            <FlatList
                                style={{ flex: 1 }}
                                contentContainerStyle={styles.answerFlatlistContainer}
                                data={this.state.answers}
                                renderItem={this.renderAnswerItem}
                                keyExtractor={this.keyExtractor}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                extraData={this.state.answers}
                            />
                            <Text style={[styles.rightText, { marginTop: 25, marginHorizontal: 25 }]}>{commonText.basicInfo}</Text>
                            <FlatList
                                style={styles.moreaboutFlatlistStyle}
                                contentContainerStyle={styles.aboutMeFlatlist}
                                data={this.state.basicInfoArray}
                                renderItem={this.renderUserBasicInfo}
                                keyExtractor={this.keyExtractor}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={this.separator}
                                extraData={this.state}
                            />
                            <Text style={[styles.rightText, { marginTop: 25, marginHorizontal: 25 }]}>{commonText.moreAbout}</Text>
                            <FlatList
                                style={styles.basicInfoFlatlistStyle}
                                contentContainerStyle={styles.aboutMeFlatlist}
                                data={this.state.userProfileMainArray}
                                renderItem={this.renderUserMoreInformation}
                                keyExtractor={this.keyExtractor}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                                ItemSeparatorComponent={this.separator}
                                extraData={this.state}
                            />
                            <TouchableOpacity activeOpacity={1} style={styles.aboutMeWrap} onPress={() => this.props.navigation.navigate(commonText.descriptionProfileRoute, { isFromSettingStack: true, message: this.state.description })}>
                                <Text style={styles.aboutMeHeading}>{commonText.aboutMe}</Text>
                                {this.props.userProfileSetupDetails.description ? <View style={styles.lastViewStyle}>
                                    <Text numberOfLines={2} style={styles.abouMeDesc}>{this.props.userProfileSetupDetails.description}</Text>
                                    <TouchableOpacity style={{ height: 20, width: 20 }} onPress={() => this.props.navigation.navigate(commonText.descriptionProfileRoute, { isFromSettingStack: true, message: this.state.description })}>
                                        <SvgIcon name={icons.nextIcon} height={15} width={9} />
                                    </TouchableOpacity>
                                </View> : null}
                            </TouchableOpacity>
                        </> : <Loader />}
                </ScrollView>
                <Loader loading={this.props.loading} />
                <ActionSheetModal
                    modalVisible={this.state.profilePicModal}
                    onRequestClose={() => this.setState({ profilePicModal: false })}
                    onSelectOption={this.onSelectOption}
                />
            </View>
        );
    }

    /**action when single option is selected from modal/popup */
    onSelectOption = (buttonIndex) => {
        this.setState({ profilePicModal: false })
        let item = this.state.activeImageDetail;
        let id = this.state.activeImageIndex;

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
    }

    /**toggle switch action */
    toggleSwitch = () => {
        this.setState({ isEnabled: !this.state.isEnabled }, () => {
            const params = {
                want_blur_pics: this.state.isEnabled
                    ? commonText.yes : commonText.no
            }
            this.props.saveBlurData(params);

        })
    }

    /**item separator component */
    separator = () => {
        return (
            <View style={{ height: 1, backgroundColor: colors.inputBorder2, }}></View>
        )
    }

    /**common photo text */
    headerPhotos = () => {
        return (
            <View>
                <Text style={styles.photosText}>{commonText.photos}</Text>
            </View>
        )
    }

    /**render method for display user's all profile picture */
    renderItem = ({ item, index }) => {
        let profilePic = item.profilePic;
        let profile_photo_id;
        let loaderStatus = item.loading;
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
                            null
                    }
                </View>

            )
        }
        else {
            return (
                <View style={{
                    flex: 1
                }}>
                    <DefaultImage
                        gender={this.state.gender}
                        isFromSetting={true}
                        source={profilePic}
                        onPressDeleteProfile={() => this._onOpenActionSheet(item, index)}
                    />
                </View>
            )
        }
    }

    /**action method for change profile picture */
    _onOpenActionSheet = (item, id) => {
        const options = ['Take photo from Camera', 'Choose image', 'Cancel'];
        this.setState({ activeImageDetail: item, activeImageIndex: id, profilePicModal: true })
        // this.props.showActionSheetWithOptions(
        //     {
        //         options,
        //     },
        //     buttonIndex => {
        //         switch (buttonIndex) {
        //             case 0:
        //                 this.pickCropImageFromCamera(item, id, true)
        //                 break;
        //             case 1:
        //                 this.pickCropImagedFromLibrary(item, id);
        //                 break;

        //             case 2:
        //                 return;
        //         }
        //     },
        // );
    };

    /**user can select image from camera */
    pickCropImageFromCamera = (item, id, isCamera) => {
        setTimeout(() => {
            ImageCropPicker.openCamera({
                width: 300,
                height: 400,
                cropping: true,
                mediaType: 'photo',
                writeTempFile: true,
                compressImageQuality: 1,
                freeStyleCropEnabled: true
            }).then(image => {
                if (image.size > 8000000) {
                    showSimpleAlert(commonText.profilePicWarning);
                    return false;
                }
                else {
                    if (image) { this.upoadProfilePicture(item, id, image, isCamera) }
                }
            }).catch((error) => console.log("Error-->", error));
        }, 800)
    }

    /**user can select image from gallary */
    pickCropImagedFromLibrary = (item, id) => {
        setTimeout(() => {
            ImageCropPicker.openPicker({
                width: 300,
                height: 400,
                cropping: true,
                mediaType: 'photo',
                writeTempFile: true,
                compressImageQuality: 1,
                freeStyleCropEnabled: true
            }).then(image => {
                if (image.size > 8000000) {
                    showSimpleAlert(commonText.profilePicWarning);
                    return false;
                }
                else {
                    if (image) { this.upoadProfilePicture(item, id, image) }
                }
            }).catch((error) => console.log("Error-->", error));
        }, 800)
    }

    /**action for store profile pic in database (uploading) */
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
        this.state.data[id].loading = true;
        this.state.data[id].profilePic = "";
        this.setState({ data: this.state.data })
        await this.props.uploadProfilePicture(formData)
        this.onScreenFocus()
    }

    /**render method to display user selected question-answer */
    renderAnswerItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={[styles.professionStyle, {}]}
                delayPressIn={0}
                activeOpacity={constants.activeOpacity}
                onPress={() => {
                    this.props.navigation.navigate(commonText.writeAnswerRoute, { questionDetail: { question: item.title, position: item.position, question_id: item.question_id }, answer: item.answer, isFromSettingsStack: true, isFromEdit: true })
                }}
            >
                <View style={styles.questionAnswer}>
                    <View style={{ width: '95%' }}>
                        <View>
                            <Text style={styles.professionTitle} numberOfLines={2}>{item.title}</Text>
                        </View>
                        {item.title !== commonText.selectPromptTitle
                            ?
                            <View>
                                <Text style={styles.answerTitle} numberOfLines={2}>{item.answer}</Text>
                            </View>
                            :
                            <Text style={styles.answerTitle} numberOfLines={2}>{item.answer}
                            </Text>
                        }
                    </View>
                    <SvgIcon name={icons.pencilIconGrey} height={15} width={15} />
                </View>
            </TouchableOpacity>
        )

    }

    /**render method for display basic info of user */
    renderUserMoreInformation = ({ item, index }) => {
        if (item.id == "marriage_goal") {
            let marriagegoal = this.props.userProfileSetupDetails ? getMarraigeGoals(this.props.userProfileSetupDetails.marriage_goal) : "";
            let abroadgoal = this.props.userProfileSetupDetails ? getAbroadGoals(this.props.userProfileSetupDetails.abroad_goal) : "";
            item.value = marriagegoal && abroadgoal ? marriagegoal + ', ' + abroadgoal : null;
        }
        else if (item.id == "educations") {
            item.value = this.props.userProfileSetupDetails[item.id] && this.props.userProfileSetupDetails[item.id].length
                ? Array.prototype.map.call(this.props.userProfileSetupDetails[item.id], function (item) { return item.education_degree; }).join(", ") // "A,B,C"
                : ""
        }
        else if (item.id == "spirituality") {
            item.value = this.props.userProfileSetupDetails[item.id] && getSpiritualityById(this.props.userProfileSetupDetails[item.id])
        }
        else if (item.id == "pray") {
            item.value = this.props.userProfileSetupDetails[item.id] && getPrayById(this.props.userProfileSetupDetails[item.id])
        }
        else {
            item.value = this.props.userProfileSetupDetails[item.id]
        }
        return (
            <TouchableOpacity onPress={() => this.onPressInfo(item)} style={styles.aboutMeStyle}>
                <View style={{ width: '90%' }}>
                    {item.value ? <Text style={styles.professionTitle} numberOfLines={1} >{item.value}</Text> : null}
                    <Text style={[styles.professionTitle, { fontSize: 14, color: colors.grayShadeDark }]} numberOfLines={1}>{item.title}</Text>
                </View>
                <TouchableOpacity style={{ height: 20, width: 20 }} onPress={() => this.onPressInfo(item)}>
                    <SvgIcon name={icons.nextIcon} height={15} width={9} />
                </TouchableOpacity>
            </TouchableOpacity>
        )
    }

    /**action method for handle basic info of user and routing */
    onPressInfo = (item) => {
        this.props.updateIndex({ specificIndex: item.index })
        this.props.navigation.navigate(
            commonText.profileSetupStepsRoute, {
            isFromSettingsStack: true,
            id: item.id
        },
        )

    }

    /**action method for handle basic info of user and routing */
    onPressAboutInfo = (item) => {
        if (item.id == 'date_of_birth') {
            this.props.navigation.navigate(commonText.signupDateOfBirthRoute, { isFromSettingsStack: true, selectedDate: item.value, })
        }
        else {
            this.props.updateIndex({ specificIndex: item.index })
            this.props.navigation.navigate(
                commonText.profileSetupStepsRoute, {
                isFromSettingsStack: true,
                id: item.id
            },
            )
        }
    }

    /**render method for display about me portion of client */
    renderUserBasicInfo = ({ item, index }) => {
        item.value = this.props.userProfileSetupDetails[item.id];
        let showTab = true;
        if (item.id == "is_children_available") {
            if (this.props.userProfileSetupDetails && this.props.userProfileSetupDetails.marital_status == commonText.single) {
                showTab = false;
            }
            else {
                showTab = true;
            }
        }
        else {
            showTab = true;
        }
        if (showTab) {
            return (
                <TouchableOpacity disabled={item.id == 'gender' ? true : false} onPress={() => this.onPressAboutInfo(item)} style={styles.aboutMeStyle}>
                    <View style={{ width: '90%' }}>
                        {item && item.value ? this.getValue(item) : null}
                        <Text style={[styles.professionTitle, { fontSize: 14, color: colors.grayShadeDark }]} numberOfLines={1} >{item.title}</Text>
                    </View>
                    <TouchableOpacity disabled={item.id == 'gender' ? true : false} style={{ height: 20, width: 20 }} onPress={() => this.onPressAboutInfo(item)}>
                        {item.id !== 'gender'
                            ?
                            <SvgIcon name={icons.nextIcon} height={15} width={9} />
                            : null
                        }
                    </TouchableOpacity>
                </TouchableOpacity>
            )
        }
        else {
            return null;
        }
    }

    /**gets the user's profile details  */
    getValue = (item) => {
        if (item.id == 'date_of_birth') {
            return (<Text style={styles.professionTitle} numberOfLines={1}>{moment(item.value).format('DD MMM,YYYY')}</Text>)
        }
        else if (item.id == 'height') {
            let minheight = item && item.value && item.value.split("'");
            let feetTocm = minheight && minheight[0] / 0.032808
            let inchesTocm = minheight && minheight[1] / 0.39370
            let heightincm = feetTocm + inchesTocm
            return (<Text style={styles.professionTitle} numberOfLines={1}>{item.value} ({heightincm.toFixed(1)}cm)</Text>)
        }
        else {
            return (
                <Text style={styles.professionTitle} numberOfLines={1}>{item.value}</Text>)
        }
    }

}

export default connectActionSheet(EditProfile);

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
    photosText: {
        marginHorizontal: 10,
        marginTop: 20,
        color: colors.blueShade1,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
    },
    leftText: {
        color: colors.grayShadeDark,
        fontSize: 14,
        fontFamily: fonts.muliSemiBold,
    },
    answerFlatlistContainer: {
        flexGrow: 1,
        marginTop: 10,
        marginHorizontal: 20,
    },
    professionStyle: {
        backgroundColor: colors.white,
        width: constants.screenWidth - 45,
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1,
        padding: 10,
        margin: 8,
        alignSelf: 'center'
    },
    aboutMeStyle: {
        backgroundColor: colors.white,
        width: constants.screenWidth - 40,
        justifyContent: 'space-between',
        padding: 10,
        alignSelf: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    aboutMeFlatlist: {
        flexGrow: 1,
        marginVertical: 10,
        borderColor: colors.inputBorder2,

    },
    professionTitle: {
        padding: 5,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        lineHeight: 15,
    },
    answerTitle: {
        padding: 5,
        fontSize: 14,
        fontFamily: fonts.muli,
        color: colors.grayShadeDark,
        lineHeight: 15,
    },
    questionTitle: {
        padding: 5,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        lineHeight: 15,
        width: '95%'
    },
    lastViewStyle: {
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        shadowRadius: 6,
        shadowOffset: {
            height: 10,
            width: 0,

        }
    },
    abouMeDesc: {
        paddingVertical: 20,
        color: colors.textColor,
        fontFamily: fonts.muli,
        fontSize: 16,
        width: '90%'
    },
    rightText: {
        color: colors.blueShade1,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
    },
    moreaboutFlatlistStyle: {
        flex: 1,
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1,
        marginTop: 12,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        shadowRadius: 6,
        shadowOffset: {
            height: 10,
            width: 0,
        },
    },
    basicInfoFlatlistStyle: {
        flex: 1,
        marginHorizontal: 20,
        marginTop: 12,
        marginBottom: 10,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 1,
        backgroundColor: '#fff',
        shadowRadius: 6,
        shadowOffset: {
            height: 10,
            width: 0,
        },
    },
    aboutMeHeading: {
        color: colors.blueShade1,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        marginHorizontal: 25,
        marginBottom: 10
    },
    questionAnswer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    blurPhotoWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10, paddingBottom: 10
    },
    wrap: {
        flexDirection: 'row', backgroundColor: colors.white, borderRadius: 10,
        margin: 10,
        shadowColor: colors.grayShade1,
        shadowOpacity: 1,
        shadowRadius: 10,
        shadowOffset: {
            height: 5,
            width: 0,
        },
        elevation: 4,
        marginBottom: 25
    },
    innerWrap: {
        alignItems: 'center',
        justifyContent: 'center', paddingHorizontal: 5,
        backgroundColor: colors.blueShade1,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    infoWrap: {
        padding: 5,
        paddingLeft: 10, flex: 1
    },
    infoText: {
        fontSize: 18,
        fontFamily: fonts.muliBold, color: colors.black
    },
    warningText: {
        fontSize: 14,
        fontFamily: fonts.muli, color: colors.grayShadeDark
    },
    myAnsWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 25
    },
    aboutMeWrap: {
        marginTop: 25,
        paddingBottom: 30,
    },
    uploadingText: {
        fontSize: 14, marginBottom: 10,
        fontFamily: fonts.muli, color: colors.blueShade1
    }
})




