import { connect } from "react-redux";
import { likeChangeSelectedIndex, likeRequest, likeResetData, likeResetSpecificTabList, likeSetSearchUserList } from "../../redux/action";
import { getUserListForLikeTab, removeUserFromListForLikeTab, unblockUserForLikeTab, validateReceiptApicall } from "../../redux/operation";
import Like from "./Like";

/**redux function */
const mapStateToProps = ({ likeState }) => ({
    selectedTabIndex: likeState.selectedTabIndex,
    likedYouData: likeState.likedYouData,
    passedByYouData: likeState.passedByYouData,
    likedByYouData: likeState.likedByYouData,
    blockedByYouData: likeState.blockedByYouData,
    loading: likeState.loading
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    likeChangeSelectedIndex: (selectedTabIndex) => dispatch(likeChangeSelectedIndex({ selectedTabIndex })),
    getUserListForLikeTab: (params) => dispatch(getUserListForLikeTab(params)),
    likeSetSearchUserList: (searchedArray, arrayName) => dispatch(likeSetSearchUserList({ searchedArray, arrayName })),
    resetData: () => dispatch(likeResetData()),
    unblockUserForLikeTab: (params) => dispatch(unblockUserForLikeTab(params)),
    likeResetSpecificTabList: (arrayName) => dispatch(likeResetSpecificTabList({ arrayName })),
    removeUserFromListForLikeTab: (params, finalParams) => dispatch(removeUserFromListForLikeTab(params, finalParams)),
    likeRequest: () => dispatch(likeRequest()),
    validateReceiptApicall: () => dispatch(validateReceiptApicall())
})

/**Main Like Tab Container */
const LikeContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Like);

export default LikeContainer;