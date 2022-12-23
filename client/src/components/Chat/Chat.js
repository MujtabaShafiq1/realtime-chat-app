import { useEffect, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Avatar, AvatarGroup } from '@mui/material'
import { ChatContainer, Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from '../../context/Socket';
import { chatActions } from '../../store/chatSlice';

import Messages from '../Message/Messages';
import NewMessage from '../Message/NewMessage';

import UserImage from "../.././assets/User/user.jpg";
import BackIcon from '@mui/icons-material/ArrowBackRounded';
import CircleIcon from '@mui/icons-material/Brightness1';

const Chat = ({ open }) => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)

    const [dynamicHeight, setDynamicHeight] = useState(false)

    useEffect(() => {
        if (chat.chatId) socket.emit("join chat", chat.chatId);
    }, [chat.chatId, socket])


    useEffect(() => {
        socket.on("getNewuser", (data) => {
            if (chat.chatId === data.chatId) {
                console.log("adding new user")
                dispatch(chatActions.addUser(data.newUser))
            }
        })
    }, [dispatch, socket, chat.chatId])

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

                            <AvatarGroup total={chat.otherMembers.length.length + (chat.isGroupChat && 1)}>
                                <Avatar src={chat.otherMembers[0]?.profilePicture || UserImage} />
                                {chat.isGroupChat && <Avatar sx={{ width: 35, height: 35 }} src={user?.profilePicture || UserImage} />}
                            </AvatarGroup>

                            {chat.isGroupChat ?
                                <Typography sx={{ fontSize: "18px" }}>
                                    You
                                    {chat.otherMembers.length >= 1 && <span style={{ fontSize: "18px" }}> and {chat.otherMembers[0].username}</span>}
                                    {chat.otherMembers.length > 1 && <span style={{ fontSize: "18px" }}> + {chat.otherMembers.length - 1} others</span>}
                                </Typography>
                                :
                                <Typography sx={{ fontSize: "18px" }}>{chat.otherMembers[0].username}</Typography>
                            }

                        </Flexbox>

                        <Flexbox sx={{ gap: 0.2, flexDirection: "column", cursor: "pointer", display: { md: "flex", lg: "none" } }} onClick={open}>
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                            <CircleIcon sx={{ fontSize: "7px" }} />
                        </Flexbox>

                    </ChatContainer>
                    <Messages value={dynamicHeight} />
                    <NewMessage open={(value) => setDynamicHeight(value)} />
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