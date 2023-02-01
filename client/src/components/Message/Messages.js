import { useState, useRef, useEffect, useContext, useCallback } from "react"
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from "../../context/Socket"
import Message from './Message'

import Typing from "../UI/Typing"
import axios from "axios"

const Messages = () => {

    const scrollRef = useRef()
    const { socket } = useContext(SocketContext)
    const chat = useSelector((state) => state.chat)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState(null)
    const [typingDetails, setTypingDetails] = useState()


    const getMessages = useCallback(async () => {
        if (!chat.chatId) return setMessages([])
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/message/${chat.chatId}`)
        console.log("fetching all message")
        setMessages(response.data)
    }, [chat.chatId])


    const updateMessages = useCallback(() => {
        if (newMessage?.chatId !== chat.chatId) return;
        setMessages(prev => [...prev, newMessage])
    }, [chat.chatId, newMessage])


    const messageDeletedHandler = useCallback((mId) => {
        if (messages.length < 1) return;
        if (mId === messages[messages.length - 1]._id) {
            socket.emit("updateLatest", { messageBody: messages[messages.length - 2], users: [...chat.otherMembers] });
        }
        socket.off("messageDeleted", messageDeletedHandler);
        setMessages((prev) => prev.filter(m => m._id !== mId))
    }, [socket, messages, chat.otherMembers])


    useEffect(() => {
        getMessages()
    }, [getMessages])


    useEffect(() => {
        updateMessages()
    }, [updateMessages])


    useEffect(() => {
        socket.on("messageDeleted", messageDeletedHandler)
    }, [socket, messageDeletedHandler])


    useEffect(() => {
        socket.on("getLatestMessage", (data) => setNewMessage(data.messageBody))
        socket.on("typing", (details) => setTypingDetails(details));
        socket.on("stop typing", (details) => setTypingDetails(details));
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [socket])


    return (
        <Box sx={{ flexGrow: 1, overflow: "auto", backgroundColor: "secondary.light" }}>
            {(messages.length > 0 && chat.chatId === messages[0].chatId) ?
                <>
                    <Box sx={{ padding: "15px 15px 0px 15px" }}>
                        {messages.map((message, index) => {
                            return (
                                <Box ref={scrollRef} key={index}>
                                    <Message message={message} next={messages[index + 1]} />
                                </Box>
                            )
                        })}
                        {typingDetails?.typer && typingDetails.chatId === chat.chatId && <Typing user={typingDetails.typer} />}
                    </Box>
                </>
                :
                <Flexbox sx={{ height: "100%" }}>
                    <Typography variant="header" sx={{ textAlign: "center", color: "gray", opacity: 0.4 }}>
                        No message found
                    </Typography>
                </Flexbox>
            }
        </Box >
    )
}

export default Messages