import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Keyboard, BackHandler } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, icons, } from '../../assets';
import { InputField, CustomButton, Loader } from '../../components';
import Header from '../../components/Header'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { verticalScale } from '../../utils/scale';
import { isValidPassword, showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';

/**Change Password Screen Component */
class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            oldPassword: "",
            newPassword: "",
            confirmNewPassword: ""
        };
    }

    /**component lifecycle method */
    componentDidMount() {
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**component lifecycle method */
    componentWillUnmount() {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    /**action for back button press */
    handleBackPress = () => {
        this.props.navigation.navigate(commonText.settingsScreenRoute);
        return true;
    }

    /**component render method */
    render() {
        const { oldPassword, newPassword, confirmNewPassword } = this.state;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <Header
                    backButton
                    onBackButtonPress={this.handleBackPress}
                    middleText={commonText.changePassword} />

                <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} showsVerticalScrollIndicator={false} bounces={false} >
                    <View style={styles.mainView}>
                        <Image style={styles.forgotPasswordImage} source={images.changePasswordLady} />
                    </View>
                    <View>
                        <View>
                            <InputField
                                value={oldPassword}
                                rightIcon={icons.passwordNewIcon}
                                rightIconHeight={20}
                                rightIconWidth={20}
                                theme={0}
                                InputRef={(ref) => this.passRef = ref}
                                onChangeText={(oldPassword) => {
                                    if (oldPassword.trim().length === 18) Keyboard.dismiss();
                                    this.setState({ oldPassword })
                                }}
                                maxLength={18}
                                onSubmitEditing={() => this.conPasswordRef.focus()}
                                placeholderTextColor={colors.grayShadeDark}
                                placeholder={'Existing Password'}
                                secureTextEntry={true}
                                returnKeyType={constants.nextReturnKeyType}
                                containerStyle={{ marginVertical: 15 }}
                                style={{ color: colors.black, }}
                                blurOnSubmit={false}
                            />
                            <InputField
                                rightIcon={icons.passwordNewIcon}
                                rightIconHeight={20}
                                rightIconWidth={20}
                                maxLength={18}
                                theme={0}
                                value={newPassword}
                                InputRef={(ref) => this.conPasswordRef = ref}
                                onChangeText={(newPassword) => {
                                    if (newPassword.trim().length === 18) Keyboard.dismiss();
                                    this.setState({ newPassword })
                                }}
                                onSubmitEditing={() => this.conNewPasswordRef.focus()}
                                placeholderTextColor={colors.grayShadeDark}
                                placeholder={'New Password'}
                                secureTextEntry={true}
                                returnKeyType={constants.nextReturnKeyType}
                                style={{ color: colors.black, }}
                                blurOnSubmit={false}
                            />
                            <InputField
                                rightIcon={icons.passwordNewIcon}
                                rightIconHeight={20}
                                rightIconWidth={20}
                                maxLength={18}
                                theme={0}
                                InputRef={(ref) => this.conNewPasswordRef = ref}
                                value={confirmNewPassword}
                                onChangeText={(confirmNewPassword) => {
                                    if (confirmNewPassword.trim().length === 18) Keyboard.dismiss();
                                    this.setState({ confirmNewPassword })
                                }}
                                onSubmitEditing={() => Keyboard.dismiss()}
                                placeholderTextColor={colors.grayShadeDark}
                                placeholder={'Confirm New Password'}
                                secureTextEntry={true}
                                returnKeyType={constants.doneReturnKeyType}
                                style={{ color: colors.black, }}
                                blurOnSubmit={false}
                            />
                            <View style={{ paddingBottom: 15 }}>
                                <CustomButton
                                    title={commonText.submit}
                                    onPress={this.onPressSubmit}
                                    mainStyle={styles.maleText}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**action for submit button click */
    onPressSubmit = async () => {
        const { oldPassword, newPassword } = this.state;
        const response = this.checkValidation();
        if (response) {
            let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
            let user_id = userDetails.user_id;
            const params = {
                old_password: oldPassword.trim(),
                new_password: newPassword.trim(),
                user_id,
            }
            this.props.changePassword(params)
        }
    }

    /**check validation for password schemas */
    checkValidation = () => {
        const { oldPassword, newPassword, confirmNewPassword } = this.state;
        if (oldPassword.trim() == "") {
            showSimpleAlert(commonText.pleaseEnterExistingPassword);
            return false;
        }
        else if (newPassword.trim() == "") {
            showSimpleAlert(commonText.pleaseEnterNewPassword);
            return false;
        }
        else if (isValidPassword(newPassword) === false) {
            showSimpleAlert(commonText.enterValidPwdMessage);
            return false;
        }
        else if (confirmNewPassword.trim() == "") {
            showSimpleAlert(commonText.pleaseEnterConfirmNewPassword);
            return false;
        }
        else if (newPassword.trim() !== confirmNewPassword.trim()) {
            showSimpleAlert(commonText.passwordSameMessageForNewPassword);
            return false;
        }
        else {
            return true;
        }
    }
}

export default ChangePassword;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainView: {
        flex: 1,
        alignSelf: 'center'
    },
    forgotPasswordImage: {
        marginTop: verticalScale(60),
        marginBottom: verticalScale(20),
    }
})