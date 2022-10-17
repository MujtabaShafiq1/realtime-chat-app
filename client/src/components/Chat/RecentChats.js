import { useState, useEffect, useContext, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { chatActions } from "../../store/chatSlice"
import { SocketContext } from "../../context/Socket"
import { Box, Typography } from "@mui/material"
import axios from "axios"

import { Flexbox } from "../../misc/MUIComponents"
import RecentUserbox from "../Userbar/RecentUserbox"

const RecentChats = () => {

    const dispatch = useDispatch()
    const socket = useContext(SocketContext);

    const [chats, setChats] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])

    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)
    const [newChat, setNewChat] = useState(false)

    const fetchUsers = useCallback(async () => {
        socket.on("getLatestMessage", (data) => {
            setNewChat(true)
            dispatch(chatActions.latestMessages(data))
            // console.log("emitting")
        })
        // console.log("executing fetch users");
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/chat/${userId}`)
        setChats(response.data)
        // eslint-disable-next-line
    }, [userId, socket, dispatch, newChat])

    useEffect(() => {
        socket.on("getUsers", (users) => setOnlineUsers(users))
    })

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    const clickHandler = async (selectedChat) => {
        if (selectedChat._id === chat?.chatId) return;
        await axios.put(`${process.env.REACT_APP_SERVER}/message/${selectedChat._id}`, { userId: userId })
        dispatch(chatActions.openChat(selectedChat.members.filter(user => user._id !== userId)[0]))
        dispatch(chatActions.conversation(selectedChat))
    }

    return (
        <Box sx={{ height: "80vh", overflow: "auto" }}>
            {chats.length > 0 ?
                <>
                    <Typography sx={{ fontSize: "18px", textAlign: "center" }}>Recent Chats</Typography>
                    {chats.map(chat => {
                        return (
                            <Box key={chat._id} onClick={() => clickHandler(chat)}>
                                <RecentUserbox chat={chat} onlineUsers={onlineUsers} />
                            </Box>
                        )
                    })}
                </>
                :
                <Flexbox>Your recent Chat box is empty</Flexbox>
            }
        </Box >
    )
}

export default RecentChats