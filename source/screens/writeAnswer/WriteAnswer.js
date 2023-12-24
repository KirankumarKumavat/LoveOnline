import React, { Component } from 'react';
import { View, StyleSheet, Keyboard, BackHandler, Platform, InputAccessoryView, Button } from 'react-native';

import { constants, colors, commonText } from '../../common';
import { fonts } from '../../assets';
import { InputField, CustomButton, TitleHeader, Loader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { isIphoneX } from '../../utils/iPhoneXHelper';

/**WriteAnswer Screen Component */
class WriteAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: this.props.route.params && this.props.route.params.answer ? this.props.route.params.answer : '',
            isShowAll: false,
        };
    }

    /**componet life cycle method */
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
        this.subscribeBlur = this.props.navigation.addListener('blur', this.onScreenBlur);
        this.subscribeFocus = this.props.navigation.addListener('focus', () => this.onScreenFocus());
        const isFromAns = this.props.route.params && this.props.route.params.isFromAns
        if (isFromAns) {
        }
    }

    /**action when screen is focued */
    onScreenFocus = () => {
        const isFromAns = this.props.route.params && this.props.route.params.isFromAns
        if (isFromAns) {
            this.setState({ message: "", isShowAll: false })
        }
    }

    /**action when screen is blurred */
    onScreenBlur = () => {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
    }

    /**action fire when back button click */
    androidBackPress = () => {
        const { isFromPrompt, isFromSettingsStack } = this.props.route.params;
        if (isFromPrompt && !isFromSettingsStack) {
            this.props.navigation.navigate(commonText.selectPromptRoute);
            return true;
        }
        else if (this.props.route.params.isFromSettingsStack) {
            this.props.navigation.goBack()
            return true;
        }
        else {
            let specificIndex = 13;
            this.props.navigation.navigate(commonText.profileSetupStepsRoute);
            this.props.profileSetupIncreaseIndex(specificIndex);
            return true;
        }
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
        this.subscribeBlur();
        this.subscribeFocus();
    }

    /**componet render method */
    render() {
        const questionDetail = this.props.route.params && this.props.route.params.questionDetail || {};
        const inputAccessoryViewID = "doneBtn";
        const isFromAns = this.props.route.params && this.props.route.params.isFromAns
        return (
            <View style={styles.container}>
                <Header
                    backButton
                    theme={0}
                    onBackButtonPress={this.androidBackPress}
                    middleText={commonText.writeAnswer}
                    rightText={this.props.route.params.answer && !isFromAns ? 'All' : ''}
                    onPressRightText={() => this.props.navigation.navigate(commonText.selectPromptRoute, {
                        position: questionDetail.position, question_id: questionDetail.question_id, isFromAns: true, isFromSettingsStack: this.props.route.params.isFromSettingsStack, isFromEdit: this.props.route.params.isFromEdit
                    })}
                />
                <View style={styles.mainStyle}>
                    <View>
                        <TitleHeader
                            title={questionDetail ? questionDetail.question : ""}
                            mainStyle={styles.mainStyleWrap}
                            textStyle={{ textAlign: 'left' }}
                            numberOfLinesForTitle={4}
                        />
                    </View>
                </View>
                <KeyboardAwareScrollView
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    keyboardShouldPersistTaps={'always'}
                    contentContainerStyle={{ flexGrow: 1 }}
                    extraHeight={isIphoneX() && 0}
                >
                    {/* <View style={styles.mainStyle}>
                        <View>
                            <TitleHeader
                                title={questionDetail ? questionDetail.question : ""}
                                mainStyle={styles.mainStyleWrap}
                                textStyle={{ textAlign: 'left' }}
                                numberOfLinesForTitle={4}
                            />
                        </View>
                    </View> */}
                    <View style={styles.InputButtonStyle} >
                        <InputField
                            value={this.state.message}
                            theme={0}
                            onChangeText={(message) => this.changeText(message)}
                            placeholderTextColor={colors.grayShadeDark}
                            placeholder={commonText.writeAnswer + "..."}
                            multiline={true}
                            containerStyle={{ marginVertical: 20, flex: 1 }}
                            style={styles.textInput}
                            returnKeyType={constants.nextReturnKeyType}
                            textAlignVertical={'top'}
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
                    title={commonText.done}
                    onPress={() => this.onPressGetStarted()}
                    mainStyle={styles.continue}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**action handling when save answer */
    onPressGetStarted = () => {
        Keyboard.dismiss()
        const questionDetail = this.props.route.params.questionDetail || {};
        if (this.state.message.trim() == "") {
            showSimpleAlert(`${commonText.pleaseText} ${commonText.writeAnswer}`)
        }
        else {
            const params = {
                position: questionDetail.position,
                question_id: questionDetail.question_id,
                answer: this.state.message.trim()
            }
            if (this.props.route.params && this.props.route.params.isFromSettingsStack) {
                this.props.saveProfileSetupData(params, this.props.route.params.isFromSettingsStack)
            } else if (this.props.route.params && this.props.route.params.isFromEdit) {
                this.props.saveProfileSetupData(params, this.props.route.params.isFromEdit)
            }
            else {
                this.props.saveProfileSetupData(params)
            }
        }
    }
    /**change text handling */
    changeText = (text) => {
        this.setState({ message: text })
    }
    /**componet life cycle method */
    componentWillUnmount() {
        this.setState({ message: "" })
    }
}
export default WriteAnswer;

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
        height: '95%',
    },
    continue: {
        marginVertical: 40
    },
    inputAccessory: {
        backgroundColor: colors.inputAccessoryBg,
        alignItems: "flex-end",
        paddingHorizontal: 5,
        height: 35,
    },
    mainStyleWrap: {
        alignItems: 'flex-start',
        marginLeft: 10
    }
})