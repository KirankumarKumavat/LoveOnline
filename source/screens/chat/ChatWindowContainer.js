import { connect } from "react-redux";
import { chatAddBadgeToList, chatBadGeListReset, chatGetNewMessage, chatRemoveBadgeFromList, resetChatMessages } from "../../redux/action";
import { assignBadgeToUser, blockUser, checkMatchStatus, getAppStatus, getMessagsList, proformUnmatchUser, sendTypingStatus, unblockUserForLikeTab } from "../../redux/operation";
import ChatWindow from "./ChatWindow";

/**redux functions */
const mapStateToProps = ({ chatState }) => ({
   loading: chatState.loading,
   messages: chatState.messages,
   selectedBadgeList: chatState.selectedBadgeList,
})

/**redux functions */
const mapDispatchToProps = (dispatch) => ({
   resetChatMessages: () => dispatch(resetChatMessages()),
   getMessagsList: (receiver_id, page_no) => dispatch(getMessagsList(receiver_id, page_no)),
   sendNewMessage: (message) => dispatch(chatGetNewMessage({ message })),
   blockUser: (params, isFromLike, likeParams) => dispatch(blockUser(params, isFromLike, likeParams, true)),
   chatAddBadgeToList: (badge) => dispatch(chatAddBadgeToList({ badge })),
   chatRemoveBadgeFromList: (badge) => dispatch(chatRemoveBadgeFromList({ badge })),
   chatBadGeListReset: () => dispatch(chatBadGeListReset()),
   assignBadgeToUser: (params) => dispatch(assignBadgeToUser(params)),
   unblockUserForLikeTab: (params) => dispatch(unblockUserForLikeTab(params, null, true)),
   getAppStatus: (params) => dispatch(getAppStatus(params)),
   sendTypingStatus: (params) => dispatch(sendTypingStatus(params)),
   checkMatchStatus: (params) => dispatch(checkMatchStatus(params)),
   proformUnmatchUser: (params) => dispatch(proformUnmatchUser(params, null, true,))
})

/**main chat window container */
const ChatWindowContainer = connect(
   mapStateToProps,
   mapDispatchToProps,
)(ChatWindow);

export default ChatWindowContainer;