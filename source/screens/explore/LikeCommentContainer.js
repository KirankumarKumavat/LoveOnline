import { connect } from "react-redux";
import { sendLike } from "../../redux/operation";
import LikeComment from "./LikeComment";
/**redux function */
const mapStateToProps = ({ exploreState }) => ({
    loading: exploreState.loading,
})

/**redux function */
const mapDispatchToProps = (dispatch) => ({
    sendLike: (params, isQuestion, otherParams) => dispatch(sendLike(params, isQuestion, otherParams))
})

/**Main LikeComment Container */
const LikeCommentContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(LikeComment);

export default LikeCommentContainer;