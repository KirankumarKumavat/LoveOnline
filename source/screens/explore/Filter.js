import React, { Component } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, BackHandler, Switch, ScrollView, Platform, StatusBar, Alert } from 'react-native';
import { fonts, icons } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { Header, ModalComponent, SvgIcon } from '../../components';
import { maritalStatus, marriageGoals, prayArray, sectArray, spiritualityArray, } from '../../utils/DummyData';
import { showSimpleAlert } from '../../utils/HelperFunction';
import NavigationService from '../../utils/NavigationService';
import StorageService from '../../utils/StorageService';
import SubscriptionModal from '../setting/SubscriptionModal';
export let filterRef;

/**Filter Screen Component */
class Filter extends Component {
    comment = ""
    constructor(props) {
        super(props);
        filterRef = this;
        this.state = {
            modal: false,
            data: '',
            isUserSubscribed: false,
            subscriptionModal: false,
            filterArray: [
                {
                    title: 'Age',
                    answer: '',
                    icon: icons.ageIcon,
                },
                {
                    title: 'Location',
                    answer: '',
                    icon: icons.locationIcon,
                },
                {
                    title: 'Ethnicity',
                    answer: '',
                    icon: icons.casteIconGrey,
                }
            ],
            filterSecondArray: [
                {
                    title: commonText.blurPhoto,
                    answer: '',
                    icon: icons.blurImage,
                    isSwitch: true,
                    isBlurPhoto: this.props.isBlurPhoto,
                },
                {
                    title: commonText.profession,
                    answer: '',
                    icon: icons.ProfessionIconGrey,
                },
                {
                    title: commonText.education,
                    answer: '',
                    icon: icons.EducationIconGrey,
                },
                {
                    title: commonText.marriageGoal,
                    answer: '',
                    icon: icons.MarriageGoalsGrey,
                },
                {
                    title: commonText.maritalStatus,
                    answer: '',
                    icon: icons.MaritalStatusiconGrey,
                },
                {
                    title: commonText.height,
                    answer: '',
                    icon: icons.HeightIconGrey,
                },
            ]
        };
    }

    /**componet life cycle method */
    componentDidMount() {
        this.props.getFilterArray();
        this.getcurrentSubscription()
        this.subscribeFocus = this.props.navigation.addListener('focus', async () => await this.onScreenFocus());
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }

    /**handle back press event */
    handleBackPress = () => {
        this.props.navigation.goBack();
        return true;
    }

