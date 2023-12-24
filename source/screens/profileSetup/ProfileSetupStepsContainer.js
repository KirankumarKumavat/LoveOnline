import { connect } from "react-redux";
import ProfileSetupSteps from "./ProfileSetupSteps";
import ProfileSetupData from "./ProfileSetupData";
import { profileSetupIncreaseIndex, profileSetupDecreaseIndex, profileSetupResetData } from "../../redux/action";

/**
 * 
 * @returns all steps for profile setup
 */
const getProfileSetupStepsData = () => {
   const allSteps = ProfileSetupData.getProfileStepData();
   return allSteps;
}

/**redux function */
const mapStateToProps = ({ profileSetupState }) => ({
   profileSetupStep: getProfileSetupStepsData(),
   activeProfileSetupStepIndex: profileSetupState.activeProfileSetupStepIndex,
   loading: profileSetupState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   selectNextIndex: () => dispatch(profileSetupIncreaseIndex()),
   onBackPress: (index) => dispatch(profileSetupDecreaseIndex({ index })),
   resetData: () => dispatch(profileSetupResetData())
})

/**Main ProfileSetupSteps Container */
const ProfileSetupStepsContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(ProfileSetupSteps);

export default ProfileSetupStepsContainer;