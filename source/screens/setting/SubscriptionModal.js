import { connect } from "react-redux";
import React, { Component, } from 'react';
import { Text, View, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Platform, FlatList, ScrollView } from 'react-native';

import { fonts, icons, } from '../../assets';
import { constants, colors, commonText } from '../../common';
import { Loader, SvgIcon, TitleDescription } from '../../components';
import * as RNIap from 'react-native-iap';
import { SafeAreaView, } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { moderateScale, scale, verticalScale } from '../../utils/scale';
import LinearGradient from 'react-native-linear-gradient';
import { getPlanList, validReceipt } from "../../redux/operation";
import { showSimpleAlert } from "../../utils/HelperFunction";
import { subscribtionFailure, subscribtionLoadIAPplanList, subscribtionRequest, subscribtionSelectPlanIndex, subscribtionSuccess, subsctiontionStoreSelectedPlanDetails } from "../../redux/action";
import StorageService from "../../utils/StorageService";
import RNModal from 'react-native-modal';
import apiConfigs from "../../api/apiConfig";
import { isIphoneX } from "../../utils/iPhoneXHelper";
import { showToastMessage } from "../../components/ToastUtil";

// const gradientArray = ['#FFFFFF', '#F8F8F8']
const gradientArray = ['#FFFFFF', '#FFFFFF']

const productIds = Platform.select({
    ios: [
        apiConfigs.WEEKLY_SUBSCRIPTION_IOS
    ],
    android: [
        apiConfigs.WEEKLY_SUBSCRIPTION_ANDROID
    ]
});


/** SubscriptionModal  screen component */
class SubscriptionModal extends Component {

    /**purchase update listener */
    purchaseUpdateSubscription = null
    /**purchase error listener */
    purchaseErrorSubscription = null

    constructor(props) {
        super(props);
        this.state = {
            selectedItem: null,
            isFreePlan: true,
            selectedSubscribtionDetail: {},
            currentPlanData: {},
        }
    }

