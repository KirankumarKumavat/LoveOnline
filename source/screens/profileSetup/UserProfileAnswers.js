import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, constants, colors } from '../../common';
import { showSimpleAlert } from '../../utils/HelperFunction';
import { fonts } from '../../assets';
import NavigationService from '../../utils/NavigationService';

/**ProfileSetup:UserProfileAnswers selection Screen component */
class UserProfileAnswers extends Component {
    keyExtractor = (item, index) => index.toString()

    state = {
        answers: [
            {
                title: commonText.selectPromptTitle,
                answer: commonText.writeAnswerTitle,
                position: 1
            },
            {
                title: commonText.selectPromptTitle,
                answer: commonText.writeAnswerTitle,
                position: 2
            },
            {
                title: commonText.selectPromptTitle,
                answer: commonText.writeAnswerTitle,
                position: 3
            },
            {
                title: commonText.selectPromptTitle,
                answer: commonText.writeAnswerTitle,
                position: 4
            },
            {
                title: commonText.selectPromptTitle,
                answer: commonText.writeAnswerTitle,
                position: 5
            },
        ]
    }

    /**componet life cycle method */
    async componentDidMount() {
        await this.props.getUserProfileData();
        const { navigation } = this.props;
        this.subscribeFocus = navigation.addListener('focus', async () => await this.onScreenFocus());
        this.setQuestionData()
    }

    /**screen focus event */
    onScreenFocus = async () => {
        await this.props.getUserProfileData();
        this.setQuestionData()
    }

    /**componet life cycle method */
    componentWillUnmount() {
        this.subscribeFocus()
    }

    /**sets question data to list based on selection */
    setQuestionData = () => {
        if (this.props.userProfileSetupDetails) {
            if (this.props.userProfileSetupDetails.questions && this.props.userProfileSetupDetails.questions.length) {
                this.state.answers.map((obj) => {
                    this.props.userProfileSetupDetails.questions.map((obj1) => {
                        if (obj.position === obj1.position) {
                            obj.title = obj1.question;
                            obj.answer = obj1.answer;
                        }
                    })
                })
                this.setState({ answer: this.state.answers })
            }
        }
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.leftText}>{commonText.answerRequiredText}</Text>
                    <FlatList
                        style={{ flex: 1 }}
                        contentContainerStyle={styles.flatlistContainer}
                        data={this.state.answers}
                        renderItem={this.renderItem}
                        keyExtractor={this.keyExtractor}
                        bounces={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <CustomButton
                    title={commonText.continue}
                    onPress={this.onPress}
                    mainStyle={styles.continue}
                />
            </View>
        );
    }

    /**action handling for continue button click */
    onPress = () => {
        let queAnsArray = [];
        queAnsArray = this.state.answers.filter((obj) => obj.title === commonText.selectPromptTitle);
        if (queAnsArray.length) {
            showSimpleAlert(commonText.allQueAnsRequired)
        }
        else {
            this.props.navigation.navigate(commonText.descriptionProfileRoute)
        }
    }

    /**render item of profile ans array list  */
    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity
                style={styles.professionStyle}
                delayPressIn={0}
                activeOpacity={constants.activeOpacity}
                onPress={() => {
                    if (item.title == commonText.selectPromptTitle) {
                        NavigationService.navigate(commonText.selectPromptRoute, { position: item.position })
                    }
                    else {
                        this.props.navigation.navigate(commonText.writeAnswerRoute, { questionDetail: { question: item.title, position: item.position, question_id: item.position }, answer: item.answer })
                    }
                }}
            >
                <View>
                    <Text style={styles.professionTitle} numberOfLines={1}>{item.title}</Text>
                </View>
                {item.title !== commonText.selectPromptTitle
                    ?
                    <View
                    >
                        <Text style={styles.answerTitle} numberOfLines={2}>{item.answer}</Text>
                    </View>
                    :
                    <Text style={styles.answerTitle} numberOfLines={2}>{item.answer}
                    </Text>
                }
            </TouchableOpacity>
        )
    }

    onPressprompt = (item, index) => {
        if (item.title == commonText.selectPromptTitle) {
            NavigationService.navigate(commonText.selectPromptRoute, { position: item.position })
        }
        else {

        }
    }

}

export default UserProfileAnswers;

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
        backgroundColor: colors.white,
        width: constants.screenWidth - 40,
        justifyContent: 'center',
        borderRadius: 10,
        borderColor: colors.inputBorder2,
        borderWidth: 1,
        padding: 10,
        margin: 8,
        alignSelf: 'center'

    },
    professionTitle: {
        padding: 5,
        fontSize: 16,
        fontFamily: fonts.muliSemiBold,
        color: colors.black,
        lineHeight: 15,
    },
    answerTitle: {
        padding: 5,
        fontSize: 14,
        fontFamily: fonts.muli,
        color: colors.grayShadeDark,
        lineHeight: 15,
    },
    continue: {
        marginVertical: 10
    },
    leftText: {
        color: colors.grayShadeDark,
        fontSize: 14,
        fontFamily: fonts.muliSemiBold,
        alignSelf: 'flex-end',
        marginHorizontal: 30
    }

})
