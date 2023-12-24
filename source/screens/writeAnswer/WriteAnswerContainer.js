import { connect } from "react-redux";
import WriteAnswer from "./WriteAnswer";
import { saveProfileSetupDetails } from "../../redux/operation";
import { profileSetupIncreaseIndex } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    loading: profileSetupState.loading
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    saveProfileSetupData: (params, isFromSettings) => dispatch(saveProfileSetupDetails(params, null, true, null, null, null, isFromSettings)),
    profileSetupIncreaseIndex: (specificIndex) => dispatch(profileSetupIncreaseIndex({ specificIndex }))
})

/**Main WriteAnswer Container */
const WriteAnswerContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(WriteAnswer);

export default WriteAnswerContainer;