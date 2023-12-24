import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import { saveProfileSetupDetails } from "../../redux/operation";
import UserHeight from "./UserHeight";

/**redux function */
const mapStateToProps = ({ }) => ({

})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
})

/**Main UserHeight Container */
const UserHeightContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserHeight);

export default UserHeightContainer;