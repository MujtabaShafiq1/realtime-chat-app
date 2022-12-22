import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import { Box, Typography, Avatar, ImageListItem, ImageList } from '@mui/material'
import { Flexbox, TextBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import ImageGallery from './ImageGallery';
import moment from "moment"

import NotifyMark from '@mui/icons-material/DoneAll';
import UserImage from "../../assets/User/user.jpg"
import axios from 'axios';

const Message = ({ message, next }) => {

    const socket = useContext(SocketContext)

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
            if (!readBy.includes(user.id)) {
                await axios.put(`${process.env.REACT_APP_SERVER}/message/${message._id}`, { userId: user.id })
                console.log("Before read")
                message.readBy.push(user.id)
                socket.emit("readMessage", message)
            }
        }
        updateMessage()
    }, [socket, message, readBy, user.id])


    // to update readby of all message of all users
    useEffect(() => {
        socket.on("getMessageReadby", (details) => {
            if (details._id !== message._id) return;
            console.log("on read by")
            setReadBy(details.readBy)
        });
    }, [socket, message._id])


    function srcset(image, size = 148, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
        };
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
                                onMouseLeave={() => setHover(false)}
                            >
                                {message.images.length === 1 ?
                                    <Box
                                        component="img"
                                        sx={{ maxWidth: { xs: 250, md: 300 }, maxHeight: { xs: 200, md: 300 }, borderRadius: "8px" }}
                                        src={message.images[0]}
                                    />
                                    :
                                    <ImageList
                                        sx={{
                                            width: { xs: 250, md: 500 },
                                            height: { xs: 200, md: 300 },
                                        }}
                                        variant="quilted"
                                        cols={4}
                                    >
                                        <ImageListItem cols={2} rows={2} >
                                            <img
                                                {...srcset(message.images[0])}
                                                loading="lazy"
                                                alt=""
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </ImageListItem>
                                        <ImageListItem
                                            cols={(message.images.length === 2 || message.images.length === 3) ? 2 : 1}
                                            rows={message.images.length === 2 ? 2 : 1}
                                        >
                                            <img
                                                {...srcset(message.images[1])}
                                                loading="lazy"
                                                alt=""
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </ImageListItem>
                                        {message.images[2] &&
                                            <ImageListItem
                                                cols={message.images.length === 3 ? 2 : 1}
                                                rows={1}
                                            >
                                                <img
                                                    {...srcset(message.images[2])}
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ borderRadius: "8px" }}
                                                />
                                            </ImageListItem>
                                        }
                                        {message.images[3] &&
                                            <ImageListItem cols={2} rows={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                                                <img
                                                    {...srcset(message.images[3])}
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ borderRadius: "8px" }}
                                                />
                                                {message.images.length > 4 &&
                                                    <Flexbox
                                                        sx={{ backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", height: "100%", width: "100%", borderRadius: "8px" }}>
                                                        <Typography sx={{ fontSize: "28px", color: "white", fontWeight: 400, opacity: 0.7 }}>
                                                            + {message.images.length - 4}
                                                        </Typography>
                                                    </Flexbox>
                                                }
                                            </ImageListItem>
                                        }
                                    </ImageList>
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
                        <TextBox onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
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
                    <Flexbox sx={{ backgroundColor: "gray", borderRadius: "30px", width: "auto", height: "auto", opacity: 0.8, padding: "4px" }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 300, opacity: 1, color: "white", textAlign: "center" }}>
                            {moment(message.createdAt).calendar()}
                        </Typography>
                    </Flexbox>
                }

            </MessageContainer >

            {
                message.type === "info" &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, opacity: 1, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {message.content}
                </Typography>
            }

            {
                (duration > 2 && next)
                &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, opacity: 1, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {moment(next?.createdAt).calendar()}
                </Typography>
            }
        </>
    )
}

export default Message