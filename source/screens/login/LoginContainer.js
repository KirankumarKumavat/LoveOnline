import { connect } from "react-redux";
import { loginFailure, loginRequest, loginResetData, loginSuccess } from "../../redux/action";
import { login } from "../../redux/operation";
import Login from "./Login";

/**redux function */
const mapStateToProps = ({ loginState }) => ({
   loading: loginState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   login: (params, isSocialLogin) => dispatch(login(params, isSocialLogin)),
   loginRequest: () => dispatch(loginRequest()),
   loginSuccess: () => dispatch(loginSuccess()),
   loginFailure: () => dispatch(loginFailure()),
   resetData: () => dispatch(loginResetData())
})
                                                                                                         
/**Main Login Container */
const LoginContainer = connect(                                                                      
   mapStateToProps,
   mapDispatchToProps,
)(Login);

export default LoginContainer;