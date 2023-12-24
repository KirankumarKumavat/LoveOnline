import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Keyboard } from 'react-native';
import { SvgIcon } from '../../components';
import { commonText, constants, colors } from '../../common';
import CountryPicker, { } from 'react-native-country-picker-modal';
import { fonts, icons, } from '../../assets';
import UserUtils from '../../utils/UserUtils';
import FastImage from 'react-native-fast-image';
let userDetails;

const AmericanCountries = [
    "AI",
    "AG",
    "AR",
    "AW",
    "BS",
    "BB",
    "BZ",
    "BM",
    "BO",
    "BR",
    "VG",
    "CA",
    "BQ",
    "KY",
    "CL",
    "CO",
    "CR",
    "CU",
    "CW",
    "DM",
    "DO",
    "EC",
    "SV",
    "FK",
    "GF",
    "GL",
    "GD",
    "GP",
    "GT",
    "GY",
    "HT",
    "HN",
    "JM",
    "MQ",
    "MX",
    "MS",
    "NI",
    "PA",
    "PY",
    "PE",
    "PR",
    "BL",
    "KN",
    "LC",
    "MF",
    "PM",
    "VC",
    "SX",
    "SR",
    "TT",
    "TC",
    "US",
    "UM",
    "VI",
    "UY",
    "VE",
]

const EuropianCounries = [
    "AX",
    "AL",
    "AD",
    "AT",
    "BY",
    "BE",
    "BA",
    "BG",
    "HR",
    "CY",
    "CZ",
    "DK",
    "EE",
    "FO",
    "FI",
    "FR",
    "DE",
    "GI",
    "GR",
    "GG",
    "HU",
    "IS",
    "IE",
    "IM",
    "IT",
    "JE",
    "XK",
    "LV",
    "LI",
    "LT",
    "LU",
    "MK",
    "MT",
    "MD",
    "MC",
    "ME",
    "NL",
    "NO",
    "PL",
    "PT",
    "RO",
    "RU",
    "SM",
    "RS",
    "SK",
    "SI",
    "ES",
    "SJ",
    "SE",
    "CH",
    "UA",
    "GB",
    "VA",
]

const allCountries = [...AmericanCountries, ...EuropianCounries]

/**ProfileSetup:User Country selection Screen component */
class UserCountry extends Component {

    state = {
        countryName: "",
        countryPressed: false,
        selectedCountry: '',
        selectedCountryListForTemp: []
    }
    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails.country_name) {
            this.setState({ selectedCountry: userDetails.country_name })
        }
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.innerWrap}>
                    <CountryPicker
                        withEmoji={false}
                        // countryCodes={[
                        //     "AX",
                        //     "AL",
                        //     "AD",
                        //     "AT",
                        //     "BY",
                        //     "BE",
                        //     "BA",
                        //     "BG",
                        //     "HR",
                        //     "CY",
                        //     "CZ",
                        //     "DK",
                        //     "EE",
                        //     "FO",
                        //     "FI",
                        //     "FR",
                        //     "DE",
                        //     "GI",
                        //     "GR",
                        //     "GG",
                        //     "HU",
                        //     "IS",
                        //     "IE",
                        //     "IM",
                        //     "IT",
                        //     "JE",
                        //     "XK",
                        //     "LV",
                        //     "LI",
                        //     "LT",
                        //     "LU",
                        //     "MK",
                        //     "MT",
                        //     "MD",
                        //     "MC",
                        //     "ME",
                        //     "NL",
                        //     "NO",
                        //     "PL",
                        //     "PT",
                        //     "RO",
                        //     "RU",
                        //     "SM",
                        //     "RS",
                        //     "SK",
                        //     "SI",
                        //     "ES",
                        //     "SJ",
                        //     "SE",
                        //     "CH",
                        //     "UA",
                        //     "GB",
                        //     "VA",

                        //     "AI",
                        //     "AG",
                        //     "AR",
                        //     "AW",
                        //     "BS",
                        //     "BB",
                        //     "BZ",
                        //     "BM",
                        //     "BO",
                        //     "BR",
                        //     "VG",
                        //     "CA",
                        //     "BQ",
                        //     "KY",
                        //     "CL",
                        //     "CO",
                        //     "CR",
                        //     "CU",
                        //     "CW",
                        //     "DM",
                        //     "DO",
                        //     "EC",
                        //     "SV",
                        //     "FK",
                        //     "GF",
                        //     "GL",
                        //     "GD",
                        //     "GP",
                        //     "GT",
                        //     "GY",
                        //     "HT",
                        //     "HN",
                        //     "JM",
                        //     "MQ",
                        //     "MX",
                        //     "MS",
                        //     "NI",
                        //     "PA",
                        //     "PY",
                        //     "PE",
                        //     "PR",
                        //     "BL",
                        //     "KN",
                        //     "LC",
                        //     "MF",
                        //     "PM",
                        //     "VC",
                        //     "SX",
                        //     "SR",
                        //     "TT",
                        //     "TC",
                        //     "US",
                        //     "UM",
                        //     "VI",
                        //     "UY",
                        //     "VE",

                        // ]}

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
                            width: constants.screenWidth - 80,
                            fontSize: 16,
                            marginBottom: 10,

                        }}
                        theme={styles.theme}
                        flatListProps={{
                            ItemSeparatorComponent: () => (<View style={styles.separatorStyle} />),
                            renderItem: (item, index) => (this.showCountryList(item, index)),
                            ListEmptyComponent: () => (<View><Text style={styles.noDataStyle}>{commonText.noData}</Text></View>)
                        }}
                    />
                </View>
            </View>
        );
    }

    /**render method for display country list */
    showCountryList = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => this.onSelectCountry(item.name, item)} style={styles.flatlistStyle}>
                <View style={styles.countryWrap}>
                    <FastImage style={{ height: 20, width: 25, }} source={{ uri: item.flag }} />
                    <Text style={styles.countryNameStyle}>{item.name}</Text>
                </View>
                {
                    this.state.selectedCountry == item.name ?
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
    onSelectCountry = (country, countryDetails) => {
        Keyboard.dismiss()
        this.setState({ countryPressed: true, selectedCountry: country }, () => {
            if (country) {
                const params = {
                    country_name: country,
                    country_code: countryDetails.callingCode[0]
                }
                if (this.props.isFromSettingsStack) {
                    this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
                }
                else {
                    this.props.saveProfileSetupData(params)
                }
            }
        })
    }
}

export default UserCountry;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    input: {
        color: 'red',
        borderBottomWidth: 1,
        borderColor: 'green'
    },
    separatorStyle: {
        height: 1,
        backgroundColor: colors.white
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
    innerWrap: {
        flex: 1,
        marginHorizontal: 40
    },
    countryWrap: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})
