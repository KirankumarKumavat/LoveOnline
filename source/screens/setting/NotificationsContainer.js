import { connect } from "react-redux";
import Notifications from "./Notifications";
import { clearAllNotificationFromList, getNotificationData, readNotification } from "../../redux/operation";
import { notificationResetData } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ notificationState }) => ({
    loading: notificationState.loading,
    notificationList: notificationState.notificationList,
    isLoadMoreLoading: notificationState.isLoadMoreLoading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getNotificationData: (params, isFromLoadMore) => dispatch(getNotificationData(params, null, isFromLoadMore)),
    readNotification: (params) => dispatch(readNotification(params)),
    resetData: () => dispatch(notificationResetData()),
    clearAllNotificationFromList: (params) => dispatch(clearAllNotificationFromList(params))
})

/**Main Notifications Container */
const NotificationsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Notifications);

export default NotificationsContainer;