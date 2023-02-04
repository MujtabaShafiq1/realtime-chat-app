import { useState, useContext } from "react"
import { useSelector } from 'react-redux'
import { Typography, Container } from '@mui/material'
import { Flexbox, StyledButton, UserContainer, UserListItem } from '../../misc/MUIComponents'
import { SocketContext } from "../../context/Socket";
import CustomSnackbar from "../UI/CustomSnackbar"
import UserCard from '../Userbar/UserCard';
import moment from 'moment';
import axios from 'axios';

import RemoveIcon from '@mui/icons-material/PersonRemoveRounded';
import AddIcon from '@mui/icons-material/PersonAddAltRounded';
import ConfirmIcon from '@mui/icons-material/CheckCircleRounded';
import RemoveCircleIcon from '@mui/icons-material/CancelRounded';

const GroupBar = ({ users }) => {

    const { socket } = useContext(SocketContext)

    const [addUser, setAddUser] = useState(false)
    const [userList, setUserList] = useState([])
    const [snackbar, setSnackbar] = useState({ open: false, details: "" })

    const chat = useSelector((state) => state.chat)
    const loggedInUser = useSelector((state) => state.user.details)

    const nonGroupMembers = users.filter(user => !JSON.stringify(chat.otherMembers).includes(user._id));
    const groupAdmin = (chat.otherMembers.filter((member => member._id === chat.groupAdmin))[0]?.username || loggedInUser.username)

    // add member in chat
    const addUserHandler = async () => {
        if ((userList.length + chat.otherMembers.length) <= 20) {
            const response = await axios.put(`${process.env.REACT_APP_SERVER}/chat/add/${chat.chatId}`, { users: userList, sender: loggedInUser })
            socket.emit("add user", { newUsers: userList, chatId: chat.chatId, users: [...chat.otherMembers, loggedInUser] })
            socket.emit("new chat", { members: userList, updatedChat: response.data })
            socket.emit("latestMessage", { messageBody: response.data.latestMessage, users: [loggedInUser.id, ...chat.otherMembers] });
            closeHandler()
            return;
        }
        setSnackbar({ open: true, details: "Maximum user limit reached" })
        setTimeout(() => {
            setSnackbar({ open: false, details: "" })
        }, 2000)
    }

    // remove member from chat
    const groupRemoveHandler = async () => {

        if (chat.otherMembers.length === 0) return groupDeleteHandler()

        socket.emit("remove member", {
            removedUsers: (userList.length > 0 ? userList.map(r => r._id) : loggedInUser.id), users: [loggedInUser, ...chat.otherMembers], chatId: chat.chatId,
        })

        const response = await axios.put(`${process.env.REACT_APP_SERVER}/chat/remove/${chat.chatId}`, { users: userList, sender: loggedInUser })
        socket.emit("latestMessage", {
            messageBody: response.data.latestMessage, users: [loggedInUser.id, ...chat.otherMembers.filter(co => !userList.includes(co.id))]
        });

        closeHandler()
        return;
    }

    const clickHandler = (user) => {
        if (userList.some(member => member._id.includes(user._id))) {
            setUserList(userList.filter(member => member._id !== user._id))
            return;
        }
        setUserList(prev => [...prev, user])
    }

    const groupDeleteHandler = async () => {
        console.log("deleting chat + messages");
        socket.emit("remove member", { removedUsers: loggedInUser.id, users: [loggedInUser], chatId: chat.chatId })
        await axios.delete(`${process.env.REACT_APP_SERVER}/chat`, { data: { chatId: chat.chatId } })
        await axios.delete(`${process.env.REACT_APP_SERVER}/message`, { data: { chatId: chat.chatId } })
    }

    const AddHandler = () => {
        setAddUser(true)
        setUserList([])
    }

    const closeHandler = () => {
        setAddUser(false)
        setUserList([])
    }

    return (
        <>

            {snackbar.open && <CustomSnackbar type="error" details={snackbar.details} />}

            <Flexbox sx={{ flexDirection: "column", minHeight: "30vh", gap: 2 }}>


                <Typography variant="body" sx={{ fontWeight: 500, textAlign: "center" }}>Group Admin: {groupAdmin}</Typography>
                <Typography variant="body" sx={{ fontWeight: 300, textAlign: "center" }}>Created {moment(chat.createdAt).fromNow()}</Typography>

                {chat.groupAdmin === loggedInUser.id && !addUser &&
                    <StyledButton onClick={AddHandler}>
                        <Typography sx={{ fontWeight: 500, fontSize: "12px" }}>Add User</Typography>
                    </StyledButton>
                }

                {userList.length > 0 &&
                    <Flexbox sx={{ flexDirection: "column", margin: "4% 0%", gap: 2 }}>
                        <Typography variant="body" sx={{ fontWeight: 300 }}>Removing Members from Group</Typography>
                        <Flexbox sx={{ flexWrap: "wrap", gap: 1 }}>
                            {userList.map(user => {
                                return (
                                    <UserListItem key={user._id} >
                                        <Typography sx={{ color: "black", fontSize: "12px" }}>{user.username}</Typography>
                                        <RemoveCircleIcon sx={{ fontSize: "18px", cursor: "pointer", color: "red" }} onClick={() => clickHandler(user)} />
                                    </UserListItem>
                                )
                            })}
                            <ConfirmIcon sx={{ fontSize: "28px", cursor: "pointer" }} onClick={addUser ? addUserHandler : groupRemoveHandler} />
                        </Flexbox>
                    </Flexbox>
                }
            </Flexbox>

            {
                !addUser ?
                    <>
                        <Typography variant="body" sx={{ m: "3% 0%", textAlign: "center" }}>Group members</Typography>
                        <Container sx={{ maxWidth: "sm", grow: 1, overflow: "auto" }}>
                            {chat.otherMembers.map(user => {
                                return (
                                    <UserContainer key={user._id}>
                                        <UserCard user={user} />
                                        {chat.groupAdmin === loggedInUser.id &&
                                            userList.includes(user) ?
                                            <AddIcon sx={{ fontSize: "28px", color: "text.primary", cursor: "pointer" }} onClick={() => clickHandler(user)} /> :
                                            <RemoveIcon sx={{ fontSize: "28px", color: "red", cursor: "pointer" }} onClick={() => clickHandler(user)} />
                                        }
                                    </UserContainer>
                                )
                            })}
                        </Container>
                    </>
                    :
                    <>
                        <Flexbox sx={{ justifyContent: "space-around" }}>
                            <Typography variant="body" sx={{ m: "3% 0%", textAlign: "center" }}>Add new members</Typography>
                            <RemoveCircleIcon sx={{ fontSize: "24px", height: "auto", cursor: "pointer", color: "red" }} onClick={closeHandler} />
                        </Flexbox>

                        <Container sx={{ maxWidth: "sm", grow: 1, overflow: "auto" }}>
                            {nonGroupMembers.length > 0
                                ?
                                nonGroupMembers.map(user => {
                                    return (
                                        <UserContainer key={user._id}>
                                            <UserCard user={user} />
                                            {chat.groupAdmin === loggedInUser.id &&
                                                userList.includes(user) ?
                                                <RemoveIcon sx={{ fontSize: "28px", color: "red", cursor: "pointer" }} onClick={() => clickHandler(user)} /> :
                                                <AddIcon sx={{ fontSize: "28px", color: "text.primary", cursor: "pointer" }} onClick={() => clickHandler(user)} />
                                            }
                                        </UserContainer>
                                    )
                                })
                                :
                                <Typography sx={{ fontSize: "22px", textAlign: "center" }}>All users added</Typography>
                            }
                        </Container>

                    </>
            }
            <Flexbox sx={{ m: "3% 0%" }}>
                <StyledButton sx={{ background: "red" }} onClick={groupRemoveHandler}>Leave</StyledButton>
            </Flexbox>
        </>
    )
}

export default GroupBar