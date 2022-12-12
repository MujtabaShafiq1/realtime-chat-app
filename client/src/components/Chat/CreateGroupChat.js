import { useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Avatar } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"
import { SocketContext } from "../../context/Socket";
import { chatActions } from "../../store/chatSlice";
import { createChat } from "../../store/chatActions";
import CustomSnackbar from "../UI/CustomSnackbar"
import axios from "axios"

import UserImage from "../../assets/User/user.jpg";
import AddIcon from "../../assets/Chat/add.png"
import RemoveIcon from "../../assets/Chat/remove.png"
import CloseIcon from "../../assets/Chat/close.png"
import ConfirmUsers from "../../assets/Chat/confirm.png"
import RemoveCircleIcon from "../../assets/Chat/remove-circle.png"

const CreateGroupChat = ({ users, close }) => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext)
    const user = useSelector(state => state.user.details)

    const [addedUsers, setAddedUsers] = useState([])
    const [snackbar, setSnackbar] = useState({ open: false, details: "" })

    const clickHandler = (user) => {
        if (addedUsers.some(member => member._id.includes(user._id))) {
            setAddedUsers(addedUsers.filter(member => member._id !== user._id))
            return;
        }
        setAddedUsers(prev => [...prev, user])
    }

    const createGroup = async () => {
        if (addedUsers.length <= 20) {
            dispatch(chatActions.conversation({ otherMembers: [...addedUsers] }))

            const response = await dispatch(createChat({ senderId: user.id, receiverId: addedUsers.map(user => user._id), isGroupChat: true })).unwrap()
            socket.emit("new chat", response)

            const messageBody = { chatId: response._id, senderId: user.id, type: "info", content: `Group created by ${user.username}`, readBy: [user.id] }
            const messageResponse = await axios.post(`${process.env.REACT_APP_SERVER}/message`, messageBody)
            socket.emit("latestMessage", { messageBody: messageResponse.data, users: [...addedUsers.map(user => user._id), user.id] });

            close();
            return;
        }
        setSnackbar({ open: true, details: "Group Chat Limit Max 20 Users" })
        setTimeout(() => {
            setSnackbar({ open: false, details: "" })
        }, 2000)
    }

    return (
        <>
            {snackbar.open && <CustomSnackbar type="error" details={snackbar.details} />}
            <Flexbox sx={{ justifyContent: "space-around" }}>
                <Typography sx={{ fontSize: "22px", m: "3% 0%" }}>Create New Group</Typography>
                <Box
                    component="img"
                    sx={{ width: 30, height: "auto", cursor: "pointer" }}
                    src={CloseIcon}
                    onClick={close}
                />
            </Flexbox>
            {addedUsers.length > 0
                &&
                <Flexbox sx={{ justifyContent: "space-between", m: "2% 0 5% 0" }}>
                    <Flexbox sx={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 1 }}>
                        {addedUsers.map(user => {
                            return (
                                <Flexbox key={user._id} sx={{ padding: "5px 10px", borderRadius: "20px", backgroundColor: "rgba(191,191,191,1)", gap: 0.5 }}>
                                    <Typography sx={{ color: "black", fontSize: "12px" }}>{user.username}</Typography>
                                    <Box
                                        component="img"
                                        sx={{ width: 15, height: "auto", cursor: "pointer" }}
                                        src={RemoveCircleIcon}
                                        onClick={() => clickHandler(user)}
                                    />
                                </Flexbox>
                            )
                        })}
                    </Flexbox>
                    <Box
                        component="img"
                        sx={{ width: 30, height: "auto", cursor: "pointer" }}
                        src={ConfirmUsers}
                        onClick={createGroup}
                    />
                </Flexbox>
            }

            {
                users.map(user =>
                    <Flexbox key={user._id} sx={{
                        mt: "3%",
                        justifyContent: "space-between",
                        '&:hover': {
                            cursor: "pointer",
                            backgroundColor: "rgba(239, 239, 240, 0.8)",
                        }
                    }}
                    >
                        <Flexbox gap={2}>
                            <Avatar sx={{ marginLeft: "3%", }} src={user.profilePicture || UserImage} />
                            <Typography sx={{ fontSize: "18px" }}>{user.username}</Typography>
                        </Flexbox>
                        <Box
                            component="img"
                            sx={{ width: 20, height: "auto", cursor: "pointer" }}
                            src={addedUsers.some(member => member._id.includes(user._id)) ? RemoveIcon : AddIcon}
                            onClick={() => clickHandler(user)}
                        />
                    </Flexbox>
                )
            }
        </>
    )
}

export default CreateGroupChat