import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { images, fonts } from '../../assets';
import { CustomButton } from '../../components';
import Header from '../../components/Header'
import { buttonTheme } from '../../components/CustomButton';
import { getBottomMoreSpace } from '../../utils/iPhoneXHelper';

/**GenderSelection screen component */
class GenderSelection extends Component {

    /**selected active gender index */
    selectedGenderIndex = null;

    /**componet render method */
    render() {
        const email = this.props.route.params.email;
        const { google_id, facebook_id, apple_id, isOnlygoogle, isOnlyApple, isOnlyFaceBook, isSocialLogin } = this.props.route.params;
        let socialText;
        let sameText = "You are creating a new account using"
        if (isOnlyApple) socialText = "Apple"
        else if (isOnlyFaceBook) socialText = "Facebook"
        else if (isOnlygoogle) socialText = "Google"
        let finalText = sameText + " " + socialText;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <Header
                    theme={0}
                    backButton
                    middleText={commonText.signUp} />
                <View style={styles.mainStyle}>
                    <View>
                        {
                            isSocialLogin ?
                                <Text style={styles.headingText}>{finalText}</Text>
                                :
                                <Text style={styles.headingText}>
                                    {commonText.genderSelectionMessage + ' '}
                                    <Text style={{ color: colors.blueShade1 }}>{email}</Text>
                                </Text>}
                        <Image resizeMode='contain' style={styles.genderImageStyle} source={images.gender} />
                        <Text style={styles.genderText}>
                            {commonText.whatYourGender}
                        </Text>
                    </View>
                    <View style={styles.malefemaleButtonStyle} >
                        <CustomButton
                            selectionButtonTheme={1}
                            theme={this.selectedGenderIndex === 0 ? buttonTheme.dark : buttonTheme.light}
                            title={commonText.male}
                            onPress={() => this.onPressGender(0, commonText.male)}
                            mainStyle={styles.maleText}
                        />
                        <CustomButton
                            selectionButtonTheme={1}
                            theme={this.selectedGenderIndex === 1 ? buttonTheme.dark : buttonTheme.light}
                            title={commonText.female}
                            onPress={() => this.onPressGender(1, commonText.female)}
                            mainStyle={styles.maleText}
                        />
                    </View>
                </View>
            </View>
        );
    }

    /**action handle for gender selection */
    onPressGender = (id, gender) => {
        this.selectedGenderIndex = id;
        const { email, google_id, isSocialLogin, facebook_id, apple_id } = this.props.route.params;
        this.forceUpdate();
        this.props.navigation.navigate(commonText.signupDateOfBirthRoute, { gender, email, google_id, isSocialLogin, facebook_id, apple_id })
    }
}

export default GenderSelection;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    mainStyle: {
        marginHorizontal: 35,
        marginTop: 30
    },
    headingText: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: fonts.muli
    },
    genderImageStyle: {
        alignSelf: 'center',
        marginTop: 40
    },
    genderText: {
        fontSize: 28,
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        textAlign: 'center',
        marginTop: 35
    },
    malefemaleButtonStyle: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center',
        paddingBottom: getBottomMoreSpace(20),
        // width: constants.screenWidth
    },
    maleText: {
        width: constants.screenWidth / 2 - 60,
        marginHorizontal: 10,
        shadowColor: colors.transparent,
        elevation: 0,
        height: 46,
        alignItems: "center",
        justifyContent: 'center'
    },
    email: {
        color: colors.blueShade1,

    }
})