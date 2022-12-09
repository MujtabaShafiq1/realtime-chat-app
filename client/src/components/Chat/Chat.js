import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography, AvatarGroup } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from '../../context/Socket';

import Messages from '../Message/Messages';
import NewMessage from '../Message/NewMessage';

import UserImage from "../.././assets/User/user.jpg";
import CircleBlack from "../.././assets/Message/circle-black.png";

const Chat = ({ open }) => {

    const socket = useContext(SocketContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)

    useEffect(() => {
        if (chat.chatId) socket.emit("join chat", chat.chatId);
    }, [chat.chatId, socket])

    return (
        <>
            <Box sx={{ flex: 4, minHeight: "100vh", backgroundColor: "rgba(239, 239, 240, 0.4)" }}>

                {chat.otherMembers.length > 0 ?

                    <Box>

                        <Flexbox sx={{
                            justifyContent: "space-between",
                            padding: "1% 2%",
                            backgroundColor: "rgba(180, 180, 180, 0.3)",
                            boxShadow: "0px 10px 10px rgba(180, 180, 180, 0.4)",
                            borderBottom: "0.5px solid rgba(102, 51, 153, 0.1)"
                        }}
                        >
                            <Flexbox gap={1}>
                                {chat.isGroupChat ?
                                    <AvatarGroup total={chat.otherMembers.length}>
                                        <Avatar src={user.profilePicture || UserImage} />
                                        <Avatar src={chat.otherMembers[0]?.profilePicture || UserImage} />
                                    </AvatarGroup>
                                    :
                                    <Avatar src={chat.otherMembers[0]?.profilePicture || UserImage} />
                                }
                                <Typography sx={{ fontSize: "18px" }}>{chat.otherMembers[0]?.username || user.username}</Typography>
                                {chat.isGroupChat && chat.otherMembers.length > 1
                                    && <Typography sx={{ fontSize: "18px", color: "gray" }}>and {chat.otherMembers.length - 1} others</Typography>}
                            </Flexbox>

                            <Flexbox sx={{ gap: 0.2, flexDirection: "column", cursor: "pointer", display: { md: "flex", lg: "none" } }} onClick={open}>
                                <Box component="img" src={CircleBlack} sx={{ height: 6 }} />
                                <Box component="img" src={CircleBlack} sx={{ height: 6 }} />
                                <Box component="img" src={CircleBlack} sx={{ height: 6 }} />
                            </Flexbox>

                        </Flexbox>

                        <Messages />
                        <NewMessage />
                    </Box>
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