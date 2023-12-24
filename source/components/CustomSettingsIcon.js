import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Platform,
} from 'react-native';
import { tabBarIcons } from '../assets';
import { colors } from '../common';
import { connect } from "react-redux";
import { getNotificationData } from "../redux/operation";
import { NavigationEvents } from '@react-navigation/compat';

export let CustomSettingsIconRef;

/**custom setting icon component for show unread notifcation */
class CustomSettingsIcon extends Component {
    constructor(props) {
        super(props);
        CustomSettingsIconRef = this;
        this.state = {
            unreadCount: 0
        };
    }
    /**component lifecycle method */
    async componentDidMount() {
        await this.getNotifications()
    }

    /**get the notification and unread count */
    getNotifications = async () => {
        await this.props.getNotificationData(1);
        let count = 0
        this.props.notificationList.notifications.map((unread) => {
            if (unread.is_read == 0) { count++; }
        })
        this.setState({ unreadCount: count })
        return count;
    }

    /**component render method */
    render() {
        return (
            <View style={{ marginBottom: Platform.OS == "ios" ? 10 : 0 }}>
                <NavigationEvents onWillFocus={() => { this.getNotifications() }} onWillBlur={() => this.getNotifications()} />
                {this.state.unreadCount != 0
                    ?
                    <>
                        <View style={styles.iconBackground} >
                        </View>
                        <Image style={{ tintColor: colors.lightDotColor }} source={tabBarIcons.setting} />
                    </>
                    :
                    <Image style={{ tintColor: colors.lightDotColor }} source={tabBarIcons.setting} />
                }
            </View>
        );
    }
}

/**redux - connect state to props */
const mapStateToProps = ({ notificationState }) => ({
    loading: notificationState.loading,
    notificationList: notificationState.notificationList
})

/**redux - dispatch to props */
const mapDispatchToProps = (dispatch) => ({
    getNotificationData: (params) => dispatch(getNotificationData(params)),
})

/**component styling */
const styles = StyleSheet.create({
    iconBackground: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 15,
        width: 15,
        position: 'absolute',
        left: 15,
        borderRadius: 20,
        backgroundColor: 'red',
        bottom: 15
    },
    notificationCount: {
        color: colors.black,
        textAlign: 'center',
        fontSize: 10, alignItems: 'center'
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomSettingsIcon);