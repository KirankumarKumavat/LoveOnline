import { connect } from "react-redux";
import { profileSetupIncreaseIndex, profileSetupAddDegreeToList, profileSetupRemoveDegreeFromList } from "../../redux/action";
import UserDegrees from "./UserDegrees";
import { getEducationData, getUserProfileSetupData, saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    educationData: profileSetupState.educationData,
    selectedDegreeList: profileSetupState.selectedDegreeList,
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    getEducationData: () => dispatch(getEducationData()),
    addDegreeToList: (degree) => dispatch(profileSetupAddDegreeToList({ degree })),
    removeFromDegreeList: (degree) => dispatch(profileSetupRemoveDegreeFromList({ degree })),
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
    getUserProfileData: () => dispatch(getUserProfileSetupData())
})

/**Main UserDegrees Container */
const UserDegreesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserDegrees);

export default UserDegreesContainer;