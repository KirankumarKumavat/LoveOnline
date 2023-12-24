import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, FlatList, Image, } from 'react-native';
import { fonts, icons, images, } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, InputField, } from '../../components';
import SvgIcon from '../../components/SvgIcon';
import CustomLabel from '../../utils/CustomLabel';

import CountryPicker, { CountryFilter, CountryList } from 'react-native-country-picker-modal';
import FastImage from 'react-native-fast-image';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { CustomSwitch } from '../../components/CustomSwitch';

/**Filter Location Component */
class Location extends Component {
    comment = ""
    constructor(props) {
        super(props);
        this.state = {
            isEnabled: true,
            countryEnabled: false
        };
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <Header
                    backButton
                    theme={0}
                    onBackButtonPress={this.androidBackPress}
                    middleText={commonText.location}
                />
                <View style={styles.topView}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.textAnyAge}>{commonText.limitByDiatnceText}</Text>
                        <Switch
                            trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                            thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                            onValueChange={() => this.toggleSwitch("0")}
                            value={this.props.selectedLocationIndex == "0" ? true : false}
                        />
                    </View>
                    {this.props.selectedLocationIndex == "0" ?
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={styles.distancePlaceholder}>{commonText.distanceMileText}</Text>
                            <MultiSlider
                                enableLabel={true}
                                customLabel={CustomLabel}
                                values={[this.props.minLocation, this.props.maxLocation]}
                                isMarkersSeparated={true}
                                onValuesChange={this.onValueChangeSlider}
                                min={0}
                                max={500}
                                step={10}
                                trackStyle={{
                                    height: 5,
                                    borderRadius: 10
                                }}
                                selectedStyle={{
                                    backgroundColor: colors.blueShade1,
                                }}
                                unselectedStyle={{
                                    backgroundColor: colors.lightDotColor,
                                }}
                                sliderLength={constants.screenWidth - 55}
                                containerStyle={styles.containerStyle}
                                markerStyle={styles.markerStyle}
                                touchDimensions=
                                {{
                                    height: 30,
                                    width: 30,
                                    borderRadius: 15,
                                    slipDisplacement: 30
                                }}
                            />
                            <View style={styles.textCon}>
                                <Text style={styles.colorGrey}>0</Text>
                                <Text style={styles.colorGrey}>500</Text>
                            </View>

                        </View>
                        : null}
                    <View>
                    </View>
                </View>
                <View style={styles.countryWrap}>
                    <Text style={styles.textAnyAge}>{commonText.countryText}</Text>
                    <Switch
                        trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                        thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                        onValueChange={() => this.toggleSwitch("1")}
                        value={this.props.selectedLocationIndex == "1" ? true : false}
                    />
                </View>
                {this.props.selectedLocationIndex == "1"
                    ?
                    <View style={styles.wrap}>
                        {/* {this.props.selectedCountryList && this.props.selectedCountryList.length ?
                            <FlatList
                                data={this.props.selectedCountryList}
                                renderItem={this.renderListItem}
                                numColumns={2}
                                bounces={false}
                                showsVerticalScrollIndicator={false}
                            /> : null} */}
                        <CountryPicker
                            withEmoji={false}
                            withFlag={true}
                            countryCode={this.state.callingCode}
                            withCallingCodeButton={true}
                            withFilter={true}
                            withCloseButton={false}
                            withModal={false}
                            filterProps={{
                                placeholder: 'Search',
                                borderWidth: 1,
                                borderColor: colors.textInputBorder,
                                backgroundColor: colors.offWhite,
                                borderRadius: 15,
                                padding: 15,
                                width: constants.screenWidth - 40,
                                fontSize: 16,
                                marginBottom: 10,
                            }}
                            theme={styles.theme}
                            flatListProps={{
                                bounces: false,
                                showsVerticalScrollIndicator: false,
                                ItemSeparatorComponent: () => (<View style={styles.separatorStyle} />),
                                renderItem: (item, index) => (this.showCountryList(item, index)),
                                ListEmptyComponent: () => (<View><Text style={styles.noDataStyle}>{commonText.noData}</Text></View>)
                            }}
                        />
                    </View>
                    : null}
            </View >
        );
    }

    /**action handling for distance slider value changes */
    onValueChangeSlider = value => {
        this.setState({ start: value[0], end: value[1] })
        this.props.filterSetMinMaxLocationDistance(value[0], value[1])
    }

    /**toggle handling for switch */
    toggleSwitch = (selectedLocationIndex) => {
        this.props.filterToggleLocationIndex(selectedLocationIndex)
    }

    /**display country list */
    showCountryList = ({ item, index }) => {
        let selected = false;
        this.props.selectedCountryList && this.props.selectedCountryList.length
            && this.props.selectedCountryList.map((obj) => {
                if (obj.name == item.name) selected = true
            })
        return (
            <TouchableOpacity
                onPress={() => this.onSelectCountry(item, selected)}
                activeOpacity={constants.activeOpacity}
                delayPressIn={0}
                style={styles.flatlistStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <FastImage style={{ height: 20, width: 20, }} source={{ uri: item.flag }} />
                    <Text style={styles.countryNameStyle}>{item.name}</Text>
                </View>
                {
                    selected ?
                        <SvgIcon
                            name={icons.checkMarkIcon}
                            height={20}
                            width={20}
                        />
                        : null
                }
            </TouchableOpacity>
        )
    }

    /**action handle for country selection */
    onSelectCountry = (country, selected) => {
        if (selected) this.props.filterRemoveCountryFromList(country)
        else this.props.filterAddCountryToList(country)
    }

    renderListItem = ({ item, index }) => {
        console.log("item-->", item);
        return (
            <View style={{
                flexDirection: "row",
                flex: 0.5,
                borderWidth: 1,
                justifyContent: "space-between",
                marginHorizontal: 5,
                marginVertical: 5,
                paddingHorizontal: 3,
                alignItems: "center",
                borderRadius: 10,
                borderColor: colors.blueShade1,
                paddingVertical: 5
            }}>
                <Text style={[styles.countryNameStyle, { marginHorizontal: 0, flex: 1 }]} numberOfLines={2}>{item.name}</Text>
                <TouchableOpacity style={{ alignItems: "center", justifyContent: "center" }}>
                    <Image source={images.close} />
                </TouchableOpacity>
            </View>
        )
    }

}
export default Location;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,

    },
    textAnyAge: {
        color: colors.black,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold
    },
    topView: {
        marginHorizontal: 20,
        marginVertical: 20,
        borderBottomColor: colors.shadowColor,
        borderBottomWidth: 2,
        paddingBottom: 20,
    }
    ,
    textCon: {
        width: constants.screenWidth - 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: -5
    },
    colorGrey: {
        color: colors.textColor,
        fontFamily: fonts.muliSemiBold,
        fontSize: 18
    },

    distancePlaceholder: {
        color: colors.grayShadeDark,
        fontSize: 16,
        fontFamily: fonts.muli,
        marginLeft: -10,
        marginBottom: 10
    },
    separatorStyle: {
        height: 1,
        backgroundColor: colors.grayShade1
    },
    theme: {
        fontFamily: fonts.muli,
        fontSize: 16,
        color: colors.textColor
    },
    countryNameStyle: {
        color: colors.textColor,
        fontFamily: fonts.muli,
        fontSize: 16,
        marginHorizontal: 20
    },
    flatlistStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        padding: 15
    },
    noDataStyle: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: fonts.muliSemiBold
    },
    containerStyle: {
        width: constants.screenWidth,
        height: 20,
        marginTop: 25
    },
    markerStyle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 4,
        borderColor: colors.blueShade1,
        shadowColor: colors.transparent,
        backgroundColor: colors.white
    },
    countryWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between', marginHorizontal: 20
    },
    wrap: {
        flex: 1,
        marginHorizontal: 20, marginTop: 20
    }
})