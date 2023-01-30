import { useState, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { Box, Typography, AvatarGroup } from '@mui/material';
import { LongTypography, StyledStatusBadge, UserAvatar, ChatListContainer, UserContainer } from '../../misc/MUIComponents';
import { chatActions } from "../../store/chatSlice"
import { SocketContext } from '../../context/Socket';
import UserImage from "../../assets/User/user.jpg";

const RecentUserCard = ({ members, chat }) => {

    const dispatch = useDispatch()

    const user = useSelector((state) => state.user.details)
    const chatId = useSelector((state) => state.chat.chatId)
    const { socket, onlineUsers } = useContext(SocketContext)

    const [filteredUser, setFilteredUser] = useState(members)
    const [onlineStatus, setOnlineStatus] = useState(members.some(mem => onlineUsers.includes(mem._id)))
    const [latestMessage, setLatestMessage] = useState(chat.latestMessage)
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })

    //latest message user update
    useEffect(() => {
        socket.on("getLatestMessage", (data) => {
            const { messageBody } = data;
            if (chat._id === messageBody.chatId) {
                console.log("updating latest message");
                if (messageBody.chatId === chatId && !messageBody.readBy.includes(user.id)) messageBody.readBy.push(user.id);
                setLatestMessage(data.messageBody)
            }
        })
        // eslint-disable-next-line
    }, [socket, chat._id])


    //update latest message when deleted
    useEffect(() => {
        socket.on("getUpdatedLatest", (updated) => {
            if (chat._id === updated.chatId) setLatestMessage(updated)
        })
    }, [socket, chat._id])


    // adding new user in group chat
    useEffect(() => {
        socket.on("getNewUser", (data) => {
            if (chat._id === data.chatId) {
                setFilteredUser(prev => [...prev, ...data.newUser])
            }
        })
        // eslint-disable-next-line
    }, [socket])


    // removing user from group chat
    useEffect(() => {
        socket.on("getRemovedUser", (data) => {
            if (chat._id === data.chatId && !data.removedUsers.includes(user.id)) {
                setFilteredUser(prev => prev.filter(m => !data.removedUsers.includes(m._id)))
            }
        })
    }, [socket, chat._id, chat.members, user.id])


    //message read
    useEffect(() => {
        socket.on("getMessageReadby", (details) => {
            if (details.messageId !== latestMessage._id) return;
            setLatestMessage(prev => ({ ...prev, readBy: [...prev.readBy, details.userId] }));
        });
    }, [socket, latestMessage?._id])


    // user online and offline 
    useEffect(() => {
        socket.on("newConnection", (uid) => { if (filteredUser.some(filtered => filtered._id === uid)) setOnlineStatus(true) })
        socket.on("disconnectedUser", (uid) => { if (filteredUser.some(u => u._id === uid)) setOnlineStatus(false) })
    }, [socket, filteredUser])


    // typing status of user
    useEffect(() => {
        socket.on("typing", (details) => setTypingDetails(details));
        socket.on("stop typing", (details) => setTypingDetails(details));
    }, [socket])


    // select chat 
    const clickHandler = (selectedChat) => {
        if (selectedChat._id === chatId) return;
        if (latestMessage?._id && !latestMessage.readBy.includes(user.id))
            setLatestMessage(prev => ({ ...prev, readBy: [...prev.readBy, user.id] }));

        const { _id, isGroupChat, groupAdmin, createdAt } = selectedChat;
        const activeChat = { chatId: _id, isGroupChat, otherMembers: filteredUser, groupAdmin, createdAt }
        dispatch(chatActions.conversation(activeChat))
    }

    return (
        <UserContainer sx={{ justifyContent: "left", gap: 2 }} onClick={() => clickHandler(chat)}>

            <AvatarGroup total={filteredUser.length + (chat.isGroupChat && 1)} >
                <StyledStatusBadge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    variant="dot"
                    show={+(onlineStatus)}
                >
                    <UserAvatar src={(filteredUser.length > 0) ? (filteredUser[0]?.profilePicture || UserImage) : (user.profilePicture || UserImage)} />
                </StyledStatusBadge>
            </AvatarGroup>

            <Box sx={{ overflow: "hidden" }}>
                <ChatListContainer>
                    <Box sx={{ gap: 1, display: "flex" }}>
                        {chat.isGroupChat ?
                            <Typography variant='subBody'>You {filteredUser.length >= 1 && ` and ${filteredUser.length} others`}</Typography>
                            :
                            <Typography variant='subBody'>{filteredUser[0].username}</Typography>
                        }
                    </Box>
                    {typingDetails?.typer && typingDetails.chatId === chat._id && <Typography sx={{ fontSize: "16px" }} color="green">typing... </Typography>}
                </ChatListContainer>

                {latestMessage &&
                    <LongTypography all={+(chat.members.length <= latestMessage.readBy.length)}>
                        {latestMessage.type !== "info" && ((user.id === latestMessage.senderId) ?
                            `You: ` : `${filteredUser.filter(u => u._id === latestMessage.senderId)[0].username}: `)
                        }
                        {(chat._id === latestMessage.chatId) && (latestMessage.type === "image") ? `Sent an Image` : latestMessage.content}
                    </LongTypography>
                }
            </Box>

        </UserContainer >
    )
}

export default RecentUserCard;