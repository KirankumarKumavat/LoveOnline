import { connect } from "react-redux";
import Matches from "./Matches";

import { blockUser, proformUnmatchUser, unblockUserForLikeTab, } from "../../redux/operation";
import { getMatchedUserProfileData, } from "../../redux/operation";
import { matchedUserResetData } from "../../redux/action";

/**redux function */
const mapStateToProps = ({ matchesState }) => ({
    loading: matchesState.loading,
    matchedUsers: matchesState.matchedUsers
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getMatchedUserProfileData: () => dispatch(getMatchedUserProfileData(true)),
    blockUser: (params) => dispatch(blockUser(params, null, null, null, true)),
    unblockUserForLikeTab: (params) => dispatch(unblockUserForLikeTab(params, null, null, true)),
    matchedUserResetData: () => dispatch(matchedUserResetData()),
    proformUnmatchUser: (params) => dispatch(proformUnmatchUser(params, null, null, null, null, null, true))
})

/**Main Matches Container */
const MatchesContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Matches);

export default MatchesContainer;