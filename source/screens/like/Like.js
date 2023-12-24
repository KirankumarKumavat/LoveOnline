import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Keyboard, BackHandler } from 'react-native';

import crashlytics from '@react-native-firebase/crashlytics';

import { fonts, icons, images } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, LikeImageComponent, Loader } from '../../components';
import _ from 'lodash';
import UserUtils from '../../utils/UserUtils';
import { calculate_age, convetCapital } from '../../utils/HelperFunction';
import { getHeight } from '../../utils/iPhoneXHelper';
import StorageService from '../../utils/StorageService';
import SubscriptionModal from '../setting/SubscriptionModal';
import NavigationService from '../../utils/NavigationService';
import { NavigationEvents } from '@react-navigation/compat';
export let liketabRef;


/**Like tab screen component */
class Like extends Component {

    arrayholder = []

    constructor(props) {
        super(props);
        liketabRef = this;
    }

    /**key extractor for list */
    keyExtractor = (item, index) => index.toString()

    state = {
        activeTabIndex: 2,
        showSearchBar: false,
        value: '',
        isSearched: false,
        searchText: '',
        arrayholder: [],
        likeTabList: [
            {
                id: 0,
                tabName: commonText.likedyouText,
                apiName: "likedYou",
                arrayName: "likedYouData",
                apiKeyForUserProfiles: 'user_id',
                isMessageButton: false,
                hideApiKey: "liked_user_id",
                hideApiName: "hideLikedYou",
                emptyArrayMessage: commonText.likedYouemptyMessage,
                emptySearchMessage: commonText.emptySearchLikedYouMessage,
                tabPageNumber: 1,
                totalPages: 0,
            },
            {
                id: 1,
                tabName: commonText.passedText,
                apiName: "passedByYou",
                arrayName: "passedByYouData",
                apiKeyForUserProfiles: 'ignored_user_id',
                isMessageButton: true,
                hideApiKey: "ignored_user_id",
                hideApiName: "hidePassedByYou",
                emptyArrayMessage: commonText.ignoredemptyMessage,
                emptySearchMessage: commonText.emptySearchIgnoredMessage,
                tabPageNumber: 1,
                totalPages: 0,
            },
            {
                id: 2,
                tabName: commonText.likedText,
                apiName: "likedByYou",
                isCrossButton: true,
                arrayName: "likedByYouData",
                isCancelButton: true,
                apiKeyForUserProfiles: 'liked_user_id',
                isMessageButton: true,
                hideApiKey: "liked_user_id",
                hideApiName: "hideLikedByYou",
                emptyArrayMessage: commonText.likedemptyMessage,
                emptySearchMessage: commonText.emptySearchLikedMessage,
                tabPageNumber: 1,
                totalPages: 0,
            },
            {
                id: 3,
                tabName: commonText.blockedText,
                apiName: "blockedByYou",
                isUnblockButton: true,
                arrayName: "blockedByYouData",
                apiKeyForUserProfiles: 'blocked_user_id',
                isMessageButton: false,
                hideApiKey: "blocked_user_id",
                hideApiName: "hideBlockedByYou",
                emptyArrayMessage: commonText.blockedemptyMessage,
                emptySearchMessage: commonText.emptySearchBlockedMessage,
                tabPageNumber: 1,
                totalPages: 0,
            }
        ],
        isMale: false,
        isUserSubscribed: false,
        subscriptionModal: false,
    }

    async UNSAFE_componentWillMount() {
        this.props.likeRequest()
        this.props.resetData()

    }

