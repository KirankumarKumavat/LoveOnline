import { connect } from "react-redux";
import { exploreFailure, exploreRequest, exploreSuccess, exploreResetData, exploreSetEmptyData, likeResetData } from "../../redux/action";
import { blockUser, getLikeTabUserProfiles, getOppositeGenderDetails, ignoreProfile, proformUnmatchUser, reportUser, saveProfileSetupDetails, unblockUserForLikeTab, validateReceiptApicall, } from "../../redux/operation";
import Explore from "./Explore";

/**redux function */
const mapStateToProps = ({ exploreState, notificationState }) => ({
    loading: exploreState.loading,
    userDetails: exploreState.userDetails,
    isNoProfileFound: exploreState.isNoProfileFound,
    notificationList: notificationState.notificationList
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
    getLikeTabUserProfiles: (params) => dispatch(getLikeTabUserProfiles(params)),
    resetData: () => dispatch(exploreResetData()),
    unblockUserForLikeTab: (params, isFromLike, isFromChat, isFromNotification, isFromMatch) => dispatch(unblockUserForLikeTab(params, isFromLike, isFromChat, null, isFromNotification, isFromMatch)),
    likeResetData: () => dispatch(likeResetData()),
    getNotificationData: (params) => dispatch(getNotificationData(params)),
    validateReceiptApicall: () => dispatch(validateReceiptApicall()),
    proformUnmatchUser: (params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams) => dispatch(proformUnmatchUser(params, isFromLike, isFromChat, isFromNotification, isFromMatch, likeParams))
})

/**Main Explore Container */
const ExploreContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Explore);

export default ExploreContainer;