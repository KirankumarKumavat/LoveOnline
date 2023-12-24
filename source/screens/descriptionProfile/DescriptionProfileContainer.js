import { connect } from "react-redux";
import DescriptionProfile from "./DescriptionProfile";
import { getUserProfileSetupData, saveProfileSetupDetails } from "../../redux/operation";

/**redux functions */
const mapStateToProps = ({ profileSetupState }) => ({
    loading: profileSetupState.loading,
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux functions */
const mapDispatchToProps = (dispatch) => ({
    saveProfileSetupData: (params, isFromSettingsStack) => dispatch(saveProfileSetupDetails(params, null, null, true, null, null, isFromSettingsStack)),
    getUserProfileData: () => dispatch(getUserProfileSetupData()),
})

/**Main Description Profile Container */
const DescriptionProfileContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(DescriptionProfile);

export default DescriptionProfileContainer;