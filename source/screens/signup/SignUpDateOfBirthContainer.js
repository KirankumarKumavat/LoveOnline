import { connect } from "react-redux";
import { signUp } from "../../redux/operation";
import SignUpDateOfBirth from "./SignUpDateOfBirth";
import { saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ signupState, profileSetupState }) => ({
   loading: signupState.loading,
   loader: signupState.loader,
   editProfileLoading: profileSetupState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   signUp: (params) => dispatch(signUp(params)),
   saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, null, null, null, true, null, true)),

})

/**Main SignUpDateOfBirth Container */
const SignUpDateOfBirthContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(SignUpDateOfBirth);

export default SignUpDateOfBirthContainer;