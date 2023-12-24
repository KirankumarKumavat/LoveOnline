import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, } from 'react-native';
import { fonts, icons, } from '../../assets';
import { colors, commonText, } from '../../common';
import { Header, Loader, } from '../../components';
import SvgIcon from '../../components/SvgIcon';

/**FilterMarriageGoal Component */
class FilterProfession extends Component {

    /**componet life cycle method */
    async componentDidMount() {
        await this.props.getProffestionData();
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.props.getFilterArray();
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <Header
                    backButton
                    middleText={commonText.profession}
                />
                <FlatList
                    style={{ flex: 1 }}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.proffestionData}
                    extraData={this.props}
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

    /**render method for diplsay item of profession list */
    renderItem = ({ item, index }) => {
        let selected = false;
        this.props.selectedProffestionData && this.props.selectedProffestionData.length
            && this.props.selectedProffestionData.map((obj) => {
                if (obj.profession_id == item.profession_id) selected = true
            })
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                delayPressIn={0}
                onPress={() => this.onPressSelectedOption(item, index, selected)}
                style={styles.casteView}
            >
                <Text style={styles.modalText}>{item.profession_name}</Text>
                {selected ? <SvgIcon
                    name={icons.checkMarkIcon}
                    height={22}
                    width={22}
                /> : null}
            </TouchableOpacity>
        )
    }

    /**item separator component */
    itemSeparator = () => (
        <View style={styles.itemSeparator} />
    )

    /**action handling when profession option is selected */
    onPressSelectedOption = (item, index, selected) => {
        let proffestion = item;
        if (selected) this.props.filterProffestioRemoveData(proffestion);
        else this.props.filterAddProffestionData(proffestion)
    }
}

export default FilterProfession;

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
        marginRight: 20,
        alignItems: 'center'
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
