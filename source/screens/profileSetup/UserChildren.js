import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, colors } from '../../common';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';

/**Profile Setup-User Children selection container */
class UserChildren extends Component {

    selectedGenderIndex = null;
    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails && userDetails.is_children_available) {
            this.selectedGenderIndex = userDetails.is_children_available === 'Yes' ? 0 : 1
            this.forceUpdate()
        }
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.maritalstatusViewStyle} >
                    <CustomButton
                        selectionButtonTheme={1}
                        theme={this.selectedGenderIndex === 0 ? buttonTheme.dark : buttonTheme.light}
                        title={commonText.yes}
                        onPress={() => this.onPressStatus(0)}
                        mainStyle={styles.SingleTextStyle}
                    />
                    <CustomButton
                        selectionButtonTheme={1}
                        theme={this.selectedGenderIndex === 1 ? buttonTheme.dark : buttonTheme.light}
                        title={commonText.no}
                        onPress={() => this.onPressStatus(1)}
                        mainStyle={styles.SingleTextStyle}
                    />
                </View>
            </View>
        );
    }

    /**action for selection of children */
    onPressStatus = (id) => {
        this.selectedGenderIndex = id;
        const params = {
            is_children_available: id === 0 ? commonText.yes : commonText.no
        }
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params)
        }
        this.forceUpdate();
    }
}

export default UserChildren;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    mainStyle: {
        width: constants.screenWidth / 2 - 30
    },
    maritalstatusViewStyle: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'center'
    },
    SingleTextStyle: {
        width: constants.screenWidth / 2 - 60,
        marginHorizontal: 10,
        elevation: 0,
        shadowColor: colors.transparent
    },

})
