import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Avatar, AvatarGroup } from '@mui/material'
import { ChatContainer, Flexbox, StyledStatusBadge } from '../../misc/MUIComponents'
import { SocketContext } from '../../context/Socket';
import { chatActions } from '../../store/chatSlice';

import Messages from '../Message/Messages';
import NewMessage from '../Message/NewMessage';

import UserImage from "../.././assets/User/user.jpg";
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import CircleIcon from '@mui/icons-material/Brightness1';

const Chat = ({ open }) => {

    const dispatch = useDispatch();
    const { socket, onlineUsers } = useContext(SocketContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)
    const [onlineStatus, setOnlineStatus] = useState(false)
    const [filteredUser, setFilteredUser] = useState([])

    // join socket chat room 
    useEffect(() => {
        if (chat.chatId) {
            socket.emit("join chat", chat.chatId);
            setOnlineStatus(chat.otherMembers.some(mem => onlineUsers.includes(mem._id)))
            setFilteredUser(chat.otherMembers)
        }
    }, [chat.chatId, chat.otherMembers, onlineUsers, socket])


    // user online and offline 
    useEffect(() => {
        socket.on("newConnection", (userId) => { if (filteredUser.some(u => u._id === userId)) setOnlineStatus(true) })
        socket.on("disconnectedUser", (userId) => { if (filteredUser.some(u => u._id === userId)) setOnlineStatus(false) })
    }, [socket, filteredUser])


    // adding new user
    useEffect(() => {
        socket.on("getNewUser", (data) => {
            if (chat.chatId === data.chatId) {
                console.log("adding new user")
                setFilteredUser(prev => [...prev, ...data.newUser])
                dispatch(chatActions.addUser(data.newUser))
            }
        })
    }, [dispatch, socket, chat.chatId])


    // remove a user
    useEffect(() => {
        socket.on("getRemovedUser", (data) => {
            if (chat.chatId === data.chatId && !data.removedUsers.includes(user.id)) {
                setFilteredUser(prev => prev.filter(p => !data.removedUsers.includes(p._id)))
                dispatch(chatActions.removeUser(data.removedUsers))
            }
        })
    }, [dispatch, socket, user.id, chat.chatId])


    return (

        <Box sx={{
            flex: 4,
            borderRight: "1px solid",
            borderColor: "secondary.other",
            display: { xs: (!chat.chatId && "none"), sm: "block" }
        }}>

            {chat.otherMembers.length > 0 ?

                <Box sx={{ minHeight: "100vh" }}>

                    <ChatContainer>

                        <BackIcon sx={{ fontSize: "24px", cursor: "pointer", color: "text.primary", display: { xs: "block", sm: "none" } }}
                            onClick={() => dispatch(chatActions.reset())} />


                        <Flexbox gap={1}>

                            <AvatarGroup total={chat.otherMembers.length + (chat.isGroupChat && 1)}>
                                <StyledStatusBadge
                                    overlap="circular"
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    variant="dot"
                                    show={+(onlineStatus)}
                                >
                                    <Avatar src={chat.otherMembers[0]?.profilePicture || UserImage} />
                                </StyledStatusBadge>
                                {chat.isGroupChat && <Avatar sx={{ width: 35, height: 35 }} src={user?.profilePicture || UserImage} />}
                            </AvatarGroup>

                            <Box>
                                {chat.isGroupChat ?
                                    <Typography sx={{ fontSize: "18px" }}>
                                        You
                                        {chat.otherMembers.length >= 1 && <span style={{ fontSize: "18px" }}> and {chat.otherMembers[0].username}</span>}
                                        {chat.otherMembers.length > 1 && <span style={{ fontSize: "18px" }}> + {chat.otherMembers.length - 1} others</span>}
                                    </Typography>
                                    :
                                    <Typography sx={{ fontSize: "18px" }}>{chat.otherMembers[0].username}</Typography>
                                }
                                {onlineStatus && <Typography sx={{ fontSize: "12px", color: "gray" }}>Active Now</Typography>}
                            </Box>

                        </Flexbox>


                        <Flexbox sx={{ gap: 0.2, flexDirection: "column", cursor: "pointer", display: { md: "flex", lg: "none" } }} onClick={open}>
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                        </Flexbox>

                    </ChatContainer>
                    <Messages />
                    <NewMessage />
                </Box>
                :
                <Flexbox sx={{ minHeight: "50vh" }}>
                    <Typography sx={{ fontSize: "32px", color: "text.secondary", textAlign: "center" }}>
                        Please select a conversation to start
                    </Typography>
                </Flexbox>
            }
        </Box >

    )
}

export default Chat