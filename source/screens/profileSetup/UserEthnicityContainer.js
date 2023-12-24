import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import UserEthnicity from "./UserEthnicity";
import { getEthnicityData, saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    ethnicityData: profileSetupState.ethnicityData
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    getEthnicityData: () => dispatch(getEthnicityData()),
    // saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params))
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
})

/**Main UserEthnicity Container */
const UserEthnicityContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserEthnicity);

export default UserEthnicityContainer;