import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import { getUserProfileSetupData, sendOtpToPhone, verifyOTPOfPhone } from "../../redux/operation";
import UserPhoneVerification from "./UserPhoneVerification";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
   userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
   getUserProfileData: () => dispatch(getUserProfileSetupData()),
   sendOtpToPhone: (params) => dispatch(sendOtpToPhone(params, true)),
   verifyOTPOfPhone: (params) => dispatch(verifyOTPOfPhone(params))
})

/**Main UserPhoneVerification Container */
const UserPhoneVerificationContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(UserPhoneVerification);

export default UserPhoneVerificationContainer;