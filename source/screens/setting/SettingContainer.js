import { connect } from "react-redux";
import Setting from "./Setting";
import { getUserProfileSetupData, logout, saveProfileSetupDetails, getNotificationData, readNotification, validateReceiptApicall } from "../../redux/operation";
import { userProfileResetData } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ userProfileState, notificationState }) => ({
    loading: userProfileState.loading,
    userProfileSetupDetails: userProfileState.userProfileSetupDetails,
    mainProfileImage: userProfileState.mainProfileImage,
    notificationList: notificationState.notificationList
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getUserProfileData: () => dispatch(getUserProfileSetupData(true)),
    logout: () => dispatch(logout()),
    resetData: () => dispatch(userProfileResetData()),
    saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, true, null, null, null, true)),
    getNotificationData: (params) => dispatch(getNotificationData(params, true)),
    readNotification: (params) => dispatch(readNotification(params)),
    validateReceiptApicall: () => dispatch(validateReceiptApicall())
})

/**Main Setting tab Container */
const SettingContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Setting);

export default SettingContainer;