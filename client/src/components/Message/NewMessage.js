import { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SocketContext } from '../../context/Socket'
import { chatActions } from '../../store/chatSlice'
import { Flexbox } from '../../misc/MUIComponents'
import SendIcon from "../../assets/send.png"
import { Box, Avatar, TextField } from "@mui/material"
import axios from 'axios'


const NewMessage = () => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const [newMessage, setNewMessage] = useState("")

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)


    useEffect(() => {
        const timeout = setTimeout(() => {
            if (newMessage.length > 0) {
                socket.emit("typing", { chatId: chat.chatId, members: chat?.users });
            }
        }, 1000);
        return () => clearTimeout(timeout);
    }, [newMessage, chat.chatId, socket, chat?.users]);


    const newMessageHandler = (e) => {
        if (e.target.value.length === 0) {
            socket.emit("stop typing", { chatId: chat.chatId, members: chat?.users });
        }
        setNewMessage(e.target.value)
    }

    const messageHandler = async () => {
        if (newMessage?.trim().length > 0) {

            let newChat

            if (!chat?.chatId) {
                const response = await axios.post(`${process.env.REACT_APP_SERVER}/chat`, { senderId: user.id, receiverId: chat.selectedUser._id })
                dispatch(chatActions.conversation(response.data))
                newChat = response.data
            }

            const messageBody = { chatId: chat.chatId || newChat._id, senderId: user.id, content: newMessage, readBy: [user.id], users: chat.users }

            setNewMessage("")

            const messageResponse = await axios.post(`${process.env.REACT_APP_SERVER}/message`, messageBody)
            await axios.put(`${process.env.REACT_APP_SERVER}/chat/${chat.chatId || newChat._id}`, { latestMessage: messageResponse.data._id })


            socket.emit("sendMessage", messageResponse.data);
            socket.emit("latestMessage", { messageBody: messageResponse.data, users: (newChat?.members || chat.users) });

            dispatch(chatActions.addMessage(messageResponse.data))
        }
        socket.emit("stop typing", chat?.chatId);
    }


    return (
        <>

            <Flexbox sx={{ gap: 2, padding: "0px 10px" }}>

                <TextField
                    variant="filled"
                    placeholder="Send Message"
                    type="text"
                    size="large"
                    hiddenLabel
                    value={newMessage}
                    onChange={newMessageHandler}
                    InputProps={{ disableUnderline: true, autoComplete: "off" }}
                    sx={{
                        width: "90%",
                        marginBottom: "1%",
                        border: "0.3px solid lightgray",
                    }}
                />

                <Flexbox>
                    <Avatar sx={{ backgroundColor: "lightblue", cursor: "pointer" }} onClick={messageHandler}>
                        <Box component="img" src={SendIcon} />
                    </Avatar>
                </Flexbox>

            </Flexbox>
        </>
    )
}

export default NewMessage