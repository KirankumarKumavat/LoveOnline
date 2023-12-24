import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Keyboard } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, fonts } from '../../assets';
import { InputField, CustomButton, TitleDescription, TitleHeader, Loader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { showSimpleAlert, isValidPassword } from '../../utils/HelperFunction';

/**Enter Password Screen Componet */
class EnterPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
        };
    }

    /**componet render method */
    render() {
        const { password, confirmPassword } = this.state;
        const { email, fromForgetPassword } = this.props.route.params;
        return (
            <View style={styles.container}>
                <Header
                    theme={0}
                    middleText={commonText.enterPassword} />
                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={styles.mainStyle}>
                        <TitleDescription description={commonText.enterpasswordDescmessage} />
                        <View style={{ flex: 1, height: constants.screenHeight / 4, justifyContent: 'center' }}>
                            <Image resizeMode='contain' style={styles.genderImageStyle} source={images.verification} />
                        </View>
                        <TitleHeader numberOfLinesForTitle={3} title={commonText.enterPassword} />
                        <Text style={styles.email}>{email}</Text>
                    </View>
                    <View style={styles.InputButtonStyle}>
                        <InputField
                            value={password}
                            theme={0}
                            InputRef={(ref) => this.passRef = ref}
                            onChangeText={(password) => {
                                if (password.trim().length === 18) Keyboard.dismiss();
                                this.setState({ password })
                            }}
                            maxLength={18}
                            onSubmitEditing={() => this.conPasswordRef.focus()}
                            placeholderTextColor={colors.grayShadeDark}
                            placeholder={'Password'}
                            secureTextEntry={true}
                            returnKeyType={constants.nextReturnKeyType}
                            containerStyle={{ marginVertical: 15 }}
                            style={{ color: colors.black, }}
                            blurOnSubmit={false}
                        />
                        <InputField
                            theme={0}
                            value={confirmPassword}
                            InputRef={(ref) => this.conPasswordRef = ref}
                            onChangeText={(confirmPassword) => {
                                if (confirmPassword.trim().length === 18) Keyboard.dismiss();
                                this.setState({ confirmPassword })
                            }}
                            maxLength={18}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            placeholderTextColor={colors.grayShadeDark}
                            placeholder={'Confirm Password'}
                            secureTextEntry={true}
                            returnKeyType={constants.doneReturnKeyType}
                            style={{ color: colors.black, }}
                            blurOnSubmit={false}
                        />
                        <CustomButton
                            title={commonText.getStarted}
                            onPress={this.onPressGetStarted}
                            mainStyle={styles.maleText}
                        />
                    </View>
                </KeyboardAwareScrollView>
                <Loader loading={fromForgetPassword ? this.props.resetLoading : this.props.loading} />
            </View>
        );
    }

    /**action when get started is clicked */
    onPressGetStarted = async () => {
        const { date_of_birth, email, gender, fromForgetPassword } = this.props.route.params;
        const { password, confirmPassword } = this.state;
        const response = await this.checkValidation()
        if (response) {
            if (fromForgetPassword) {
                const params = {
                    new_password: password.trim(),
                    email,
                }
                this.props.resetPassword(params)
            }
            const params = {
                password: password.trim(),
                date_of_birth,
                email,
                gender,
            }
            this.props.signUp(params)
        }
    }

    /**check the validation for password schema */
    checkValidation = async () => {
        Keyboard.dismiss()
        const { password, confirmPassword } = this.state;
        if (password.trim() == "") { showSimpleAlert(commonText.enterPasswordMessage); return false; }
        else if (isValidPassword(password) === false) { showSimpleAlert(commonText.enterValidPwdMessage); return false; }
        else if (confirmPassword.trim() == "") { showSimpleAlert(commonText.enterConfirmPasswordMessage); return false; }
        else if (password.trim() !== confirmPassword.trim()) { showSimpleAlert(commonText.passwordSameMessage); return false; }
        else return true;
    }

}

export default EnterPassword;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainStyle: {
        marginHorizontal: 20,
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
        justifyContent: 'center'
    },
    maleText: {
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
    }
})