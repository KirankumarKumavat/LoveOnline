import { connect } from "react-redux";
import { saveProfileSetupDetails } from "../../redux/operation";
import UserPray from "./UserPray";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({

})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, isFromSettings)),
})

/**Main UserPray Container */
const UserPrayContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(UserPray);

export default UserPrayContainer;