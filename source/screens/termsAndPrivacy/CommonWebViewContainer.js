import { connect } from "react-redux";
import CommonWebView from "./CommonWebView";

/**redux function */
const mapStateToProps = ({ }) => ({

})

/**redux function */
const mapDispatchToProps = (dispatch) => ({

})

/**Main CommonWebView Container */
const CommonWebViewContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(CommonWebView);

export default CommonWebViewContainer;