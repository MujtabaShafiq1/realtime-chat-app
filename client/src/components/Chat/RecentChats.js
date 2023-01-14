import { useDispatch, useSelector } from "react-redux"
import { chatActions } from "../../store/chatSlice"
import { Box, Typography } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"
import RecentUserbox from "../Userbar/RecentUserbox"

const RecentChats = ({ chats }) => {

    const dispatch = useDispatch()

    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)

    const clickHandler = async (selectedChat) => {
        if (selectedChat._id === chat?.chatId) return;
        const { _id, isGroupChat, members, groupAdmin, createdAt } = selectedChat;
        const activeChat = { chatId: _id, isGroupChat, otherMembers: members.filter(member => member._id !== userId), groupAdmin, createdAt }
        dispatch(chatActions.conversation(activeChat))
    }

    return (
        <Box>
            {
                chats.length > 0 ?
                    <>
                        <Typography sx={{ fontSize: "22px", textAlign: "center", m: "3% 0%" }}>Recent Chats</Typography>
                        {chats.map(chat => {
                            return (
                                <Box key={chat._id} onClick={() => clickHandler(chat)}>
                                    <RecentUserbox chat={chat} members={chat.members.filter(member => member._id !== userId)} />
                                </Box>
                            )
                        })}
                    </>
                    :
                    <Flexbox sx={{ minHeight: "50vh" }}>
                        <Typography sx={{ color: "text.secondary", opacity: 0.8, textAlign: "center", fontSize: "20px" }}>
                            Your recent Chat box is empty
                        </Typography>
                    </Flexbox>
            }
        </Box>
    )
}

export default RecentChats