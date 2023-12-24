import { connect } from "react-redux";
import { changePassword } from "../../redux/operation";
import ChangePassword from "./ChangePassword";

/**redux-map state to props */
const mapStateToProps = ({ userProfileState }) => ({
    loading: userProfileState.loading,
})
/**redux-map disptch to props */
const mapDispatchToProps = (dispatch) => ({
    changePassword: (params) => dispatch(changePassword(params))
})

/**
 * Change password main container
 */

const ChangePasswordContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ChangePassword);

export default ChangePasswordContainer;