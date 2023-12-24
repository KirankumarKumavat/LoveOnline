import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Image, Platform } from 'react-native';
import { fonts, icons, images } from '../assets';
import { colors, commonText, constants } from '../common';
import NavigationService from '../utils/NavigationService';
import SvgIcon from './SvgIcon';

/**
 * ChatCell Component which represent single cell of Chat user list
 */
class ChatCell extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    /**component render method */
    render() {
        const { onPressCell, imageSource, userName, lastMesssage, lastMesssageDate, isOnline, isMatched, isBlurPhoto, isStarText, gender, isUserSubscribed, onPressLeftImage } = this.props;
        let blurRadius = isBlurPhoto ? Platform.OS == "android" ? 3 : 8 : 0;
        let userNameUpdated = isStarText ? userName && userName.charAt(0) + "*******" : userName;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onPressCell}
                    activeOpacity={constants.activeOpacity}
                    delayPressIn={0}
                    style={styles.mainWrap}
                >
                    <TouchableOpacity style={[{
                        paddingBottom: 5, paddingHorizontal: 2,
                    }, Platform.OS == "ios" ? styles.iOSStyle : {}]}
                        // onPress={() => {

                        // if (imageSource && (isMatched || isUserSubscribed)) {
                        //     // NavigationService.navigate(commonText.zoomImageRoute, { imageUrl: imageSource })
                        // }


                        // }}
                        onPress={onPressLeftImage}
                    >
                        <ImageBackground
                            style={[
                                styles.mainImage,
                                Platform.OS == "android" ? {
                                    elevation: 5,
                                }
                                    : {}
                            ]}
                            source={gender == commonText.male ? images.placeHolderFemale : images.profilePlaceHolder}
                            imageStyle={{ borderRadius: 50, }}
                            resizeMode={'cover'}
                        >
                            <Image
                                source={{ uri: imageSource }}
                                style={[styles.mainImage, {
                                    borderColor: colors.white,
                                    borderWidth: 2.5,
                                }]}
                                resizeMode={'cover'}
                                blurRadius={blurRadius}
                            />
                            {isMatched ?
                                <View style={[styles.matchView, { left: -5, bottom: 10 }]}>
                                    <SvgIcon name={icons.matchIcon} height={10} width={10} />
                                </View>
                                : null}
                            {isOnline ?
                                <View style={[styles.onlineView, { left: 45, bottom: 10 }]} />
                                : null}
                        </ImageBackground>
                    </TouchableOpacity>
                    <View style={styles.textWrap}>
                        <Text style={[styles.userName, isStarText ? { color: colors.starTextColor } : {}]} numberOfLines={1}>{userNameUpdated}</Text>
                        <Text style={styles.lastMesssage} numberOfLines={1}>{lastMesssage}</Text>
                        <Text style={styles.lastMesssageDate} numberOfLines={1}>{lastMesssageDate}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ChatCell;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1
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
    userName: {
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        fontSize: 16,
    },
    lastMesssage: {
        fontFamily: fonts.muli,
        color: colors.black,
        fontSize: 12,
        paddingVertical: 2,
    },
    lastMesssageDate: {
        fontFamily: fonts.muli,
        color: colors.grayShadeDark,
        fontSize: 12,
    },
    textWrap: {
        paddingLeft: 13,
        paddingRight: 10,
        flex: 1
    },
    matchView: {
        position: 'absolute',
        left: 13,
        height: 18,
        width: 18,
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
    onlineView: {
        height: 15,
        width: 15,
        borderRadius: 20,
        backgroundColor: colors.orange,
        position: 'absolute',
        bottom: 20,
        left: 60,
        borderWidth: 2,
        borderColor: colors.white,
    },
    iOSStyle: {
        shadowColor: colors.grayShadeDark,
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    }
})