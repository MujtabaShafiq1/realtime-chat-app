import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox, TextBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import ImageGallery from './ImageGallery';
import ImageGrid from './ImageGrid';
import moment from "moment"

import NotifyMark from '@mui/icons-material/DoneAll';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UserImage from "../../assets/User/user.jpg"
import axios from 'axios';

const Message = ({ message, next }) => {

    const { socket } = useContext(SocketContext)

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)

    const [hover, setHover] = useState(false)
    const [gallery, setGallery] = useState(false)
    const [readBy, setReadBy] = useState(message.readBy)

    const consecutiveMessage = !(message.senderId === next?.senderId)
    const currentUserMessage = (user.id === message.senderId)

    const dateFormat = "YYYY-MM-DD HH:mm:ss"
    const duration = moment(moment(next?.createdAt).format(dateFormat)).diff(moment(message.createdAt).format(dateFormat), 'hours');

    // to read message by logged in user
    useEffect(() => {
        const updateMessage = async () => {
            if (!readBy.includes(user.id) && ((chat.otherMembers.length + 1) !== readBy.length)) {
                await axios.put(`${process.env.REACT_APP_SERVER}/message/${message._id}`, { userId: user.id })
                console.log("Before read")
                message.readBy.push(user.id)
                socket.emit("readMessage", { chatId: message.chatId, messageId: message._id, userId: user.id })
            }
        }
        updateMessage()
        // eslint-disable-next-line
    }, [socket])


    // to update readby of all message of all users
    useEffect(() => {
        socket.on("getMessageReadby", (details) => {
            if (details.messageId !== message._id) return;
            console.log("on read by")
            setReadBy(prev => [...prev, details.userId])
        });
    }, [socket, message._id])


    const hideMessageDetails = () => {
        const timeout = setTimeout(() => {
            setHover(false)
        }, 1000)
        return () => clearTimeout(timeout);
    }

    const deleteHandler = () => {
        console.log("deleting");
    }

    return (
        <>
            <MessageContainer sender={+currentUserMessage} consecutive={+consecutiveMessage} >

                {(consecutiveMessage && currentUserMessage && message.type !== "info") &&
                    <Avatar
                        src={user.profilePicture || UserImage}
                        sx={{ alignSelf: "flex-end", display: { xs: "none", sm: "block" } }}
                    />
                }

                {(consecutiveMessage && !currentUserMessage && message.type !== "info") &&
                    <Avatar
                        src={chat.otherMembers.filter(member => (member._id === message.senderId))[0]?.profilePicture || UserImage}
                        sx={{ alignSelf: "flex-end", width: { xs: 20, sm: 50 }, height: { xs: 20, sm: 50 }, }}
                    />
                }

                <Flexbox sx={{ flexDirection: "column", alignItems: currentUserMessage ? "flex-end" : "flex-start", maxWidth: "50%" }}>

                    {/* Images */}
                    {message.images.length > 0 &&
                        <>
                            {gallery && <ImageGallery images={message.images} close={() => setGallery(false)} />}
                            <Box
                                sx={{ display: "flex", flexDirection: "column", m: "1.5% 0%", cursor: "pointer", position: "relative" }}
                                onClick={() => setGallery(true)}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={hideMessageDetails}
                            >
                                {message.images.length === 1 ?
                                    <Box component="img" sx={{ maxWidth: { xs: 250, md: 300 }, maxHeight: { xs: 200, md: 300 } }} src={message.images[0]} />
                                    :
                                    <ImageGrid images={message.images} />
                                }
                                {message.senderId === user.id &&
                                    <NotifyMark sx={{
                                        fontSize: "20px", alignSelf: "flex-end", position: "absolute", top: "90%", right: "4%",
                                        color: ((chat.otherMembers.length + 1) === readBy.length ? "blue" : "gray"),
                                    }} />
                                }
                            </Box>
                        </>
                    }

                    {/* Text */}
                    {(message.content && message.type !== "info") &&
                        <TextBox onMouseEnter={() => setHover(true)} onMouseLeave={hideMessageDetails}>
                            <Flexbox>
                                <Typography sx={{ fontSize: { xs: "14px", sm: "16px" } }}>{message.content}</Typography>
                            </Flexbox>
                            {
                                message.senderId === user.id &&
                                <NotifyMark sx={{
                                    fontSize: "20px", alignSelf: "flex-end", color: ((chat.otherMembers.length + 1) === readBy.length ? "blue" : "gray"),
                                }} />
                            }
                        </TextBox>
                    }

                </Flexbox>

                {hover &&
                    <Flexbox>
                        {message.senderId === user.id && <DeleteForeverIcon sx={{ fontSize: "20px", fill: "red", cursor: "pointer" }} onClick={deleteHandler} />}
                        <Flexbox sx={{ backgroundColor: "gray", borderRadius: "30px", opacity: 0.8, padding: "2px 6px" }}>
                            <Typography sx={{ fontSize: "11px", fontWeight: 300, opacity: 1, color: "white", textAlign: "center" }}>
                                {moment(message.createdAt).calendar()}
                            </Typography>
                        </Flexbox>
                    </Flexbox>
                }

            </MessageContainer >

            {message.type === "info" &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {message.content}
                </Typography>
            }

            {(duration > 2 && next) &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {moment(next?.createdAt).calendar()}
                </Typography>
            }

        </>
    )
}

export default Message