import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import UserSect from "./UserSect";
import { getCastData, saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    casteData: profileSetupState.casteData
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    getCasteData: () => dispatch(getCastData()),
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
})

/**Main UserSect Container */
const UserSectContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserSect);

export default UserSectContainer;