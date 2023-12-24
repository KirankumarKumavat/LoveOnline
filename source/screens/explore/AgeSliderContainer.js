import { connect } from "react-redux";
import { filterSetMinMaxAge, filterToggleAnyAge, storeFilterData } from "../../redux/action";
import AgeSlider from "./AgeSlider";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    isAnyAgeSelected: filterState.isAnyAgeSelected,
    minAge: filterState.minAge,
    maxAge: filterState.maxAge,
    isDefaultFilterSetup: filterState.isDefaultFilterSetup,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    filterToggleAnyAge: () => dispatch(filterToggleAnyAge()),
    filterSetMinMaxAge: (minAge, maxAge) => dispatch(filterSetMinMaxAge({ minAge, maxAge })),
    storeFilterData: (filterDetails) => dispatch(storeFilterData({ filterDetails })),
})

/**main Age slider component */
const AgeSliderContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(AgeSlider);

export default AgeSliderContainer;