import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fonts } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, } from '../../components';
import CustomLabel from '../../utils/CustomLabel';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

/**FilterHeight Component */
class FilterHeight extends Component {
    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <Header
                    backButton
                    theme={0}
                    onBackButtonPress={this.androidBackPress}
                    middleText={commonText.height}
                />
                <View style={styles.topView}>
                    <View style={styles.topWrap}>
                        <Text style={styles.textAnyAge}>{commonText.selectHeightText + " "}</Text>
                        <Text style={[styles.textAnyAge, { color: colors.grayShadeDark }]}>({commonText.inInchesText})</Text>
                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <MultiSlider
                            enableLabel={true}
                            customLabel={CustomLabel}
                            values={[this.props.minHeight, this.props.maxHeight]}
                            isMarkersSeparated={true}
                            onValuesChange={this.onValueChangeSlider}
                            min={4}
                            max={7}
                            step={0.5}
                            trackStyle={styles.trackStyle}
                            selectedStyle={{
                                backgroundColor: colors.blueShade1,
                            }}
                            unselectedStyle={{
                                backgroundColor: colors.lightDotColor,
                            }}
                            sliderLength={constants.screenWidth - 80}
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
                    </View>
                    <View style={styles.textCon}>
                        <Text style={styles.colorGrey}>4</Text>
                        <Text style={styles.colorGrey}>7</Text>
                    </View>
                </View>
            </View>
        );
    }

    /**handling for changing value of slider */
    onValueChangeSlider = value => {
        this.setState({ start: value[0], end: value[1] })
        this.props.filterSetMinMaxHeight(value[0], value[1])
    }

    /**toggle handling for switch */
    toggleSwitch = (selectedLocationIndex) => {
        this.props.filterToggleLocationIndex(selectedLocationIndex)
    }

}
export default FilterHeight;

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
        paddingBottom: 20,
    },
    textCon: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 15,
        marginVertical: 5
    },
    colorGrey: {
        color: colors.textColor,
        fontFamily: fonts.muliSemiBold,
        fontSize: 14
    },
    topWrap: {
        flexDirection: 'row',
        marginBottom: 10, marginHorizontal: 10
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
    containerStyle: {
        width: constants.screenWidth,
        height: 10,
        marginTop: 30
    },
    trackStyle: {
        height: 5,
        borderRadius: 10
    }
})