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
    Image,
    Modal,
    TouchableHighlight,
    BackHandler,
    Platform,
    Alert,
} from 'react-native';
import Socket from '../../api/Socket';
import { fonts, icons, images } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { ActionButton, Header, Loader, QueAnsBox, SvgIcon, CustomImage, LikePopup, ReportUserModal, CustomButton } from '../../components';
import { calculate_age, convetCapital, showSimpleAlert } from '../../utils/HelperFunction';
import { getHeight, isIphoneX } from '../../utils/iPhoneXHelper';
import { moderateScale, verticalScale } from '../../utils/scale';
import UserUtils from '../../utils/UserUtils';
import crashlytics from '@react-native-firebase/crashlytics';
export let exploreRef;
import { getAbroadGoals, getMarraigeGoals } from '../profileSetup/UserMarriageGoal';
import { getPrayById } from '../profileSetup/UserPray';
import { getSpiritualityById } from '../profileSetup/UserSect';
import AnimatedHeader from '../../components/animatedHeader/AnimatedHeader';
import { headerAnimRef } from '../../components/animatedHeader/HeaderAnim';

/**Explore Screen Component */
class Explore extends Component {
    keyExtractor = (i, j) => j.toString();

    constructor(props) {
        super(props);
        exploreRef = this;
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
                icon: icons.casteIconGrey,
                iconHeight: 13,
                iconWidth: 13,
            },
            {
                id: "ethnicity",
                value: "",
                icon: icons.casteIconGrey,
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
        isUserSubscribed: false,
        loading: false,
    }

