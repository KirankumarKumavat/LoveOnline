import { connect } from "react-redux";
import EnterPassword from "./EnterPassword";
import { resetPassword, signUp } from "../../redux/operation";

/**redux functions */
const mapStateToProps = ({ signupState, forgotPasswordState }) => ({
    loading: signupState.loading,
    resetLoading: forgotPasswordState.loading,
})

/**redux functions */
const mapDispatchToProps = (dispatch) => ({
    signUp: (params) => dispatch(signUp(params)),
    resetPassword: (params) => dispatch(resetPassword(params))
})

/**Main Enter Password Container */
const EnterPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EnterPassword);

export default EnterPasswordContainer;