import { connect } from "react-redux";
import { chatSetSearchedArrayList } from "../../redux/action";
import { getChatUsers, validateReceiptApicall } from "../../redux/operation";
import Chat from "./Chat";

/**reduc function */
const mapStateToProps = ({ chatState }) => ({
    loading: chatState.loading,
    users: chatState.users,
})

/**reduc function */
const mapDispatchToProps = (dispatch) => ({
    getChatUsers: () => dispatch(getChatUsers()),
    chatSetSearchedArrayList: (users) => dispatch(chatSetSearchedArrayList({ users })),
    validateReceiptApicall: () => dispatch(validateReceiptApicall())
})

/**main Chat-ContactList container */
const ChatContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Chat);

export default ChatContainer;