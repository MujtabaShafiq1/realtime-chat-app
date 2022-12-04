import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { Flexbox } from '../misc/MUIComponents'
import { Box } from '@mui/material'
import axios from "axios"

import Chat from '../components/Chat/Chat'
import Userbar from '../components/Userbar/Userbar'
import GroupBar from "../components/Detailbar/GroupBar";
import SingleChatbar from '../components/Detailbar/SingleChatbar';


const Home = () => {

    const [users, setUsers] = useState([])
    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)
    const socket = useContext(SocketContext)

    const fetchUsers = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        const data = response.data.filter((person) => person._id !== userId)
        setUsers(data)

        console.log("connection established")
        socket.emit("connection", userId);

    }, [userId, socket])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
        <Flexbox>
            <Userbar users={users} />
            <Chat />
            {chat.chatId &&
                <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
                    {chat.isGroupChat ? <GroupBar users={users} /> : <SingleChatbar />}
                </Box>
            }
        </Flexbox>
    )
}

export default Home