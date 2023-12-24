import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard, FlatList, BackHandler } from 'react-native';
import { colors, commonText, constants } from '../../common';
import { fonts, icons } from '../../assets';
import { ChatCell, Header, } from '../../components';
import _ from 'lodash';
import moment from 'moment';
import Socket from '../../api/Socket';
import UserUtils from '../../utils/UserUtils';
import { convetCapital } from '../../utils/HelperFunction';
import { getHeight } from '../../utils/iPhoneXHelper';
import StorageService from '../../utils/StorageService';
import { NavigationEvents } from '@react-navigation/compat';
import ShareImageModal from './ShareImageModal';
import UserProfileViewer from '../../components/UserProfileViewer';
export let chatListRef;

/**Chat-Contact list screen Component */
class Chat extends Component {

    constructor(props) {
        super(props);
        this.arrayholder = [];
        this.state = {
            isSearched: false,
            showSearchBar: false,
            searchText: '',
            isUserSubscribed: false,
            gender: commonText.male,

            isTempModalVisible: false,
            activeImageSource: null,

            showBlurPics: false,
        }
        chatListRef = this;
    }

    async UNSAFE_componentWillMount() {
        await this.props.validateReceiptApicall()
        this.getcurrentSubscription()
    }

    /**componet life cycle method */
    async componentDidMount() {
        await this.getUserList();
        // this.subscribeFocus();

        await this.props.validateReceiptApicall()
        this.getcurrentSubscription()

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        // this.subscribeBlur = this.props.navigation.addListener('blur', () => this.handleBackPressRemove());

        const loggedInUser = await UserUtils.getUserDetailsFromAsyncStorage();
        Keyboard.dismiss();

        const userDetail = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetail) this.setState({ gender: userDetail.gender })

    }

    /**action when back button click */
    handleBackPressRemove = () => {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
    /**action when back button click */
    handleBackPressAdd = () => {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        this.navigationCall()
    }

    /**action when back button click */
    handleBackPress = () => {
        this.props.navigation.jumpTo(commonText.exploreRoute);
        return true;
    }

    /** get current subscription detail and 
     *  display on current running subscription section
     */
    getcurrentSubscription = async () => {
        let currentPlanData = await StorageService.getItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
        let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
        if (isActive == "1") {
            this.setState({ isUserSubscribed: true })
        }
        await this.getUserList();
    }

    /**componet life cycle method */
    componentWillUnmount() {
        // this.subscribeFocus();
        // this.backHandler.remove()
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    // /**action when screen is focused */
    // subscribeFocus = () => {
    //     this.props.navigation.addListener('focus', async () => await this.navigationCall());
    // }

    /**action for navigation call */
    navigationCall = async () => {
        this.onPressCross()
        await this.getUserList();
    }

    /**get the user-contact user list  */
    getUserList = async () => {
        const users = await this.props.getChatUsers();
        this.arrayholder = this.props.users;
    }

    /**componet render method */
    render() {
        console.log("this.props.users-->", this.props.users);
        const isFromNotification = this.props.route.params && this.props.route.params.isFromNotification

        return (
            <View style={styles.container}>
                <NavigationEvents onWillFocus={this.handleBackPressAdd} onWillBlur={this.handleBackPressRemove} />
                <Header
                    backButton={isFromNotification ? true : false}
                    middleText={commonText.chat}
                    showSearchField={true}
                    rightIcon
                    rightImage={icons.search}
                    rightIconHeight={15}
                    rightIconWidth={15}
                    onPress={this.onPressSearch}
                    showSearchBar={this.state.showSearchBar}
                    searchValue={this.state.searchText}
                    onPressSearchCross={this.onPressCross}
                    onChangeText={text => this.onChangeSearchText(text)}
                    mainStyle={{ height: getHeight(75) }}
                />
                <View>
                    <FlatList
                        data={this.props.users || []}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.contentContainerStyle}
                        ListEmptyComponent={this.renderEmptyComponent}
                        renderItem={this.renderChatListItem}
                        ItemSeparatorComponent={this.ItemSeparatorComponent}
                    />
                </View>
                <UserProfileViewer
                    modalVisible={this.state.isTempModalVisible}
                    onRequestClose={() => this.setState({ isTempModalVisible: false })}
                    imageSource={this.state.activeImageSource}
                    showBlurPics={this.state.showBlurPics}
                />
            </View>
        );
    }

    /**item seperator component */
    ItemSeparatorComponent = () => (
        <View style={{ height: 1, width: constants.screenWidth, backgroundColor: colors.textInputBorder, opacity: 0.5 }} />
    )

    /**render empty list component */
    renderEmptyComponent = () => (
        <View style={styles.noDataView}>
            <Text style={styles.noData}>{commonText.noDataText}</Text>
        </View>
    )

    /**render contact list single item */
    renderChatListItem = ({ item, index }) => {
        const {
            is_matched, is_typing,
            last_message, name, profile_pic, user_id, is_online,
            last_messaged_at, receiver_liked_by_you, receiver_ignored_by_you,
            want_blur_pics,
        } = item;
        let isShowData = false;
        let showBlurPics = false;
        if (is_matched === 1) {
            isShowData = true;
        }
        else if (is_matched === 0) {
            if (this.state.isUserSubscribed) {
                isShowData = true;
            }
            else if (receiver_liked_by_you || receiver_ignored_by_you) {
                isShowData = true;
            }
            else {
                isShowData = false;
            }
        }

        if (want_blur_pics == commonText.yes) {
            showBlurPics = true
        }
        else if (want_blur_pics == commonText.no) {
            if (this.state.isUserSubscribed || is_matched === 1 || receiver_liked_by_you || receiver_ignored_by_you) {
                showBlurPics = false
            }
            else {
                showBlurPics = true
            }
        }

        var dateString = moment.unix(last_messaged_at).format("DD MMM, YYYY ")
        var newDate = new Date(last_messaged_at * 1000).toLocaleDateString("en-Us")
        return (
            <View>
                <ChatCell
                    isUserSubscribed={this.state.isUserSubscribed}
                    isMatched={is_matched}
                    imageSource={profile_pic}
                    userName={convetCapital(name)}
                    gender={this.state.gender}
                    isOnline={is_online}
                    lastMesssage={is_typing === 1 ? "typing..." : last_message}
                    lastMesssageDate={dateString}
                    onPressCell={() => this.onPressCell(item, index)}
                    isBlurPhoto={showBlurPics}
                    isStarText={!isShowData}
                    onPressLeftImage={() => {
                        // if (profile_pic && is_matched && this.state.isUserSubscribed) {
                        //     this.setState({ isTempModalVisible: true, activeImageSource: profile_pic })
                        // }
                        // else {

                        // }
                        if (this.state.isUserSubscribed || is_matched) {
                            this.setState({ isTempModalVisible: true, activeImageSource: profile_pic, showBlurPics })
                        }
                        else if (receiver_liked_by_you || receiver_ignored_by_you) {
                            this.setState({ isTempModalVisible: true, activeImageSource: profile_pic, showBlurPics })
                        }
                    }}
                />
            </View>
        )
    }

    /**action when user click on single cell */
    onPressCell = async (item, index) => {
        const loggedInUser = await UserUtils.getUserDetailsFromAsyncStorage();
        Keyboard.dismiss();
        const method_name = 'loginChat';
        const responseObj = await Socket.sendRequest(method_name, { receiver_id: item.user_id });
        if (responseObj.method_name == method_name && responseObj.code === 1) {
            const id = responseObj.data.user_id;
            this.setState({ showSearchBar: false });
            this.onPressCross()
            const userDetails = {
                id,
                chat_user_id: item.user_id,
                profile_pic: item.profile_pic,
                name: item.name,
                loggedInUser_id: loggedInUser.user_id,
                badges: item.badges,
                is_matched: item.is_matched,
                is_blocked: item.is_blocked,
                is_blocked_by_you: item.is_blocked_by_you,
                is_typing: item.is_typing,
                receiver_ignored_by_you: item.receiver_ignored_by_you,
                receiver_liked_by_you: item.receiver_liked_by_you,
                want_blur_pics: item.want_blur_pics
            }
            this.props.navigation.navigate(commonText.chatWindowRoute, {
                userDetails,
                id,
                chat_user_id: item.user_id,
                profile_pic: item.profile_pic,
                name: item.name,
                loggedInUser_id: loggedInUser.user_id,
                badges: item.badges,
                is_matched: item.is_matched,
                is_blocked: item.is_blocked,
                is_blocked_by_you: item.is_blocked_by_you,
                is_typing: item.is_typing,
                receiver_liked_by_you: item.receiver_liked_by_you,
                receiver_ignored_by_you: item.receiver_ignored_by_you,
                want_blur_pics: item.want_blur_pics
            });
        }
    }

    /**action when user click on search button */
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

    /**mehod for hadnle searching text */
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
        this.props.chatSetSearchedArrayList(SearchData)
    }

    /**handling cross button of searchbar */
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
}

export default Chat;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    noDataView: {
        alignItems: 'center', justifyContent: 'center',
        height: constants.screenHeight / 1.5,
        width: '100%',
    },
    noData: {
        fontSize: 16,
        color: colors.grayShadeDark,
        fontFamily: fonts.muliSemiBold,
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingBottom: 150, paddingTop: 10
    }
})