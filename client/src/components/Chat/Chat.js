import { useState, useEffect, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, AvatarGroup } from '@mui/material'
import { ChatHeader, Flexbox, UserAvatar, StyledStatusBadge, LongTypography, ChatHeaderContainer } from '../../misc/MUIComponents'
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
            flex: 3.5,
            height: "100%",
            width: "100%",
            borderRight: "1px solid",
            borderColor: "secondary.other",
            flexDirection: "column",
            display: { xs: (!chat.chatId ? "none" : "flex") },
        }}>


            {(chat.otherMembers.length > 0 || chat.chatId) ?

                <>
                    <ChatHeader>

                        <BackIcon sx={{ fontSize: "24px", cursor: "pointer", display: { xs: "block", sm: "none" } }}
                            onClick={() => dispatch(chatActions.reset())} />

                        <AvatarGroup total={chat.otherMembers.length + (chat.isGroupChat && 1)}>
                            <StyledStatusBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                                show={+(onlineStatus)}
                            >
                                <UserAvatar
                                    src={(chat.otherMembers.length > 0) ? (chat.otherMembers[0]?.profilePicture || UserImage) : (user?.profilePicture || UserImage)}
                                />
                            </StyledStatusBadge>
                            {chat.isGroupChat && <UserAvatar src={user?.profilePicture || UserImage} />}
                        </AvatarGroup>


                        <ChatHeaderContainer>
                            {chat.isGroupChat ?
                                <LongTypography>
                                    You
                                    {chat.otherMembers.length >= 1 && ` and ${chat.otherMembers[0].username}`}
                                    {chat.otherMembers.length > 1 && ` + ${chat.otherMembers.length - 1} others`}
                                </LongTypography>
                                :
                                <LongTypography variant='username'>{chat.otherMembers[0].username}</LongTypography>
                            }
                            {onlineStatus && <Typography sx={{ fontSize: "12px", color: "gray" }}>Active Now</Typography>}
                        </ChatHeaderContainer>



                        <Flexbox sx={{ gap: 0.2, flexDirection: "column", cursor: "pointer", display: { md: "flex", lg: "none" } }} onClick={open}>
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                        </Flexbox>

                    </ChatHeader>
                    <Messages />
                    <NewMessage />
                </>
                :
                <Flexbox sx={{ flexGrow: 1 }}>
                    <Typography variant="header" sx={{ color: "text.secondary", textAlign: "center" }}>
                        Please select a conversation to start
                    </Typography>
                </Flexbox>
            }
        </Box >
    )
}

export default Chat