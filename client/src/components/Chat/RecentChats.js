import { useState, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { chatActions } from "../../store/chatSlice"
import { SocketContext } from "../../context/Socket"
import { Box, Typography } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"
import RecentUserbox from "../Userbar/RecentUserbox"

const RecentChats = ({ chats }) => {

    const dispatch = useDispatch()
    const socket = useContext(SocketContext);

    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)

    const [onlineUsers, setOnlineUsers] = useState([])

    // get all the online users
    useEffect(() => {
        socket.on("getUsers", (data) => {
            setOnlineUsers(data)
            console.log(data)
        })
    }, [socket])


    const clickHandler = async (selectedChat) => {
        if (selectedChat._id === chat?.chatId) return;
        const { _id, isGroupChat, members, groupAdmin, createdAt } = selectedChat;
        const activeChat = { chatId: _id, isGroupChat, otherMembers: members.filter(member => member._id !== userId), groupAdmin, createdAt }
        dispatch(chatActions.conversation(activeChat))
        socket.emit("readAllMessage", { chatId: _id, readByUser: userId, totalMembers: members.length })
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
                                    <RecentUserbox chat={chat} onlineUsers={onlineUsers} members={chat.members.filter(member => member._id !== userId)} />
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