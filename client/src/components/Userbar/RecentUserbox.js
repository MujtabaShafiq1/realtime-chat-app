import { useState, useContext, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Box, Avatar, Typography } from '@mui/material';
import { Flexbox, StyledStatusBadge } from '../../misc/MUIComponents';
import { SocketContext } from '../../context/Socket';
import UserImage from "../../assets/user.jpg";

const RecentUserbox = ({ chat, onlineUsers }) => {

    const socket = useContext(SocketContext)
    const userId = useSelector((state) => state.user.details.id)

    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })
    const [latestMessage, setLatestMessage] = useState(chat.latestMessage)

    const filteredUser = chat.members.filter(user => user._id !== userId)[0]

    const fetchLatestMessage = useCallback(() => {
        socket.on("getLatestMessage", (data) => {
            if (chat._id !== data.chatId) return;
            setLatestMessage(data);
        })
    }, [socket, chat._id])

    useEffect(() => {
        fetchLatestMessage()
    }, [fetchLatestMessage])

    useEffect(() => {
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }));
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
    })

    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            marginTop: "5%",
            '&:hover': {
                cursor: "pointer",
                backgroundColor: "rgba(239, 239, 240, 0.8)",
            }
        }}
        >

            <StyledStatusBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                show={(onlineUsers.some(r => r.includes(filteredUser._id)) ? 1 : 0)}
                sx={{ marginLeft: "3%" }}
            >
                <Avatar
                    sx={{ width: 50, height: 50 }}
                    src={filteredUser.profilePicture || UserImage}
                />
            </StyledStatusBadge>

            <Box>
                <Flexbox sx={{ justifyContent: "flex-start", gap: 2 }}>
                    <Typography sx={{ fontSize: "18px" }}>{filteredUser.username}</Typography>
                    {typingDetails.typing && typingDetails.chatId === chat._id && <Typography sx={{ fontSize: "16px" }} color="green">typing... </Typography>}
                </Flexbox>

                <Flexbox sx={{ justifyContent: "flex-start", gap: 1 }}>
                    {/* fix username */}
                    {/* <Typography color={(chat.members.every(val => latestMessage.readBy.includes(val._id))) ? "lightgray" : "black"} sx={{ fontSize: "16px", fontWeight: 500 }}> */}
                    <Typography color="lightgray" sx={{ fontSize: "16px", fontWeight: 500 }}>
                        {(userId === latestMessage.senderId) ? `You: ` : `${filteredUser.username}: `}
                        {(chat._id === latestMessage.chatId) && (latestMessage?.content).substring(0, 25)}
                        {(latestMessage.content).length > 25 && `...`}
                    </Typography>
                </Flexbox>
            </Box>

        </Box >
    )
}

export default RecentUserbox;