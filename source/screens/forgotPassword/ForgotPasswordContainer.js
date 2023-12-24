import { connect } from "react-redux";
import { forgotPassword } from "../../redux/operation";
import ForgotPassword from "./ForgotPassword";

/**redux function */
const mapStateToProps = ({ forgotPasswordState }) => ({
    loading: forgotPasswordState.loading
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    forgotPassword: (params) => dispatch(forgotPassword(params))
})

/**Main ForgotPassword Container */
const ForgotPasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForgotPassword);

export default ForgotPasswordContainer;