    /**componet life cycle method */
    async componentDidMount() {
        crashlytics().log('Like Tab mounted.');

        this.props.likeRequest()
        this.props.resetData()

        // const isFromNotification = this.props.route.params && ((this.props.route.params.params && this.props.route.params.params.isFromNotification) || this.props.route.params.isFromNotification)
        const isFromNotification = this.props.route.params && ((this.props.route.params.params && this.props.route.params.params.isFromNotification) || this.props.route.params.isFromNotification)


        // const activeTabIndex = this.props.route.params && ((this.props.route.params.params && this.props.route.params.params.activeTabIndex) || this.props.route.params.activeTabIndex)
        const activeTabIndex = this.props.route.params && (this.props.route.params.params && this.props.route.params.params.activeTabIndex)

        console.log("activeTabIndex->", activeTabIndex);
        console.log("this.props.->", this.props);
        // alert(activeTabIndex)
        if (isFromNotification) {
            console.log("isFromNotification->", isFromNotification);
            this.setState({ activeTabIndex }, async () => {
                await this.getUserListData()
                this.setArrayValueToArrayHolder();
            })
        }
        else {
            await this.getUserListData()
            this.setArrayValueToArrayHolder();
        }

        const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        let isMale = userDetails.gender == commonText.male ? false : true;
        this.setState({ isMale })

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.subscribeBlur = this.props.navigation.addListener('blur', () => this.handleBackPressRemove());

        await this.props.validateReceiptApicall()
        this.getcurrentSubscription()

        // this.props.navigation.addListener("tabPress", (event) => { console.log("event tabPress---->", event) })
    }

    /**handle back press event */
    handleBackPressRemove = () => {
        this.backHandler.remove()
    }

    /**handle back press event */
    handleBackPress = () => {

        const isFromNotification = this.props.route.params && ((this.props.route.params.params && this.props.route.params.params.isFromNotification) || this.props.route.params.isFromNotification)
        console.log("isFromNotificationisFromNotification --", isFromNotification);
        if (isFromNotification == true) {
            NavigationService.goBack()
        }
        else {
            this.props.navigation.jumpTo(commonText.exploreRoute);
            return true;
        }


    }
    /** get current subscription detail and 
         *  display on current running subscription section
         */
    getcurrentSubscription = async () => {
        let currentPlanData = await StorageService.getItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
        let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
        let planName = ""
        let planExpiryDate = ""
        let selectedPlan = 0
        let planPrice = "";
        if (isActive == "1") {
            this.setState({ isUserSubscribed: true })
        }

    }

    /**open subscription modal */
    openSubscribeModal() {
        this.setState({ subscriptionModal: true })
    }

    /**hide subscription modal */
    closeSubscribeModal() {
        this.setState({ subscriptionModal: false })
    }

    /**get the user list data based on selected from all 4 tab */
    getUserListData = async () => {
        const params = {
            apiName: this.state.likeTabList[this.state.activeTabIndex].apiName,
            arrayName: this.state.likeTabList[this.state.activeTabIndex].arrayName,
            page_no: this.state.likeTabList[this.state.activeTabIndex].tabPageNumber
        }
        this.state.likeTabList[this.state.activeTabIndex].tabPageNumber = this.state.likeTabList[this.state.activeTabIndex].tabPageNumber + 1;
        this.setState({ likeTabList: this.state.likeTabList })
        this.props.getUserListForLikeTab(params)
    }

    /**sets array list value to local holder */
    setArrayValueToArrayHolder = (/*arrayvalue*/) => {
        let arrayvalue = this.state.likeTabList[this.state.activeTabIndex].arrayName;
        this.arrayholder = this.props[arrayvalue];
        this.forceUpdate();
    }
    
    /**sets the custom index for tab */
    setCustomIndex = (index) => {
        this.setState({ activeTabIndex: index }, () => {
            console.log("ActiveIndex-->", this.state.activeTabIndex);
        })
    }

    /**action handle for search button click */
    onPressSearch = () => {
        this.setState({ showSearchBar: !this.state.showSearchBar }, () => {
            if (!this.state.showSearchBar) {
                Keyboard.dismiss()
                this.setState({ searchText: '' }, () => {
                    this.onChangeSearchText(this.state.searchText)
                })
            }
        })
    }

    /**action handle for cross button click of search bar */
    onPressCross = () => {
        if (this.state.searchText.trim() == "") {
            this.setState({ searchText: '', showSearchBar: false }, () => {
                this.onChangeSearchText(this.state.searchText)
            })
        }
        else {
            this.setState({ searchText: '' }, () => {
                this.onChangeSearchText(this.state.searchText)
            })
        }
    }
    /**handle back press event */
    handleBackPressAdd = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**set the total pages */
    setTotalPage = (value) => {
        this.state.likeTabList[this.state.activeTabIndex].totalPages = value;
        this.setState({ likeTabList: this.state.likeTabList })
    }

