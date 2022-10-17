import { useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { Flexbox } from '../misc/MUIComponents'

import Userbar from '../components/Userbar/Userbar'
import Chat from '../components/Chat/Chat'
import Detailbar from '../components/Detailbar/Detailbar'

const Home = () => {

    const socket = useContext(SocketContext);

    const member = useSelector((state) => state.chat.selectedUser)
    const userId = useSelector((state) => state.user.details.id)

    useEffect(() => {
        socket.emit("connection", userId);
        console.clear()
    })

    return (
        <Flexbox>
            <Userbar />
            <Chat />
            {member && <Detailbar />}
        </Flexbox>
    )
}

export default Home