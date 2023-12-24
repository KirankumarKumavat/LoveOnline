import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import { getUserProfileSetupData, saveProfileSetupDetails, sendOtpToPhone } from "../../redux/operation";
import UserPhoneNumber from "./UserPhoneNumber";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
   userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
   saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params)),
   getUserProfileData: () => dispatch(getUserProfileSetupData()),
   sendOtpToPhone: (params) => dispatch(sendOtpToPhone(params))
})

/**Main UserPhoneNumber Container */
const UserPhoneNumberContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(UserPhoneNumber);

export default UserPhoneNumberContainer;