import React, { Component } from 'react';
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Animated, StatusBar, BackHandler, FlatList, TouchableOpacity,
    Platform, ImageBackground
} from 'react-native';
import { colors, commonText, constants } from '../../common';
import { fonts, icons, images } from '../../assets';
import SvgIcon from '../../components/SvgIcon';
import { profileItems } from '../../utils/DummyData'
import { CustomButton, Loader } from '../../components';
import FastImage from 'react-native-fast-image';
import { calculate_age, convetCapital, } from '../../utils/HelperFunction';
import SubscriptionModal from './SubscriptionModal'
import NavigationService from '../../utils/NavigationService';
import StorageService from '../../utils/StorageService';
import { NavigationEvents } from '@react-navigation/compat';
import apiConfigs from '../../api/apiConfig';
import deviceInfoModule from 'react-native-device-info';
import UserUtils from '../../utils/UserUtils';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
export let settingTabRef;

/** Setting Tab screen component */
class Setting extends Component {

    constructor(props) {
        super(props);
        settingTabRef = this;
        this.state = {
            isEnabled: true,
            selectedImage: null,
            logoutPressed: false,
            visible: false,
            subscriptionModal: false,
            userDetails: {},
            unreadCount: 0,
            scroll: new Animated.Value(0),
            isUserSubscribed: false,
            showHeader: false,
            currentPlanData: {},
            gender: commonText.male,
            showIcons: true,
            isFromChangePlan: false,
        };
    }
    /**componet life cycle method */
    async componentDidMount() {
        this.handleRedirection();

        await this.settingsApi();

        await this.props.validateReceiptApicall()
        this.getcurrentSubscription()

        await this.getNotificationData();

        this.subscribeFocus = this.props.navigation.addListener('focus', this.onScreenFocus);
        this.subscribeBlur = this.props.navigation.addListener('blur', this.handleBackPressRemove);

        const userDetail = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetail) this.setState({ gender: userDetail.gender })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**action fire when back button click */
    handleBackPressAdd = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**action fire when back button click */
    handleBackPress = () => {
        this.props.navigation.jumpTo(commonText.exploreRoute);
        return true;
    }
    /**action fire when back button click */
    handleBackPressRemove = () => {
        // this.backHandler.remove();
        if (this.refs.ScrollView) this.refs.ScrollView.refs.ScrollView.scrollTo({ index: 0 })
    }

    /**handle notification redirection */
    handleRedirection = () => {
        console.log("Props--->", this.props);
        if (this.props.route && this.props.route.params && this.props.route.params.params) {
            const { isFromNotification, user_id, notificationData } = this.props.route && this.props.route.params && this.props.route.params.params;
            if (isFromNotification) {
                if (notificationData && notificationData.notify_type == apiConfigs.MATCHED_TYPE) {
                    setTimeout(() => {
                        this.props.navigation.navigate(commonText.userProfileRoute, { user_id, isFromNotification })
                    }, 500)
                }
                // else if (notificationData && notificationData.notify_type == apiConfigs.SUBSCRIPTION_EXPIRE_TYPE) {
                //     this.setState({ subscriptionModal: true })
                // }
            }
        }
    }

    /**get the notification data  */
    getNotificationData = async () => {
        await this.props.getNotificationData();
        this.getUnreadNotificationCount()
    }

    /**get the unread notification counts */
    getUnreadNotificationCount = () => {
        let count = 0;
        count = this.props.notificationList.unread_notification_count;
        this.setState({ unreadCount: count })
    }

    /**action handling for get the user profile data */
    settingsApi = async () => {
        await this.props.getUserProfileData();
        const { navigation } = this.props;
        this.setState({
            isEnabled: this.props.userProfileSetupDetails && this.props.userProfileSetupDetails.want_blur_pics == 'Yes' ? true : false,
        })
    }

    /** get current subscription detail and 
     *  display on current running subscription section
     */
    getcurrentSubscription = async () => {
        let currentPlanData = await StorageService.getItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
        let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);

