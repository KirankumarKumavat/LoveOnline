import { connect } from "react-redux";
import { filterAddValueToSpecificList, filterRemoveValueFromSpecificList } from "../../redux/action";
import FilterMarriageGoal from "./FilterMarriageGoal";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
   selectedAboradGoalList: filterState.selectedAboradGoalList,
   selectedMarriageGoalsList: filterState.selectedMarriageGoalsList,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
   filterAddValueToSpecificList: (key, arrayName, selectedValue) => dispatch(filterAddValueToSpecificList({ key, arrayName, selectedValue })),
   filterRemoveValueFromSpecificList: (key, arrayName, selectedValue) => dispatch(filterRemoveValueFromSpecificList({ key, arrayName, selectedValue })),
})

/**Main FilterMarriageGoal Container */
const FilterMarriageGoalContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(FilterMarriageGoal);

export default FilterMarriageGoalContainer;