import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { Flexbox } from '../misc/MUIComponents'
import { Box, SwipeableDrawer } from '@mui/material'
import axios from "axios"

import Chat from '../components/Chat/Chat'
import Userbar from '../components/Userbar/Userbar'
import GroupBar from "../components/Detailbar/GroupBar";
import SingleChatbar from '../components/Detailbar/SingleChatbar';

import CloseIcon from "../assets/Chat/close.png"

const Home = () => {

    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)

    const [users, setUsers] = useState([])
    const [back, setBack] = useState(false)
    const [drawer, setDrawer] = useState(false)

    const socket = useContext(SocketContext)

    const fetchUsers = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        const data = response.data.filter((person) => person._id !== userId)
        setUsers(data)

        console.log("connection established")
        socket.emit("connection", userId);
        console.clear()

    }, [userId, socket])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
        <Flexbox >
            <Userbar users={users} />
            <Chat open={() => setDrawer(true)} />
            {chat.chatId &&
                <>
                    <Box sx={{ minHeight: "100vh", width: "22%", display: { xs: "none", lg: "block" }, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
                        {chat.isGroupChat ? <GroupBar users={users} /> : <SingleChatbar />}
                    </Box>
                    <SwipeableDrawer
                        open={drawer}
                        onOpen={() => setDrawer(true)}
                        onClose={() => setDrawer(false)}
                        anchor="right"
                        disableSwipeToOpen
                        PaperProps={{
                            sx: {
                                zIndex: 1,
                                width: { xs: "50%", md: "30%" },
                                minHeight: "100vh",
                            }
                        }}>
                        <Box component="img" src={CloseIcon} sx={{ mt: "1% ", height: 35, position: "absolute", left: "85%" }} onClick={() => setDrawer(false)} />
                        {chat.isGroupChat ? <GroupBar users={users} /> : <SingleChatbar />}
                    </SwipeableDrawer>
                </>
            }
        </Flexbox>
    )
}

export default Home