        if (isActive == "1" && currentPlanData && Object.keys(currentPlanData).length > 0) {
            this.setState({ isUserSubscribed: true, currentPlanData })
        }
        else {
            this.setState({ isUserSubscribed: false, })
        }
    }

    /**action when screen is focued */
    onScreenFocus = async () => {
        await this.settingsApi()
        await this.getNotificationData();
        if (this.flatListRef) this.flatListRef.scrollToIndex({ index: 0 })
    }

    /**action handle for lifecycling */
    goToTop = () => {
        this.handleBackPressAdd()
        if (this.refs.ScrollView) this.refs.ScrollView.refs.ScrollView.scrollTo({ index: 0 })
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.goToTop()
        this.props.resetData();
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**open subscription modal */
    openSubscribeModal() {
        this.setState({ subscriptionModal: true })
    }

    /**hide subscription modal */
    closeSubscribeModal() {
        this.setState({ subscriptionModal: false })
    }

    /**get the subscription key values */
    getAndroidData = (key) => {
        let peroidValue = "";
        let peroidUnit = "";
        if (key == "P1W") {
            peroidValue = "1";
            peroidUnit = "WEEK"
        }
        else if (key == "P1M") {
            peroidValue = "1";
            peroidUnit = "MONTH"
        }
        else if (key == "P3M") {
            peroidValue = "3";
            peroidUnit = "MONTH"
        }
        else if (key == "P6M") {
            peroidValue = "6";
            peroidUnit = "MONTH"
        }
        else if (key == "P1Y") {
            peroidValue = "1";
            peroidUnit = "YEAR"
        }
        return { peroidValue, peroidUnit };
    }

    /**get the subscription free trial keys */
    getAndroidFREETRIALData = (key) => {
        let freeperoidValue = "";
        let freeperoidUnit = "";
        if (key == "P1W") {
            freeperoidValue = "1";
            freeperoidUnit = "WEEK"
        }
        else if (key == "P1M") {
            freeperoidValue = "1";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P3M") {
            freeperoidValue = "3";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P6M") {
            freeperoidValue = "6";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P1Y") {
            freeperoidValue = "1";
            freeperoidUnit = "YEAR"
        }
        return { freeperoidValue, freeperoidUnit };
    }

    /**handle scroll events */
    scrollEvent = (event) => {
        if (event.nativeEvent.contentOffset.y > 0) {
            this.setState({ showIcons: false })
        }
        else {
            this.setState({ showIcons: true })
        }
    }

    /**componet render method */
    render() {
        let details = this.props;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'light-content'} backgroundColor={colors.blueShade1} />
                <NavigationEvents onWillFocus={() => this.goToTop()} onDidBlur={this.handleBackPressRemove} />
                <ParallaxScrollView
                    ref="ScrollView"
                    bounces={false}
                    backgroundColor={colors.blueShade1}
                    stickyHeaderHeight={STICKY_HEADER_HEIGHT}
                    contentBackgroundColor={colors.white}
                    parallaxHeaderHeight={constants.screenHeight < 700 ? constants.screenHeight / 1.75 : constants.screenHeight / 1.95}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 0.8 }}
                    renderStickyHeader={() => this.renderStickyHeader(details)}
                    renderForeground={this.renderForeground}
                    scrollEvent={this.scrollEvent}
                    renderFixedHeader={() => this.renderFixedHeader()}
                    onChangeHeaderVisibility={(event) => console.log("event-->", event)}
                >
                    {this.renderBody()}
                </ParallaxScrollView>
                {
                    this.state.subscriptionModal
                        ?
                        <SubscriptionModal
                            visible={this.state.subscriptionModal}
                            isFromSettings={true}
                            isFromChangePlan={this.state.isFromChangePlan}
                            onPressSwitchPlan={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { switchplan: true, isFromSettings: true })
                            }}
                            onPressCancelSubscribtion={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { cancelSubscription: true, isFromSettings: true })
                            }}
                            onRequestClose={() => { this.setState({ subscriptionModal: false }) }}
                        />
                        : null
                }
                <Loader loading={this.props.loading} color={colors.white} />
            </View>
        );
    }

    /**render animated header component */
    renderFixedHeader = () => {
        if (this.state.showIcons) {
            return (
                <View style={styles.mainWrap}>
                    <View style={styles.innerWrap}>
                        <TouchableOpacity delayPressIn={0} style={styles.unreadWrap}
                            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20, }} onPress={() => this.props.navigation.navigate(commonText.noticationsRoute)}>
                            <SvgIcon name={icons.notificationIcon} height={26} width={22} />
                            {this.state.unreadCount > 0
                                ?
                                <View style={[styles.iconBackground, this.state.unreadCount > 999 ? { width: 50 } : {}]} >
                                    <Text
                                        style={styles.notificationCount}>
                                        {this.state.unreadCount}
                                    </Text>
                                </View>
                                : null}
                        </TouchableOpacity>
                        <TouchableOpacity delayPressIn={0} style={styles.svgWrap}
                            hitSlop={{ top: 20, left: 20, right: 20, bottom: 20, }} onPress={() => {
                                this.props.navigation.navigate(commonText.matchesRoute, { details: this.props.userProfileSetupDetails })
                            }}>
                            <SvgIcon name={icons.multipleUserIcon} height={25} width={30} />
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
        else {
            return null;
        }
    }
    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={{ height: 1, backgroundColor: colors.textInputBorder }}></View>
        )
    }

    /**render body portion of component */
    renderBody = () => {
        const { peroidUnit, peroidValue } = this.getAndroidData(this.state.currentPlanData.subscriptionPeriodAndroid);
        const { freeperoidValue, freeperoidUnit } = this.getAndroidFREETRIALData(this.state.currentPlanData.freeTrialPeriodAndroid);
        let planPeriod = this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0 ? constants.isIOS ? this.state.currentPlanData.subscriptionPeriodNumberIOS : peroidValue : "";
        let planUnit = this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0 ? constants.isIOS ? this.state.currentPlanData.subscriptionPeriodUnitIOS : peroidUnit : "";
        let freeTimeText = this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0 ? constants.isIOS ? this.state.currentPlanData.introductoryPriceNumberOfPeriodsIOS + " " + this.state.currentPlanData.introductoryPriceSubscriptionPeriodIOS : freeperoidValue + " " + freeperoidUnit : ""
        let details = this.props;
        return (
            <View style={styles.mainBodyWrap}>
                <View style={styles.innerBodyWrap}>
                    <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        contentContainerStyle={styles.flatlistContainer}
                        data={profileItems}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                    />
                    <View style={styles.separateView}>
                    </View>
                    {this.state.isUserSubscribed && this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0 ?
                        <View>
                            <View style={styles.changePlanWrap}>
                                <Text style={styles.currenltPlan}>{commonText.currentPlanText}</Text>
                                <TouchableOpacity onPress={() => {
                                    this.setState({ subscriptionModal: true, isFromChangePlan: true, })
                                    if (this.refs.ScrollView) this.refs.ScrollView.refs.ScrollView.scrollTo({ index: 0 })
                                }}
                                    activeOpacity={constants.activeOpacity} delayPressIn={0} style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: colors.blueShade1, borderRadius: 50, paddingHorizontal: 10, paddingVertical: 5 }}>
                                    <Text style={styles.changePlan}>{commonText.changePlanText}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.subscriptionMainView}>
                                <View style={styles.mothView}>
                                    <Text style={styles.digitText}>{planPeriod}</Text>
                                    <Text style={styles.monthText}>{planUnit}</Text>
                                </View>
                                <View style={styles.priceView}>
                                    <Text style={styles.freeTrialText}>{freeTimeText + commonText.freeText}</Text>
                                    <Text style={styles.dayDigitText}>{this.state.currentPlanData.localizedPrice}</Text>
                                </View>
                            </View>
                        </View>
                        :
                        this.state.isUserSubscribed == false
                            ?
                            <CustomButton
                                title={commonText.SubscriptionPlan}
                                mainStyle={styles.logout}
                                onPress={() => {
                                    this.setState({ subscriptionModal: true })
                                    if (this.refs.ScrollView) this.refs.ScrollView.refs.ScrollView.scrollTo({ index: 0 })
                                }}
                            />
                            : null
                    }
                </View>
            </View>
        )
    }

    /**render animated sticky header component */
    renderStickyHeader = (details) => {
        return (
            <View style={styles.headerWrap}>
                <View>
                    <Text style={[styles.name]}>{details.userProfileSetupDetails.name ? convetCapital(details.userProfileSetupDetails.name) : null}</Text>
                </View>
            </View>
        )
    }

    /**render method for display body portion */
    renderItem = ({ item, index }) => {
        let show = false;
        if (this.props.userProfileSetupDetails) {
            const { google_id, facebook_id, apple_id } = this.props.userProfileSetupDetails;
            if ((google_id && google_id != null) || (facebook_id && facebook_id != null) || (apple_id && apple_id != null)) {
                show = false;
            }
            else {
                show = true;
            }
        }
        if (item.title == "Change Password") {
            if (!show) { return null; }
            else {
                return (
                    <View style={styles.profileItemsList}>
                        <TouchableOpacity
                            onPress={() => this.onPressItems(item)}
                            style={styles.svgNewWrap}>
                            <SvgIcon
                                name={item.icon}
                                height={20}
                            />
                            <Text style={styles.listText}>{item.title}</Text>
                        </TouchableOpacity>
                    </View>
                )
            }
        }

        else {
            return (
                <View style={styles.profileItemsList}>
                    <TouchableOpacity
                        onPress={() => this.onPressItems(item)}
                        style={styles.wrapSvg}>
                        <SvgIcon
                            name={item.icon}
                            height={20}
                        />
                        <Text style={styles.listText}>{item.title}</Text>
                    </TouchableOpacity>
                </View>
            )
        }

    }

    /**action handling for body item clicks */
    onPressItems = (item) => {
        if (item.route) {
            this.props.navigation.navigate(item.route, { userDetails: this.props.userProfileSetupDetails, isFromSettings: true })
        }
    }

    /**render foreground portion of component (User image and name,email,age,phone no) */
    renderForeground = () => {
        let details = this.props;
        return (
            <View>
                <View style={styles.wrapPic}>
                    <View style={[styles.imageBorder, { marginTop: deviceInfoModule.hasNotch() ? 70 : 35 }]}>
                        <View style={styles.circle}>
                            <ImageBackground
                                source={this.state.gender == commonText.male ? images.profilePlaceHolder : images.placeHolderFemale}
                                style={styles.profilePic}
                                imageStyle={{ borderRadius: 75 }}
                            >
                                <FastImage
                                    source={this.props.mainProfileImage ?
                                        { uri: this.props.mainProfileImage }
                                        : this.state.gender == commonText.male ? images.profilePlaceHolder : images.placeHolderFemale}
                                    style={styles.profilePic} />
                            </ImageBackground>
                        </View>
                    </View>
                    <View style={styles.editMainWrap}>
                        <TouchableOpacity onPress={() => {
                            this.props.navigation.navigate(commonText.editProfileRoute, { userDetails: this.props.userProfileSetupDetails, })
                        }} delayPressIn={0} activeOpacity={constants.activeOpacity} style={styles.editIcon}>
                            <SvgIcon name={icons.pencilIcon} height={16} width={16} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.nameView}>
                    <Text numberOfLines={1} style={[styles.name, { textAlign: 'center' }]}>{details.userProfileSetupDetails.name ? convetCapital(details.userProfileSetupDetails.name) : null}</Text>
                    <Text style={[styles.name, { maxWidth: '30%' }]}>{details.userProfileSetupDetails.name && details.userProfileSetupDetails.date_of_birth ? "," : null} {details.userProfileSetupDetails.date_of_birth ? calculate_age(details.userProfileSetupDetails.date_of_birth) : null}</Text>
                </View>
                <Text numberOfLines={1} style={styles.email}>{details.userProfileSetupDetails.mobile_number ? "(+" + details.userProfileSetupDetails.country_code + ")" + " " + details.userProfileSetupDetails.mobile_number || "" : null} </Text>
                <Text numberOfLines={1} style={[styles.email, { marginTop: 0 }]}>{details.userProfileSetupDetails.email ? details.userProfileSetupDetails.email || "" : null} </Text>
            </View>
        )
    }
}

