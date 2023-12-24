import { connect } from "react-redux";
import { filterAddCountryToList, filterRemoveCountryFromList, filterSetMinMaxLocationDistance, filterToggleLocationIndex, storeFilterData } from "../../redux/action";
import Location from "./Location";

/**redux function */
const mapStateToProps = ({ filterState }) => ({
    selectedLocationIndex: filterState.selectedLocationIndex,
    minLocation: filterState.minLocation,
    maxLocation: filterState.maxLocation,
    selectedCountryList: filterState.selectedCountryList,
    isDefaultFilterSetup: filterState.isDefaultFilterSetup,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    filterToggleLocationIndex: (selectedLocationIndex) => dispatch(filterToggleLocationIndex({ selectedLocationIndex })),
    filterSetMinMaxLocationDistance: (minLocation, maxLocation) => dispatch(filterSetMinMaxLocationDistance({ minLocation, maxLocation })),
    filterAddCountryToList: (country) => dispatch(filterAddCountryToList({ country })),
    filterRemoveCountryFromList: (country) => dispatch(filterRemoveCountryFromList({ country })),
    storeFilterData: (filterDetails) => dispatch(storeFilterData({ filterDetails })),
})

/**Main Location Container */
const LocationContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Location);

export default LocationContainer;