    /**componet render method */
    render() {
        const isFromNotification = this.props.route.params && ((this.props.route.params.params && this.props.route.params.params.isFromNotification) || this.props.route.params.isFromNotification)

        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this.handleBackPressAdd} onWillBlur={this.handleBackPressRemove} />
                <Header
                    backButton={isFromNotification ? true : false}
                    onBackButtonPress={this.handleBackPress}
                    middleText={commonText.likesText}
                    leftIcon={icons.filterBlueIcon}
                    leftIconPress={this.onFilterIconPress}
                    showShadow={false}
                    showSearchField={true}
                    rightIcon
                    rightImage={icons.search}
                    rightIconHeight={15}
                    rightIconWidth={15}
                    onPress={this.onPressSearch}
                    showSearchBar={this.state.showSearchBar}
                    // mainStyle={{ height: 80 }}
                    onChangeText={text => this.onChangeSearchText(text)}
                    searchValue={this.state.searchText}
                    onPressSearchCross={this.onPressCross}
                    mainStyle={{ height: getHeight(75) }}
                />
                <View style={styles.mainWrap}>
                    <View style={styles.tabView}>
                        {
                            this.state.likeTabList.map((obj) => {
                                let sameValue = this.state.activeTabIndex == obj.id
                                let color = sameValue ? colors.blueShade1 : colors.textColor;
                                let borderColor = sameValue ? colors.blueShade1 : colors.transparent;
                                let borderBottomWidth = sameValue ? 4 : 4
                                return (
                                    <TouchableOpacity
                                        delayPressIn={0}
                                        activeOpacity={constants.activeOpacity}
                                        onPress={() => this.onPressTab(obj)}
                                        style={[styles.tabWrap, { borderBottomWidth, borderColor }]}
                                    >
                                        <Text style={[styles.tabName, { color }]}>{obj.tabName}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.getListData()}
                        extraData={this.props}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        renderItem={this.renderUserListItem}
                        numColumns={2}
                        keyExtractor={this.keyExtractor}
                        ListEmptyComponent={() => this.props.loading ? null : this.renderEmptyComponent()}
                        contentContainerStyle={styles.contentContainerStyle}
                        onEndReachedThreshold={0.1}
                        onEndReached={this.onEndReached}
                    />
                </View>
                {
                    this.state.subscriptionModal
                        ?
                        <SubscriptionModal
                            visible={this.state.subscriptionModal}
                            isFromLike={true}
                            onRequestClose={() => { this.setState({ subscriptionModal: false }) }}
                            onPressSwitchPlan={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { switchplan: true, isFromLike: true })
                            }}
                            onPressCancelSubscribtion={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { cancelSubscription: true, isFromLike: true })
                            }}
                        />
                        : null
                }
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**action handle when scroll ends and fetching new data */
    onEndReached = () => {
        let tabPageNumber = this.state.likeTabList[this.state.activeTabIndex].tabPageNumber;
        let totalPages = this.state.likeTabList[this.state.activeTabIndex].totalPages;

        if (tabPageNumber <= totalPages) {
            const params = {
                apiName: this.state.likeTabList[this.state.activeTabIndex].apiName,
                arrayName: this.state.likeTabList[this.state.activeTabIndex].arrayName,
                page_no: tabPageNumber,
            }
            this.state.likeTabList[this.state.activeTabIndex].tabPageNumber = this.state.likeTabList[this.state.activeTabIndex].tabPageNumber + 1;
            this.setState({ likeTabList: this.state.likeTabList })
            this.props.getUserListForLikeTab(params)
        }
        else {
            console.log("No Data");
        }
    }

    /**render empty list component */
    renderEmptyComponent = () => {
        let emptyArrayMessage = this.state.likeTabList[this.state.activeTabIndex].emptyArrayMessage;
        let emptySearchMessage = this.state.likeTabList[this.state.activeTabIndex].emptySearchMessage;
        let message = this.state.showSearchBar && this.state.searchText.trim() != "" ? emptySearchMessage : emptyArrayMessage
        return (
            <View style={styles.noDataView}>
                <Text style={styles.noData}>{message}</Text>
            </View>
        )
    }

    /**render list item */
    renderUserListItem = ({ item, index }) => {
        const { ignored_user_id, name, profile_pic,
            want_blur_pics, user_id, blocked_user_id,
            liked_user_id, date_of_birth,
        } = item;
        let isBlurPhoto = want_blur_pics == commonText.yes ? true : false;
        let isCancelButton = this.state.likeTabList[this.state.activeTabIndex].isCancelButton ? true : false;
        let isUnblockButton = this.state.likeTabList[this.state.activeTabIndex].isUnblockButton ? true : false;
        let userAge = date_of_birth ? calculate_age(date_of_birth) : null;
        try {
            return (
                <View>
                    <LikeImageComponent
                        source={profile_pic}
                        isMale={this.state.isMale}
                        userAge={userAge}
                        userName={convetCapital(name)}
                        isBlurPhoto={isBlurPhoto}
                        isCancelButton={true}
                        isUnblockButton={isUnblockButton}
                        onPressImage={() => this.onPressImage(item, index)}
                        onPressUnBlockButton={() => this.onPressUnBlockButton(item, index)}
                        onPressCancel={() => this.onPressCancel(item, index)}
                    />
                </View>
            )
        } catch (error) {
            crashlytics().recordError(error);
        }
    }

    /**click event for image click handling */
    onPressImage = async (item, index) => {
        if (this.state.activeTabIndex === 0) {
            if (this.state.isUserSubscribed) {
                let apiKeyForUserProfiles = this.state.likeTabList[this.state.activeTabIndex].apiKeyForUserProfiles;
                let isMessageButton = this.state.likeTabList[this.state.activeTabIndex].isMessageButton;
                let user_id = item[apiKeyForUserProfiles];
                let isUnblockButton = this.state.likeTabList[this.state.activeTabIndex].isUnblockButton;
                let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
                let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName;
                let apiName = this.state.likeTabList[this.state.activeTabIndex].apiName;

                this.props.navigation.navigate(commonText.exploreRoute, {
                    isFromLike: true,
                    user_id,
                    isMessageButton,
                    isUnblockButton,
                    arrayName,
                    apiName,
                })
            }
            else {
                this.openSubscribeModal()
            }
        }
        else {
            let apiKeyForUserProfiles = this.state.likeTabList[this.state.activeTabIndex].apiKeyForUserProfiles;
            let isMessageButton = this.state.likeTabList[this.state.activeTabIndex].isMessageButton;
            let user_id = item[apiKeyForUserProfiles];
            let isUnblockButton = this.state.likeTabList[this.state.activeTabIndex].isUnblockButton;
            let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
            let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName;
            let apiName = this.state.likeTabList[this.state.activeTabIndex].apiName;

            this.props.navigation.navigate(commonText.exploreRoute, {
                isFromLike: true,
                user_id,
                isMessageButton,
                isUnblockButton,
                arrayName,
                apiName,
            })
        }
    }

    /**click event handle for unblock button */
    onPressUnBlockButton = (item, index) => {
        const { blocked_user_id } = item;
        const params = {
            apiName: this.state.likeTabList[this.state.activeTabIndex].apiName,
            arrayName: this.state.likeTabList[this.state.activeTabIndex].arrayName,
            blocked_user_id,
            page_no: 1
        }
        this.props.unblockUserForLikeTab(params);
        Keyboard.dismiss()
        this.onPressCross();
    }

    /**click event handle for cancel button */
    onPressCancel = async (item, index) => {
        let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName
        let apiName = this.state.likeTabList[this.state.activeTabIndex].apiName
        let hideApiName = this.state.likeTabList[this.state.activeTabIndex].hideApiName
        let hideApiKey = this.state.likeTabList[this.state.activeTabIndex].hideApiKey
        let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        let key = item[hideApiKey];
        const finalParams = {
            arrayName,
            apiName,
            hideApiName,
            page_no: 1
        }
        let params;

        if (apiName == "likedYou") {
            params = {
                user_id: item["user_id"],
                [hideApiKey]: userDetails.user_id,
            }
        }
        else {
            params = {
                [hideApiKey]: item[hideApiKey],
                user_id: userDetails.user_id,
            }
        }
        this.props.removeUserFromListForLikeTab(params, finalParams);
    }

    /**click event for filter icon press */
    onFilterIconPress = () => {
        let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName
        let apiName = this.state.likeTabList[this.state.activeTabIndex].apiName
        let tabPageNumber = this.state.likeTabList[this.state.activeTabIndex].tabPageNumber
        const params = {
            arrayName, apiName, page_no: 1
        }
        this.props.navigation.navigate(commonText.filterRoute, {
            isFromLike: true,
            params
        });
    }

    /**reset values for tab and component */
    resetValues = () => {
        this.state.likeTabList.map((obj) => obj.tabPageNumber = 1);
        let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName
        this.props.likeResetSpecificTabList(arrayName);
    }

    /**click event for click on Tab */
    onPressTab = async (obj) => {
        crashlytics().log("Tab Press");
        Keyboard.dismiss();
        if (obj.id != this.state.activeTabIndex) {
            this.props.likeRequest()
            this.state.likeTabList.map((obj) => obj.tabPageNumber = 1);
            let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName
            this.props.likeResetSpecificTabList(arrayName);
            this.arrayholder = [];
            this.onPressCross();
            this.setState({
                activeTabIndex: obj.id, showSearchBar: false,
                searchText: ""
            }, async () => {
                await this.getUserListData()
                this.setArrayValueToArrayHolder()
            })
        }
    }

    /**get the userlist data based on selected tab */
    getListData = () => {
        let arrayvalue = this.state.likeTabList[this.state.activeTabIndex].arrayName;
        let arrayName = this.props[arrayvalue];
        return arrayName
    }

    /**handling for searching text */
    onChangeSearchText = (searchText) => {
        let newSearchtext1 = searchText.replace(/\s+/g, " ");
        let newSearchtext = newSearchtext1.replace(/^\s+|\s+$/g, "");
        let newObj = newSearchtext.split(" ");
        const SearchData = _.filter(this.arrayholder, (obj) => {
            let finalName = obj.name.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "");
            let newObj11;
            let count = 0;
            const itemData11 = finalName ? finalName.toUpperCase()
                : ''.toUpperCase();
            (
                _.map(newObj,
                    (obj1) => {
                        newObj11 = obj1.toUpperCase();
                        if (itemData11.indexOf(newObj11) > -1) {
                            count = count + 1
                        }
                    })
            )
            if (count == newObj.length) {
                return itemData11.indexOf(newObj11) > -1
            }
        })
        this.setState({
            searchText,
            displayProfleData: SearchData
        });
        let arrayName = this.state.likeTabList[this.state.activeTabIndex].arrayName;
        this.props.likeSetSearchUserList(SearchData, arrayName)
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.props.resetData()
        this.backHandler.remove()
        this.setState({ activeTabIndex: 2 })
    }
}
export default Like;
/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    tabView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        backgroundColor: colors.white,
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        elevation: 9,
        shadowRadius: 6,
        shadowOffset: {
            height: 4,
            width: 0,
        },
    },
    tabName: {
        fontSize: 16,
        color: colors.textColor,
        fontFamily: fonts.muli
    },
    tabWrap: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 5
    },
    shadowView: {
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        elevation: 15,
        shadowRadius: 6,
        shadowOffset: {
            height: 4,
            width: 0,
        },

        height: 5,
        backgroundColor: colors.white
    },
    noDataView: {
        alignItems: 'center',
        justifyContent: 'center',
        height: constants.screenHeight / 1.4,
        width: '100%',
        paddingHorizontal: 30,
    },
    noData: {
        fontSize: 16,
        color: colors.grayShadeDark,
        fontFamily: fonts.muliSemiBold,
        textAlign: 'center'
    },
    mainWrap: {
        overflow: 'hidden',
        paddingBottom: 10
    },
    contentContainerStyle: {
        paddingBottom: 100,
        paddingTop: 10
    }
})