import { useState, useContext } from "react"
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography } from "@mui/material"
import { Flexbox, UserContainer, UserListItem } from "../../misc/MUIComponents"
import { SocketContext } from "../../context/Socket";
import { chatActions } from "../../store/chatSlice";
import { createChat } from "../../store/chatActions";
import UserCard from "../Userbar/UserCard";
import CustomSnackbar from "../UI/CustomSnackbar"


import AddIcon from '@mui/icons-material/PersonAddAltRounded';
import RemoveIcon from '@mui/icons-material/PersonRemoveRounded';
import ConfirmIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/CancelRounded';


const CreateGroupChat = ({ users, close }) => {

    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext)
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

    // new message when creating group chat issue
    const createGroup = async () => {
        if (addedUsers.length <= 20) {
            dispatch(chatActions.conversation({ otherMembers: [...addedUsers] }))

            const response = await dispatch(createChat({
                senderId: user.id,
                receiverId: addedUsers.map(user => user._id),
                content: `Group created by ${user.username}`,
                type: "info",
                isGroupChat: true
            })).unwrap()

            socket.emit("new chat", response)
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

            <Flexbox sx={{ justifyContent: "space-between" }}>
                <Typography variant="body" sx={{ m: "3% 0%" }}>Create New Group</Typography>
                <RemoveCircleIcon sx={{ fontSize: "24px", cursor: "pointer", color: "red" }} onClick={close} />
            </Flexbox>
            {addedUsers.length > 0
                &&
                <Flexbox sx={{ justifyContent: "space-between", m: "2% 0 5% 0" }}>
                    <Flexbox sx={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 1 }}>
                        {addedUsers.map(user => {
                            return (
                                <UserListItem key={user._id} >
                                    <Typography sx={{ color: "black", fontSize: "12px" }}>{user.username}</Typography>
                                    <RemoveCircleIcon sx={{ fontSize: "18px", cursor: "pointer", color: "red" }} onClick={() => clickHandler(user)} />
                                </UserListItem>
                            )
                        })}
                    </Flexbox>
                    <ConfirmIcon sx={{ fontSize: "24px", color: "text.primary", cursor: "pointer" }} onClick={createGroup} />
                </Flexbox>
            }
            <Box sx={{ maxWidth: "sm", grow: 1, overflow: { sm: "auto" } }}>
                {users.map(user =>
                    <UserContainer key={user._id}>
                        <UserCard user={user} />
                        <Box sx={{ cursor: "pointer" }} onClick={() => clickHandler(user)}>
                            {addedUsers.some(member => member._id.includes(user._id)) ?
                                <RemoveIcon sx={{ fontSize: "28px", color: "red" }} />
                                : <AddIcon sx={{ fontSize: "28px", color: "text.primary" }} />}
                        </Box>
                    </UserContainer>
                )}
            </Box>
        </>
    )
}

export default CreateGroupChat