import { useState, useEffect, useContext, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { Flexbox } from '../misc/MUIComponents'
import axios from "axios"

import Userbar from '../components/Userbar/Userbar'
import Chat from '../components/Chat/Chat'
import Detailbar from '../components/Detailbar/Detailbar'

const Home = () => {

    const [users, setUsers] = useState([])

    const socket = useContext(SocketContext);

    const members = useSelector((state) => state.chat.otherMembers)
    const userId = useSelector((state) => state.user.details.id)

    const fetchUsers = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        const data = response.data.filter((person) => person._id !== userId)
        setUsers(data)
    }, [userId])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    useEffect(() => {
        socket.emit("connection", userId);
        // console.clear()
    })

    return (
        <Flexbox>
            <Userbar users={users} />
            <Chat />
            {members.length > 0 && <Detailbar users={users} />}
        </Flexbox>
    )
}

export default Home