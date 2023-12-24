import { connect } from "react-redux";
import SettingsScreen from "./SettingsScreen";
import { logout, notificationPermission } from "../../redux/operation";
import { userProfileResetData } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ userProfileState, notificationPermissionState }) => ({
    loading: userProfileState.loading,
    userProfileSetupDetails: userProfileState.userProfileSetupDetails,
    loader: notificationPermissionState.loader,
    userProfileLoader: userProfileState.loader,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(logout()),
    notificationReq: (params) => dispatch(notificationPermission(params)),
    resetData: () => dispatch(userProfileResetData())
})

/**Main SettingsScreen Container */
const SettingScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SettingsScreen);

export default SettingScreenContainer;