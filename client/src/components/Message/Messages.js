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
    const socket = useContext(SocketContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)

    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState()
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })

    const getMessages = useCallback(async () => {
        if (!chat.chatId) return setMessages([])
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/message/${chat.chatId}`)
        console.log("fetching all message")
        setMessages(response.data)
    }, [chat.chatId])

    const newMessageHandler = useCallback(() => {
        socket.on("getMessage", (data) => setNewMessage(data));
    }, [socket])

    const updateMessages = useCallback(async () => {
        if (newMessage?.chatId !== chat.chatId) return;
        await axios.put(`${process.env.REACT_APP_SERVER}/message/${newMessage.chatId}`, { userId: user.id })
        console.log("updating message");
        setMessages(prev => [...prev, newMessage])
        // eslint-disable-next-line
    }, [user.id, newMessage])

    useEffect(() => {
        getMessages()
    }, [getMessages])

    useEffect(() => {
        newMessageHandler()
    }, [newMessageHandler])

    useEffect(() => {
        updateMessages()
    }, [updateMessages])

    useEffect(() => {
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }));
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    return (
        <Box padding="30px">
            {messages.length > 0 ?
                <>
                    <Box sx={{ height: "80vh", overflow: "auto" }}>
                        {messages.map((message, index) => {
                            return (
                                <Box ref={scrollRef} key={index}>
                                    <Message message={message} next={messages[index + 1]} />
                                </Box>
                            )
                        })}
                        {typingDetails.typing && typingDetails.chatId === chat.chatId && <Typing />}
                    </Box>
                </>
                :
                <Flexbox sx={{ minHeight: "80vh" }}>
                    <Typography sx={{ fontSize: "24px", color: "gray", opacity: 0.4 }}>
                        No message found
                    </Typography>
                </Flexbox>
            }
        </Box >
    )
}

export default Messages