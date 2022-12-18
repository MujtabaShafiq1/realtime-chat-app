import { useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Avatar, Typography, AvatarGroup } from '@mui/material';
import { LatestText, StyledStatusBadge, UserContainer } from '../../misc/MUIComponents';
import { SocketContext } from '../../context/Socket';

import UserImage from "../../assets/User/user.jpg";

const RecentUserbox = ({ chat, onlineUsers }) => {

    const dispatch = useDispatch()

    const socket = useContext(SocketContext)
    const user = useSelector((state) => state.user.details)

    const [latestMessage, setLatestMessage] = useState(chat.latestMessage)
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })
    const [filteredUser, setFilteredUser] = useState(chat.members.filter(member => member._id !== user.id))


    //latest message user update
    useEffect(() => {
        socket.on("getLatestMessage", (data) => {
            if (chat._id === data.messageBody.chatId) {
                console.log("updating latest message");
                setLatestMessage(data.messageBody)
            }
        })
    }, [socket, chat._id])


    // adding new user in group chat
    useEffect(() => {
        socket.on("getNewuser", (data) => {
            if (chat._id === data.chatId) {
                chat.members.push(data.newUser)
                setFilteredUser(prev => [...prev, data.newUser])
            }
        })
        // eslint-disable-next-line
    }, [dispatch, socket])


    useEffect(() => {
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }))
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
    }, [socket])


    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            justifyContent: "left",
            alignItems: "center",
            marginTop: "5%",
            '&:hover': {
                cursor: "pointer",
                backgroundColor: "rgba(239, 239, 240, 0.8)",
            }
        }}
        >

            <AvatarGroup total={filteredUser.length + (chat.isGroupChat && 1)} sx={{ marginLeft: "3%" }}>
                <StyledStatusBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    show={+(onlineUsers.some(r => r.includes(filteredUser[0]._id)))}
                >
                    <Avatar
                        sx={{ width: 50, height: 50 }}
                        src={filteredUser[0]?.profilePicture || UserImage}
                    />
                </StyledStatusBadge>
            </AvatarGroup>

            <Box>

                <UserContainer>
                    <Box sx={{ gap: 1, display: "flex" }}>
                        {chat.isGroupChat ?
                            <Typography sx={{ fontSize: "18px" }}>
                                You {filteredUser.length >= 1 && <span sx={{ fontSize: "18px" }}>and {filteredUser.length} others</span>}
                            </Typography>
                            :
                            <Typography sx={{ fontSize: "18px" }}>{filteredUser[0].username}</Typography>
                        }
                    </Box>
                    {typingDetails.typing && typingDetails.chatId === chat._id && <Typography sx={{ fontSize: "16px" }} color="green">typing... </Typography>}
                </UserContainer>


                {latestMessage &&
                    <LatestText all={+(chat.members.every(val => latestMessage.readBy.includes(val._id)))}>
                        {(user.id === latestMessage.senderId) ? `You: ` : `${filteredUser[0].username}: `}
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
                    </LatestText>
                }
            </Box >

        </Box >
    )
}

export default RecentUserbox;