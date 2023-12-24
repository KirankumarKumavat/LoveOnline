import { connect } from "react-redux";
import GenderSelection from "./GenderSelection";

/**redux function */
const mapStateToProps = (state) => {
    return {
    }
}

/**redux function */
const mapDispatchToProps = (dispatch) => ({

})

/**Main GenderSelection Container */
const GenderSelectionContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(GenderSelection);

export default GenderSelectionContainer;