import React, { } from 'react';
import { Image, Animated, Platform } from 'react-native';
import ExploreContainer from '../screens/explore/ExploreContainer'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { tabBarIcons } from '../assets';
import { colors, commonText, } from '../common';
import LikeContainer from '../screens/like/LikeConatiner';
import ChatContainer from '../screens/chat/ChatContainer';
import SettingContainer from '../screens/setting/SettingContainer';
import SettingsScreeenContainer from '../screens/setting/SettingsScreenContainer'
import ChangePasswordContainer from '../screens/changePassword/ChangePasswordContainer';
import LikeCommentContainer from '../screens/explore/LikeCommentContainer';
import FilterContainer from '../screens/explore/FilterContainer';
import AgeSliderContainer from '../screens/explore/AgeSliderContainer';
import LocationContainer from '../screens/explore/LocationContainer';
import { SafeAreaProvider, SafeAreaView, } from 'react-native-safe-area-context';
import FilterProfessionContainer from '../screens/explore/FilterProfessionContainer';
import FilterEducationContainer from '../screens/explore/FilterEducationContainer';
import deviceInfoModule from 'react-native-device-info';
import FilterHeightContainer from '../screens/explore/FilterHeightContainer';
import FilterMarriageGoalContainer from '../screens/explore/FilterMarriageGoalContainer';
import ChatWindowContainer from '../screens/chat/ChatWindowContainer';
import ZoomableImage from '../screens/chat/ZoomableImage';
import NotificationsContainer from '../screens/setting/NotificationsContainer';
import MatchesContainer from '../screens/setting/MatchesContainer';
import EditProfileContainer from '../screens/setting/EditProfileContainer';
import commonWebViewContainer from '../screens/termsAndPrivacy/CommonWebViewContainer'
import WriteAnswerContainer from '../screens/writeAnswer/WriteAnswerContainer';
import DescriptionProfileContainer from '../screens/descriptionProfile/DescriptionProfileContainer';
import SignUpDateOfBirthContainer from '../screens/signup/SignUpDateOfBirthContainer';
import ProfileSetupStepsContainer from '../screens/profileSetup/ProfileSetupStepsContainer';
import SelectPromptContainer from '../screens/selectPrompt/SelectPromptContainer';
import ProfilePicsContainer from '../screens/profilePics/ProfilePicsContainer'
import CustomSettingsIcon from '../components/CustomSettingsIcon';
import UserProfileContainer from '../screens/explore/UserProfileContainer';
import PushNotification from '../screens/pushNotification/PushNotification';

const Tab = createBottomTabNavigator();
const MainStack = createStackNavigator();

const ExploreTab = createStackNavigator();
const LikeTab = createStackNavigator();
const ChatTab = createStackNavigator();
const SettingsTab = createStackNavigator();

const { multiply } = Animated;

/**custom function for render screen from left side */
export function forHorizontalModal({
    current,
    next,
    inverted,
    layouts: { screen }
}) {
    const translateFocused = multiply(
        current.progress.interpolate({
            inputRange: [0, 1],
            outputRange: [screen.width, 0],
            extrapolate: "clamp"
        }),
        inverted
    );

    const overlayOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.07],
        extrapolate: "clamp"
    });

    const shadowOpacity = current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.3],
        extrapolate: "clamp"
    });

    return {
        cardStyle: {
            transform: [
                { translateX: translateFocused },
                { translateX: 0 }
            ]
        },
        overlayStyle: { opacity: overlayOpacity },
        shadowStyle: { shadowOpacity }
    };
}

/**
* Home Stack for Home Tab
*/
// function ExploreStack() {
//     return (
//         <ExploreTab.Navigator
//             headerMode='none'
//             initialRouteName={commonText.exploreRoute}
//             screenOptions={({ route, navigation }) => (
//                 {
//                     gestureEnabled: false,
//                 })}
//         >
//             <ExploreTab.Screen name={commonText.exploreRoute} component={ExploreContainer} />
//             <ExploreTab.Screen name={commonText.likeCommentRoute} component={LikeCommentContainer} />
//             <ExploreTab.Screen name={commonText.filterRoute} component={FilterContainer} options={{
//                 gestureDirection: 'horizontal-inverted',
//                 cardStyleInterpolator: forHorizontalModal
//             }} />
//             <ExploreTab.Screen name={commonText.ageSliderRoute} component={AgeSliderContainer} />
//             <ExploreTab.Screen name={commonText.locationRoute} component={LocationContainer} />
//             <ExploreTab.Screen name={commonText.filterProfessionRoute} component={FilterProfessionContainer} />
//             <ExploreTab.Screen name={commonText.filterEducationRoute} component={FilterEducationContainer} />
//             <ExploreTab.Screen name={commonText.filterHeightRoute} component={FilterHeightContainer} />
//             <ExploreTab.Screen name={commonText.filtermarriageGoalRoute} component={FilterMarriageGoalContainer} />
//             <ExploreTab.Screen name={commonText.termsAndPrivacyRoute} component={commonWebViewContainer} />
//         </ExploreTab.Navigator>
//     );
// }

