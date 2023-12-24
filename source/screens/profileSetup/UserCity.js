import React, { Component } from 'react';
import { View, Text, StyleSheet, Keyboard } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { InputField, CustomButton } from '../../components';
import { commonText, constants } from '../../common';
import { showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';
let userDetails;

/**ProfileSetup-User City screen component */
class UserCity extends Component {
    state = {
        userCity: ""
    }

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails.city) {
            this.setState({ userCity: userDetails.city }, () => {
            })
        }
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    bounces={false}
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1 }}>
                        <InputField
                            placeholder={commonText.city}
                            value={this.state.userCity}
                            onChangeText={(userCity) => this.setState({ userCity })}
                            returnKeyType={constants.doneReturnKeyType}
                            onSubmitEditing={() => Keyboard.dismiss()}
                            autoCapitalize={'words'}
                        />
                        <View style={styles.wrap}>
                            <CustomButton
                                title={commonText.continue}
                                onPress={this.onPress}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        );
    }

    /**click event for continue press */
    onPress = () => {
        Keyboard.dismiss()
        if (!this.state.userCity.trim()) showSimpleAlert(commonText.enterCityMessage)
        else {
            const params = { city: this.state.userCity.trim() }
            // this.props.saveProfileSetupData(params)
            if (this.props.isFromSettingsStack) {
                this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
            }
            else {
                this.props.saveProfileSetupData(params)
            }
        }
    }

    /**change text handling */
    onChangeText = (text) => {
        this.userCity = text.replace(/\s/g, '');
        this.forceUpdate()
    }
}

export default UserCity;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    wrap: { flex: 1, justifyContent: 'flex-end', marginBottom: 10 }
})