    /**componet life cycle method */
    async componentDidMount() {
        /**initialize the iAP connnection */
        try {
            const result = await RNIap.initConnection();
            // alert(result)
        } catch (err) {
            console.log('ERROR->', err.message);
        }

        /**get the subscription planlist from database */
        await this.props.getPlanList();

        if (this.props.subscribtionProductList && this.props.subscribtionProductList.length > 0) {
            /**get the subscription planlist from appstore/playstore */
            let itemskulist = [];
            this.props.subscribtionProductList.map((obj) => {
                itemskulist.push(obj.product_id).toString();
            })
            console.log("itemskulist-->", itemskulist);
            try {
                this.props.dispatchAction(subscribtionRequest())
                const getProducttdata = await RNIap.getSubscriptions(itemskulist);
                console.log("getProducttdata--->", getProducttdata);
                // alert(JSON.stringify(getProducttdata))
                this.props.dispatchAction(subscribtionSuccess())
                if (getProducttdata && getProducttdata.length) {
                    this.props.subscribtionLoadIAPplanList(getProducttdata)
                }
            } catch (err) {
                console.log("err-->", err);
                /**error handling */
                // alert(JSON.stringify(err))
                this.props.dispatchAction(subscribtionFailure())
            }
        }

        /** handle purchase update lister call when purchase done */
        this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
            if (purchase) {
                if (Platform.OS == "ios") {
                    // await RNIap.finishTransactionIOS(purchase.transactionId)
                }
                else {
                    await RNIap.acknowledgePurchaseAndroid(purchase.purchaseToken);
                }
                await RNIap.finishTransaction(purchase);
                /** save purchase data and call purchase validation */
                this.props.dispatchAction(subscribtionSuccess())
                await StorageService.saveItem(StorageService.STORAGE_KEYS.PURCHASE_DATA, purchase);
                let isfromRestorePurchase = false;
                this.validateReceipt(purchase.transactionReceipt, isfromRestorePurchase)
            }
            else {
                /**error handling */
                this.props.dispatchAction(subscribtionFailure())
            }
        })

        /** purchase error listner */
        this.purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
            this.props.dispatchAction(subscribtionFailure())
            if (error.message) {
                if (error.code == "E_USER_CANCELLED") {
                    showSimpleAlert(commonText.subscriptionMessage1)
                }
                else if (error.code == "E_ALREADY_OWNED") {
                    showSimpleAlert(commonText.subscriptionMessage2)
                }
                else if (error.code == "E_UNKNOWN") {
                    showSimpleAlert(error.message)
                }
                else {
                    showSimpleAlert(commonText.subscriptionMessage3)
                }
            }
        })
        if (this.props.isFromChangePlan) {
            this.getcurrentSubscription()
        }
    }

    /** get current subscription detail and 
     *  display on current running subscription section
     */
    getcurrentSubscription = async () => {
        let currentPlanData = await StorageService.getItem(StorageService.STORAGE_KEYS.CURRENT_SUBSCRIPTION_DETAILS);
        let isActive = await StorageService.getItem(StorageService.STORAGE_KEYS.IS_SUBSCRIBED);
        if (isActive == "1" && currentPlanData && Object.keys(currentPlanData).length > 0) {
            this.setState({ isUserSubscribed: true, currentPlanData })
        }
        else {
            this.setState({ isUserSubscribed: false, })
        }
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.props.subscribtionSelectPlanIndex(null)
        this.props.subsctiontionStoreSelectedPlanDetails({})
        this.props.dispatchAction(subscribtionSuccess())
        if (this.purchaseUpdateSubscription) {
            this.purchaseUpdateSubscription.remove();
            this.purchaseUpdateSubscription = null;
        }
        if (this.purchaseErrorSubscription) {
            this.purchaseErrorSubscription.remove();
            this.purchaseErrorSubscription = null;
        }
        /**end connection with iAP */
        RNIap.endConnection()
    }

    /** Call api for the product validate by receipt validation */
    validateReceipt = (data, isfromRestorePurchase) => {
        const { isFromFilter, isFromSettings, isFromLike } = this.props;
        if (data) {
            let param = {
                "receipt": data
            }
            this.props.validReceipt(param, isfromRestorePurchase, isFromFilter, isFromSettings, isFromLike)
        }
    }

    /**componet render method */
    render() {
        const { visible, onRequestClose, onPressCancelSubscribtion, onPressSwitchPlan, } = this.props;
        return (
            // <Modal
            //     transparent
            //     visible={visible}
            //     onRequestClose={onRequestClose}
            //     animationType={'slide'}
            //     statusBarTranslucent
            // >
            <RNModal
                testID={'modal'}
                isVisible={visible}
                onModalHide={onRequestClose}
                onBackButtonPress={onRequestClose}
                animationIn="fadeInUpBig"
                animationOut="fadeOutDown"
                animationInTiming={800}
                animationOutTiming={800}
                backdropTransitionInTiming={600}
                backdropTransitionOutTiming={600}
                backdropOpacity={1}
                backdropColor={colors.transparent}
                statusBarTranslucent
                supportedOrientations={['portrait']}
                style={{ padding: 0, margin: 0 }}
            >
                {/* <SafeAreaView style={{ flex: 1 }} edges={['bottom']}> */}
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.container}
                    onPress={() => onRequestClose()}
                >
                    <TouchableWithoutFeedback onPress={() => null}>
                        <View style={styles.main}>
                            <TouchableOpacity onPress={() => onRequestClose()} style={{ alignSelf: 'flex-end', paddingTop: 15, paddingHorizontal: 15, }}>
                                <SvgIcon name={icons.closeIconDark} />
                            </TouchableOpacity>
                            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                                <View style={styles.firstView}>
                                    <Text style={styles.message}>{commonText.subscriptionHeading}</Text>
                                    <Text style={styles.message}>{commonText.subscriptionHeading2}</Text>
                                    <Text style={styles.subMessage}>{commonText.subscriptionSubHeading}</Text>
                                </View>
                                <LinearGradient
                                    start={{ x: 0, y: 1 }}
                                    end={{ x: 1, y: 0 }}
                                    colors={gradientArray}
                                    style={{ flex: 1 }}
                                >
                                    <FlatList
                                        contentContainerStyle={styles.flatlistContainer}
                                        data={this.props.subscribtionPlanListFromIAP}
                                        renderItem={this.renderItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        bounces={false}
                                        showsVerticalScrollIndicator={false}
                                        horizontal={true}
                                        ListEmptyComponent={this.renderEmptyComponent}
                                        showsHorizontalScrollIndicator={false}
                                    />
                                    <CustomButton
                                        title={commonText.subscribe}
                                        mainStyle={{ marginVertical: 10 }}
                                        onPress={this.onPressSubscibe}
                                    />
                                    <CustomButton
                                        theme={0}
                                        title={commonText.restorePurchase}
                                        mainStyle={styles.mainStyle}
                                        onPress={this.onPressRestorePurchase}
                                    />
                                    <TouchableOpacity onPress={onPressCancelSubscribtion} style={styles.cancelWrap} activeOpacity={constants.activeOpacity} delayPressIn={0}>
                                        <Text style={styles.cancelSubscription}>{commonText.cancelSubscription}</Text>
                                    </TouchableOpacity>
                                    {Platform.OS == "ios" ? <TouchableOpacity onPress={onPressSwitchPlan} style={styles.cancelWrap} activeOpacity={constants.activeOpacity} delayPressIn={0}>
                                        <Text style={styles.cancelSubscription}>{commonText.switchplan}</Text>
                                    </TouchableOpacity> : null}
                                </LinearGradient>
                            </ScrollView>
                        </View>
                    </TouchableWithoutFeedback>
                </TouchableOpacity>
                {/* </SafeAreaView> */}
                <Loader innerStyle={{ marginTop: constants.screenHeight / 4 }} loading={this.props.loading} />
            </RNModal>
            // </Modal>
        )
    }

    /**render method to display empty list component */
    renderEmptyComponent = () => {
        let text = this.props.loading ? "Subscrption plan list will display here" : "No Subscription Plan list found"
        return (
            <View style={styles.emptyWrap}>
                <TitleDescription description={text} />
            </View>
        )
    }

    /**get the subscription key values */
    getAndroidData = (key) => {
        let peroidValue = "";
        let peroidUnit = "";
        if (key == "P1W") {
            peroidValue = "1";
            peroidUnit = "WEEK"
        }
        else if (key == "P1M") {
            peroidValue = "1";
            peroidUnit = "MONTH"
        }
        else if (key == "P3M") {
            peroidValue = "3";
            peroidUnit = "MONTH"
        }
        else if (key == "P6M") {
            peroidValue = "6";
            peroidUnit = "MONTH"
        }
        else if (key == "P1Y") {
            peroidValue = "1";
            peroidUnit = "YEAR"
        }
        return { peroidValue, peroidUnit };
    }

    /**get the subscription free trial keys */
    getAndroidFREETRIALData = (key) => {
        let freeperoidValue = "";
        let freeperoidUnit = "";
        if (key == "P1W") {
            freeperoidValue = "1";
            freeperoidUnit = "WEEK"
        }
        else if (key == "P1M") {
            freeperoidValue = "1";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P3M") {
            freeperoidValue = "3";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P6M") {
            freeperoidValue = "6";
            freeperoidUnit = "MONTH"
        }
        else if (key == "P1Y") {
            freeperoidValue = "1";
            freeperoidUnit = "YEAR"
        }
        return { freeperoidValue, freeperoidUnit };
    }

    /**render method to display subscription plan list */
    renderItem = ({ item, index }) => {
        const { peroidUnit, peroidValue } = this.getAndroidData(item.subscriptionPeriodAndroid);
        const { freeperoidValue, freeperoidUnit } = this.getAndroidFREETRIALData(item.freeTrialPeriodAndroid);
        let planPrice = item.is_free_plan == 1 ? "Free" : item.price;
        let planPeriod = constants.isIOS ? item.subscriptionPeriodNumberIOS : peroidValue;
        let planUnit = constants.isIOS ? item.subscriptionPeriodUnitIOS : peroidUnit;
        let weeklyPrice = "";
        let freeTimeText = constants.isIOS ? item.introductoryPriceNumberOfPeriodsIOS + " " + item.introductoryPriceSubscriptionPeriodIOS : freeperoidValue + " " + freeperoidUnit
        if (planUnit == "MONTH") {
            weeklyPrice = (item.price) / (planPeriod * 4);
        }
        let selected = false;
        if (this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0) {
            if (constants.isIOS) {
                if (this.state.currentPlanData.product_id == item.productId) {
                    selected = true;
                }
            }
            else {
                if (this.state.currentPlanData.productId == item.productId) {
                    selected = true;
                }
            }
        }
        return (
            <View style={styles.boxWrap}>
                <TouchableOpacity
                    onPress={() => this.onPressPlan(item, index)}
                    style={[styles.box]}
                >
                    <LinearGradient colors={index === this.props.selectedPlanIndex ? ['#FE5E5F', '#FE5E5F'] : ['#ffffff', '#ffffff']} style={[{ flex: 1, justifyContent: 'center', borderRadius: 10 }, selected ? { borderWidth: 1, borderColor: colors.blueShade1, borderRadius: 10 } : {}]}>
                        <Text style={[styles.duration, { color: index === this.props.selectedPlanIndex ? colors.white : colors.black }]}>{planPeriod}</Text>
                        <Text style={[styles.months, { color: index === this.props.selectedPlanIndex ? colors.white : colors.black }]}>{planUnit}</Text>
                        {freeTimeText ? <Text style={[styles.weekText, { color: index === this.props.selectedPlanIndex ? colors.white : colors.blueShade1 }]}>{freeTimeText + commonText.freeText}</Text> : null}
                        {weeklyPrice != "" ? <Text style={[styles.weekText, { color: index === this.props.selectedPlanIndex ? colors.white : colors.blueShade1 }]}>{weeklyPrice.toFixed(2) + "/" + commonText.weekText}</Text> : null}
                        <TouchableOpacity style={[styles.boxContainer, { backgroundColor: index === this.props.selectedPlanIndex ? colors.white : colors.blueShade1, marginTop: weeklyPrice == "" ? 30 : 10 }]} >
                            <Text style={[styles.priceStyle, { color: index === this.props.selectedPlanIndex ? colors.blueShade1 : colors.white }]}>{item.localizedPrice}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    {
                        selected ?
                            <View style={styles.svgWrap}>
                                <SvgIcon name={icons.checkMarkIcon} />
                            </View>
                            : null
                    }
                </TouchableOpacity>
            </View>
        )
    }

    /**action handle when user click on any one plan */
    onPressPlan = (item, index) => {
        this.props.subscribtionSelectPlanIndex(index)
        this.props.subsctiontionStoreSelectedPlanDetails(item)
    }

    /**action method for subscribe click */
    onPressSubscibe = () => {

        let selected = false;
        // if (this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0) {
        //     if (constants.isIOS) {
        //         if (this.state.currentPlanData.product_id == this.props.selectedPlanDetails.productId) {
        //             selected = true;
        //         }
        //     }
        //     else {
        //         if (this.state.currentPlanData.productId == this.props.selectedPlanDetails.productId) {
        //             selected = true;
        //         }
        //     }
        // }

        if (Object.keys(this.props.selectedPlanDetails).length > 0) {
            console.log('this.state.currentPlanData--->', this.state.currentPlanData);
            console.log('this.props.selectedPlanDetails', this.props.selectedPlanDetails);
            if (this.state.currentPlanData && Object.keys(this.state.currentPlanData).length > 0) {
                if (constants.isIOS) {
                    if (this.state.currentPlanData.product_id == this.props.selectedPlanDetails.productId) {
                        selected = true;
                        showSimpleAlert(commonText.subscriptionMessage2)
                    }
                    else {
                        this.buyProductForSubscription(this.props.selectedPlanDetails.productId)
                    }
                }
                else {
                    if (this.state.currentPlanData.productId == this.props.selectedPlanDetails.productId) {
                        selected = true;
                        showSimpleAlert(commonText.subscriptionMessage2)
                    }
                    else {
                        this.buyProductForSubscription(this.props.selectedPlanDetails.productId)
                    }
                }
            }
            else {
                this.buyProductForSubscription(this.props.selectedPlanDetails.productId)
            }
        }
        else {
            showSimpleAlert(commonText.showAnyPlanAlert)
        }
    }

    /** restore purchase handing function */
    onPressRestorePurchase = async () => {
        this.props.dispatchAction(subscribtionRequest());
        try {
            const purchases = await RNIap.getAvailablePurchases();
            if (Platform.OS == "ios") {
                if (purchases && purchases.length > 0) {
                    const sortedAvailablePurchases = purchases.sort(
                        (a, b) => b.transactionDate - a.transactionDate
                    );
                    let receiptValidateData = sortedAvailablePurchases[0]
                    await StorageService.saveItem(StorageService.STORAGE_KEYS.PURCHASE_DATA, purchases[0]);
                    let isfromRestorePurchase = true
                    this.validateReceipt(receiptValidateData.transactionReceipt, isfromRestorePurchase)
                }
                else {
                    showSimpleAlert(commonText.restorePurchaseNotFound)
                }
            }
            else {
                if (purchases && purchases.length > 0) {
                    let receiptValidateData = purchases[0]
                    await StorageService.saveItem(StorageService.STORAGE_KEYS.PURCHASE_DATA, purchases[0]);
                    let isfromRestorePurchase = true
                    this.validateReceipt(receiptValidateData.transactionReceipt, isfromRestorePurchase)
                }
                else {
                    showSimpleAlert(commonText.restorePurchaseNotFound)
                }
            }
            this.props.dispatchAction(subscribtionSuccess());
        }
        catch (err) {
            this.props.dispatchAction(subscribtionFailure());
            showSimpleAlert(err.message)
        }
    }

    /** buying subscription and do subscription request */
    buyProductForSubscription = async (purchaseSubscriptionId) => {
        if (this.props.loading) {
            this.props.dispatchAction(subscribtionFailure());
            return false;
        }
        this.props.dispatchAction(subscribtionRequest());
        try {
            const purchase = await RNIap.requestSubscription(purchaseSubscriptionId)
            console.log('purchase-', purchase);
        }
        catch (error) {
            // standardized err.code and err.message available
            this.props.dispatchAction(subscribtionFailure());
        }
    }
}

