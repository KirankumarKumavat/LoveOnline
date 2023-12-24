import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { CustomButton } from '../../components';
import { constants, colors } from '../../common';
import { fonts } from '../../assets';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';
let userDetails;
/**ProfileSetup:UserProffestion selection Screen component */
class UserProffestion extends Component {

    keyExtractor = (item, index) => index.toString();

    selectedProffestionIndex = null;

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails.profession_name) {
            this.selectedProffestionIndex = userDetails.profession_id;
            await this.props.getProffestionData();
        }
        await this.props.getProffestionData();

    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{}}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.proffestionData}
                    renderItem={this.renderItem}
                    keyExtractor={this.keyExtractor}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props}
                    numColumns={2}
                />
            </View>
        );
    }

    /**render Profession item */
    renderItem = ({ item, index }) => {
        return (
            <CustomButton
                isSmall
                selectionButtonTheme={1}
                theme={this.selectedProffestionIndex === item.profession_id ? buttonTheme.dark : buttonTheme.light}
                title={item.profession_name || ""}
                onPress={() => this.onPressProfession(item, index)}
                mainStyle={styles.professionStyle}
            />
        )
    }

    /**action handle for profession click */
    onPressProfession = (item, index) => {
        this.selectedProffestionIndex = item.profession_id;
        this.forceUpdate();
        const params = {
            profession_id: item.profession_id
        }
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params)
        }
    }
}

export default UserProffestion;

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
        paddingBottom: 10,
        // alignItems: 'center'
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
    },
    SingleTextStyle: {
        width: constants.screenWidth / 2 - 50,
        marginHorizontal: 10
    },
})
