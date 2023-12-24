import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, BackHandler } from 'react-native';
import { constants, colors, commonText } from '../../common';
import { icons, fonts } from '../../assets';
import { Loader, SvgIcon } from '../../components';
import Header from '../../components/Header'
import { showSimpleAlert } from '../../utils/HelperFunction';
import UserUtils from '../../utils/UserUtils';
/**
 * Select Prompt screen for select question for profile setup
 */
class SelectPrompt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verificationCode: '',
            questionArray: [],
            questionPosition: '',
            listPosition: '',
            storePosition: ''
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        await this.props.getPromptQuestionArray();
        const userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails && userDetails.questions) {
            this.setState({ questionArray: userDetails.questions.length ? userDetails.questions : [], storePosition: this.props.route.params.position })
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.androidBackPress);
        this.subscribeBlur = this.props.navigation.addListener('blur', this.onScreenBlur);
    }

    /**event screen will blur */
    onScreenBlur = () => {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
    }

    /**back button event handling */
    androidBackPress = () => {
        const { isFromAns } = this.props.route.params;

        if (this.state.listPosition) {
            this.props.navigation.goBack()
        }
        else if (this.props.route.params && this.props.route.params.isFromSettingsStack) {
            this.props.navigation.goBack()
        }
        else if (this.props.route.params && this.props.route.params.isFromProfile) {
            let specificIndex = 13;
            this.props.navigation.navigate(commonText.profileSetupStepsRoute);
            this.props.profileSetupIncreaseIndex(specificIndex);
            return true;
        }
        else {
            let specificIndex = 13;
            this.props.navigation.navigate(commonText.profileSetupStepsRoute);
            this.props.profileSetupIncreaseIndex(specificIndex);
            return true;
        }

        // if (isFromAns) {
        //     this.props.navigation.navigate(commonText.writeAnswerRoute);
        //     return true;
        // }
        // else {
        //     let specificIndex = 13;
        //     this.props.navigation.navigate(commonText.profileSetupStepsRoute);
        //     this.props.profileSetupIncreaseIndex(specificIndex);
        //     return true;
        // }

    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.backHandler = BackHandler.removeEventListener('hardwareBackPress', this.androidBackPress)
        this.subscribeBlur()
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <Header
                    theme={0}
                    onBackButtonPress={this.androidBackPress}
                    backButton
                    middleText={commonText.selectPrompt} />
                <FlatList
                    style={{ flex: 1, }}
                    contentContainerStyle={styles.flatlistContainer}
                    data={this.props.promptQueData || []}
                    renderItem={this.renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    extraData={this.props}
                    ItemSeparatorComponent={this.itemSeparator}
                />
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**render question list item */
    renderItem = ({ item, index }) => {
        let selected = false;
        const isFromSettingsStack = this.props.route.params && this.props.route.params.isFromSettingsStack;
        if (isFromSettingsStack) {
            this.state.questionArray && this.state.questionArray.length
                && this.state.questionArray.map((obj) => {
                    if (obj.question_id === item.question_id) {
                        selected = true;
                    }
                })
        }
        else {
            if (this.props.userProfileSetupDetails) {
                if (this.props.userProfileSetupDetails.questions && this.props.userProfileSetupDetails.questions.length) {
                    this.props.userProfileSetupDetails.questions.map((obj) => {
                        if (obj.question_id === item.question_id) {
                            selected = true;
                        }
                    })
                }
            }
        }
        return (
            <TouchableOpacity
                delayPressIn={0}
                activeOpacity={constants.activeOpacity}
                onPress={() => this.onPressQuestion(item, index, selected)}
                style={styles.questionWrap}
            >
                <Text style={styles.prompt}>{item.question || ""}</Text>
                {
                    selected ?
                        <SvgIcon name={icons.checkMarkIcon} />
                        : null
                }
            </TouchableOpacity>
        )
    }

    /**action fire when question is selected */
    onPressQuestion = (item, index, selected) => {
        const isFromAns = this.props.route.params && this.props.route.params.isFromAns
        const isFromEdit = this.props.route.params && this.props.route.params.isFromEdit
        const isFromProfile = this.props.route.params && this.props.route.params.isFromProfile

        if (selected) { showSimpleAlert(commonText.youAlreadySelectQuestion) }
        else {
            const position = this.props.route.params.position;
            const questionDetail = {
                position: this.state.storePosition,
                question_id: item.question_id,
                question: item.question,
            }
            this.props.navigation.navigate(commonText.writeAnswerRoute, { questionDetail, isFromPrompt: true, isFromAns, isFromEdit, isFromProfile })
        }
    }

    /**item separator component */
    itemSeparator = () => {
        return (
            <View style={styles.itemSeparotor}></View>
        )
    }
}

export default SelectPrompt;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white
    },
    prompt: {
        fontSize: 16,
        fontFamily: fonts.muli,
        color: colors.textColor,
        paddingVertical: 15,
    },
    itemSeparotor: {
        borderBottomColor: colors.grayShade1,
        borderBottomWidth: 1.5,
        opacity: 0.5

    },
    flatlistContainer: {
        flexGrow: 1,
        marginVertical: 10,
        marginHorizontal: 20,
        paddingBottom: 20
    },
    questionWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5, alignItems: 'center'
    }
})