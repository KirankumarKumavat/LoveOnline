import { connect } from "react-redux";
import SelectPrompt from "./SelectPrompt";
import { getPromptQuestionArray } from "../../redux/operation";
import { profileSetupIncreaseIndex } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
    promptQueData: profileSetupState.promptQueData,
    loading: profileSetupState.loading,
    userProfileSetupDetails: profileSetupState.userProfileSetupDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getPromptQuestionArray: () => dispatch(getPromptQuestionArray()),
    profileSetupIncreaseIndex: (specificIndex) => dispatch(profileSetupIncreaseIndex({ specificIndex }))
})

/**Main SelectPrompt Container */
const SelectPromptContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(SelectPrompt);

export default SelectPromptContainer;