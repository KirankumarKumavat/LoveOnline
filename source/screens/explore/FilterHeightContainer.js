import { connect } from "react-redux";
import { filterSetMinMaxHeightValue } from "../../redux/action";
import FilterHeight from "./FilterHeight";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    maxHeight: filterState.maxHeight,
    minHeight: filterState.minHeight,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    filterSetMinMaxHeight: (minHeight, maxHeight) => dispatch(filterSetMinMaxHeightValue({ minHeight, maxHeight }))
})

/**Main FilterHeight Container */
const FilterHeightContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilterHeight);

export default FilterHeightContainer;