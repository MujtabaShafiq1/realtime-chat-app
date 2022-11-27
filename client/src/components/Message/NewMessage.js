import { useState, useContext, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { SocketContext } from '../../context/Socket'
import { chatActions } from '../../store/chatSlice'
import { Flexbox } from '../../misc/MUIComponents'
import { Box, Avatar, TextField, IconButton, InputAdornment, CircularProgress } from "@mui/material"
import CustomSnackbar from '../UI/CustomSnackbar'
import axios from 'axios'

import SendIcon from "../../assets/send.png"
import GalleryIcon from "../../assets/gallery.png"
import RemoveCircleIcon from "../../assets/remove-circle.png"

const NewMessage = () => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)

    const [files, setFiles] = useState([])
    const [newMessage, setNewMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, details: "" })

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

    const uploadImages = async () => {
        if (files.length > 0) {
            setLoading(true)
            const list =
                await Promise.all(
                    files.map(async (image) => {
                        const data = new FormData();
                        data.append("file", image);
                        data.append("upload_preset", "chatting-app");
                        data.append("cloud_name", "dkai1pma6");
                        const response = await axios.post("https://api.cloudinary.com/v1_1/dkai1pma6/image/upload", data)
                        const { url } = response.data
                        return url;
                    })
                );
            setLoading(false)
            setFiles([])
            return list;
        }
    }

    const selectImage = (data) => {
        if ((files.length + data.length) <= 12) {
            setFiles((prev) => [...prev, ...data])
            return;
        }
        setSnackbar({ open: true, details: "Maximum 12 pictures allowed" })
        setTimeout(() => {
            setSnackbar({ open: false, details: "" })
        }, 2000)
    }


    const messageHandler = async () => {
        if ((newMessage?.trim().length > 0 || files.length > 0) && !loading) {

            let newChat

            const imageList = await uploadImages()

            if (!chat.chatId) {
                console.log("creating newChat")
                const response = await axios.post(`${process.env.REACT_APP_SERVER}/chat`, { senderId: user.id, receiverId: chat.otherMembers[0]._id })
                const { _id, isGroupChat } = response.data
                dispatch(chatActions.conversation({ chatId: _id, isGroupChat, otherMembers: chat.otherMembers }))
                newChat = response.data
            }

            const messageBody = {
                chatId: chat.chatId || newChat._id,
                senderId: user.id,
                type: imageList ? "image" : "text",
                images: imageList,
                content: newMessage,
                readBy: [user.id]
            }

            setNewMessage("")

            const messageResponse = await axios.post(`${process.env.REACT_APP_SERVER}/message`, messageBody)

            socket.emit("sendMessage", messageResponse.data);
            socket.emit("latestMessage", { messageBody: messageResponse.data, users: (newChat?.members || [...chat.otherMembers, user.id]) });
            socket.emit("stop typing", (chat.chatId || newChat._id));

        }
    }

    return (
        <>
            {snackbar.open && <CustomSnackbar type="error" details={snackbar.details} />}
            <Box sx={{ position: "sticky", mt: (files.length > 0 ? "1%" : "4%") }}>
                <Flexbox>
                    <Flexbox sx={{ justifyContent: "flex-start", width: "94%", gap: 1, flexWrap: "wrap" }}>
                        {Object.values(files).map((file) => {
                            return (
                                <Box key={file.name}>
                                    <Box
                                        component="img"
                                        sx={{ width: 60, height: 60, border: "2px solid rgba(180,180,180,0.5)", borderRadius: "10px" }}
                                        src={URL.createObjectURL(file)}
                                    />
                                    <Box
                                        key={file.name}
                                        component="img"
                                        sx={{ width: 13, height: 13, position: "absolute", marginLeft: "-0.4%", cursor: "pointer" }}
                                        src={RemoveCircleIcon}
                                        onClick={() => setFiles(prev => Object.values(prev).filter(data => data !== file))}
                                    />
                                </Box>
                            )
                        })}
                    </Flexbox>
                </Flexbox>

                <Flexbox sx={{ gap: 2 }}>

                    <TextField
                        variant="filled"
                        placeholder="Send Message"
                        type="text"
                        size="large"
                        hiddenLabel
                        value={newMessage}
                        onChange={newMessageHandler}
                        InputProps={{
                            disableUnderline: true,
                            autoComplete: "off",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton component="label" >
                                        <Box component="img" src={GalleryIcon} sx={{ height: 30, width: 30 }} />
                                        <input type="file" hidden multiple onChange={(e) => selectImage(e.target.files)} />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: "90%",
                            border: "0.3px solid lightgray",
                        }}
                    />

                    <Flexbox>
                        {loading ?
                            <CircularProgress />
                            :
                            <Avatar sx={{ backgroundColor: "lightblue", cursor: "pointer" }} disabled={loading} onClick={messageHandler}>
                                <Box component="img" src={SendIcon} />
                            </Avatar>
                        }
                    </Flexbox>
                </Flexbox>
            </Box>
        </>
    )
}

export default NewMessage