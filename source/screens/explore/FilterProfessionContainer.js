import { connect } from "react-redux";
import FilterProfession from "./FilterProfession";
import { filterAddProffestionData, filterProffestioRemoveData, getFilterArray, profileSetupIncreaseIndex, selectProffestionIndex } from "../../redux/action";
import { getUserProfesstionData, saveProfileSetupDetails } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    proffestionData: filterState.proffestionData,
    loading: filterState.loading,
    selectedProffestionData: filterState.selectedProffestionData,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getProffestionData: () => dispatch(getUserProfesstionData(true)),
    filterAddProffestionData: (proffestion) => dispatch(filterAddProffestionData({ proffestion })),
    filterProffestioRemoveData: (proffestion) => dispatch(filterProffestioRemoveData({ proffestion })),
    getFilterArray: () => dispatch(getFilterArray())
})

/**Main FilterProfession Container */
const FilterProfessionContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilterProfession);

export default FilterProfessionContainer;