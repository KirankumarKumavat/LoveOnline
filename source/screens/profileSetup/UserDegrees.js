import React, { Component } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, colors } from '../../common';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { fonts } from '../../assets';
import { buttonTheme } from '../../components/CustomButton';
import UserUtils from '../../utils/UserUtils';

/**ProfileSetup:UserDegrees selection Screen component */
class UserDegrees extends Component {
    state = {
        userDetails: {}
    }

    /**componet life cycle method */
    async componentDidMount() {
        let userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        this.setState({ userDetails })
        await this.props.getUserProfileData();
        await this.props.getEducationData();
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    style={{}}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.educationData || []}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props}
                    numColumns={2}
                />
                <View style={{ justifyContent: 'flex-end', }}>
                    <CustomButton
                        title={commonText.continue}
                        onPress={this.onPress}
                    />
                </View>
            </View>
        );
    }

    /**action handling for continue button click */
    onPress = () => {
        if (this.props.selectedDegreeList) {
            if (!this.props.selectedDegreeList.length) {
                showSimpleAlert(commonText.selectOneDegreeMessage)
            }
            else {
                let education_id = [];
                this.props.selectedDegreeList.map((obj) => {
                    education_id.push(obj.education_id)
                })
                const parmas = { education_id }
                if (this.props.isFromSettingsStack) {
                    this.props.saveProfileSetupData(parmas, this.props.isFromSettingsStack)
                }
                else {
                    this.props.saveProfileSetupData(parmas)
                }
            }
        }
    }

    /**rende method for all degree list items */
    renderItem = ({ item, index }) => {
        let selected = false;
        this.props.selectedDegreeList && this.props.selectedDegreeList.length &&
            this.props.selectedDegreeList.map((obj) => {
                if (obj.education_id == item.education_id) selected = true;
            })
        return (
            <CustomButton
                key={index}
                isSmall
                selectionButtonTheme={1}
                theme={selected ? buttonTheme.dark : buttonTheme.light}
                title={item.education_degree || ""}
                onPress={() => this.onPressDegree(item, index, selected)}
                mainStyle={styles.professionStyle}
                titleStyle={styles.professionTitle}
            />
        )
    }

    /**when user click on degree */
    onPressDegree = (item, index, selected) => {
        let degree = item;
        if (selected) this.props.removeFromDegreeList(degree)
        else this.props.addDegreeToList(degree)
    }
}
export default UserDegrees;

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
        shadowColor: colors.transparent,
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
