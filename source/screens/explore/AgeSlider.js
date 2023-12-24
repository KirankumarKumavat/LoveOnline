import React, { Component } from 'react';
import { View, Text, StyleSheet, Switch, } from 'react-native';
import { fonts, icons, images } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, } from '../../components';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomLabel from '../../utils/CustomLabel';

/**Age Slider Componet */
class AgeSlider extends Component {
    comment = ""
    constructor(props) {
        super(props);
        this.state = {
            isEnabled: false,
            start: '18',
            end: '55+'
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
                    middleText={commonText.age}
                />
                <View style={styles.topView}>
                    <Text style={styles.textAnyAge}>{commonText.anyAgeText}</Text>
                    <Switch
                        trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                        thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                        onValueChange={this.toggleSwitch}
                        value={this.props.isAnyAgeSelected}
                        style={[styles.switchStyle]}
                    />
                </View>
                {!this.props.isAnyAgeSelected && <View style={{ marginHorizontal: 30 }}>
                    <MultiSlider
                        enableLabel={true}
                        customLabel={CustomLabel}
                        values={[this.props.minAge, this.props.maxAge]}
                        isMarkersSeparated={true}
                        onValuesChange={this.onValueChangeSlider}
                        min={18}
                        max={55}
                        step={1}
                        trackStyle={{
                            height: 5,
                            borderRadius: 10,
                        }}
                        minMarkerOverlapDistance={20}
                        sliderLength={constants.screenWidth - 55}
                        selectedStyle={{
                            backgroundColor: colors.blueShade1,
                        }}
                        unselectedStyle={{
                            backgroundColor: colors.lightDotColor,
                        }}
                        containerStyle={{
                            width: constants.screenWidth,
                        }}
                        markerStyle={{
                            height: 20,
                            width: 20,
                            borderRadius: 10,
                            borderWidth: 4,
                            borderColor: colors.blueShade1,
                            shadowColor: colors.transparent,
                            backgroundColor: colors.white
                        }}
                        touchDimensions=
                        {{
                            height: 30,
                            width: 30,
                            borderRadius: 15,
                            slipDisplacement: 30
                        }}
                    />
                    <View style={styles.textCon}>
                        <Text style={styles.colorGrey}>18</Text>
                        <Text style={styles.colorGrey}>55+ </Text>
                    </View>
                </View>}
            </View>
        );
    }

    /**action for changing value of slider */
    onValueChangeSlider = value => {
        this.setState({ start: value[0], end: value[1] })
        this.props.filterSetMinMaxAge(value[0], value[1])
    }

    /**toggle action switching */
    toggleSwitch = () => {
        this.props.filterToggleAnyAge()
    }
}

export default AgeSlider;

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 30,
        borderBottomColor: colors.shadowColor,
        borderBottomWidth: 2,
        // paddingBottom: 30,
        paddingTop: 20,
        paddingBottom: 30,
        paddingHorizontal: 10
    },
    textCon: {
        width: constants.screenWidth - 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -15,
        marginHorizontal: -5
    },
    colorGrey: {
        color: colors.textColor,
        fontFamily: fonts.muliSemiBold,
        fontSize: 18
    },
    colorYellow: {
        color: 'rgb(252, 228, 149)'
    }

})