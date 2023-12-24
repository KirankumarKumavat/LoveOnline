import React, { Component } from 'react';
import { View, Text, StyleSheet, StatusBar, Switch, FlatList, TouchableOpacity, ScrollView, Platform, TouchableOpacityBase, BackHandler } from 'react-native';
import { colors, commonText, } from '../../common';
import { fonts, icons, } from '../../assets';
import SvgIcon from '../../components/SvgIcon';
import { account, notifications, accountSocial } from '../../utils/DummyData'
import { Header, Loader } from '../../components';
import CustomAlertBox from '../../components/CustomAlertBox';
import { buttonTheme } from '../../components/CustomButton';
import { NavigationEvents } from '@react-navigation/compat';
import StorageService from '../../utils/StorageService';

/** Settings Screen screen component */
class SettingsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matchNotification: false,
            msgNotification: false,
            likeProfileNotification: false,
            subscriptionNotification: false,
            logoutPressed: false,
            visible: false,

            isSocialLogin: false,
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        this.setState({
            matchNotification: this.props.route.params.userDetails.on_match == 1 ? true : false,
            msgNotification: this.props.route.params.userDetails.on_get_message == 1 ? true : false,
            likeProfileNotification: this.props.route.params.userDetails.on_profile_like == 1 ? true : false,
            subscriptionNotification: this.props.route.params.userDetails.on_subscription_expire == 1 ? true : false,
        })
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);

        let userDetails = await StorageService.getItem(StorageService.STORAGE_KEYS.USER_DETAILS);
        console.log("userDetails->", userDetails);
        if (userDetails && Object.keys(userDetails).length > 0) {
            let { apple_id, google_id, facebook_id } = userDetails;
            if (apple_id && apple_id != null && apple_id != "null") {
                this.setState({ isSocialLogin: true })
            }
            else if (google_id && google_id != null && google_id != "null") {
                this.setState({ isSocialLogin: true })
            }
            else if (facebook_id && facebook_id != null && facebook_id != "null") {
                this.setState({ isSocialLogin: true })
            }
            else {
                this.setState({ isSocialLogin: false })
            }
        }
    }
    /**action fire when back button click */
    handleBackPress = () => {
        this.props.navigation.navigate(commonText.settingsRoute);
        return true;
    }
    /**componet life cycle method */
    componentWillUnmount() {
        this.backHandler.remove()
    }
    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <NavigationEvents onDidBlur={() => {
                    this.backHandler.remove()
                }} />
                <Header
                    theme={0}
                    onBackButtonPress={this.androidBackPress}
                    backButton
                    middleText={commonText.settings} />

                <ScrollView bounces={false} showsVerticalScrollIndicator={false} >
                    <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                    <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.flatlistContainer}
                        data={this.state.isSocialLogin ? accountSocial : account}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                        ListHeaderComponent={this.accountView}
                        extraData={this.state}
                    />

                    <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.flatlistContainer}
                        data={notifications}
                        renderItem={this.renderNotificationItem}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                        ListHeaderComponent={this.notificationView}
                        ListFooterComponent={this.logoutView}
                        extraData={this.state}
                    />
                    {this.state.logoutPressed
                        ?
                        <CustomAlertBox
                            visible={this.state.visible}
                            message="Are you sure you want to logout?"
                            cancelText="Cancel"
                            okayText="Confirm"
                            onPressLeftView={() => this.onPressLeftView(0)}
                            onPressRightView={() => this.onPressLeftView(1)}
                            onRequestClose={() => { this.setState({ visible: false }, () => { this.selectedButtonIndex = null }) }}
                            theme={this.selectedButtonIndex === 0 ? buttonTheme.dark : buttonTheme.light}
                            themeSecond={this.selectedButtonIndex === 1 ? buttonTheme.dark : buttonTheme.light}
                        />
                        : null}
                </ScrollView>
                <Loader loading={this.props.loader} />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**render all notifications  */
    renderNotificationItem = ({ item, index }) => {
        return (
            <View style={styles.renderItemWrap}>
                <Text style={styles.listText}>{item.title}</Text>
                <Switch
                    trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                    thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                    onValueChange={() => this.toggleSwitch({ item, index })}
                    value={this.getValue(index)}
                    style={styles.switchStyle}
                />
            </View>
        )
    }

    /**get the notification boolean values */
    getValue = (index) => {
        if (index == 0) {
            return this.state.matchNotification
        }
        else if (index == 1) {
            return this.state.msgNotification
        }
        else if (index == 2) {
            return this.state.likeProfileNotification
        }
        else if (index == 3) {
            return this.state.subscriptionNotification
        }
        else return
    }

    /**render method to display account portion  */
    accountView = () => {
        return (
            <View style={styles.accountHeader}>
                <SvgIcon height={15} width={13}
                    name={icons.accountIcon}
                />
                <Text style={styles.accountText}>{commonText.accountText}</Text>
            </View>
        )
    }

    /**render notification header  */
    notificationView = () => {
        return (
            <View style={[styles.accountHeader, { marginTop: 0 }]}>
                <SvgIcon height={17} width={15}
                    name={icons.notificationsIcon}
                />
                <Text style={styles.accountText}>{commonText.notifications}</Text>
            </View>
        )
    }

    /**log out view */
    logoutView = () => {
        return (
            <TouchableOpacity onPress={() => this.onPressLogout()} style={styles.logoutView}>
                <SvgIcon height={20} width={20}
                    name={icons.logoutIcon}
                />
                <Text style={styles.accountText}>{commonText.logOutText}</Text>
            </TouchableOpacity>
        )
    }

    /**action handling for toggle switches */
    toggleSwitch = ({ item, index }) => {
        if (index == 0) {
            this.setState({ matchNotification: !this.state.matchNotification }, () => {
                this.getPermission(index)
            })
        }
        else if (index == 1) {
            this.setState({ msgNotification: !this.state.msgNotification }, () => {
                this.getPermission(index)
            })
        }
        else if (index == 2) {
            this.setState({ likeProfileNotification: !this.state.likeProfileNotification }, () => {
                this.getPermission(index)
            })
        }
        else if (index == 3) {
            this.setState({ subscriptionNotification: !this.state.subscriptionNotification }, () => {
                this.getPermission(index)
            })
        }
    }

    /**get the permission  of all notification types  */
    getPermission = async (index) => {
        let params = {
            on_match: this.state.matchNotification == true ? 1 : 0,
            on_get_message: this.state.msgNotification == true ? 1 : 0,
            on_profile_like: this.state.likeProfileNotification == true ? 1 : 0,
            on_subscription_expire: this.state.subscriptionNotification == true ? 1 : 0
        }
        await this.props.notificationReq(params)
    }

    /**action handling for log out click */
    onPressLogout = () => {
        this.setState({ logoutPressed: true, visible: true })
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparator}></View>
        )
    }

    /** render method for account item list */
    renderItem = ({ item, index }) => {
        console.log("item", item);
        return (
            <TouchableOpacity onPress={() => this.onPressItems(item)} style={styles.titleWrap}>
                <Text style={styles.listText}>{item.title}</Text>
            </TouchableOpacity>
        )
    }

    /**action method for account item click */
    onPressItems = (item) => {
        if (item.route) {
            if (item.param) {
                this.props.navigation.navigate(item.route, item.param)
            } else {
                this.props.navigation.navigate(item.route)
            }
        }
    }

    /** log out modal button click handling */
    onPressLeftView = (id) => {
        this.selectedButtonIndex = id;
        this.forceUpdate();
        if (id === 1) {
            this.setState({ visible: false }, () => {
                this.selectedButtonIndex = null
            })
        }
        if (id === 0) {
            this.props.logout();
            setTimeout(() => {
                this.setState({ visible: false }, () => {
                    this.selectedButtonIndex = null
                })
            }, 500);

        }
    }

}

