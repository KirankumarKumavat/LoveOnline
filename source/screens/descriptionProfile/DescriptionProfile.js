import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, BackHandler, Platform, InputAccessoryView, Button } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { fonts } from '../../assets';
import { InputField, CustomButton, Loader, TitleDescription, TitleHeader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';
import NavigationService from '../../utils/NavigationService';
import { isIphoneX } from '../../utils/iPhoneXHelper';

/**Description Profile screen component */
class DescriptionProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.route.params ? this.props.route.params.message : ''
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
        this.subscribeBlur = this.props.navigation.addListener('blur', this.onScreenBlur);
        let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
    }

    /**action when screen is focused */
    onScreenBlur = () => {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
        this.subscribeBlur()
    }

    /**action for back button handling */
    androidBackPress = async () => {
        if (this.props.route.params && this.props.route.params.isFromSettingStack) {
            NavigationService.navigate(commonText.editProfileRoute)
        }
        else {
            this.props.navigation.goBack();
        }
        return true;
    }

    /**componet render method */
    render() {
        const inputAccessoryViewID = "doneBtn";
        return (
            <View style={styles.container}>
                <Header
                    onBackButtonPress={() => this.androidBackPress()}
                    backButton
                    theme={0}
                    middleText={this.props.route.params && this.props.route.params.isFromSettingStack ? commonText.editProfile : commonText.profileSetUp} />
                <View style={styles.mainStyle}>
                    <View>
                        <TitleDescription description={commonText.aboutSelfDesc} />
                        <TitleHeader title={commonText.aboutSelftitle} numberOfLinesForTitle={4} mainStyle={{ marginTop: 30 }} />
                    </View>
                </View>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraHeight={isIphoneX() && 0}

                >
                    {/* <View style={styles.mainStyle}>
                        <View>
                            <TitleDescription description={commonText.aboutSelfDesc} />
                            <TitleHeader title={commonText.aboutSelftitle} numberOfLinesForTitle={4} mainStyle={{ marginTop: 30 }} />
                        </View>
                    </View> */}
                    <View style={styles.InputButtonStyle} >
                        <InputField
                            value={this.state.message}
                            theme={0}
                            onChangeText={(message) => this.changeText(message)}
                            placeholderTextColor={colors.grayShadeDark}
                            placeholder={'Enter Message (minimum 100 characters)'}
                            multiline={true}
                            containerStyle={styles.containerStyle}
                            style={styles.textInput}
                            returnKeyType={constants.nextReturnKeyType}
                            textAlignVertical={'top'}
                            maxLength={500}
                            inputAccessoryViewID={inputAccessoryViewID}
                        />
                    </View>
                    {
                        Platform.OS === "ios" &&
                        <InputAccessoryView nativeID={inputAccessoryViewID}>
                            <View style={styles.inputAccessory}>
                                <Button onPress={() => Keyboard.dismiss()} title={commonText.done} />
                            </View>
                        </InputAccessoryView>
                    }
                </KeyboardAwareScrollView>

                <CustomButton
                    title={commonText.continue}
                    onPress={() => this.onPressGetStarted()}
                    mainStyle={styles.continue}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**action when continue is clicked */
    onPressGetStarted = () => {
        Keyboard.dismiss()
        if (this.state.message.trim() == "") {
            showSimpleAlert(commonText.describeyourSelfAlert)
        }
        else {
            if (this.state.message.trim().length < 100) {
                showSimpleAlert(commonText.rightMinDescMessage)
            }
            else {
                const params = { description: this.state.message.trim() }
                if (this.props.route.params && this.props.route.params.isFromSettingStack) {
                    this.props.saveProfileSetupData(params, this.props.route.params.isFromSettingStack)
                }
                else {
                    this.props.saveProfileSetupData(params, false)
                }
            }
        }
    }

    /**handling text changing */
    changeText = (text) => {
        this.setState({ message: text })
    }
}

export default DescriptionProfile;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainStyle: {
        marginHorizontal: 30,
        marginTop: 30
    },
    headingText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.muli,
        color: colors.textColor
    },
    genderImageStyle: {
        alignSelf: 'center',
        marginTop: 20
    },
    genderText: {
        fontSize: 32,
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        marginTop: 35
    },
    InputButtonStyle: {
        marginTop: 5,
        justifyContent: 'center',
        flex: 1
    },
    continueButton: {
        marginHorizontal: 30,
        marginTop: 10
    },
    email: {
        color: colors.grayShadeDark,
        fontSize: 16,
        fontFamily: fonts.muli,
        textAlign: 'center'
    },
    resend: {
        marginTop: 20,
        color: colors.blueShade1,
        fontFamily: fonts.muli,
        fontSize: 16,
        textAlign: 'center'
    },
    textInput: {
        color: colors.black,
        alignSelf: 'flex-start',
        marginHorizontal: 5,
        paddingTop: 15,
        flex: 1,
        height: '100%',
    },
    continue: {
        marginVertical: 20
    },
    inputAccessory: {
        backgroundColor: colors.inputAccessoryBg,
        alignItems: "flex-end",
        paddingHorizontal: 5,
        height: 35,
    },
    containerStyle: {
        marginVertical: 20,
        flex: 1
    }
})