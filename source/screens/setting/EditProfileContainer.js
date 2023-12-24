import { connect } from "react-redux";
import EditProfile from "./EditProfile";
import { userProfileResetData, profileSetupIncreaseEditIndex } from "../../redux/action";
import { getUserProfileSetupData, saveProfileSetupDetails, uploadProfilePicture, deleteProfilePicture, saveBlurData } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ userProfileState, profileSetupState }) => ({
    loading: userProfileState.loading,
    userProfileSetupDetails: userProfileState.userProfileSetupDetails,
    imageLoad: profileSetupState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getUserProfileData: () => dispatch(getUserProfileSetupData(true)),
    resetData: () => dispatch(userProfileResetData()),
    uploadProfilePicture: (params) => dispatch(uploadProfilePicture(params, true)),
    saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, true)),
    saveBlurData: (params) => dispatch(saveBlurData(params, true)),
    deleteProfilePicture: (params) => dispatch(deleteProfilePicture(params, true)),
    updateIndex: (params) => dispatch(profileSetupIncreaseEditIndex(params))
})

/**Main EditProfile Container */
const EditProfileContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EditProfile);

export default EditProfileContainer;