import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material'
import { ImageListItem, ImageList } from '@mui/material'
import { Flexbox, ImageBox, TextBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import moment from "moment"

import Seen from "../../assets/seen.png";
import SeenImage from "../../assets/seen-image.png";
import DeliveredImage from "../../assets/delivered-image.png";
import Delivered from "../../assets/delivered.png";
import UserImage from "../../assets/user.jpg";

const Message = ({ message, next }) => {

    const socket = useContext(SocketContext)

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)

    const [hover, setHover] = useState(false)
    const [readBy, setReadBy] = useState(message.readBy)

    const consecutiveMessage = !(message.senderId === next?.senderId)
    const currentUserMessage = (user.id === message.senderId)

    const dateFormat = "YYYY-MM-DD HH:mm:ss"
    const start = moment(message.createdAt).format(dateFormat)
    const end = moment(next?.createdAt).format(dateFormat)
    const duration = moment(end).diff(start, 'hours');

    const updateRecentMessage = useCallback(() => {
        if (message.senderId !== user.id && (chat.otherMembers + 1) !== readBy.length && !readBy.includes(user.id)) {
            setTimeout(() => {
                message.readBy.push(user.id)
                socket.emit("readMessage", message)
            }, 1000)
        }
        // eslint-disable-next-line
    }, [socket, message._id])

    const updateReadBy = useCallback(() => {
        socket.on("getMessageReadby", (details) => {
            if (details._id !== message._id) return;
            setReadBy(details.readBy)
        });
    }, [socket, message._id])

    const latestMessageReadBy = useCallback(() => {
        socket.on("getMessageReadbyAll", (data) => {
            if (data.chatId === message.chatId && data.totalMembers !== readBy.length && !readBy.includes(data.readByUser)) {
                const updatedReadby = [...readBy, data.readByUser]
                setReadBy(updatedReadby)
            }
        })
    }, [socket, message.chatId, readBy])

    useEffect(() => {
        updateRecentMessage()
    }, [updateRecentMessage])

    useEffect(() => {
        updateReadBy()
    }, [updateReadBy])

    useEffect(() => {
        latestMessageReadBy()
    }, [latestMessageReadBy])

    return (
        <>
            <MessageContainer sender={currentUserMessage ? 1 : 0} consecutive={consecutiveMessage ? 1 : 0}>

                {(consecutiveMessage && currentUserMessage) &&
                    < Avatar src={user.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}

                {(consecutiveMessage && !currentUserMessage) &&
                    < Avatar src={chat.otherMembers.filter(member => (member._id === message.senderId))[0]?.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}


                {/* Images */}
                {
                    message.images.length > 0
                    &&
                    <Box sx={{ display: "flex" }}>
                        <ImageBox sender={currentUserMessage ? 1 : 0} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                            <ImageList
                                sx={{ width: 300, height: 300, borderRadius: "10px" }}
                                variant="quilted"
                                cols={4}
                                rowHeight={121}
                            >
                                {message.images.map((image) => (
                                    <ImageListItem key={image} >
                                        <img src={image} loading="lazy" />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        </ImageBox>

                        {message.senderId === user.id &&
                            <Box
                                component="img"
                                sx={{ width: "auto", height: "2vh", alignSelf: "flex-end" }}
                                src={((chat.otherMembers.length + 1) === readBy.length) ? SeenImage : DeliveredImage}
                            />
                        }
                    </Box>
                }

                {/* Text */}
                {
                    message.content
                    &&
                    <TextBox sender={currentUserMessage ? 1 : 0} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        <Flexbox>
                            <Typography sx={{ fontSize: "16px" }}>{message.content}</Typography>
                        </Flexbox>
                        {
                            message.senderId === user.id &&
                            <Box component="img" src={((chat.otherMembers.length + 1) === readBy.length) ? Seen : Delivered} sx={{ width: "auto", height: "2vh" }} />
                        }
                    </TextBox>
                }


                {hover &&
                    <Flexbox sx={{ backgroundColor: "gray", borderRadius: "10px", width: "auto", height: "2vh", opacity: 0.8, padding: "5px" }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 300, opacity: 1, color: "white" }}>
                            {moment(message.createdAt).calendar()}
                        </Typography>
                    </Flexbox>
                }

            </MessageContainer >

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