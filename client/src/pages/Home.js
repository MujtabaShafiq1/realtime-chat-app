import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { MainContainer, DetailBarContainer } from "../misc/MUIComponents"
import { SwipeableDrawer } from '@mui/material'
import axios from "axios"

import Chat from '../components/Chat/Chat'
import Userbar from '../components/Userbar/Userbar'
import GroupBar from "../components/Detailbar/GroupBar";
import SingleChatbar from '../components/Detailbar/SingleChatbar';

import CloseIcon from '@mui/icons-material/CancelRounded';

const Home = () => {

    const { socket } = useContext(SocketContext)
    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)

    const [users, setUsers] = useState([])
    const [drawer, setDrawer] = useState(false)

    const fetchUsers = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        const data = response.data.filter((person) => person._id !== userId)
        setUsers(data)
        // console.clear()
    }, [userId])

    useEffect(() => {
        socket.connect();
    }, [socket])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    return (
        <MainContainer>
            <Userbar users={users} />
            <Chat open={() => setDrawer(true)} />
            {chat.chatId &&
                <>
                    <DetailBarContainer>{chat.isGroupChat ? <GroupBar users={users} /> : <SingleChatbar />}</DetailBarContainer>
                    <SwipeableDrawer
                        open={drawer}
                        onOpen={() => setDrawer(true)}
                        onClose={() => setDrawer(false)}
                        anchor="right"
                        disableSwipeToOpen
                        PaperProps={{ sx: { zIndex: 1, width: { xs: "100%", sm: "50%", md: "30%" }, backgroundColor: "primary.main" } }}>
                        <CloseIcon
                            sx={{ fontSize: "28px", mt: "1% ", color: "red", cursor: "pointer", position: "absolute", left: "85%" }}
                            onClick={() => setDrawer(false)}
                        />
                        {chat.isGroupChat ? <GroupBar users={users} /> : <SingleChatbar />}
                    </SwipeableDrawer>
                </>
            }
        </MainContainer >
    )
}

export default Home