    /**componet life cycle method */
    async componentDidMount() {
        crashlytics().log('Explore Tab mounted.');
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        let isMale = userDetails.gender == commonText.male ? false : true;
        this.setState({ isMale })
        this.props.resetData()
        this.props.exploreSetEmptyData()
        const isFromLike = this.props.route.params && this.props.route.params.isFromLike;
        const isFromChat = this.props.route.params && this.props.route.params.isFromChat;
        const isUnblockButton = this.props.route.params && this.props.route.params.isUnblockButton;
        const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification;
        const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch;
        if (isFromNotification) {
            let user_id = this.props.route.params && this.props.route.params.user_id
            await this.props.getLikeTabUserProfiles({ user_id });
            const { is_blocked_by_you, is_matched } = this.props.userDetails;
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
        else if (isFromLike) {
            let user_id = this.props.route.params && this.props.route.params.user_id
            await this.props.getLikeTabUserProfiles({ user_id });
            const { is_matched } = this.props.userDetails;
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
            if (isUnblockButton) {
                this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.blockUserText) })
            }
            else {
                this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.unblockUserText) })
            }
        }
        else if (isFromChat) {
            let user_id = this.props.route.params && this.props.route.params.user_id
            await this.props.getLikeTabUserProfiles({ user_id });
            const { is_blocked_by_you, is_matched } = this.props.userDetails;
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
        else if (isFromMatch) {
            let user_id = this.props.route.params && this.props.route.params.user_id
            await this.props.getLikeTabUserProfiles({ user_id });
            const { is_blocked_by_you } = this.props.userDetails;
            this.state.menuArray.push({
                id: 4,
                title: commonText.unmatchUser,
                onPress: () => {
                    this.onPressUnmatchUser()
                },
                color: colors.black,
            })
            if (is_blocked_by_you) {
                this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.blockUserText) })
            }
            else {
                this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.unblockUserText) })
            }
        }
        else {
            this.getDetailsOFOppositeGender({});
            this.setState({ menuArray: this.state.menuArray.filter((obj) => obj.title != commonText.unblockUserText) })
        }
        this.props.validateReceiptApicall()
    }

    /**get the details for display users in explore screen */
    getDetailsOFOppositeGender = async (params) => {
        params.per_page = 2
        params.offset = 0;
        this.props.exploreRequest()
        await this.props.getOppositeGenderDetails(params)
        if (this.props.isNoProfileFound) {
        }
        else {
            if (this.scrollRef) this.scrollRef.scrollTo({ x: 0 })
        }
    }

    /**handle back press event */
    handleBackPress = () => {
        console.log("back click on explore");
        const isFromLike = this.props.route.params && this.props.route.params.isFromLike
        const isFromChat = this.props.route.params && this.props.route.params.isFromChat
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
        else if (isFromLike) {
            if (Platform.OS == "android") {
                this.props.navigation.navigate(commonText.likeRoute, { screen: commonText.likeRoute })
                return true;
            }
            else {
                this.props.navigation.navigate(commonText.likeRoute, { screen: commonText.likeRoute })
                return true;
                // this.props.navigation.goBack();
            }
        }
        if (isFromChat) {
            this.props.navigation.goBack();
            return true;
        }
        else {
            BackHandler.exitApp()
        }
    }

    /**componet render method */
    render() {
        let blurPhoto = this.props.userDetails && this.props.userDetails.want_blur_pics
            ? this.props.userDetails.want_blur_pics == commonText.yes ? true : false : null;
        const isFromLike = this.props.route.params && this.props.route.params.isFromLike
        const isFromChat = this.props.route.params && this.props.route.params.isFromChat
        const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
        const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
        const isMessageButton = this.props.route.params && this.props.route.params.isMessageButton
        if (isFromLike || isFromChat || isFromNotification || isFromMatch) {
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
                            middleText={isFromLike || isFromChat || isFromNotification || isFromMatch ? this.props.userDetails && this.props.userDetails.name && convetCapital(this.props.userDetails.name) : this.state.scrollDone ? this.props.userDetails && this.props.userDetails.name && convetCapital(this.props.userDetails.name) || commonText.exploreTitle : commonText.exploreTitle}
                            threeDotsView={Object.keys(this.props.userDetails).length > 0 ? true : false}
                            onPressThreeDots={this.onPressThreeDots}
                            middleTextStyle={isFromLike || isFromChat || isFromNotification || isFromMatch ? { fontSize: 25 } : this.state.scrollDone ? { fontSize: 25 } : {}}
                            mainStyle={Object.keys(this.props.userDetails).length > 0 ? { height: getHeight(75) } : { height: getHeight(75) }}
                        />
                        {
                            this.props.loading ?
                                <Loader loading={this.props.loading} />
                                :
                                <>
                                    {
                                        this.props.isNoProfileFound ?
                                            <View
                                                style={styles.newWrap}
                                            >
                                                {/* <Image source={images.appLogoWithoutName} style={{ height: 85, width: 85 }} resizeMode={'contain'} /> */}
                                                <SvgIcon name={icons.appIconWithOutName} height={85} width={85} />
                                                <Text style={[styles.emptyText, { paddingHorizontal: 30, paddingVertical: 10 }]}>{commonText.noMoreDataText}</Text>
                                                <View style={{ width: "80%", }}>
                                                    <CustomButton onPress={this.onFilterIconPress} theme={2} title={commonText.openPrefrencesText} isSmall mainStyle={{ borderRadius: 50, marginTop: 10 }} />
                                                </View>
                                            </View>
                                            :
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
                                                {Object.keys(this.props.userDetails).length ? <View>
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
                                    }

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
                    <LikePopup
                        visible={this.state.likeVisible}
                        likeData={this.likeData}
                        onRequestClose={this.onRequestClose}
                        isBlurPhoto={blurPhoto}
                    />
                </>
            );
        }
        else {
            console.log("Animated header showing");
            return (
                <View style={{ flex: 1, paddingTop: Platform.OS == "android" ? 10 : 0, backgroundColor: colors.white }}>
                    <AnimatedHeader
                        ref={(ref) => this.animRef = ref}
                        style={{ flex: 1, backgroundColor: colors.white }}
                        isShowSimpleHeader={false}
                        backText={commonText.exploreTitle}
                        title={this.props.userDetails && this.props.userDetails.name && convetCapital(this.props.userDetails.name)}
                        renderLeft={() => this.renderLeftPortion()}
                        renderRight={() => this.renderRightPortion()}
                        backStyle={{ marginLeft: 0 }}
                        backTextStyle={styles.backTextStyle}
                        titleStyle={styles.titleStyle}
                        headerMaxHeight={this.getHeightOfHeader(this.props.userDetails && this.props.userDetails.name && convetCapital(this.props.userDetails.name))}
                        toolbarColor='#FFF'
                        disabled={false}
                    >
                        {
                            this.props.loading ?
                                <Loader loading={this.props.loading} />
                                :
                                <ScrollView bounces={false}
                                    onScroll={this.handleScroll}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ flexGrow: 1, paddingBottom: isFromChat || isFromLike || isFromNotification ? 50 : 130, paddingTop: 10 }}
                                    ref={(ref) => this.scrollRef = ref}
                                    nestedScrollEnabled
                                >
                                    <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                                    {
                                        this.props.isNoProfileFound ?
                                            <View
                                                style={styles.noProfileView}
                                            >
                                                {/* <Image source={images.appLogoWithoutName} style={{ height: 85, width: 85 }} resizeMode={'contain'} /> */}
                                                <SvgIcon name={icons.appIconWithOutName} height={85} width={85} />
                                                <Text style={[styles.emptyText, { paddingHorizontal: 30, paddingVertical: 10 }]}>{commonText.noMoreDataText}</Text>
                                                <View style={{ width: "80%", }}>
                                                    <CustomButton onPress={this.onFilterIconPress} theme={2} title={commonText.openPrefrencesText} isSmall mainStyle={{ borderRadius: 50, marginTop: 10 }} />
                                                </View>
                                            </View>
                                            :
                                            <FlatList
                                                data={this.state.profilePicAndQueAnsArray}
                                                keyExtractor={this.keyExtractor}
                                                extraData={this.props || this.state}
                                                bounces={false}
                                                renderItem={this.renderPicAndQueAnsItem}
                                                contentContainerStyle={{ flexGrow: 1, backgroundColor: colors.white, paddingBottom: isFromChat || isFromLike || isFromNotification ? 50 : 130, paddingTop: 10 }}
                                                ListHeaderComponent={this.renderHeaderComponent}
                                                ListFooterComponent={this.renderFooterComponent}
                                            />}
                                </ScrollView>
                        }
                    </AnimatedHeader>
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
                    {Object.keys(this.props.userDetails).length ? <View>
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
                    <LikePopup
                        visible={this.state.likeVisible}
                        likeData={this.likeData}
                        onRequestClose={this.onRequestClose}
                        isBlurPhoto={blurPhoto}
                    />
                </View>
            )
        }
    }

    /**get the height of header title */
    getHeightOfHeader = (name) => {
        let lenght = name && name.length;
        let finalAns;
        if (lenght <= 15) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 150 : 130 : Platform.OS == "android" ? 120 : 110
        }
        else if (lenght <= 20) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 150 : 130 : Platform.OS == "android" ? 120 : 120
        }
        else if (lenght <= 25) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 175 : 150 : Platform.OS == "android" ? 140 : 140
        }
        else if (lenght <= 30) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 200 : 180 : Platform.OS == "android" ? 170 : 170
        }
        else if (lenght <= 40) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 220 : 200 : Platform.OS == "android" ? 190 : 190
        }
        else if (lenght <= 50) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 240 : 220 : Platform.OS == "android" ? 210 : 210
        }
        else if (lenght <= 60) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 260 : 240 : Platform.OS == "android" ? 230 : 230
        }
        else if (lenght <= 70) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 280 : 260 : Platform.OS == "android" ? 250 : 250
        }
        else if (lenght <= 80) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 300 : 280 : Platform.OS == "android" ? 270 : 270
        }
        else if (lenght <= 90) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 320 : 300 : Platform.OS == "android" ? 290 : 290
        }
        else if (lenght <= 100) {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 200 : 180 : Platform.OS == "android" ? 170 : 170
        }
        else {
            finalAns = Platform.OS == "ios" ? isIphoneX() ? 150 : 130 : Platform.OS == "android" ? 120 : 110
        }
        if (headerAnimRef) {
            if (lenght < 30) {
                headerAnimRef.setheightDymnamically(finalAns - 10)
            }
            else {
                headerAnimRef.setheightDymnamically(finalAns - 20)
            }
        }
        return finalAns - 10
    }

    /**render left part of header */
    renderLeftPortion = () => {
        const isFromLike = this.props.route.params && this.props.route.params.isFromLike
        const isFromChat = this.props.route.params && this.props.route.params.isFromChat
        const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification
        const isFromMatch = this.props.route.params && this.props.route.params.isFromMatch
        if (isFromLike || isFromChat || isFromNotification || isFromMatch) {
            return (
                <TouchableOpacity style={{ top: -5 }} onPress={this.handleBackPress}>
                    <SvgIcon name={icons.darkback} width={14} height={22} />
                </TouchableOpacity>
            )
        }
        else {
            return (
                <TouchableOpacity hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} style={{ top: -5, padding: 5, paddingHorizontal: 8 }} onPress={this.onFilterIconPress}>
                    <SvgIcon name={icons.filterBlueIcon} />
                </TouchableOpacity>
            )
        }
    }

    /**render right part of header */
    renderRightPortion = () => {
        if (Object.keys(this.props.userDetails).length > 0) {
            return (
                <TouchableOpacity
                    activeOpacity={constants.activeOpacity}
                    delayPressIn={0}
                    style={{ top: -5, padding: 10 }}
                    hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                    onPress={this.onPressThreeDots}
                >
                    {[1, 2, 3].map((obj) => <View key={obj} style={{ height: 4, width: 4, marginVertical: 2, borderRadius: 20, backgroundColor: colors.blueShade1 }} />)}
                </TouchableOpacity>
            )
        }
        else {
            return null;
        }
    }

    /**handle scrolling event */
    handleScroll = (event) => {
        if (this.props.isNoProfileFound) {
        }
        else {
            if (event.nativeEvent.contentOffset.y > 0) {
                this.setState({ scrollDone: true, menuVisible: false, showIcons: false })
            }
            else if ((event.nativeEvent.contentOffset.y == 0)) {
                this.setState({ scrollDone: false })
            }
        }
    }

    goToNext = () => {
        this.props.navigation.navigate(commonText.likeCommentRoute)
    }

    /**render component header portion */
    renderHeaderComponent = () => {
        crashlytics().log('Explore Header component');
        let headerImageUrl = null;
        let photoId;
        this.props.userDetails && this.props.userDetails.pictures
            && this.props.userDetails.pictures.length
            &&
            this.props.userDetails.pictures.map((obj) => {
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
                obj.value = this.props.userDetails ? calculate_age(this.props.userDetails.date_of_birth) : ""
            }
            else if (obj.isDistance) {
                obj.value = this.props.userDetails && Object.keys(this.props.userDetails).length > 0 && this.props.userDetails.distance != null ? this.props.userDetails.distance.toFixed(2).toString() + " miles" : "Not Available"
            }
            else {
                obj.value = this.props.userDetails ? this.props.userDetails[obj.id] : ""
            }
        })
        this.state.userProfileMainArray.map((obj) => {
            if (obj.isEducation) {
                obj.value = this.props.userDetails[obj.id] && this.props.userDetails[obj.id].length
                    ? Array.prototype.map.call(this.props.userDetails[obj.id], function (item) { return item.education_degree; }).join(", ") // "A,B,C"
                    : ""
            }
            else if (obj.id == "marriage_goal") {
                let marriagegoal = this.props.userDetails ? getMarraigeGoals(this.props.userDetails.marriage_goal) : "";
                let abroadgoal = this.props.userDetails ? getAbroadGoals(this.props.userDetails.abroad_goal) : "";
                obj.value = marriagegoal + ', ' + abroadgoal;
            }
            else if (obj.id == "spirituality") {
                obj.value = this.props.userDetails && this.props.userDetails[obj.id] != null && this.props.userDetails[obj.id] != undefined ?
                    getSpiritualityById(this.props.userDetails[obj.id])
                    : ""
            }
            else if (obj.id == "pray") {
                obj.value = this.props.userDetails && this.props.userDetails[obj.id] != null && this.props.userDetails[obj.id] != undefined ?
                    getPrayById(this.props.userDetails[obj.id])
                    : ""
            }
            else {
                if (obj.id != "marriage_goal" && obj.id != "educations") obj.value = this.props.userDetails ? this.props.userDetails[obj.id] : ""
            }
        })
        let blurPhoto = this.props.userDetails && this.props.userDetails.want_blur_pics
            ? this.props.userDetails.want_blur_pics == commonText.yes ? true : false : null;
        return (
            <View style={styles.headerTopView}>
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
                    this.props.userDetails && Object.keys(this.props.userDetails).length > 0 ?
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
                    this.props.userDetails && Object.keys(this.props.userDetails).length > 0
                        ? <View style={styles.mainWrapStyle}>
                            {
                                this.state.userProfileMainArray.map((obj) => {
                                    return (
                                        <View style={styles.itemView}>
                                            {obj.icon ? <SvgIcon name={obj.icon} height={obj.iconHeight + 2} width={obj.iconWidth + 2} /> : null}
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
        this.props.userDetails && this.props.userDetails.pictures && this.props.userDetails.pictures.length
            && this.props.userDetails.pictures.map((obj) => {
                if (obj.position == item.position) {
                    profilePic = obj.profile_pic ? obj.profile_pic : "";
                    photoId = obj.profile_photo_id
                }
            })
        this.props.userDetails && this.props.userDetails.questions && this.props.userDetails.questions.length
            && this.props.userDetails.questions.map((obj) => {
                if (obj.position == item.position - 1) {
                    questionTag = obj.question ? obj.question : "";
                    answerTag = obj.answer ? obj.answer : "";
                    questionId = obj.question_id
                }
            })
        let blurPhoto = this.props.userDetails && this.props.userDetails.want_blur_pics
            ? this.props.userDetails.want_blur_pics == commonText.yes ? true : false : null;
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
        aboutUserDescription = this.props.userDetails && this.props.userDetails.description
            ? this.props.userDetails.description : "";
        let badges = this.props.userDetails && this.props.userDetails.badges && this.props.userDetails.badges.length
            ? this.props.userDetails.badges
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
        this.setState({ menuVisible: true }, () => { })
    }

    /**action for click like button */
    onPressLikeButton = (imageurl, imageid, question, answer, questionid, isQuestion) => {
        this.setState({ likeVisible: true });
        let liked_user_id = this.props.userDetails && this.props.userDetails.user_id;
        let headetitle = this.props.userDetails && this.props.userDetails.name
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

    /**action handling for cross button click(Ingore user) */
    onCrossButtonPress = async () => {
        if (this.state.loading) {
            return false;
        }
        let ignored_user_id = this.props.userDetails.user_id;
        const params = {
            ignored_user_id
        }
        this.setState({ loading: true })
        await this.props.ignoreProfile(params)
        this.setState({ loading: false })
    }

    /**handling for block user button */
    onPressBlockUser = async () => {
        let blocked_user_id = this.props.userDetails.user_id;
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
            let reported_user_id = this.props.userDetails.user_id;
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
        let name = this.props.userDetails && this.props.userDetails.name;
        let badges = this.props.userDetails && this.props.userDetails.badges;
        let is_matched = this.props.userDetails && this.props.userDetails.is_matched;
        let receiver_ignored_by_you = this.props.userDetails && this.props.userDetails.receiver_ignored_by_you;
        let receiver_liked_by_you = this.props.userDetails && this.props.userDetails.receiver_liked_by_you;
        let is_blocked = this.props.userDetails && this.props.userDetails.is_blocked;
        let is_blocked_by_you = this.props.userDetails && this.props.userDetails.is_blocked_by_you;

        const isFromLike = this.props.route.params && this.props.route.params.isFromLike
        let arrayName = this.props.route.params && this.props.route.params.arrayName;
        let apiName = this.props.route.params && this.props.route.params.apiName;
        let likeParams = {
            arrayName, apiName, page_no: 1
        }
        console.log("this.props.userDetails-->", this.props.userDetails);
        this.props.userDetails && this.props.userDetails.pictures
            && this.props.userDetails.pictures.length &&
            this.props.userDetails.pictures.map((obj) => {
                if (obj.position === 1) {
                    headerImageUrl = obj.profile_pic;
                }
            })
        if (responseObj.code === 1) {
            const id = responseObj.data.user_id;
            const userDetails = {
                id,
                chat_user_id: user_id,
                profile_pic: headerImageUrl,
                name,
                loggedInUser_id: loggedInUser.user_id,
                badges,
                is_matched, receiver_ignored_by_you,
                receiver_liked_by_you,
                is_blocked,
                is_blocked_by_you,
                want_blur_pics: this.props.userDetails.want_blur_pics
            }
            this.props.navigation.navigate(commonText.chatWindowRoute, {
                userDetails,
                id,
                chat_user_id: user_id,
                profile_pic: headerImageUrl,
                name,
                loggedInUser_id: loggedInUser.user_id,
                badges,
                is_matched,
                isFromExplore: true,
                receiver_ignored_by_you,
                receiver_liked_by_you,
                isFromLike,
                likeParams,
                is_blocked,
                is_blocked_by_you,
                want_blur_pics: this.props.userDetails.want_blur_pics
            });
        }
    }

    /**action for unblock user */
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

    /**action for unmatch user */
    onPressUnmatchUser = () => {
        let userName = this.props.userDetails && this.props.userDetails.name && convetCapital(this.props.userDetails.name);
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
}

export default Explore;

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
        textAlign: "center"
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
    newWrap: {
        flex: 1, alignItems: 'center',
        justifyContent: 'center', bottom: 30
    },
    backTextStyle: {
        fontFamily: fonts.sukhumvitSetBold,
        fontSize: moderateScale(20),
        color: colors.black,
    },
    textStyle: {
        fontSize: 25, color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
    },
    titleStyle: {
        fontSize: 28,
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        marginTop: 10,
    },
    noProfileView: {
        flex: 1, alignItems: 'center',
        justifyContent: 'center', height: constants.screenHeight / 1.5
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
        height: 8, width: 8,
        borderRadius: 10, backgroundColor: colors.blueShade1
    }
})