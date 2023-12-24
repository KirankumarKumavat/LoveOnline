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
 * @returns etnicity
 */
export const getEthnicity = (id) => {
    let value;
    switch (id) {
        case 1:
            value = commonText.somaliText
            break;
        case 2:
            value = commonText.mixedSomaliText
            break;
        case 3:
            value = commonText.nonSomaliText
            break;
        default:
            value = ""
            break;
    }
    return value;
}

/**ProfileSetup:UserEthnicity selection Screen component */
class UserEthnicity extends Component {
    selectedIndex = null;

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails && userDetails.ethnicity) {
            this.ethnicityArray.map((obj) => {
                if (obj.title === userDetails.ethnicity) {
                    this.selectedIndex = obj.id;
                    this.forceUpdate()
                }
            })
        }
    }

    /**etnicity list array */
    ethnicityArray = [
        {
            id: 0,
            title: commonText.hinduism
        },
        {
            id: 1,
            title: commonText.buddhism
        },
        {
            id: 2,
            title: commonText.Jainism
        },
        {
            id: 3,
            title: commonText.sikhism
        }, {
            id: 4,
            title: commonText.islam
        }, {
            id: 5,
            title: commonText.judaism
        },
        {
            id: 6,
            title: commonText.christianity
        },
        {
            id: 7,
            title: commonText.otherreligions
        },
    ]

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{}}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.ethnicityArray || []}
                    renderItem={this.renderItem}
                    keyExtractor={index => index}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props}
                    numColumns={2}
                />
            </View>
        );
    }

    /**render method for etnicity list */
    renderItem = ({ item, index }) => {
        return (
            <CustomButton
                key={index}
                isSmall
                selectionButtonTheme={1}
                theme={this.selectedIndex === item.id ? buttonTheme.dark : buttonTheme.light}
                title={item.title || ""}
                onPress={() => this.onPressEthnicity(item, index)}
                mainStyle={styles.professionStyle}
            />
        )
    }

    /**click event for etnicity press */
    onPressEthnicity = (item, index) => {
        this.selectedIndex = item.id;
        this.forceUpdate();
        const params = { ethnicity: item.title }
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params)
        }
    }
}

export default UserEthnicity;

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
        width: constants.screenWidth / 2 - 45,
        margin: 10,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 15,
        shadowColor: 'transparent',
        elevation: 0
    },
    professionTitle: {
        padding: 5,
        fontSize: 14,
        fontFamily: fonts.muli,
        color: colors.textColor,
        textAlign: 'center',
        lineHeight: 17,
    }
})