/**
* Message Stack for Messages Tab
*/
// function LikeStack() {
//     return (
//         <LikeTab.Navigator
//             headerMode={'none'}
//             initialRouteName={commonText.likeRoute}
//             screenOptions={({ route, navigation }) => ({
//                 gestureEnabled: false,
//                 gestureDirection: 'horizontal'
//             })}
//         >
//             <LikeTab.Screen name={commonText.likeRoute} component={LikeContainer} initialParams={{
//                 isEmpty: true
//             }} />
//             <LikeTab.Screen name={commonText.filterRoute} component={FilterContainer} options={{
//                 gestureDirection: 'horizontal-inverted',
//                 cardStyleInterpolator: forHorizontalModal
//             }} />
//             <LikeTab.Screen name={commonText.exploreRoute} component={ExploreContainer} />
//             <LikeTab.Screen name={commonText.likeCommentRoute} component={LikeCommentContainer} />
//             <LikeTab.Screen name={commonText.ageSliderRoute} component={AgeSliderContainer} />
//             <LikeTab.Screen name={commonText.locationRoute} component={LocationContainer} />
//             <LikeTab.Screen name={commonText.filterProfessionRoute} component={FilterProfessionContainer} />
//             <LikeTab.Screen name={commonText.filterEducationRoute} component={FilterEducationContainer} />
//             <LikeTab.Screen name={commonText.filterHeightRoute} component={FilterHeightContainer} />
//             <LikeTab.Screen name={commonText.filtermarriageGoalRoute} component={FilterMarriageGoalContainer} />
//             <LikeTab.Screen name={commonText.chatWindowRoute} component={ChatWindowContainer} />
//             <LikeTab.Screen name={commonText.zoomImageRoute} component={ZoomableImage} />
//             <LikeTab.Screen name={commonText.termsAndPrivacyRoute} component={commonWebViewContainer} />
//         </LikeTab.Navigator>
//     );
// }

// function ChatStack() {
//     return (
//         <ChatTab.Navigator
//             headerMode={'none'}
//             initialRouteName={commonText.chatRoute}
//             screenOptions={({ route, navigation }) => ({
//                 gestureEnabled: false,
//                 gestureDirection: 'horizontal'
//             })}
//         >
//             <ChatTab.Screen name={commonText.chatRoute} component={ChatContainer} />
//             <ChatTab.Screen name={commonText.chatWindowRoute} component={ChatWindowContainer} />
//             <ChatTab.Screen name={commonText.zoomImageRoute} component={ZoomableImage} />
//             <ChatTab.Screen name={commonText.exploreRoute} component={ExploreContainer} />
//         </ChatTab.Navigator>
//     );
// }

