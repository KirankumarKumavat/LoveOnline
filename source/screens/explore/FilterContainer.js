import { connect } from "react-redux";
import { exploreResetUserList, exploreSetEmptyData, filterAddValueToSpecificList, filterRemoveValueFromSpecificList, filterResetData, filterToggleBlurPhoto, getFilterArray, likeResetData, storeFilterData, exploreSetNoMoreDataForList } from "../../redux/action";
import { getOppositeGenderDetails, getUserListForLikeTab } from "../../redux/operation";
import Filter from "./Filter";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    isBlurPhoto: filterState.isBlurPhoto,
    selectedEthnicityList: filterState.selectedEthnicityList,
    selectedMarriageGoalsList: filterState.selectedMarriageGoalsList,
    selectedMaritalStatusList: filterState.selectedMaritalStatusList,
    filterMiniArray: filterState.filterMiniArray,
    filterPaidArray: filterState.filterPaidArray,
    selectedSpiritualityList: filterState.selectedSpiritualityList,
    seletedPrayList: filterState.seletedPrayList,
    selectedAboradGoalList: filterState.selectedAboradGoalList,
    isDefaultFilterSetup: filterState.isDefaultFilterSetup,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    filterToggleBlurPhoto: () => dispatch(filterToggleBlurPhoto()),
    filterAddValueToSpecificList: (key, arrayName, selectedValue) => dispatch(filterAddValueToSpecificList({ key, arrayName, selectedValue })),
    filterRemoveValueFromSpecificList: (key, arrayName, selectedValue) => dispatch(filterRemoveValueFromSpecificList({ key, arrayName, selectedValue })),
    getFilterArray: () => dispatch(getFilterArray()),
    getOppositeGenderDetails: (params, isFilter, isClearFilter) => dispatch(getOppositeGenderDetails(params, true, isClearFilter)),
    storeFilterData: (filterDetails) => dispatch(storeFilterData({ filterDetails })),
    filterResetData: () => dispatch(filterResetData()),
    getUserListForLikeTab: (params, isClearFilter) => dispatch(getUserListForLikeTab(params, isClearFilter)),
    exploreResetUserList: () => dispatch(exploreResetUserList()),
    exploreSetEmptyData: () => dispatch(exploreSetEmptyData()),
    likeResetData: () => dispatch(likeResetData()),
    exploreSetNoMoreDataForList: (isNoMoreData) => dispatch(exploreSetNoMoreDataForList({ isNoMoreData }))
})

/**Main Filter Container */
const FilterContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Filter);

export default FilterContainer;