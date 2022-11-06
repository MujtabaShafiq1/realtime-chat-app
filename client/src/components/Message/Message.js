import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux';
import { Avatar, Typography } from '@mui/material'
import { Flexbox, MessageBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import UserImage from "../../assets/user.jpg";
import moment from "moment"

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
        if (message.senderId !== user.id && (chat.otherMembers.length + 1) !== readBy.length) {
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
    }, [message._id, socket])

    const latestMessageReadBy = useCallback(() => {
        socket.on("getMessageReadbyAll", (data) => {
            if (data.chatId === message.chatId && data.totalMembers > readBy.length) {
                setReadBy(prev => [...prev, data.readByUser])
            }
        })
    }, [socket, message._id, message.chatId, readBy.length])

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


                <MessageBox sender={currentUserMessage ? 1 : 0} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <Typography sx={{ fontSize: "16px" }}>{message.content}</Typography>
                </MessageBox>

                {
                    !readBy.every(id => next?.readBy.includes(id)) &&
                    <>
                        {
                            readBy.map((value) =>
                                (value !== user.id && message.senderId === user.id) &&
                                <div key={value}>
                                    <Avatar
                                        src={(value === user.id ? user?.profilePicture : chat.otherMembers.filter(m => m._id === value)[0]?.profilePicture) || UserImage}
                                        sx={{ width: 20, height: 20, alignSelf: "flex-end" }}
                                    />
                                </div>
                            )

                        }
                    </>
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