/**redux function */
const mapStateToProps = ({ subscribtionState }) => ({
    subscribtionProductList: subscribtionState.subscribtionProductList,
    loading: subscribtionState.loading,
    subscribtionPlanListFromIAP: subscribtionState.subscribtionPlanListFromIAP,
    selectedPlanDetails: subscribtionState.selectedPlanDetails,
    selectedPlanIndex: subscribtionState.selectedPlanIndex
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getPlanList: () => dispatch(getPlanList()),
    validReceipt: (params, isfromRestorePurchase, isFromFilter, isFromSettings, isFromLike) => dispatch(validReceipt(params, isfromRestorePurchase, isFromFilter, isFromSettings, isFromLike)),
    subscribtionLoadIAPplanList: (subscribtionPlanListFromIAP) => dispatch(subscribtionLoadIAPplanList({ subscribtionPlanListFromIAP })),
    subsctiontionStoreSelectedPlanDetails: (selectedPlanDetails) => dispatch(subsctiontionStoreSelectedPlanDetails({ selectedPlanDetails })),
    subscribtionSelectPlanIndex: (selectedPlanIndex) => dispatch(subscribtionSelectPlanIndex({ selectedPlanIndex })),
    dispatchAction: (action) => dispatch(action)
})

/**Main SubscriptionModal Container */
export default connect(mapStateToProps, mapDispatchToProps)(SubscriptionModal)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end'
    },
    main: {
        backgroundColor: colors.white,
        borderTopRightRadius: moderateScale(20),
        borderTopLeftRadius: moderateScale(20),
        paddingBottom: isIphoneX() ? 30 : 10
    },
    titleView: {
    },
    appName: {
        color: colors.black,
        fontSize: moderateScale(18),
        fontFamily: fonts.muliBold,
    },
    message: {
        color: colors.black,
        fontSize: moderateScale(22),
        fontFamily: fonts.muliBold,
        textAlign: "center",
        marginHorizontal: 20,
        // lineHeight: 30
    },
    subMessage: {
        color: colors.textColor,
        fontSize: moderateScale(15),
        fontFamily: fonts.muli,
        textAlign: "center",
        marginHorizontal: 20,
        marginTop: 5
    },
    box:
    {
        width: constants.screenWidth / 3.5,
        height: 180,
        backgroundColor: colors.white,
        marginLeft: 10,
        shadowColor: colors.grayShade1,
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
        shadowRadius: 10,
        shadowOffset: {
            height: 0,
            width: 1,
        },
        borderRadius: 10
    },
    flatlistContainer: {
        marginHorizontal: 10,
        flexGrow: 1,
        paddingTop: 5,
        marginTop: 15
    },
    duration: {
        fontSize: moderateScale(35),
        fontFamily: fonts.muliBold,
        textAlign: 'center',
        color: colors.black
    },
    months: {
        fontSize: verticalScale(15),
        color: colors.textColor,
        fontFamily: fonts.muliSemiBold,
        textAlign: 'center',
    },
    firstView: {
        alignItems: 'center',
        backgroundColor: colors.white,
        paddingBottom: 10,
        borderBottomColor: colors.grayShade1,
        // opacity: 0.8,
        // borderBottomWidth: 1
    },
    buttonView: {
    },
    boxContainer: {
        backgroundColor: colors.blueShade1,
        width: '90%',
        height: 25,
        borderRadius: 5,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 10,
        justifyContent: 'center',
        padding: 2
    },
    priceStyle: {
        color: colors.white,
        alignItems: 'center',
        fontFamily: fonts.muliBold,
        fontSize: 14
    },
    cancelSubscription: {
        fontSize: 16,
        fontFamily: fonts.muliBold,
        color: colors.blueShade1
    },
    weekText: {
        fontSize: 12,
        fontFamily: fonts.muliSemiBold,
        color: colors.blueShade1,
        textAlign: 'center',
    },
    mainStyle: {
        marginVertical: 10,
        borderWidth: 1,
        borderColor: colors.blueShade1
    },
    cancelWrap: {
        marginVertical: 8,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 10
    },
    emptyWrap: {
        height: 200,
        alignItems: 'center',
        justifyContent: "center",
        width: "100%"
    },
    boxWrap: {
        height: 220,
        justifyContent: 'center',
        paddingBottom: 10
    },
    svgWrap: {
        position: 'absolute',
        right: 2, top: 2,
    }
})