import { connect } from "react-redux";
import UserMeritalStatus from "./UserMeritalStatus";
import { profileSetupIncreaseIndex } from "../../redux/action";
import { saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ }) => ({
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: (index) => dispatch(profileSetupIncreaseIndex({ index })),
    saveProfileSetupData: (params, userIsSingle, isFromSettings) => dispatch(saveProfileSetupDetails(params, userIsSingle, null, null, null, null, isFromSettings)),
})

/**Main UserMaritalStatusContainer Container */
const UserMaritalStatusContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserMeritalStatus);

export default UserMaritalStatusContainer;