/**some useful constants for components */
const window = Dimensions.get('window');
const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = deviceInfoModule.hasNotch() ? 90 : 70;

/**component styling */
const styles = StyleSheet.create({
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: 300,
        justifyContent: 'flex-end'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20
    },
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    center: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: colors.blueShade1,
    },
    behind: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
        height: '95%',
        marginHorizontal: 3,
    },
    circle: {
        height: 160,
        width: 160,
        borderRadius: 90,
        alignSelf: 'center',
        justifyContent: 'center',
        borderColor: 'rgba(255,255,255,0.2)',
        borderWidth: 10
    },
    name: {
        color: colors.white,
        fontFamily: fonts.sukhumvitSetBold,
        fontSize: 24,
        marginTop: 20,
        maxWidth: '70%'
    },
    email: {
        color: colors.white,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        fontSize: 16,
        alignSelf: 'center',
    },
    innerView: {
        margin: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switchStyle: {
        marginRight: 5,
        transform: Platform.OS == 'ios' ? [{ scaleX: .9 }, { scaleY: .9 }] : [{ scaleX: 1.1 }, { scaleY: 1.1 }],
        alignSelf: 'flex-end'
    },
    blurredText: {
        marginLeft: 15,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black
    },
    flatlistContainer: {
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1.5,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 20,
        shadowRadius: 6,
        shadowOffset: {
            height: 10,
            width: 0,
        },
        marginTop: 20,
    },
    profileItemsList: {
    },
    listText: {
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        padding: 20
    },
    logout: {
        marginVertical: 15,
    },
    profilePic: {
        height: 130,
        width: 130,
        borderRadius: 75,
        overflow: 'hidden',
        alignSelf: 'center',
        overflow: 'hidden'
    },
    imageBorder: {
        alignSelf: 'center',
        height: 180,
        width: 180,
        borderRadius: 100,
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: colors.lightWhite
    },
    imageOuterView: {
    },
    nameView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    editMainWrap: {
        position: 'absolute',
        width: constants.screenWidth,
        bottom: 5,
        justifyContent: 'center', alignItems: 'center',
    },
    editIcon: {
        height: 32, width: 32,
        borderRadius: 50,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 25,
        width: 25,
        position: 'absolute',
        bottom: 29,
        left: 28,
        borderRadius: 20,
        backgroundColor: colors.white,
    },
    notificationCount: {
        color: colors.black,
        textAlign: 'center',
        fontSize: 10, alignItems: 'center'
    },
    subscriptionMainView: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1.5,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 20,
        shadowRadius: 6,
        shadowOffset: {
            height: 10,
            width: 0,
        },
        marginTop: 15,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 80
    },
    mothView: {
        flexDirection: "row",
        alignItems: 'flex-end'
    },
    digitText: {
        fontSize: 30,
        fontFamily: fonts.muliBold,
        color: colors.black,
        top: 5
    },
    monthText: {
        fontSize: 14,
        fontFamily: fonts.muliBold,
        color: colors.black,
    },
    priceView: {
        alignItems: 'center'
    },
    freeTrialText: {
        fontSize: 13,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
    },
    dayDigitText: {
        fontSize: 22,
        fontFamily: fonts.muliBold,
        color: colors.blueShade1,
    },
    changePlan: {
        fontSize: 12,
        fontFamily: fonts.muliSemiBold,
        color: colors.white
    },
    currenltPlan: {
        fontSize: 15,
        fontFamily: fonts.muliBold,
        color: colors.blueShade1
    },
    headerTitle: {
        textAlign: 'center',
        justifyContent: 'center'
    },
    mainWrap: {
        position: 'absolute',
        width: constants.screenWidth,
        paddingRight: 10
    },
    innerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-between",
        marginHorizontal: 15,
        justifyContent: 'space-between',
        paddingTop: deviceInfoModule.hasNotch() ? 40 : 30
    },
    unreadWrap: {
        height: 50, left: 0, width: 50,
        alignItems: 'center', justifyContent: 'center',
    },
    svgWrap: {
        height: 50, right: 0,
        alignItems: 'center', justifyContent: 'center',
    },
    mainBodyWrap: {
        backgroundColor: colors.blueShade1,
        paddingTop: deviceInfoModule.hasNotch() ? 35 : 20
    },
    innerBodyWrap: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    separateView: {
        height: 30, backgroundColor: 'red',
        position: 'absolute', top: 0, zIndex: 99
    },
    changePlanWrap: {
        flexDirection: "row", alignItems: 'center',
        justifyContent: "space-between", marginTop: 15, paddingHorizontal: 20
    },
    headerWrap: {
        height: STICKY_HEADER_HEIGHT,
        width: constants.screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: deviceInfoModule.hasNotch() ? 20 : 0
    },
    svgNewWrap: {
        flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 20
    },
    wrapSvg: {
        flexDirection: 'row',
        alignItems: 'center', paddingHorizontal: 20
    },
    wrapPic: {
        marginTop: 20,
        alignItems: "center", justifyContent: "center"
    }
});

export default Setting;
