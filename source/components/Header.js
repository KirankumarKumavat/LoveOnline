import React, { useState, } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, Image, Platform, Keyboard, ImageBackground } from 'react-native';
import { colors, commonText, constants } from '../common';
import { getStatusBarHeight, } from '../utils/iPhoneXHelper';
import { verticalScale, moderateScale } from '../utils/scale';
import NavigationService from '../utils/NavigationService'
import fonts from '../assets/fonts'
import icons from '../assets/icons'
import { SvgIcon } from '.';
import InputField from './InputField';
import { images } from '../assets';

/**header theme */
export const headerTheme = {
    light: 0,
    dark: 1
}

/**custom header componet */
const Header = ({
    backButton,
    onBackButtonPress,
    rightIcon,
    rightImage,
    middleText,
    rightText,
    mainStyle,
    leftIcon,
    leftIconPress,
    middleTextStyle,
    barStyle,
    onPressRightText,
    onPress,
    rightFlex,
    threeDotsView,
    onPressThreeDots,
    leftIconColor,
    rightSideTextStyle,
    showSearchBar,
    onChangeText,
    searchValue,
    onPressSearchCross,
    theme = 0,
    showShadow = true,
    filterMiddleView,
    isProfilePicView,
    profilePicSource,
    onPressProfilePic,
    isOnline, isMatched,
    showTypingIndicator,
    isBlurPhoto,
    isStarText,
    gender,
    onPressName,
    activeOpacity,
}) => {
    let defaultStyle = theme === headerTheme.dark ? 'light-content' : 'dark-content';
    let icon = theme === headerTheme.dark ? icons.backIcon : icons.darkback;
    let textColor = theme === headerTheme.dark ? colors.white : colors.black
    let backgroundColor = theme === headerTheme.dark ? colors.transparent : colors.white
    const [searchText, setSeachText] = useState('');
    let blurRadius = isBlurPhoto ? Platform.OS == "android" ? 3 : 8 : 0;
    let userNameUpdated = isStarText ? middleText && middleText.charAt(0) + "*****" : middleText;

    /**component render return method */
    return (
        <View style={[styles.container, mainStyle,
        { backgroundColor: backgroundColor }, showShadow ? styles.shadowStyle : {},
        showSearchBar ? {} : {
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }
        ]} >
            <StatusBar barStyle={barStyle ? barStyle : defaultStyle} />
            {
                showSearchBar ?
                    <View style={[styles.middleSearch, {}]}>
                        <InputField
                            autoFocus={true}
                            value={searchValue}
                            returnKeyType={constants.searchReturnKeyType}
                            placeholder={'Search User'}
                            autoCapitalize={'words'}
                            onChangeText={onChangeText}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            containerStyle={styles.newContainer}
                            style={{
                                fontSize: 14,
                                paddingVertical: 0,
                            }}
                            rightIconStyle={{ marginTop: 5, }}
                            rightIcon={icons.closeIconDark}
                            rightIconHeight={18}
                            rightIconWidth={18}
                            onPressRightIcon={onPressSearchCross}
                        />
                    </View>
                    :
                    <>
                        <View style={styles.firstView}>
                            {
                                backButton ?
                                    <View
                                        style={[styles.backButton]}
                                    >
                                        <TouchableOpacity
                                            onPress={() => {
                                                if (onBackButtonPress) onBackButtonPress();
                                                else NavigationService.goBack();
                                            }}
                                            activeOpacity={constants.activeOpacity}
                                            delayPressIn={0}
                                        >
                                            <SvgIcon name={icon} width={14} height={22} />

                                        </TouchableOpacity>
                                    </View>
                                    :
                                    leftIcon ?
                                        <View
                                            style={[styles.backButton]}
                                        >
                                            <TouchableOpacity
                                                onPress={() => leftIconPress && leftIconPress()}
                                                activeOpacity={constants.activeOpacity}
                                                delayPressIn={0}
                                                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                            >
                                                <SvgIcon name={leftIcon} color={leftIconColor} width={23} height={23} />
                                            </TouchableOpacity>
                                        </View>
                                        :
                                        null
                            }
                        </View>
                        {
                            isProfilePicView
                                ?
                                <>
                                    <TouchableOpacity
                                        delayPressIn={0}
                                        onPress={onPressProfilePic}
                                        activeOpacity={constants.activeOpacity}
                                        style={[{
                                            flex: 0.85, marginLeft: 20,

                                        }, Platform.OS == "ios" ? {
                                            shadowColor: colors.black,
                                            shadowOffset: { width: 0.5, height: 2 },
                                            shadowOpacity: 0.4,
                                            shadowRadius: 5,
                                        } : {}]}
                                    >
                                        <ImageBackground
                                            style={[styles.mainImage, {
                                            }, Platform.OS == "android" ? {
                                                elevation: 5,
                                            }
                                                : {}]}
                                            source={gender == commonText.male ? images.placeHolderFemale : images.profilePlaceHolder}
                                            imageStyle={{ borderRadius: 50 }}
                                            resizeMode={'cover'}
                                        >
                                            <Image
                                                source={{ uri: profilePicSource }}
                                                style={[styles.mainImage, {
                                                    borderColor: colors.white,
                                                    borderWidth: 2.5,
                                                }]}
                                                resizeMode={'cover'}
                                                blurRadius={blurRadius}
                                            />
                                            {isMatched ?
                                                <View style={styles.matchView}>
                                                    <SvgIcon name={icons.matchIcon} height={10} width={10} />
                                                </View>
                                                : null}
                                        </ImageBackground>

                                    </TouchableOpacity>
                                    {isOnline ?
                                        <View style={styles.onlineView} />
                                        : null}
                                </>
                                :
                                null
                        }
                        <TouchableOpacity
                            activeOpacity={activeOpacity || 1} onPress={onPressName}
                            style={[styles.middleView, filterMiddleView, isProfilePicView ? { flex: 3.5, alignItems: 'flex-start', } : {}]}>
                            {middleText ?
                                <>
                                    <Text numberOfLines={1} style={[styles.middleTextStyle, middleTextStyle, { color: textColor }, isStarText ? { color: colors.starTextColor } : {}]}> {userNameUpdated}</Text>
                                    {
                                        showTypingIndicator
                                            ?
                                            <View style={{ paddingHorizontal: 6, position: 'absolute', top: 25 }}>
                                                <Text style={styles.typingFont} >{commonText.typingText}</Text>
                                            </View>
                                            : null
                                    }
                                </>
                                :
                                null}
                        </TouchableOpacity>
                        {rightIcon ?
                            <View style={[styles.lastView, { flex: rightText ? 0.7 : 0.3, }]}>
                                <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
                                    {rightImage ? <SvgIcon
                                        name={rightImage}
                                        height={20}
                                        width={20}
                                    />
                                        : null
                                    }
                                </TouchableOpacity>
                            </View>
                            : <View style={[styles.lastView, { flex: rightFlex ? rightFlex : 0.3, }]}>
                                {
                                    rightText ? <Text onPress={() => {
                                        if (onPressRightText) onPressRightText();
                                    }} style={[styles.rightTextStyle, rightSideTextStyle]}>{rightText}</Text>
                                        : threeDotsView ?
                                            <TouchableOpacity
                                                activeOpacity={constants.activeOpacity}
                                                delayPressIn={0}
                                                hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                                onPress={onPressThreeDots}>
                                                {[1, 2, 3].map((obj) => <View key={obj} style={{ height: 4, width: 4, marginVertical: 2, borderRadius: 20, backgroundColor: colors.blueShade1 }} />)}
                                            </TouchableOpacity>
                                            : null
                                }
                            </View>
                        }
                    </>
            }
        </View>
    );
};

