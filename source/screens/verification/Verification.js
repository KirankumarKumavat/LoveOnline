import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Keyboard, TouchableOpacity } from 'react-native';

import { constants, colors, commonText } from '../../common';
import { images, fonts } from '../../assets';
import { InputField, CustomButton, TitleHeader, Timer, TitleDescription, Loader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { moderateScale } from '../../utils/scale';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { getBottomMoreSpace } from '../../utils/iPhoneXHelper';

/**timer options */
export const timerOptions = {
    container: {
        borderRadius: 5,
    },
    text: {
        fontSize: 14,
        color: colors.blueShade1,
        fontFamily: fonts.muliSemiBold,
    }
};

/**Verification Screen Component */
class Verification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            timer: false,
            timerStart: false,
            timerReset: false,
            totalDuration: 60000,
        };
    }

    /**componet life cycle method */
    componentDidMount() {
        this.setState({ timerStart: true, timerReset: false, timer: true });
    }
    /**componet life cycle method */
    componentWillUnmount() {
        this.setState({ timerStart: false, timerReset: false, timer: false });
    }

    /**componet render method */
    render() {
        const { email } = this.props.route.params;
        return (
            <View style={styles.container}>
                <Header
                    theme={0}
                    middleText={commonText.verification} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1, }}>
                    <View style={styles.mainStyle}>
                        <TitleDescription description={commonText.verificationDescMessage} />
                        <View style={styles.imageView}>
                            <Image resizeMode='contain' style={styles.genderImageStyle} source={images.verification} />
                        </View>
                        <TitleHeader title={commonText.enterVerificationCode} numberOfLinesForTitle={4} mainStyle={{ paddingHorizontal: moderateScale(30), }} />
                        <Text style={styles.email}>{email}</Text>
                    </View>
                    <View style={styles.InputButtonStyle} >
                        <InputField
                            keyboardType={constants.numericKeyboardType}
                            value={this.state.verificationCode}
                            theme={0}
                            maxLength={4}
                            placeholderTextColor={colors.grayShadeDark}
                            onChangeText={(verificationCode) => this.changeText(verificationCode)}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            placeholder={'# # # #'}
                            containerStyle={{ marginVertical: 20 }}
                            style={styles.textStyle}
                            secureTextEntry={true}
                            returnKeyType={constants.doneReturnKeyType}
                        />
                        <CustomButton
                            title={commonText.submit}
                            onPress={this.onPressSubmit}
                            mainStyle={styles.maleText}
                        />
                        {this.renderResendView()}
                    </View>
                </KeyboardAwareScrollView>
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**render method for display resend otp view and timer view */
    renderResendView = () => {
        const {
            timer,
            timerStart,
            timerReset,
            totalDuration,
        } = this.state;
        return (
            <View style={{ marginVertical: 20 }}>
                {
                    timer ?
                        <View style={{ alignSelf: 'center' }}>
                            <Timer
                                msec
                                options={timerOptions}
                                start={timerStart}
                                reset={timerReset}
                                totalDuration={totalDuration}
                                style={styles.bottomTextStyle}
                                handleFinish={() => this.setState({ timer: false })}
                            />
                        </View>
                        :
                        <TouchableOpacity activeOpacity={0.5} delayPressIn={0} onPress={this.resendPress}>
                            <Text style={styles.resend}>{commonText.resend}</Text>
                        </TouchableOpacity>
                }
            </View>
        )
    }

    /**action handle for submit button click */
    onPressSubmit = () => {
        Keyboard.dismiss();
        if (!this.state.verificationCode) showSimpleAlert(commonText.enterVerificationCodeMessage)
        else {
            if (this.state.verificationCode.length < 4) {
                showSimpleAlert(commonText.enterValidOtpMessage)
            }
            else {
                const { date_of_birth, gender, email } = this.props.route.params;
                const params = {
                    otp: this.state.verificationCode.trim(),
                    email,
                }
                const navParams = {
                    email, date_of_birth, gender
                }
                this.props.verifyCode(params, navParams);
            }
        }
    }

    /**action handle when resend button click  */
    resendPress = () => {
        const { email } = this.props.route.params;
        const params = { email }
        this.setState({ timerStart: true, timerReset: false, timer: true });
        this.props.resendOtpCode(params);
    }

    /**otp change text handle */
    changeText = (text) => {
        if (text.trim().length === 4) Keyboard.dismiss();
        this.setState({ verificationCode: text })
    }

}

export default Verification;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainStyle: {
        marginHorizontal: 30,
        marginTop: 25
    },
    headingText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.muli,
        color: colors.textColor
    },
    genderImageStyle: {
        alignSelf: 'center',
        // marginTop: 80
    },
    genderText: {
        fontSize: 30,
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        marginTop: 35
    },
    InputButtonStyle: {

        marginTop: 15,
        justifyContent: 'center',
        paddingBottom: getBottomMoreSpace(20),

    },
    maleText: {
        marginHorizontal: 10,
        marginHorizontal: 30
    },
    email: {
        color: colors.grayShadeDark,
        fontSize: 16,
        fontFamily: fonts.muli,
        textAlign: 'center'
    },
    resend: {
        color: colors.blueShade1,
        fontFamily: fonts.muli,
        fontSize: 16,
        textAlign: 'center'
    },
    imageView: {
        flex: 1,
        height: constants.screenHeight / 4,
        justifyContent: 'center'
    },
    textStyle: {
        textAlign: 'center',
        color: colors.black, fontSize: 22
    }
})