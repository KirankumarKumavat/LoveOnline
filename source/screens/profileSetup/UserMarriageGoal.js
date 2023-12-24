import React, { Component } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, colors } from '../../common';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { fonts } from '../../assets';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';
let userDetails;

/**
 * 
 * @param {*} id 
 * @returns marriage goals
 */
export const getMarraigeGoals = (id) => {
    let value;
    switch (id) {
        case 1:
            value = commonText.marriageOption1
            break;
        case 2:
            value = commonText.marriageOption2
            break;
        case 3:
            value = commonText.preferNotSay
            break;
        default:
            value = ""
            break;
    }
    return value;
}

/**
 * 
 * @param {*} id 
 * @returns abroad goals
 */
export const getAbroadGoals = (id) => {
    let value;
    switch (id) {
        case 1:
            value = commonText.marriageOption3
            break;
        case 2:
            value = commonText.marriageOption4
            break;
        default:
            value = ""
            break;
    }
    return value;
}

/**ProfileSetup:UserMarriageGoal selection Screen component */
class UserMarriageGoal extends Component {
    userName = "";
    selectedMarriageIndex = null;
    selectedAbroadIndex = null;

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails && userDetails.marriage_goal && userDetails.abroad_goal) {
            this.marriageArray.map((obj) => {
                if (obj.id === userDetails.marriage_goal) { this.selectedMarriageIndex = userDetails.marriage_goal }
            })
            this.abroadArray.map((obj) => {
                if (obj.id === userDetails.abroad_goal) { this.selectedAbroadIndex = userDetails.abroad_goal }
            })
            this.forceUpdate()
        }
    }

    /**marraige goal array list */
    marriageArray = [
        { id: 1, title: commonText.marriageOption1 },
        { id: 2, title: commonText.marriageOption2 },
        { id: 3, title: commonText.preferNotSay },
    ]

    /** abroad goal array list */
    abroadArray = [
        { id: 1, title: commonText.marriageOption3 },
        { id: 2, title: commonText.marriageOption4 }
    ]

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1, }}>
                    <Text style={styles.titleText}>{commonText.marriagePrefrences}:</Text>
                    <View style={{ marginTop: 10 }}>
                        {
                            this.marriageArray.map((obj) => {
                                return (
                                    <CustomButton
                                        mainStyle={styles.mainStyle}
                                        isSmall
                                        title={obj.title}
                                        selectionButtonTheme={1}
                                        theme={this.selectedMarriageIndex == obj.id ? buttonTheme.dark : buttonTheme.light}
                                        titleStyle={styles.title}
                                        onPress={() => this.onPressGoal(obj.id)}
                                    />
                                )
                            })
                        }
                    </View>
                    <Text style={[styles.titleText, { marginVertical: 10 }]}>{commonText.abroadPrefrences}:</Text>
                    <View style={styles.casteButtonStyle} >
                        {
                            this.abroadArray.map((obj) => {
                                return (
                                    <CustomButton
                                        mainStyle={{
                                            shadowColor: 'transparent',
                                            elevation: 0,
                                        }}
                                        isSmall
                                        title={obj.title}
                                        selectionButtonTheme={1}
                                        theme={this.selectedAbroadIndex == obj.id ? buttonTheme.dark : buttonTheme.light}
                                        titleStyle={styles.title}
                                        mainStyle={styles.marriageOptionsText}
                                        onPress={() => this.onPressGoal(obj.id, true)}
                                    />
                                )
                            })
                        }
                    </View>
                    <View style={styles.buttonWrap}>
                        <CustomButton
                            title={commonText.continue}
                            mainStyle={{ marginVertical: 15 }}
                            onPress={this.onPressContinue}
                        />
                    </View>
                </View>
            </View>
        );
    }

    /**click event for selecing goal */
    onPressGoal = (id, isAbroad) => {
        if (isAbroad) this.selectedAbroadIndex = id
        else this.selectedMarriageIndex = id
        this.forceUpdate()
    }

    /**action handling for continue button click */
    onPressContinue = () => {
        if (this.selectedAbroadIndex == null && this.selectedMarriageIndex == null) {
            showSimpleAlert(commonText.selectBothPrefrence)
        }
        else {
            if (this.selectedMarriageIndex == null) showSimpleAlert(commonText.selectMarriagePref)
            else if (this.selectedAbroadIndex == null) showSimpleAlert(commonText.selectAbroadPref)
            else {
                const params = {
                    marriage_goal: this.selectedMarriageIndex,
                    abroad_goal: this.selectedAbroadIndex
                }
                if (this.props.isFromSettingsStack) {
                    this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
                }
                else {
                    this.props.saveProfileSetupData(params)
                }
            }
        }
    }
}

export default UserMarriageGoal;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10
    },
    flatlistContainer: {
        flexGrow: 1,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: 20,
    },
    professionStyle: {
        backgroundColor: colors.transparentWhite,
        width: constants.screenWidth / 2 - 45,
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 15,
        height: 50,
        marginHorizontal: 10,
        shadowColor: 'transparent',
        elevation: 0
    },
    professionTitle: {
        padding: 5,
        fontSize: 16,
        fontFamily: fonts.muli,
        color: colors.textColor,
        textAlign: 'center',
        lineHeight: 17,
    },
    casteButtonStyle: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'center'
    },
    marriageOptionsText: {
        width: constants.screenWidth / 2 - 40,
        marginHorizontal: 10,
        shadowColor: colors.transparent,
        elevation: 0
    },
    title: {
        fontFamily: fonts.muli,
        fontSize: 16,
    },
    titleText: {
        fontSize: 18,
        color: colors.black,
        paddingHorizontal: 20,
        fontFamily: fonts.muliSemiBold
    },
    mainStyle: {
        shadowColor: 'transparent',
        elevation: 0,
        marginVertical: 5,
    },
    buttonWrap: {
        flex: 1,
        justifyContent: 'center'
    }
})
