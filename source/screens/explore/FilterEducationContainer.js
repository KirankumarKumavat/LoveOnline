import { connect } from "react-redux";
import { filterAddEducationData, filterEducationRemoveData, } from "../../redux/action";
import FilterEducation from "./FilterEducation";
import { getEducationData, } from "../../redux/operation";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    loading: filterState.loading,
    educationData: filterState.educationData,
    selectedEducationData: filterState.selectedEducationData
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    getEducationData: () => dispatch(getEducationData(true)),
    filterAddEducationData: (education) => dispatch(filterAddEducationData({ education })),
    filterEducationRemoveData: (education) => dispatch(filterEducationRemoveData({ education }))
})

/**Main FilterEducation Container */
const FilterEducationContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(FilterEducation);

export default FilterEducationContainer;