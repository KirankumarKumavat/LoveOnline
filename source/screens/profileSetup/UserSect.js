import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, colors } from '../../common';
import { fonts } from '../../assets';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';
let userDetails;

/**
 * 
 * @param {*} id 
 * @returns Spirituality
 */
export const getSpiritualityById = (id) => {
    let spirituality = "";
    switch (id) {
        case 1:
            spirituality = commonText.veryReligious;
            break;
        case 2:
            spirituality = commonText.religious;
            break;
        case 3:
            spirituality = commonText.notveryreligious;
            break;
        case 4:
            spirituality = commonText.preferNotSay;
            break;
        default:
            spirituality = "";
            break;
    }
    return spirituality;
}

/**ProfileSetup:UserSect selection Screen component */
class UserSect extends Component {

    userName = "";
    selectedIndex = null;

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails.spirituality) {
            this.selectedIndex = userDetails.spirituality;
            this.forceUpdate()
        }
    }

    /**list for spirituality */
    userSpirituality = [
        {
            id: 1,
            title: commonText.veryReligious,
        },
        {
            id: 2,
            title: commonText.religious,
        },
        {
            id: 3,
            title: commonText.notveryreligious,
        },
        {
            id: 4,
            title: commonText.preferNotSay,
        }
    ]

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.userSpirituality || []}
                    renderItem={this.renderItem}
                    numColumns={2}
                    contentContainerStyle={styles.flatlistContainer}
                    keyExtractor={index => index}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props}
                />
            </View>
        );
    }

    /**render item for spirituality list */
    renderItem = ({ item, index }) => {
        return (
            <CustomButton
                key={index}
                isSmall
                theme={this.selectedIndex === item.id ? buttonTheme.dark : buttonTheme.light}
                selectionButtonTheme={1}
                title={item.title}
                mainStyle={[styles.professionStyle]}
                onPress={() => this.onPressCell(item, index)}
            />
        )
    }

    /**click event when user select spirituality */
    onPressCell = (item, index) => {
        this.selectedIndex = item.id;
        this.forceUpdate();
        const params = { spirituality: item.id }
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params)
        }
    }
}

export default UserSect;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    flatlistContainer: {
        flexGrow: 1,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: 20,
        alignItems: 'center'
    },
    professionStyle: {
        backgroundColor: colors.transparentWhite,
        shadowColor: 'transparent',
        elevation: 0,
        width: constants.screenWidth / 2 - 35,
        margin: 10,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 15,
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
        marginTop: 20,
        justifyContent: 'center'
    },
    maleText: {
        width: constants.screenWidth / 2 - 60,
        marginHorizontal: 10
    },
    title: {
        fontFamily: fonts.muli
    }
})
