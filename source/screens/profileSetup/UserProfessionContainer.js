import { connect } from "react-redux";
import UserProffestion from "./UserProffestion";
import { profileSetupIncreaseIndex, selectProffestionIndex } from "../../redux/action";
import { getUserProfesstionData, saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    proffestionData: profileSetupState.proffestionData,
    selectedProffestionIndex: profileSetupState.selectedProffestionIndex,
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    getProffestionData: () => dispatch(getUserProfesstionData()),
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
    selectedProffestionIndex: (selectedProffestionIndex) => dispatch(selectProffestionIndex({ selectedProffestionIndex }))
})

/**Main UserProffestion Container */
const UserProfessionContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserProffestion);

export default UserProfessionContainer;