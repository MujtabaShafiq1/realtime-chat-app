import { useEffect, useContext } from 'react'
import { useSelector } from 'react-redux'
import { SocketContext } from '../context/Socket'
import { Flexbox } from '../misc/MUIComponents'

import Userbar from '../components/Userbar/Userbar'
import Chat from '../components/Chat/Chat'
import Detailbar from '../components/Detailbar/Detailbar'

const Home = () => {

    const socket = useContext(SocketContext);

    const members = useSelector((state) => state.chat.otherMembers)
    const userId = useSelector((state) => state.user.details.id)

    useEffect(() => {
        socket.emit("connection", userId);
        console.clear()
    })

    return (
        <Flexbox>
            <Userbar />
            <Chat />
            {members.length > 0 && <Detailbar />}
        </Flexbox>
    )
}

export default Home