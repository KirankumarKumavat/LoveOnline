import { connect } from "react-redux";
import ProfilePics from "./ProfilePics";
import { getUserProfileSetupData, saveProfileSetupDetails, uploadProfilePicture, deleteProfilePicture } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    loading: profileSetupState.loading,
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getUserProfileData: () => dispatch(getUserProfileSetupData()),
    uploadProfilePicture: (params) => dispatch(uploadProfilePicture(params)),
    // saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, null, true)),
    saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, null, true)),
    deleteProfilePicture: (params) => dispatch(deleteProfilePicture(params))
})

/**Main ProfilePics Container */
const ProfilePicsContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ProfilePics);

export default ProfilePicsContainer;