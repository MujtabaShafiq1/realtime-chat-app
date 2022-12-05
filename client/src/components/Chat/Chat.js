import { useEffect, useContext, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography, AvatarGroup } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from '../../context/Socket';
import axios from 'axios';

import Messages from '../Message/Messages';
import NewMessage from '../Message/NewMessage';

import UserImage from "../.././assets/User/user.jpg";

const Chat = () => {

    const socket = useContext(SocketContext)

    const user = useSelector((state) => state.user)
    const chat = useSelector((state) => state.chat)

    const readAllMessages = useCallback(async () => {
        if (chat.chatId) {
            console.log("reading all message");
            await axios.put(`${process.env.REACT_APP_SERVER}/message/${chat.chatId}`, { userId: user.id })
            socket.emit("join chat", chat.chatId);
        }
    }, [chat.chatId, socket, user.id])

    useEffect(() => {
        readAllMessages()
    }, [readAllMessages])

    return (
        <>
            <Box sx={{ flex: 4, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
                {chat.otherMembers.length > 0 ?
                    <>
                        <Flexbox sx={{
                            justifyContent: "flex-start",
                            gap: 1,
                            boxShadow: "0px 10px 10px rgba(180, 180, 180, 0.4)",
                            backgroundColor: "rgba(239, 239, 240, 0.7)",
                            borderBottom: "0.5px solid rgba(102, 51, 153, 0.1)"
                        }}
                        >
                            {chat.isGroupChat ?
                                <AvatarGroup total={chat.otherMembers.length} sx={{ margin: "1%" }}>
                                    <Avatar src={chat.otherMembers[0].profilePicture || UserImage} />
                                    <Avatar src={chat.otherMembers[1]?.profilePicture || UserImage} />
                                </AvatarGroup>
                                :
                                <Avatar sx={{ margin: "1%" }} src={chat.otherMembers[0].profilePicture || UserImage} />
                            }
                            <Typography sx={{ fontSize: "18px" }}>{chat.otherMembers[0].username}</Typography>
                            {chat.isGroupChat && chat.otherMembers.length > 1
                                && <Typography sx={{ fontSize: "18px", color: "gray" }}>and {chat.otherMembers.length - 1} others</Typography>}
                        </Flexbox>


                        <Box sx={{ minHeight: "93vh", backgroundColor: "rgba(180, 180, 180, 0.3)" }}>
                            <Messages />
                            <NewMessage />
                        </Box>
                    </>
                    :
                    <Flexbox sx={{ minHeight: "50vh" }}>
                        <Typography sx={{ fontSize: "32px", color: "gray", opacity: 0.4 }}>
                            Please select a conversation to start
                        </Typography>
                    </Flexbox>
                }
            </Box>
        </>
    )
}

export default Chat