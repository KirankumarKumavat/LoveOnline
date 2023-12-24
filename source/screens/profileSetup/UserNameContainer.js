import { connect } from "react-redux";
import UserName from "./UserName";
import { profileSetupIncreaseIndex } from "../../redux/action";
import { saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ }) => ({

})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
   saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),

})

/**Main UserName Container */
const UserNameContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(UserName);

export default UserNameContainer;