export default SettingsScreen;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    switchStyle: {
        marginRight: 2,
        transform: Platform.OS == 'ios' ? [{ scaleX: .9 }, { scaleY: .9 }] : [{ scaleX: 1.1 }, { scaleY: 1.1 }],
    },
    flatlistContainer: {
        marginHorizontal: 10,
    },
    listText: {
        fontSize: 16,
        fontFamily: fonts.muli,
        color: colors.black,
        width: '80%',
        alignItems: 'center'
    },
    logout: {
        marginVertical: 15,
        marginBottom: 80
    },
    accountHeader: {
        flexDirection: 'row',
        marginTop: 15,
        marginHorizontal: 12,
        borderBottomColor: colors.textInputBorder,
        borderBottomWidth: 1,
        paddingVertical: 20,
        alignItems: 'center'
    },
    accountText: {
        fontFamily: fonts.muliSemiBold,
        fontSize: 16,
        color: colors.blueShade1,
        marginLeft: 10
    },
    logoutView: {
        flexDirection: 'row',
        borderTopColor: colors.textInputBorder,
        borderTopWidth: 1,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    renderItemWrap: {
        flexDirection: 'row', padding: 20,
        justifyContent: 'space-between', paddingRight: 10
    },
    itemSeparator: {
        height: 1,
        backgroundColor: colors.textInputBorder,
        marginHorizontal: 10
    },
    titleWrap: {
        flexDirection: 'row',
        alignItems: 'center', padding: 20
    }
})