// /**Setting TabRoute stack */
// function SettingsStack() {
//     return (
//         <SettingsTab.Navigator
//             headerMode={'none'}
//             initialRouteName={commonText.settingsRoute}
//             screenOptions={({ route, navigation }) => ({
//                 gestureEnabled: true,
//                 gestureDirection: 'horizontal'
//             })}
//         >
//             <SettingsTab.Screen name={commonText.settingsRoute} component={SettingContainer} />
//             <SettingsTab.Screen name={commonText.changePasswordRoute} component={ChangePasswordContainer} />
//             <SettingsTab.Screen name={commonText.settingsScreenRoute} component={SettingsScreeenContainer} />
//             <SettingsTab.Screen name={commonText.noticationsRoute} component={NotificationsContainer} />
//             <SettingsTab.Screen name={commonText.matchesRoute} component={MatchesContainer} />
//             <SettingsTab.Screen name={commonText.editProfileRoute} component={EditProfileContainer} />
//             <SettingsTab.Screen name={commonText.filterRoute} component={FilterContainer} />
//             <SettingsTab.Screen name={commonText.termsAndPrivacyRoute} component={commonWebViewContainer} />
//             <SettingsTab.Screen name={commonText.ageSliderRoute} component={AgeSliderContainer} />
//             <SettingsTab.Screen name={commonText.locationRoute} component={LocationContainer} />
//             <SettingsTab.Screen name={commonText.filterProfessionRoute} component={FilterProfessionContainer} />
//             <SettingsTab.Screen name={commonText.filterEducationRoute} component={FilterEducationContainer} />
//             <SettingsTab.Screen name={commonText.filterHeightRoute} component={FilterHeightContainer} />
//             <SettingsTab.Screen name={commonText.filtermarriageGoalRoute} component={FilterMarriageGoalContainer} />
//             <SettingsTab.Screen name={commonText.descriptionProfileRoute} component={DescriptionProfileContainer} />
//             <SettingsTab.Screen name={commonText.signupDateOfBirthRoute} component={SignUpDateOfBirthContainer} />
//             <SettingsTab.Screen name={commonText.writeAnswerRoute} component={WriteAnswerContainer} />
//             <SettingsTab.Screen name={commonText.profileSetupStepsRoute} component={ProfileSetupStepsContainer} />
//             <SettingsTab.Screen name={commonText.selectPromptRoute} component={SelectPromptContainer} />
//             <SettingsTab.Screen name={commonText.profilePicsRoute} component={ProfilePicsContainer} />
//             <SettingsTab.Screen name={commonText.exploreRoute} component={ExploreContainer} />
//             <SettingsTab.Screen name={commonText.userProfileRoute} component={UserProfileContainer} />
//         </SettingsTab.Navigator>
//     );
// }

/**action for hider bottom tab bar in specific screens */
function hideTabBar({ route, navigation }) {
    let tabBarVisible = true;
    let unmountOnBlur = true;
    if (route.state && route.state.index > 0) tabBarVisible = false;
    return { tabBarVisible, unmountOnBlur };
}

/**render icon for bottom tab bar */
const getTabBarIcon = (navigation, focused, tintColor, route) => {
    const { name } = route;
    if (name === commonText.exploreRoute) {
        return <Image style={{ tintColor: focused ? colors.blueShade1 : colors.lightDotColor, marginBottom: Platform.OS == "ios" ? 10 : 0 }} source={tabBarIcons.explore} />;
    }
    else if (name === commonText.likeRoute) {
        return <Image style={{ tintColor: focused ? colors.blueShade1 : colors.lightDotColor, marginBottom: Platform.OS == "ios" ? 10 : 0 }} source={tabBarIcons.like} />;
    }
    else if (name === commonText.chatRoute) {
        return <Image style={{ tintColor: focused ? colors.blueShade1 : colors.lightDotColor, marginBottom: Platform.OS == "ios" ? 10 : 0 }} source={tabBarIcons.chat} />;
    }
    else if (name === commonText.settingsRoute) {
        if (focused) {
            return <Image style={{ tintColor: focused ? colors.blueShade1 : colors.lightDotColor, marginBottom: Platform.OS == "ios" ? 10 : 0 }} source={tabBarIcons.setting} />
        }
        else {
            return <CustomSettingsIcon />;
        }
    }

};

/**render bottom tab bar */
function TabNavigation() {
    return (
        <Tab.Navigator
            initialRouteName={commonText.exploreRoute}
            screenOptions={
                ({ route, navigation }) => (
                    {
                        headerShown: false,
                        unmountOnBlur: true,
                        tabBarIcon: ({ focused, tintColor }) =>
                            getTabBarIcon(navigation, focused, tintColor, route),
                    }
                )
            }
            tabBarOptions={{
                showLabel: false,
                safeAreaInsets: { bottom: true },
                keyboardHidesTabBar: true,
                style: {
                    backgroundColor: colors.white,
                    shadowColor: colors.grayShade1,
                    shadowOpacity: 0.8,
                    elevation: 20,
                    shadowRadius: 8,
                    shadowOffset: {
                        height: -6,
                        width: 0,
                    },
                    height: deviceInfoModule.hasNotch() ? 70 : 55,
                    position: 'absolute',
                    borderTopWidth: 1,
                    borderColor: colors.inputBorder2,
                    // paddingBottom: deviceInfoModule.hasNotch() ? 15 : 0
                },

            }}
            backBehavior={'initialRoute'}
            lazy={true}
        >
            <Tab.Screen name={commonText.exploreRoute} component={ExploreContainer} options={hideTabBar}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        e.preventDefault()
                        navigation.reset({
                            routes: [{ name: commonText.exploreRoute, params: undefined }],
                        });
                    }
                })} />
            <Tab.Screen name={commonText.likeRoute} component={LikeContainer} options={hideTabBar}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        e.preventDefault()
                        navigation.reset({
                            routes: [{ name: commonText.likeRoute, params: undefined }],
                        });
                        delete route.params
                    }
                })}
            />
            <Tab.Screen name={commonText.chatRoute} component={ChatContainer} options={hideTabBar} />
            <Tab.Screen name={commonText.settingsRoute} component={SettingContainer} options={hideTabBar}
                listeners={({ navigation, route }) => ({
                    tabPress: (e) => {
                        e.preventDefault()
                        navigation.reset({
                            routes: [{ name: commonText.settingsRoute }],
                        });
                        delete route.params
                    }
                })}
            />
        </Tab.Navigator>
    );
}


