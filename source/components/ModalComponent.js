import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableHighlight, FlatList, TouchableOpacity, } from 'react-native';
import { fonts } from '../assets';
import { colors } from '../common';
import { isIphoneX } from '../utils/iPhoneXHelper';
import RNModal from 'react-native-modal';

/**
 * modal component to select various filter values 
 */
class ModalComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View>
                {/* <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.props.modalVisible}
                    statusBarTranslucent
                    onRequestClose={this.props.onRequestClose}
                > */}
                <RNModal
                    testID={'modal'}
                    isVisible={this.props.modalVisible}
                    onModalHide={this.props.onRequestClose}
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
                    <TouchableHighlight
                        underlayColor={"transparent"}
                        onPress={this.props.onRequestClose}
                        style={styles.outerViewModalStyle}
                    >
                        <TouchableOpacity delayPressIn={0} onPress={() => null} activeOpacity={1}>
                            <View style={styles.modal}>
                                <FlatList
                                    style={{ marginTop: 10, }}
                                    data={this.props.data}
                                    renderItem={(item, index) => this.props.renderItem(item, index)}
                                    keyExtractor={item => item.id}
                                    bounces={false}
                                    showsVerticalScrollIndicator={false}
                                    extraData={this.state}
                                    ItemSeparatorComponent={() => this.ItemSeparatorComponent()}
                                    ListHeaderComponent={() => this.modalHeader()}
                                />
                            </View>
                        </TouchableOpacity>
                    </TouchableHighlight>
                    {/* </Modal> */}
                </RNModal>
            </View>
        )
    }
    /**item sepeator componet */
    ItemSeparatorComponent = () => {
        return (
            <View style={styles.itemDivider} />

        )
    }
    /**render modal header part */
    modalHeader = () => {
        return (
            <View style={styles.modalHeaderView}>
                <Text style={styles.modalHeaderText}>
                    {this.props.header}
                </Text>
            </View>
        )
    }

}
export default ModalComponent;

/**
* Compoenent styles
*/
const styles = StyleSheet.create({
    safearea: {
        flex: 1,
        backgroundColor: colors.backgroundColor,
    },
    container: {
        flexGrow: 1,
        backgroundColor: colors.backgroundColor,
        justifyContent: 'space-between'
    },
    modal: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    itemDivider: {
        backgroundColor: colors.grayShade1,
        height: 1
    },
    outerViewModalStyle: {
        flex: 1,
        backgroundColor: colors.modalBackground,
        justifyContent: 'flex-end',
        marginBottom: isIphoneX() ? 25 : 0
    },
    modalHeaderView: {
        height: 40,
        marginTop: 3,
        paddingLeft: 20,
        borderBottomColor: colors.black,
        borderBottomWidth: 1,
    },
    modalHeaderText: {
        fontFamily: fonts.muliBold,
        fontSize: 20,
        color: colors.Orange,
    },
    confirmButtonView: {
        marginTop: 10,
        alignItems: 'flex-end',
        marginRight: 10,
    },
    confirmText: {
        color: colors.textColor,
        fontSize: 18
    },
})