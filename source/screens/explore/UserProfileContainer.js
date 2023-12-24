import { connect } from "react-redux";
import { exploreFailure, exploreRequest, exploreSuccess, exploreResetData, exploreSetEmptyData, likeResetData } from "../../redux/action";
import { blockUser, getLikeTabUserProfiles, getOppositeGenderDetails, ignoreProfile, proformUnmatchUser, reportUser, saveProfileSetupDetails, unblockUserForLikeTab, } from "../../redux/operation";
import UserProfile from "./UserProfile";

/**redux function */
const mapStateToProps = ({ exploreState }) => ({
   loading: exploreState.loading,
   userDetails: exploreState.userDetails,
   isNoProfileFound: exploreState.isNoProfileFound,
   userProfileDetails: exploreState.userProfileDetails
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   exploreSetEmptyData: () => dispatch(exploreSetEmptyData()),
   exploreRequest: () => dispatch(exploreRequest()),
   exploreSuccess: () => dispatch(exploreSuccess()),
   exploreFailure: () => dispatch(exploreFailure()),
   saveProfileSetupData: (params) => dispatch(saveProfileSetupDetails(params, null, null, null, null, true)),
   getOppositeGenderDetails: (params) => dispatch(getOppositeGenderDetails(params)),
   ignoreProfile: (params) => dispatch(ignoreProfile(params)),
   blockUser: (params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch) => dispatch(blockUser(params, isFromLike, likeParams, isFromChat, null, isFromNotification, isFromMatch)),
   reportUser: (params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch) => dispatch(reportUser(params, isFromLike, likeParams, isFromChat, isFromNotification, isFromMatch)),
   getLikeTabUserProfiles: (params) => dispatch(getLikeTabUserProfiles(params, true)),
   resetData: () => dispatch(exploreResetData()),
   unblockUserForLikeTab: (params, isFromLike, isFromChat, isFromNotification, isFromMatch) => dispatch(unblockUserForLikeTab(params, isFromLike, isFromChat, null, isFromNotification, isFromMatch)),
   likeResetData: () => dispatch(likeResetData()),
   proformUnmatchUser: (params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams) => dispatch(proformUnmatchUser(params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams))
})

/**Main UserProfile Container */
const UserProfileContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(UserProfile);

export default UserProfileContainer;