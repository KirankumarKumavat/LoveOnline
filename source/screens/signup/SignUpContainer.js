import { connect } from "react-redux";
import SignUp from "./SignUp";
import { login, signUpWithEmail } from "../../redux/operation";
import { signUpFailure, signUpRequest, signUpResetData, signUpSuccess } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ signupState }) => ({
   loading: signupState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   signUpWithEmail: (email) => dispatch(signUpWithEmail(email)),
   signUpRequest: () => dispatch(signUpRequest()),
   signUpSuccess: () => dispatch(signUpSuccess()),
   signupFailure: () => dispatch(signUpFailure()),
   login: (params, isSocialLogin) => dispatch(login(params, isSocialLogin, true)),
   resetData: () => dispatch(signUpResetData())
})

/**Main SignUp Container */
const SignUpContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(SignUp);

export default SignUpContainer;