import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { fonts, icons } from '../../assets';
import { colors, commonText } from '../../common';
import { Header, Loader } from '../../components';
import SvgIcon from '../../components/SvgIcon';

/**Filter Education Component */
class FilterEducation extends Component {
    /**componet life cycle method */
    async componentDidMount() {
        await this.props.getEducationData();
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <Header
                    backButton
                    middleText={commonText.education}
                />
                <FlatList
                    ref={(ref) => this.flatListRef = ref}
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.educationData}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={this.itemSeparator}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**render method for education list item */
    renderItem = ({ item, index }) => {
        let selected = false;
        this.props.selectedEducationData && this.props.selectedEducationData.length
            && this.props.selectedEducationData.map((obj) => {
                if (obj.education_id == item.education_id) selected = true
            })
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => this.onPressSelectedOption(item, index, selected)}
                delayPressIn={0}
                style={styles.casteView}>
                <Text style={styles.modalText}>{item.education_degree}</Text>
                {selected ? <SvgIcon
                    name={icons.checkMarkIcon}
                    height={20}
                    width={20}
                /> : null}
            </TouchableOpacity>)
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparator}></View>
        )
    }

    /**action handling for selecting option */
    onPressSelectedOption = (item, index, selected) => {
        let education = item;
        if (selected) this.props.filterEducationRemoveData(education)
        else this.props.filterAddEducationData(education)
    }
}

export default FilterEducation;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,

    },
    textHeader: {
        color: colors.textColor,
        fontFamily: fonts.muli,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 25,
        marginHorizontal: 40
    },
    listText: {
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        paddingTop: 20,
        paddingHorizontal: 15
    },
    answers: {
        fontSize: 14,
        fontFamily: fonts.muliSemiBold,
        color: colors.grayShadeDark,
        paddingHorizontal: 40,
        paddingBottom: 10
    },
    flatlistContainer: {
        paddingVertical: 20,
        marginHorizontal: 10,
    },

    preference: {
        color: colors.black,
        fontFamily: fonts.sukhumvitSetBold,
        fontSize: 22,

    },
    modalText: {
        color: colors.black,
        fontFamily: fonts.muli,
        fontSize: 16
    },
    casteView: {
        paddingLeft: 20,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 20
    },
    textAndButtonStyle: {
        flexDirection: 'row',
        marginHorizontal: 30,
        marginTop: 30,
        justifyContent: 'space-between'
    },
    itemsContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    itemSeparator: {
        height: 1,
        backgroundColor: colors.textInputBorder
    }

})



