import React, { Component } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { CustomButton } from '../../components';
import { commonText, colors } from '../../common';
import { height, heightInInches } from '../../utils/DummyData'
import {
    WheelPicker
} from "react-native-wheel-picker-android";
import UserUtils from '../../utils/UserUtils';
import { Picker } from '@react-native-picker/picker';

let userDetails;
class UserHeight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: '',
            selectedItem: 17,
            mainList: []
        };
    }

    /**componet life cycle method */
    async componentDidMount() {
        userDetails = await UserUtils.getUserDetailsFromAsyncStorage();
        if (userDetails.height) {
            // this.setState({ selectedItem: heightInInches.indexOf(userDetails.height) })
            var selectedItem = ''
            height.map((obj, i) => {
                if (i === heightInInches.indexOf(userDetails.height)) {
                    selectedItem = obj
                    console.log("obj ---->", obj);
                }
            })
            this.setState({ selectedItem: Platform.OS === 'ios' ? selectedItem : heightInInches.indexOf(userDetails.height) })
            console.log("heightInInches.indexOf(userDetails.height) --->", userDetails.height);
        }
    }

    /**componet render method */
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.heightWrap}>
                    {Platform.OS === 'android' ?
                        <WheelPicker
                            selectedItem={this.state.selectedItem}
                            data={height}
                            onItemSelected={this.onItemSelected}
                            style={{ flex: 1, fontSize: 16 }}
                            selectedItemTextSize={20}
                            itemTextSize={20}
                            indicatorColor={colors.grayShadeDark}

                        />
                        :
                        <Picker
                            style={{ flex: 1, fontSize: 16 }}
                            selectedValue={this.state.selectedItem}
                            itemStyle={{ fontSize: 20 }}
                            onValueChange={this.onItemSelected}>
                            {
                                height.map((v) => {
                                    return <Picker.Item label={v} value={v} />
                                })
                            }
                        </Picker>
                    }
                </View>
                <View style={styles.buttonWrap}>
                    <CustomButton
                        title={commonText.continue}
                        onPress={this.onPress}
                    />
                </View>
            </View>
        );
    }

    /**height selection method */
    onItemSelected = selectedItem => {
        Platform.OS === 'ios' ?
            height.map((v, i) => {
                if (selectedItem === v) {
                    this.setState({
                        selectedItem: selectedItem,
                    })
                }
            })
            :
            this.setState({ selectedItem });
    };

    /**action handling for continue button click */
    onPress = () => {
        // let foot = height[this.state.selectedItem].split("   ");
        let foot = Platform.OS === 'ios' ? this.state.selectedItem.split("   ") : height[this.state.selectedItem].split("   ");
        const params = {
            height: foot[0]
        }
        if (this.props.isFromSettingsStack) {
            this.props.saveProfileSetupData(params, this.props.isFromSettingsStack)
        }
        else {
            this.props.saveProfileSetupData(params)
        }
    }
}

export default UserHeight;

/**component styling */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20
    },
    heightWrap: {
        flex: 1,
        marginHorizontal: 40
    },
    buttonWrap: {
        flex: 1,
        justifyContent: 'flex-end'
    }
})
