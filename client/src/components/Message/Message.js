import { useState, useEffect, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Typography } from '@mui/material'
import { Flexbox, MessageBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import { chatActions } from '../../store/chatSlice';
import UserImage from "../../assets/user.jpg";
import moment from "moment"

const Message = ({ message, next }) => {


    const dispatch = useDispatch();
    const socket = useContext(SocketContext)

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)

    const senderDetails = chat.otherMembers.filter(member => (member._id === message.senderId))[0]

    const dateFormat = "YYYY-MM-DD HH:mm:ss"
    const start = moment(message.createdAt).format(dateFormat)
    const end = moment(next?.createdAt).format(dateFormat)
    const duration = moment(end).diff(start, 'hours');

    const consecutiveMessage = !(message.senderId === next?.senderId)
    const currentUserMessage = (user.id === message.senderId)

    const [hover, setHover] = useState(false)
    // const [readByUpdated, setReadByUpdated] = useState(((chat?.latestMessages?.filter(c => c._id === message._id)[0]?.readBy) || message.readBy))

    const updateRecentMessage = useCallback(() => {
        //     if (message.senderId !== user.id && (chat.users.length !== readByUpdated.length)) {
        //         socket.emit("readMessage", { chatId: chat.chatId, messageId: message._id, userId: user.id })
        //         dispatch(chatActions.updateReadBy({ chatId: chat.chatId, messageId: message._id, userId: user.id }))
        //     }
        // }, [dispatch, socket, readByUpdated, chat.chatId, chat.users.length, message._id, message.senderId, user.id])
    }, [])

    const updateReadBy = useCallback(() => {
        // socket.on("getMessageReadby", (details) => {
        //     if (details.messageId === message._id && !readByUpdated.includes(details.userId)) {
        //         setReadByUpdated((prev) => [...prev, details.userId])
        //         dispatch(chatActions.updateReadBy(details))
        //     }
        // });
        // eslint-disable-next-line
        // }, [socket, dispatch])
    }, [])

    useEffect(() => {
        updateRecentMessage();
    }, [updateRecentMessage])

    useEffect(() => {
        updateReadBy();
    }, [updateReadBy])

    return (
        <>
            <MessageContainer sender={currentUserMessage ? 1 : 0} consecutive={consecutiveMessage ? 1 : 0}>

                {(consecutiveMessage && currentUserMessage) &&
                    < Avatar src={user.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}

                {(consecutiveMessage && !currentUserMessage) &&
                    < Avatar src={senderDetails?.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}


                <MessageBox sender={currentUserMessage ? 1 : 0} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    <Typography sx={{ fontSize: "16px" }}>{message.content}</Typography>
                </MessageBox>

                {
                    // !readByUpdated.every(id => next?.readBy.includes(id)) &&
                    // <>
                    //     {
                    //         readByUpdated.map((value, index) =>
                    //             (value !== user.id && message.senderId === user.id) &&
                    //             <div key={message._id}>
                    //                 <Avatar
                    //                     src={(chat.otherMembers.filter(m => m._id === value)[0]?.profilePicture) || UserImage}
                    //                     sx={{ width: 20, height: 20, alignSelf: "flex-end" }}
                    //                 />
                    //             </div>
                    //         )
                    //     }
                    // </>
                }


                {hover &&
                    <Flexbox sx={{ backgroundColor: "gray", borderRadius: "10px", width: "auto", height: "2vh", opacity: 0.8, padding: "5px" }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 300, opacity: 1, color: "white" }}>
                            {moment(message.createdAt).calendar()}
                        </Typography>
                    </Flexbox>
                }
            </MessageContainer >

            {
                (duration > 2 && next)
                &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, opacity: 1, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {moment(next?.createdAt).calendar()}
                </Typography>
            }
        </>
    )
}

export default Message