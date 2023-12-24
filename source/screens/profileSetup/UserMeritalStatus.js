import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, } from '../../common';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';
let userDetails;

/**ProfileSetup:User UserMaritalStatus selection Screen component */
class UserMaritalStatus extends Component {
    selectedGenderIndex = null;
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails && userDetails.marital_status) {
            this.maritalStatusArray.map((obj) => {
                if (obj.title == userDetails.marital_status) this.selectedGenderIndex = obj.id
                this.forceUpdate();
            })
        }
    }

    /**marital status array list */
    maritalStatusArray = [
        {
            id: 0,
            title: commonText.single,
        },
        {
            id: 1,
            title: commonText.divorced,
        },
        {
            id: 2,
            title: commonText.widowed,
        },
    ]

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.maritalStatusArray}
                    renderItem={this.renderItem}
                    numColumns={2}
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', }}
                    keyExtractor={(i, j) => j.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }

    /**rende method for all marital status list items */
    renderItem = ({ item, index }) => {
        return (
            <View style={{ marginTop: 15 }}>
                <CustomButton
                    key={index}
                    isSmall
                    selectionButtonTheme={1}
                    title={item.title}
                    onPress={() => this.onPressStatus(item, index)}
                    mainStyle={styles.SingleTextStyle}
                    theme={this.selectedGenderIndex === index ? buttonTheme.dark : buttonTheme.light}
                />
            </View>
        )
    }

    /**action handle for marital status click */
    onPressStatus = (item, id) => {
        this.selectedGenderIndex = id;
        this.forceUpdate();
        const params = {
            marital_status: item.title
        }
        if (id === 0) params.is_children_available = commonText.no;
        let userIsSingle = id === 0 ? true : false
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, null, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params, userIsSingle)
        }
    }
}

export default UserMaritalStatus;

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
        // width: constants.screenWidth
    },
    SingleTextStyle: {
        width: constants.screenWidth / 2 - 60,
        marginHorizontal: 10,
        shadowColor: 'transparent',
        elevation: 0

    },

})
