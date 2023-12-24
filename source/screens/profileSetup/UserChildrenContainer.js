import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import UserChildren from "./UserChildren";
import { saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ }) => ({

})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    // saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params))
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
})

/**Main UserChildren Container */
const UserChildrenContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserChildren);

export default UserChildrenContainer;