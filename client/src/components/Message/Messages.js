import { useState, useRef, useEffect, useContext, useCallback } from "react"
import { useSelector, useDispatch } from 'react-redux'
import { chatActions } from "../../store/chatSlice"
import { Box, Typography } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import { SocketContext } from "../../context/Socket"
import Message from './Message'
import Typing from "../UI/Typing"
import axios from "axios"

const Messages = () => {

    const scrollRef = useRef()

    const dispatch = useDispatch()
    const socket = useContext(SocketContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)

    const [messages, setMessages] = useState([])
    // const [receivedMessage, setReceivedMessage] = useState(null)
    const [typingDetails, setTypingDetails] = useState({ typing: false, chatId: null })

    const getMessages = useCallback(async () => {

        socket.on("getMessage", async (data) => {
            console.log(data);
            // setReceivedMessage(data)
            // dispatch(chatActions.updateReadBy({ chatId: data.chatId, messageId: data._id, userId: user.id }))
            // await axios.put(`${process.env.REACT_APP_SERVER}/message/${data.chatId}`, { userId: user.id })
        });

        if (!chat.chatId) return setMessages([])

        const response = await axios.get(`${process.env.REACT_APP_SERVER}/message/${chat.chatId}`)
        console.log(response.data.length)
        setMessages(response.data)

    }, [socket, chat.chatId])

    useEffect(() => {
        getMessages()
    }, [getMessages])

    useEffect(() => {
        socket.on("typing", (chatId) => setTypingDetails({ typing: true, chatId: chatId }));
        socket.on("stop typing", (chatId) => setTypingDetails({ typing: false, chatId: chatId }));
        scrollRef.current?.scrollIntoView({ behavior: "smooth" })
    })

    // useEffect(() => {
    //     if (receivedMessage && receivedMessage.chatId === chat.chatId) {
    //         dispatch(chatActions.addMessage(receivedMessage))
    //     }
    //     // eslint-disable-next-line
    // }, [receivedMessage, socket, dispatch, chat.chatId]);

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