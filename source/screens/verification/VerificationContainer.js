import { connect } from "react-redux";
import Verification from "./Verification";
import { verifyCode, resendOtpVerificationCode } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ signupState }) => ({
    loading: signupState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    verifyCode: (params, navParams) => dispatch(verifyCode(params, navParams)),
    resendOtpCode: (params) => dispatch(resendOtpVerificationCode(params))
})

/**Main Verification Container */
const VerificationContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Verification);

export default VerificationContainer;