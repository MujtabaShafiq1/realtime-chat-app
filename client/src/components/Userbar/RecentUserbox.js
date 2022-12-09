import { useState, useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Avatar, Typography, AvatarGroup } from '@mui/material';
import { Flexbox, StyledStatusBadge } from '../../misc/MUIComponents';
import { SocketContext } from '../../context/Socket';

import UserImage from "../../assets/User/user.jpg";

const RecentUserbox = ({ chat, onlineUsers }) => {

    const socket = useContext(SocketContext)
    const userId = useSelector((state) => state.user.details.id)

    const [latestMessage, setLatestMessage] = useState(chat.latestMessage)
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })

    const filteredUser = chat.members.filter(user => user._id !== userId)

    useEffect(() => {
        socket.on("getLatestMessage", (data) => {
            if (chat._id !== data.chatId) return;
            setLatestMessage(data);
        })
    }, [socket, chat._id])

    useEffect(() => {
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }))
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
    }, [socket])


    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            justifyContent: { xs: "center", sm: "left" },
            alignItems: "center",
            marginTop: "5%",
            '&:hover': {
                cursor: "pointer",
                backgroundColor: "rgba(239, 239, 240, 0.8)",
            }
        }}
        >

            <AvatarGroup total={filteredUser.length} sx={{ marginLeft: "3%" }}>
                <StyledStatusBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    show={(onlineUsers.some(r => r.includes(filteredUser[0]._id)) ? 1 : 0)}
                >
                    <Avatar
                        sx={{ width: 50, height: 50 }}
                        src={filteredUser[0]?.profilePicture || UserImage}
                    />
                </StyledStatusBadge>
                {chat.isGroupChat && <Avatar sx={{ width: 50, height: 50 }} src={filteredUser[1]?.profilePicture || UserImage} />}
            </AvatarGroup>


            <Box sx={{ display: { xs: "none", sm: "inline-block" } }}>
                <Flexbox sx={{ justifyContent: "flex-start", gap: 2 }}>
                    <Flexbox gap={1}>
                        <Typography sx={{ fontSize: "18px" }}>{filteredUser[0].username}</Typography>
                        {chat.isGroupChat && filteredUser.length > 1 &&
                            <Typography sx={{ fontSize: "18px", color: "gray" }}>and {filteredUser.length - 1} others</Typography>}
                    </Flexbox>
                    {typingDetails.typing && typingDetails.chatId === chat._id && <Typography sx={{ fontSize: "16px" }} color="green">typing... </Typography>}
                </Flexbox>


                {latestMessage &&
                    <Typography sx={theme => ({ [theme.breakpoints.down(750)]: { display: 'none' }, color: "lightgray" })} >
                        {(userId === latestMessage.senderId) ? `You: ` : `${filteredUser[0].username}: `}
                        {
                            (chat._id === latestMessage.chatId)
                                &&
                                latestMessage.type === "image" ?
                                `Sent an Image`
                                :
                                latestMessage.content.length > 25 ?
                                    latestMessage.content.substring(0, 25) + `...`
                                    :
                                    latestMessage.content
                        }
                    </Typography>
                }
            </Box >

        </Box >
    )
}

export default RecentUserbox;