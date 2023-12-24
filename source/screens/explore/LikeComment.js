import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Keyboard, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fonts, } from '../../assets';
import { colors, commonText, constants } from '../../common';
import { CustomButton, CustomImage, Header, InputField, Loader, QueAnsBox, } from '../../components';
import { convetCapital, getFileExtension } from '../../utils/HelperFunction';

/**Like Comment Component */
class LikeComment extends Component {
    state = {
        comment: "",
    }
    /**componet render method */
    render() {
        const { question, answer, isQuestion, } = this.props.likeData;
        return (
            <View style={styles.container}>
                <Header
                    showShadow={false}
                    middleTextStyle={{ fontSize: 26 }}
                    middleText={convetCapital(this.props.likeData.headetitle) || ""}
                />
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'always'}
                    showsVerticalScrollIndicator={false}
                    bounces={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={styles.container}
                >

                    <View style={{ marginTop: 10 }}>
                        {
                            isQuestion ?
                                <QueAnsBox title={question} description={answer} />
                                :
                                <CustomImage isBlurPhoto={this.props.isBlurPhoto} source={this.props.likeData.imageurl} />
                        }
                    </View>
                    <View style={styles.wrap}>
                        <InputField
                            returnKeyType={constants.doneReturnKeyType}
                            theme={0}
                            value={this.state.comment}
                            placeholder={commonText.addaComment}
                            onChangeText={(comment) => this.setState({ comment })}
                            onSubmitEditing={() => Keyboard.dismiss()}
                        />
                        <CustomButton
                            onPress={this.onPressSendLike}
                            title={commonText.sendLike}
                            titleColor={colors.white}
                        />
                        <TouchableOpacity onPress={this.props.onRequestClose}>
                            <Text style={styles.cancelButton}>{commonText.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAwareScrollView>
                <Loader loading={this.props.loading} />
            </View>
        );
    }

    /**action handling for send like click */
    onPressSendLike = async () => {
        const { liked_user_id, headetitle, question, answer, questionid, isQuestion, imageid, imageurl } = this.props.likeData;
        const params = {
            liked_user_id,
        }
        const otherParams = {};
        if (isQuestion) {
            params.is_question = 1;
            params.question_id = questionid;
            params.comment = this.state.comment.trim() != "" ? this.state.comment.trim() : "Liked Question",
                otherParams.question = question;
            otherParams.answer = answer;
        }
        else {
            params.photo_id = imageid
            params.is_question = 0;
            params.comment = this.state.comment.trim() != "" ? this.state.comment.trim() : "Liked Picture"
            otherParams.imageurl = imageurl;
            let imageExt = await getFileExtension(imageurl)
            otherParams.ext = imageExt
        }
        this.props.sendLike(params, isQuestion, otherParams)
    }

}
export default LikeComment;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    underDevelopment: {
        textAlign: 'center',
        fontSize: 28,
        fontFamily: fonts.sukhumvitSetBold,
        marginTop: 50,
        marginBottom: 20
    },
    imageView: {
        height: 300,
        shadowColor: colors.shadowColor,
        shadowOffset: { width: 0, height: -2 },
        elevation: 5
    },
    cancelButton: {
        textAlign: 'center',
        color: colors.grayShadeDark,
        fontSize: 22,
        fontFamily: fonts.muli,
        marginTop: 20
    },
    imageBox: {
        flex: 0.5,
    },
    imageStyle: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        borderRadius: 10
    },
    wrap: {
        flex: 0.5,
        marginTop: 20, marginBottom: 20
    }
})