export default Header;

/**component styling */
const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android'
            ? verticalScale(20) :
            (getStatusBarHeight(true) + verticalScale(10)),
        flexDirection: 'row',
        paddingBottom: verticalScale(10),
    },
    shadowStyle: {
        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        elevation: 15,
        shadowRadius: 4,
        shadowOffset: {
            height: 4,
            width: 0,
        },
    },
    firstView: {
        paddingLeft: 20,
        flex: 0.3
    },
    middleView: {
        alignItems: 'center',
        flex: 3.5,

    },
    middleTextStyle: {
        fontFamily: fonts.sukhumvitSetBold,
        fontSize: moderateScale(20),
        color: colors.black,
    },
    lastView: {
        alignItems: 'flex-end',
        paddingRight: 20,
    },
    type1View: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: moderateScale(10)
    },
    type2View: {
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backButton: {
    },
    backIconStyle: {
        height: moderateScale(20),
        width: moderateScale(20),
        paddingLeft: 20
    },
    leftStyle: {
        fontSize: moderateScale(36),
        color: colors.grayShade6
    },
    rightStyle: {
        fontSize: moderateScale(36),
        color: colors.grayShade6,
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    rightTextStyle: {
        fontSize: moderateScale(18),
        color: colors.blueShade1,
        fontFamily: fonts.MuliSemiBold,
        textAlign: 'center'
    },
    middleSearch: {
        flex: 1,
    },
    mainImage: {
        height: 40,
        width: 40,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center'
    },
    onlineView: {
        height: 15,
        width: 15,
        borderRadius: 20,
        backgroundColor: colors.orange,
        position: 'absolute',
        bottom: Platform.OS == "android" ? 18 : 20,
        left: Platform.OS == "android" ? 90 : 90,
        borderWidth: 2,
        borderColor: colors.white,
    },
    matchView: {
        position: 'absolute',
        left: -5,
        height: 18,
        width: 18,
        borderRadius: 30,
        backgroundColor: colors.white,
        bottom: 0,
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
    newContainer: {
        height: 40,
        padding: 0,
        paddingHorizontal: 10,
        borderRadius: 50,
        marginHorizontal: 15,
    },
    typingFont: {
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        fontSize: 12,
    }
})