import { useState, useRef, useEffect, useContext, useCallback } from "react"
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from "../../context/Socket"
import Message from './Message'

import Typing from "../UI/Typing"
import axios from "axios"

const Messages = ({ value }) => {

    const scrollRef = useRef()
    const socket = useContext(SocketContext)

    const [newMessage, setNewMessage] = useState(null)
    const chatId = useSelector((state) => state.chat.chatId)

    const [messages, setMessages] = useState([])
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })

    const getMessages = useCallback(async () => {
        if (!chatId) return setMessages([])
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/message/${chatId}`)
        console.log("fetching all message")
        setMessages(response.data)
    }, [chatId])

    const updateMessages = useCallback(() => {
        if (newMessage?.chatId !== chatId) return;
        setMessages(prev => [...prev, newMessage])
    }, [chatId, newMessage])

    useEffect(() => {
        getMessages()
    }, [getMessages])

    useEffect(() => {
        updateMessages()
    }, [updateMessages])

    useEffect(() => {
        socket.on("getLatestMessage", (data) => setNewMessage(data.messageBody))
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }));
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [socket])

    return (
        <Box sx={{ height: (value ? "79.5vh" : "86.6vh"), overflow: "auto", backgroundColor: "secondary.light" }}>
            {messages.length > 0 ?
                <>
                    <Box sx={{ padding: "15px 15px 0px 15px" }}>
                        {messages.map((message, index) => {
                            return (
                                <Box ref={scrollRef} key={index}>
                                    <Message message={message} next={messages[index + 1]} />
                                </Box>
                            )
                        })}
                        {typingDetails.typing && typingDetails.chatId === chatId && <Typing />}
                    </Box>
                </>
                :
                <Flexbox sx={{ minHeight: "50vh" }}>
                    <Typography sx={{ fontSize: { xs: "20px", lg: "32px" }, color: "gray", opacity: 0.4 }}>
                        No message found
                    </Typography>
                </Flexbox>
            }
        </Box >
    )
}

export default Messages