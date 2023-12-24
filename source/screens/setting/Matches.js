import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, StatusBar, FlatList, TouchableOpacity, Platform, BackHandler, Alert } from 'react-native';
import { colors, commonText, constants } from '../../common';
import { fonts, icons, images } from '../../assets';
import SvgIcon from '../../components/SvgIcon';
import { Header, Loader } from '../../components';
import { convetCapital } from '../../utils/HelperFunction';

/** Matches screen component */
class Matches extends Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        this.getUsers()
        this.subscribeFocus = this.props.navigation.addListener('focus', async () => await this.onScreenFocus());
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**action fire when back button click */
    handleBackPress = () => {
        this.props.navigation.jumpTo(commonText.settingsRoute);
        // return true;
    }

    /**action when screen is focued */
    onScreenFocus = async () => {
        this.getUsers()
    }

    /**get the data of matched users from database */
    getUsers = () => {
        this.props.getMatchedUserProfileData()
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.props.matchedUserResetData()
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <Header
                    theme={0}
                    // onBackButtonPress={this.handleBackPress}
                    onBackButtonPress={() => this.props.navigation.goBack()}
                    backButton
                    middleText={commonText.matches}
                />
                <FlatList
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.matchedUsers}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.props.loading ? null : this.itemSeparator}
                    ListEmptyComponent={this.props.loading ? null : this.listEmpty}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**render list empty component */
    listEmpty = () => {
        return (
            <View style={styles.listEmpty}>
                <Text>{commonText.noMatchedUser}</Text>
            </View>
        )
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparator}></View>
        )
    }

    /**render method for display matched user list   */
    renderItem = ({ item, index }) => {
        let isBlurPhoto = item.want_blur_pics == commonText.yes;
        let blurRadius = isBlurPhoto ? Platform.OS == "android" ? 3 : 8 : 0;
        return (
            <TouchableOpacity
                style={styles.mainWrap}
                activeOpacity={constants.activeOpacity}
                delayPressIn={0}
                onPress={() => this.onPressCell(item, index)}
            >
                <View style={[{
                    paddingBottom: 5, paddingHorizontal: 2,
                }, Platform.OS == "ios" ? styles.iOStyle : {}]}>
                    <ImageBackground
                        style={[
                            styles.mainImage,
                            Platform.OS == "android" ? {
                                elevation: 5,
                            }
                                : {}
                        ]}
                        source={images.profilePlaceHolder}
                        imageStyle={{ borderRadius: 50, }}
                        resizeMode={'cover'}
                    >
                        <Image
                            source={{ uri: item.profile_pic }}
                            style={[styles.mainImage, {
                                borderColor: colors.white,
                                borderWidth: 2.5,
                            }]}
                            resizeMode={'cover'}
                            blurRadius={blurRadius}
                        />
                        <View style={[styles.matchView, { left: -5, bottom: 10 }]}>
                            <SvgIcon name={icons.matchIcon} height={12} width={12} />
                        </View>
                    </ImageBackground>
                </View>
                {item.name ? <View style={styles.textWrap}>
                    <Text style={styles.userName} numberOfLines={1}>{item && item.name ? convetCapital(item.name) : ""}</Text>
                </View> : null}
                <TouchableOpacity onPress={() => this.onPressUnmatchUser(item, index)} style={{ marginHorizontal: 10 }}>
                    <Image source={images.unmatchIcon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => item.is_blocked == 1 ? this.onPressUnBlockUser(item) : this.onPressBlockUser(item)}>
                    <Image style={{ height: 25, width: 25 }} source={item.is_blocked == 1 ? images.blockUser : images.unblockIconGray} resizeMode={'cover'} />
                </TouchableOpacity>
            </TouchableOpacity>
        )

    }

    /**action method for handling matched user click */
    onPressCell = (item) => {
        const user_id = item.user_id;
        if (user_id) {
            this.props.navigation.navigate(commonText.exploreRoute, {
                user_id,
                isFromMatch: true,
            })
        }
    }

    /**action method to block matched user */
    onPressBlockUser = async (item) => {
        let blocked_user_id = item.user_id;
        const params = {
            blocked_user_id
        }
        await this.props.blockUser(params)
        this.getUsers()
    }

    /**action method to unblock matched user */
    onPressUnBlockUser = (item) => {
        let unblocked_user_id = item.user_id;;
        const params = {
            unblocked_user_id
        }
        this.props.unblockUserForLikeTab(params)
        this.getUsers()
    }

    /**action method to handle click event for matched user and check user is still matched with that user or not */
    onPressUnmatchUser = (item) => {
        let userName = item.name;
        const params = {
            unmatch_user_id: item.user_id
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
                    onPress: async () => {
                        await this.props.proformUnmatchUser(params)
                        this.getUsers()
                    }
                }
            ],
            {
                cancelable: false
            }
        )
    }
}

export default Matches;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    flatlistContainer: {
        flexGrow: 1,
        paddingVertical: 15
    },
    listText: {
        fontSize: 16,
        fontFamily: fonts.muli,
        color: colors.textColor,
        alignItems: 'center'
    },
    notificationCell: {
    },
    dateTime: {
        flexDirection: 'row',
        fontSize: 12,
        color: colors.grayShadeDark,
        paddingTop: 5
    },
    mainWrap: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        alignItems: 'center',
        paddingVertical: 10,
    },
    mainImage: {
        height: 55,
        width: 55,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    matchView: {
        position: 'absolute',
        left: 13,
        height: 20,
        width: 20,
        borderRadius: 30,
        backgroundColor: colors.white,
        bottom: 18,
        borderWidth: 1,
        borderColor: colors.borderColorWhite,
        shadowColor: colors.shadowColor,
        shadowRadius: 6,
        shadowOffset: {
            height: 2,
            width: 2
        },
        shadowOpacity: 1,
        elevation: 3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textWrap: {
        paddingLeft: 20,
        paddingRight: 10,
        flex: 1
    },
    userName: {
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black
    },
    itemSeparator: {
        height: 1,
        backgroundColor: colors.textInputBorder,
    },
    listEmpty: {
        flex: 1,
        justifyContent: 'center', alignSelf: 'center'
    },
    iOStyle: {
        shadowColor: colors.grayShadeDark,
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    }
})