function MainAppNavigation() {
    return (
        <MainStack.Navigator
            initialRouteName={'tabNavigation'}
            screenOptions={({ route, navigation }) => (
                {
                    headerShown: false,
                    tabBarVisible: true,
                    gestureEnabled: false,
                    gestureDirection: 'horizontal'
                })}>
            <MainStack.Screen name={'tabNavigation'} component={TabNavigation} />
            <MainStack.Screen name={commonText.exploreRoute} component={ExploreContainer} />
            <MainStack.Screen name={commonText.likeCommentRoute} component={LikeCommentContainer} />
            <MainStack.Screen name={commonText.filterRoute} component={FilterContainer} options={{
                gestureDirection: 'horizontal-inverted',
                cardStyleInterpolator: forHorizontalModal
            }} />
            <MainStack.Screen name={commonText.ageSliderRoute} component={AgeSliderContainer} />
            <MainStack.Screen name={commonText.locationRoute} component={LocationContainer} />
            <MainStack.Screen name={commonText.filterProfessionRoute} component={FilterProfessionContainer} />
            <MainStack.Screen name={commonText.filterEducationRoute} component={FilterEducationContainer} />
            <MainStack.Screen name={commonText.filterHeightRoute} component={FilterHeightContainer} />
            <MainStack.Screen name={commonText.filtermarriageGoalRoute} component={FilterMarriageGoalContainer} />
            <MainStack.Screen name={commonText.termsAndPrivacyRoute} component={commonWebViewContainer} />

            <MainStack.Screen name={commonText.likeRoute} component={LikeContainer} initialParams={{
                isEmpty: true
            }} />
            <MainStack.Screen name={commonText.chatWindowRoute} component={ChatWindowContainer} />
            <MainStack.Screen name={commonText.zoomImageRoute} component={ZoomableImage} />
            <MainStack.Screen name={commonText.chatRoute} component={ChatContainer} />
            <MainStack.Screen name={commonText.settingsRoute} component={SettingContainer} />
            <MainStack.Screen name={commonText.changePasswordRoute} component={ChangePasswordContainer} />
            <MainStack.Screen name={commonText.settingsScreenRoute} component={SettingsScreeenContainer} />
            <MainStack.Screen name={commonText.noticationsRoute} component={NotificationsContainer} />
            <MainStack.Screen name={commonText.matchesRoute} component={MatchesContainer} />
            <MainStack.Screen name={commonText.editProfileRoute} component={EditProfileContainer} />

            <MainStack.Screen name={commonText.descriptionProfileRoute} component={DescriptionProfileContainer} />
            <MainStack.Screen name={commonText.signupDateOfBirthRoute} component={SignUpDateOfBirthContainer} />
            <MainStack.Screen name={commonText.writeAnswerRoute} component={WriteAnswerContainer} />
            <MainStack.Screen name={commonText.profileSetupStepsRoute} component={ProfileSetupStepsContainer} />
            <MainStack.Screen name={commonText.selectPromptRoute} component={SelectPromptContainer} />
            <MainStack.Screen name={commonText.profilePicsRoute} component={ProfilePicsContainer} />
            <MainStack.Screen name={commonText.userProfileRoute} component={UserProfileContainer} />
        </MainStack.Navigator>
    )
}
/**render app inside module(for loggedin user) */
function AppNavigator() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1 }} edges={['right', 'left']}>
                <MainAppNavigation />
                {/* <TabNavigation /> */}
                <PushNotification />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

export default AppNavigator;
