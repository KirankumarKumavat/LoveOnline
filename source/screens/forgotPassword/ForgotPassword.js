import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Keyboard } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, icons, } from '../../assets';
import { InputField, CustomButton, Loader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { verticalScale } from '../../utils/scale';
import { isValidEmail, showSimpleAlert } from '../../utils/HelperFunction';
import crashlytics from '@react-native-firebase/crashlytics';

/**Forgot Password screen component */
class ForgotPassword extends Component {
    state = {
        email: ""
    }

    /**render component method */
    render() {
        try {
            return (
                <View style={styles.container}>
                    <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                    <Header
                        backButton
                        middleText={commonText.forgotPassword} />

                    <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} bounces={false} >
                        <View style={styles.mainView}>
                            <Image style={styles.forgotPasswordImage} source={images.ladyWithPassword} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View>
                                <InputField
                                    value={this.state.email}
                                    InputRef={(ref) => this.emailRef = ref}
                                    placeholder={commonText.email}
                                    returnKeyType={constants.doneReturnKeyType}
                                    onChangeText={(email) => this.setState({ email })}
                                    onSubmitEditing={() => Keyboard.dismiss()}
                                    keyboardType={constants.emailKeyboardType}
                                    rightIcon={icons.emailGrey}
                                    rightIconHeight={13}
                                    rightIconWidth={17}
                                    blurOnSubmit={false}
                                    containerStyle={{ borderColor: colors.inputBorder2, marginVertical: 30 }}
                                />
                                <View style={styles.wrap}>
                                    <CustomButton
                                        onPress={this.onPressSubmit}
                                        title={commonText.submit}
                                        titleColor={colors.white}
                                    />
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <Loader loading={this.props.loading} />
                </View>
            );
        } catch (error) {
            crashlytics().recordError(error);
        }
    }

    /**action handling for submit button click */
    onPressSubmit = () => {
        if (this.state.email.trim() === "") {
            showSimpleAlert(commonText.enterEmailMessage)
            return false;
        }
        else {
            const checkEmail = isValidEmail(this.state.email)
            if (checkEmail) {
                const params = { email: this.state.email.trim() }
                this.props.forgotPassword(params)
            }
            else {
                showSimpleAlert(commonText.enterValidEmail)
                return false;
            }
        }
    }
}

export default ForgotPassword;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainView: {
        alignSelf: 'center'
    },
    forgotPasswordImage: {
        marginTop: verticalScale(60),
        marginBottom: verticalScale(20),

    },
    wrap: { flex: 1, marginBottom: 20 }
})