    /**handle back press event */
    componentWillUnmount() {
        this.subscribeFocus()
        this.onScreenFocus(true)
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress)
    }

    openSubscribeModal() {
        this.setState({ subscriptionModal: true })
    }

    closeSubscribeModal() {
        this.setState({ subscriptionModal: false })
    }

    /**action when screen is focused */
    onScreenFocus = async (isUnmount) => {
        await this.props.getFilterArray();
        if (this.props.isDefaultFilterSetup) {
        }
        else {
            await this.onPressApply(isUnmount);
        }
    }

    /** get current subscription detail and 
     *  display on current running subscription section
     */
    getcurrentSubscription = async () => {
        let currentPlanData = await StorageService.getItem(StorageService.STORAGE_KEYS.CURRENT_PLAN_DATA);
        let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
        if (isActive == "1") {
            this.setState({ isUserSubscribed: true })
        }
    }

    /**componet render method */
    render() {
        const isFromSettings = this.props.route && this.props.route.params && this.props.route.params.isFromSettings;
        return (
            <View style={styles.container}>
                <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
                <Header
                    leftIcon={icons.closeIconDark}
                    theme={0}
                    backButton={isFromSettings}
                    leftIconPress={() => this.props.navigation.goBack()}
                    middleText={commonText.filter}
                    rightText={'Clear All'}
                    onPressRightText={this.clearAllPressed}
                    rightFlex={1}
                    filterMiddleView={{
                        marginLeft: 30
                    }}
                    rightSideTextStyle={styles.rightSideTextStyle}
                />
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollStyle}
                    style={styles.behind} bounces={false}
                >
                    <Text style={styles.textHeader}>{commonText.staticTextFilterScreen}</Text>
                    <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        style={{ flex: 1, }}
                        contentContainerStyle={styles.flatlistContainer}
                        data={this.props.filterMiniArray}
                        renderItem={this.renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        ListHeaderComponent={this.renderFilterHeader}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                    />
                    <View style={styles.textAndButtonStyle}>
                        <Text style={styles.preference}>Preferences</Text>
                        {
                            this.state.isUserSubscribed ? null :
                                <TouchableOpacity onPress={() => this.setState({ subscriptionModal: true })}
                                    style={styles.upgradeView}
                                    delayPressIn={0} activeOpacity={constants.activeOpacity}>
                                    <Text style={styles.upgrateText}
                                    >{commonText.upgradeToUnlock}</Text>
                                </TouchableOpacity>}
                    </View>
                    <FlatList
                        ref={(ref) => this.flatListRef = ref}
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.flatlistContainer}
                        data={this.props.filterPaidArray}
                        renderItem={this.renderSecondItem}
                        keyExtractor={(item, index) => index.toString()}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                        ItemSeparatorComponent={this.itemSeparator}
                    />
                </ScrollView>
                {this.state.modal &&
                    <ModalComponent
                        header={this.getTitle()}
                        data={this.getData()}
                        onRequestClose={async () => {
                            this.setState({ modal: false })
                            await this.onPressApply()
                        }}
                        renderItem={(item, index) => this.renderModalItem(item, index)} modalVisible={true} />
                }
                {
                    this.state.subscriptionModal
                        ?
                        <SubscriptionModal
                            visible={this.state.subscriptionModal}
                            isFromFilter={true}
                            onRequestClose={() => { this.setState({ subscriptionModal: false }) }}
                            onPressSwitchPlan={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { switchplan: true })
                            }}
                            onPressCancelSubscribtion={() => {
                                this.setState({ subscriptionModal: false })
                                NavigationService.navigate(commonText.termsAndPrivacyRoute, { cancelSubscription: true })
                            }}
                        />
                        : null
                }
            </View>
        );
    }

    /**action handling for clear all click */
    clearAllPressed = async () => {
        // await this.props.filterResetData();
        // await this.props.getFilterArray();
        // let filterParams = {
        //     per_page: 2,
        //     offset: 0,
        // }
        // this.props.exploreSetNoMoreDataForList(false)
        // await this.props.getOppositeGenderDetails(filterParams, null, true)
        // const finalParams = this.props.route.params && this.props.route.params.params;
        // const isFromLike = this.props.route.params && this.props.route.params.isFromLike;
        // if (isFromLike) await this.props.getUserListForLikeTab(finalParams, true)

        console.log("props--->", this.props);
        if (this.props.isDefaultFilterSetup) {
            showSimpleAlert(commonText.defaultFilterClearMessage)
        }
        else {
            Alert.alert(
                constants.AppName,
                commonText.clearAllFilterMessageText,
                [
                    {
                        text: commonText.no,
                        onPress: () => null,
                    },
                    {
                        text: commonText.yes,
                        onPress: async () => {
                            await this.props.filterResetData();
                            await this.props.getFilterArray();
                            let filterParams = {
                                per_page: 2,
                                offset: 0,
                            }
                            this.props.exploreSetNoMoreDataForList(false)
                            await this.props.getOppositeGenderDetails(filterParams, null, true)
                            const finalParams = this.props.route.params && this.props.route.params.params;
                            const isFromLike = this.props.route.params && this.props.route.params.isFromLike;
                            if (isFromLike) await this.props.getUserListForLikeTab(finalParams, true)
                        }
                    }
                ]
            )
        }
    }

    /** get data for various filters */
    getData = () => {
        if (this.state.data == 3) return sectArray
        else if (this.state.data == 4) return marriageGoals
        else if (this.state.data == 5) return maritalStatus
        else if (this.state.data == 6) return spiritualityArray
        else if (this.state.data == 7) return prayArray
    }

    /** get title for various filters */
    getTitle = () => {
        if (this.state.data == 3) return "Select Ethnicity"
        else if (this.state.data == 4) return "Select Marriage Goal"
        else if (this.state.data == 5) return "Select Marital Status"
        else if (this.state.data == 6) return "Select Spirituality"
        else if (this.state.data == 7) return "Select Pray"
    }

    /** get key and array name for various filters */
    getKeyAndArrayName = () => {
        let key;
        let arrayName;
        if (this.state.data == 3) {
            key = "ethnicity_name";
            arrayName = "selectedEthnicityList";
        }
        else if (this.state.data == 4) {
            key = "goal_name";
            arrayName = "selectedMarriageGoalsList";
        }
        else if (this.state.data == 5) {
            key = "marital_status_name";
            arrayName = "selectedMaritalStatusList";
        }
        else if (this.state.data == 6) {
            key = "spirituality_name";
            arrayName = "selectedSpiritualityList";
        }
        else if (this.state.data == 7) {
            key = "pray_name";
            arrayName = "seletedPrayList"
        }
        return { key, arrayName }
    }

    /**render method for filter list item */
    renderItem = ({ item, index }) => {
        let answer = "";
        if (item.title == commonText.age) {
            if (item.isAnyAge == true) {
                answer = this.props.isDefaultFilterSetup ? "" : "18-55+"
            }
            else {
                answer = this.props.isDefaultFilterSetup ? "" : `${item.minAge} - ${item.maxAge}`
            }
        }
        else if (item.title == commonText.location) {
            if (item.selectedLocationIndex == "0") {
                answer = this.props.isDefaultFilterSetup ? "" : `${item.minLocation} - ${item.maxLocation} miles away`
            }
            else if (item.selectedLocationIndex == "1") {
                answer = this.props.isDefaultFilterSetup ? "" : item.selectedCountryList && item.selectedCountryList.length
                    ? Array.prototype.map.call(item.selectedCountryList, function (item) { return item.name; }).join(",") // "A,B,C"
                    : ""
            }
        }
        else if (item.title == commonText.ethnicity) {
            answer = item.selectedEthnicityList && item.selectedEthnicityList
                ? Array.prototype.map.call(item.selectedEthnicityList, function (item) { return item.ethnicity_name }).join(',')
                : ""
        }
        return (
            <TouchableOpacity onPress={() => this.onPress(item, index)}
                style={styles.mainCell}
                activeOpacity={constants.activeOpacity}
                delayPressIn={0}
            >
                <View style={[styles.cellWrap, answer == "" ? { paddingVertical: 7 } : {}]}>
                    <View style={[styles.wrapView,]}>
                        <View style={styles.svgMainView}>
                            {item.icon && <SvgIcon
                                name={item.icon}
                                height={item.iconHeight + 3}
                                width={item.iconWidth + 3}
                                style={{ marginTop: 0 }}
                            />}
                        </View>
                        <View style={[styles.iconView,]}>
                            <Text style={[styles.listText, styles.wrapText]}>{item.title.trim()}</Text>
                            {
                                this.props.isDefaultFilterSetup ? null :
                                    answer != "" ?
                                        <Text style={[styles.answers, { paddingHorizontal: 0, marginRight: 0 }, /*answer2 ? { paddingBottom: 0 } : {}*/]}
                                            numberOfLines={1}>{this.props.isDefaultFilterSetup ? null : answer.trim()}
                                        </Text>
                                        : null
                            }
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {
                            <SvgIcon
                                name={icons.nextIcon}
                                height={16}
                                width={9}
                            />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**render method for filter list item */
    renderSecondItem = ({ item, index }) => {
        let answer = "";
        let answer2 = "";
        if (item.title == commonText.height) {
            answer = !this.state.isUserSubscribed ? "" : this.props.isDefaultFilterSetup ? "" : `${item.minHeight} - ${item.maxHeight} inches`
        }
        else {
            if (item.arrayName2) {
                answer2 = !this.state.isUserSubscribed ? "" : item[item.arrayName2] && item[item.arrayName2].length
                    ? Array.prototype.map.call(item[item.arrayName2], function (obj) {
                        return obj[item.key2]
                    }).join(',')
                    : ""
            }
            answer = !this.state.isUserSubscribed ? "" : item[item.arrayName] && item[item.arrayName].length
                ? Array.prototype.map.call(item[item.arrayName], function (obj) {
                    return obj[item.key]
                }).join(',')
                : ""
        }
        return (
            <TouchableOpacity
                onPress={
                    () =>
                        this.state.isUserSubscribed
                            ?
                            this.onPress(item, index)
                            : this.setState({ subscriptionModal: true })
                }
                style={styles.mainCell}
            >
                <View style={[styles.cellWrap, answer == "" ? { paddingVertical: 7 } : {}]}>
                    <View style={[styles.wrapView, item.isSwitch ? { paddingVertical: 3 } : {}]}>
                        <View style={[styles.svgMainView, item.isHeight && !this.props.isDefaultFilterSetup ? { height: 60 } : {}]}>
                            {item.icon && <SvgIcon
                                name={item.icon}
                                height={item.isSwitch ? item.iconHeight : item.iconHeight + 3}
                                width={item.isSwitch ? item.iconWidth : item.iconWidth + 3}
                                // height={18}
                                style={{ marginTop: item.isSwitch ? 0 : 0, }}
                            />}
                        </View>
                        <View style={[styles.iconView, item.isSwitch ? { paddingTop: 0 } : {}]}>
                            <Text style={[styles.listText, { paddingTop: item.isSwitch ? 10 : 10, paddingBottom: item.isSwitch && 0, paddingHorizontal: 0, marginRight: 0 }]}>{item.title.trim()}</Text>
                            {item.isSwitch ? null :
                                this.props.isDefaultFilterSetup ? null :
                                    answer != "" ?
                                        <Text style={[styles.answers, { paddingHorizontal: 0, marginRight: 0 }, answer2 ? { paddingBottom: 0 } : {}]}
                                            numberOfLines={1}>{this.props.isDefaultFilterSetup ? null : answer.trim()}
                                        </Text>
                                        : null
                            }
                            {answer2 != "" ? <Text style={[styles.answers, { paddingHorizontal: 0 }]} numberOfLines={1}>{this.props.isDefaultFilterSetup ? null : answer2}</Text> : null}
                        </View>
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        {
                            item.isSwitch ?
                                <Switch
                                    trackColor={{ false: colors.grayShade1, true: colors.blueShade1 }}
                                    thumbColor={Platform.OS == 'ios' ? { false: colors.grayShade1, true: colors.white } : colors.white}
                                    onValueChange={async () => {
                                        this.props.filterToggleBlurPhoto();
                                        this.props.getFilterArray();
                                    }}
                                    disabled={this.state.isUserSubscribed ? false : true}
                                    value={item.isBlurPhoto}
                                />
                                :
                                <SvgIcon
                                    name={icons.nextIcon}
                                    height={16}
                                    width={9}
                                />
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparator}></View>
        )
    }

    /**handle click event for various filter  */
    onPressItems = (item, index) => {
        if (item.isModal) {
            this.setState({ modal: true, data: index })
        }
        else if (item.isSwitch) {
        }
        else {
            this.props.navigation.navigate(item.routeName)
        }
    }

    /**handle click event for various filter  */
    onPress = (item, index) => {
        if (item.isModal) {
            this.setState({ modal: true, data: index + 1 })
        }
        else if (item.isSwitch) {
        }
        else {
            this.props.navigation.navigate(item.routeName)
        }

    }

    /**render modal component list items */
    renderModalItem = ({ item, index }) => {
        let selected = false;
        let { key, arrayName } = this.getKeyAndArrayName();
        this.props[arrayName] && this.props[arrayName].length &&
            this.props[arrayName].map((obj) => {
                if (obj[key] == item.title) selected = true;
            })
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                delayPressIn={0}
                onPress={() => this.onPressSelectedOption(item, index, selected)}
                style={styles.casteView}
            >
                <Text style={styles.modalText}>{item.title}</Text>
                {selected ?
                    <SvgIcon
                        name={icons.checkMarkIcon}
                        height={20}
                        width={20}
                    />
                    : null}
            </TouchableOpacity>)
    }

    /**click event for seleced option */
    onPressSelectedOption = async (item, index, selected) => {
        let { key, arrayName } = this.getKeyAndArrayName();
        const params = { [key]: item.title, id: item.id }
        if (selected) this.props.filterRemoveValueFromSpecificList(key, arrayName, params)
        else this.props.filterAddValueToSpecificList(key, arrayName, params);
        this.props.getFilterArray();
    }

    /**action handling for apply click */
    onPressApply = async (isUnmount) => {
        const params = {};
        this.props.filterMiniArray.map((obj) => {
            if (obj.title == commonText.age) {
                if (obj.isAnyAge) {
                    params[obj.apiKey1] = 18;
                    params[obj.apiKey2] = 55;
                }
                else {
                    params[obj.apiKey1] = obj.minAge;
                    params[obj.apiKey2] = obj.maxAge;
                }
            }
            else if (obj.title == commonText.location) {
                if (obj.selectedLocationIndex == "0") {
                    params[obj.apiKey1] = obj.minLocation;
                    params[obj.apiKey2] = obj.maxLocation;
                }
                else if (obj.selectedLocationIndex == "1") {
                    let countries = obj.selectedCountryList && obj.selectedCountryList.length
                        ? Array.prototype.map.call(obj.selectedCountryList, function (item) { return item.name; }).join(",") // "A,B,C"
                        : ""
                    if (obj.selectedCountryList && obj.selectedCountryList.length) {
                        params[obj.apiKey3] = countries;
                    }
                }
            }
            else if (obj.title == commonText.ethnicity) {
                let ethnicity = obj.selectedEthnicityList && obj.selectedEthnicityList.length
                    ? Array.prototype.map.call(obj.selectedEthnicityList, function (item) { return item.ethnicity_name }).join(',')
                    : ""
                if (obj.selectedEthnicityList && obj.selectedEthnicityList.length) {
                    params[obj.apiKey1] = ethnicity;
                }
            }
        })
        this.props.filterPaidArray.map((obj) => {
            if (this.state.isUserSubscribed) {
                if (obj.isSwitch) {
                    params[obj.apiKey1] = obj.isBlurPhoto ? 1 : 0;
                }
                if (obj.isHeight) {
                    let minHeight = obj.minHeight.toFixed(1);
                    let maxHeight = obj.maxHeight.toFixed(1);
                    let heightSepMin = minHeight.split('.');
                    let heightSepMax = maxHeight.split('.');
                    let minFinalheight = `${heightSepMin[0]}'${heightSepMin[1]}`
                    let maxFinalheight = `${heightSepMax[0]}'${heightSepMax[1]}`
                    params[obj.apiKey1] = minFinalheight;
                    params[obj.apiKey2] = maxFinalheight;
                }
                else {
                    if (obj.arrayName) {
                        let value = obj[obj.arrayName] && obj[obj.arrayName].length
                            ? Array.prototype.map.call(obj[obj.arrayName], function (i) {
                                return i[obj.uniqueKey]
                            }).join(',')
                            : ""
                        if (obj[obj.arrayName] && obj[obj.arrayName].length) {
                            params[obj.apiKey1] = value
                        }
                    }
                    if (obj.arrayName2) {
                        let value2 = obj[obj.arrayName2] && obj[obj.arrayName2].length
                            ? Array.prototype.map.call(obj[obj.arrayName2], function (i) {
                                return i[obj.uniqueKey2]
                            }).join(',')
                            : "";
                        if (obj[obj.arrayName2] && obj[obj.arrayName2].length) {
                            params[obj.apiKey2] = value2
                        }
                    }
                }
            }
            else {
                console.log("User Is Not Subscribed")
            }
        })
        await this.props.storeFilterData(params)
        if (isUnmount) {
            this.props.exploreResetUserList();
            this.props.exploreSetEmptyData();
            let filterParams = {
                per_page: 2,
                // params.page_no = 1
                offset: 0,
            }
            await this.props.getOppositeGenderDetails(filterParams)
            this.props.likeResetData()
            const finalParams = this.props.route.params && this.props.route.params.params;
            const isFromLike = this.props.route.params && this.props.route.params.isFromLike;
            if (isFromLike) await this.props.getUserListForLikeTab(finalParams)
        }
    }
}

export default Filter;

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
        paddingHorizontal: 30,
        paddingRight: 20,
        paddingBottom: 10
    },
    flatlistContainer: {
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1.5,

        shadowColor: colors.grayShade1,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 3,

        shadowOffset: {
            height: 10,
            width: 0,
        },
        backgroundColor: '#fff',
        marginBottom: Platform.OS == "android" ? 4 : 3
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
        marginHorizontal: 20,
        marginTop: 30,
        justifyContent: 'space-between'
    },
    itemsContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingRight: 15
    },
    CustomButton: {
        position: 'absolute',
        bottom: 0, paddingVertical: 10,
        width: constants.screenWidth,
        backgroundColor: colors.white
    },
    mainCell: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingRight: 15
    },
    cellWrap: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'space-between'
    },
    wrapView: {
        flex: 1,
        flexDirection: 'row',
    },
    svgMainView: {
        height: 50, width: 50,
        alignItems: 'center', justifyContent: 'center'
    },
    iconView: {
        alignItems: 'flex-start',
        paddingRight: 35,
    },
    rightSideTextStyle: {
        fontSize: 14,
        fontFamily: fonts.muliBold
    },
    scrollStyle: {
        flexGrow: 1,
        paddingBottom: 30
    },
    upgradeView: {
        paddingHorizontal: 10,
        backgroundColor: colors.blueShade1, borderRadius: 50,
        height: 34, alignItems: 'center', justifyContent: 'center',
    },
    upgrateText: {
        fontFamily: fonts.muliBold,
        fontSize: 12, color: colors.white,
        textAlign: 'center'
    },
    wrapText: {
        paddingTop: 10,
        paddingHorizontal: 0, marginRight: 0
    },
    itemSeparator: {
        height: 1,
        backgroundColor: colors.textInputBorder, opacity: 0.5
    }
})