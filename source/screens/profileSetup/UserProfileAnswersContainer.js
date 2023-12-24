import { connect } from "react-redux";
import { profileSetupIncreaseIndex } from "../../redux/action";
import UserProfileAnswers from "./UserProfileAnswers";
import { getUserProfileSetupData } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
    getUserProfileData: () => dispatch(getUserProfileSetupData())
})

/**Main UserProfileAnswersContainer Container */
const UserProfileAnswersContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(UserProfileAnswers);

export default UserProfileAnswersContainer;