import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, BackHandler, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors, commonText, constants } from '../../common';
import { fonts, icons, } from '../../assets';
import SvgIcon from '../../components/SvgIcon';
import { Header, Loader } from '../../components';
import apiConfigs from '../../api/apiConfig';
import { settingTabRef } from './Setting';
import _ from 'lodash';
import { Notifications as AllNotifcations } from 'react-native-notifications';
import { showSimpleAlert } from '../../utils/HelperFunction';
import NavigationService from '../../utils/NavigationService';
var Spinner = require('react-native-spinkit');

const moment = require('moment');

/** Notifications screen component */
class Notifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            insideLoadMore: false,
            has_more: 0,
            list: []
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        this.getNotifications();

        this.subscribeFocus = this.props.navigation.addListener('focus', async () => await this.onScreenFocus());

        AllNotifcations.ios.setBadgeCount(0);
        AllNotifcations.removeAllDeliveredNotifications();

        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**action when screen is focued */
    onScreenFocus = async () => {
        this.setState({ page: 1, list: [] }, () => this.getNotifications())
    }

    /**action fire when back button click */
    handleBackPress = () => {
        this.props.navigation.goBack()
        return true;
    }

    /**action method to get all notifications from database */
    getNotifications = async (isFromLoadMore) => {
        await this.props.getNotificationData(this.state.page, isFromLoadMore);
        this.setState({ has_more: this.props.notificationList.notificationCount, list: this.state.insideLoadMore ? [...this.state.list, ...this.props.notificationList.notifications] : this.props.notificationList.notifications })
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.props.resetData()
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    /**action method to handle clear all notifications */
    clearAllPressed = async () => {
        const params = {
        };
        Alert.alert(
            constants.AppName,
            commonText.clearAllNotiText,
            [
                {
                    text: commonText.no,
                    onPress: () => null
                },
                {
                    text: commonText.yes,
                    onPress: async () => {
                        await this.props.clearAllNotificationFromList(params);
                        this.setState({ page: 1 })
                        this.onScreenFocus()
                    }
                }
            ]
        )
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <Header
                    theme={0}
                    onBackButtonPress={this.handleBackPress}
                    backButton
                    middleText={commonText.notifications}
                    rightText={this.state.list.length ? 'Clear All' : null}
                    onPressRightText={() => this.state.list.length ? this.clearAllPressed() : null}
                    rightFlex={1}
                    filterMiddleView={{
                        marginLeft: 30
                    }}
                    rightSideTextStyle={styles.rightSideTextStyle}
                />
                <FlatList
                    ref={(ref) => this.flatListRef = ref}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.state.list ? _.uniqBy(this.state.list, "notification_id") : []}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.loadMoreData}
                    ListFooterComponent={this.renderFooterComponent}
                    onEndReachedThreshold={0.3}
                    initialNumToRender={10}
                    extraData={this.props.notificationList}
                    ListEmptyComponent={this.props.loading ? null : this.renderEmptyList}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /** render method to display empty list component */
    renderEmptyList = () => {
        return (
            <View style={styles.emptyText}>
                <Text>{commonText.noNotificationFound}</Text>
            </View>
        )
    }

    /**render footer component for pagination loading */
    renderFooterComponent = () => {
        if (this.props.isLoadMoreLoading) {
            return (
                // <ActivityIndicator
                //     animating={this.props.isLoadMoreLoading}
                //     size={30}
                //     color={colors.blueShade1}
                // />
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    <Spinner
                        type={'Circle'}
                        color={colors.blueShade1}
                        size={30}
                    />
                </View>
            )
        }
        else return null;
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparator}></View>
        )
    }

    /**render method for display notification list   */
    renderItem = ({ item, index }) => {
        var dateString = moment.unix(item.created_date).format("DD-MMM-YYYY, hh:mm A")
        return (
            <TouchableOpacity style={styles.notificationCell}
                activeOpacity={constants.activeOpacity}
                delayPressIn={0}
                onPress={() => this.onPressItems(item)}
            >
                <Text style={[styles.listText, { color: item.is_read == 0 ? colors.blueShade1 : colors.notificationTextColor }]}>{item.text}</Text>
                <View style={styles.wrap}>
                    <SvgIcon height={15} width={15} name={icons.clockIcon} />
                    <Text style={[styles.dateTime, { marginLeft: 10 }]}>{dateString}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    /**action handling for clicking of single notifcation tap */
    onPressItems = (item) => {
        let { notify_type } = item;
        const params = {
            notification_id: item.notification_id
        }
        if (item.is_read == 0) {
            this.props.readNotification(params)
        }
        switch (notify_type) {
            case Number(apiConfigs.MATCHED_TYPE):
                this.handleMatchUserNotification(item)
                break;

            case Number(apiConfigs.GET_MESSAGE_TYPE):
                this.handleGetMessageNotification(item)
                break;

            case Number(apiConfigs.LIKE_PROFILE_TYPE):
                this.handleLikeProfileNotification(item)
                break;

            // case Number(apiConfigs.SUBSCRIPTION_EXPIRE_TYPE):
            //     this.handleSubscriptionExpireNotification(item)
            //     break;
            case Number(apiConfigs.UNMATCH_USER_TYPE):
                this.handleUnMatchNotification(item)
                break;
        }
    }

    /**handle unmatch type notification */
    handleUnMatchNotification = (item) => {
        let userName = item.text.split("has unmatched");
        userName = userName && userName[0] && userName[0].trim()
        showSimpleAlert(`You are no longer a match with ${userName} and all your chat history with ${userName} has been removed.`)
        if (item.is_read == 0) {
            this.onScreenFocus()
        }
    }

    /**handle match type notification */
    handleMatchUserNotification = (item) => {
        let userName = item.text.split("has unmatched");
        userName = userName && userName[0] && userName[0].trim()
        if (item.is_matched === 1) {
            this.props.navigation.navigate(commonText.exploreRoute, {
                isFromNotification: true,
                user_id: item.sender_id
            })
        }
        else {
            showSimpleAlert(commonText.unmatchWarningText)
            if (item.is_read == 0) {
                this.onScreenFocus()
            }
        }
    }

    /**handle get message(chat) type notification */
    handleGetMessageNotification = (item) => {
        NavigationService.popToTop()
        this.props.navigation.navigate(commonText.chatRoute, { isFromNotification: true })
    }

    /**handle like profile type notification */
    handleLikeProfileNotification = (item) => {

        NavigationService.popToTop()

        NavigationService.navigate(commonText.likeRoute,
            {
                params: {
                    isFromNotification: true,
                    activeTabIndex: 0
                }
            }
        )
    }

    /**handle subscription expire type notification */
    handleSubscriptionExpireNotification = (item) => {
        this.props.navigation.goBack();
        if (settingTabRef) {
            settingTabRef.openSubscribeModal()
        }
    }

    /**action handling for get more notification if available in list(pagination) */
    loadMoreData = ({ distanceFromEnd }) => {
        this.setState({ insideLoadMore: true })
        if (distanceFromEnd < 0) return;
        if (this.state.has_more > 0
            && this.props.notificationList.notifications.length != this.props.notificationList.notificationCount) {
            this.setState({ page: this.state.page + 1, }, () => {
                let isFromLoadMore = true;
                this.getNotifications(isFromLoadMore);
            })
        }
        else {
            console.log("inside load more else part");
        }
    };
}

export default Notifications;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    flatlistContainer: {
        marginHorizontal: 10,
        flexGrow: 1,
        paddingVertical: 10,
        paddingBottom: 50,
    },
    listText: {
        fontSize: 16,
        fontFamily: fonts.muli,
        color: colors.textColor,
        alignItems: 'center'
    },
    notificationCell: {
        borderWidth: 1,
        borderColor: colors.borderlightColor,
        marginTop: 15,
        borderRadius: 10,
        alignContent: 'center',
        paddingHorizontal: 15,
        paddingVertical: 12
    },
    dateTime: {
        flexDirection: 'row',
        fontSize: 12,
        color: colors.grayShadeDark,
        fontFamily: fonts.muliSemiBold
    },
    rightSideTextStyle: {
        fontSize: 14,
        fontFamily: fonts.muliBold
    },
    emptyText: {
        flex: 1,
        justifyContent: 'center', alignSelf: 'center'
    },
    itemSeparator: {
        height: 1,
        backgroundColor: colors.textInputBorder, marginHorizontal: 10
    },
    wrap: {
        flexDirection: 'row',
        alignItems: 'center', paddingTop: 5
    }
})