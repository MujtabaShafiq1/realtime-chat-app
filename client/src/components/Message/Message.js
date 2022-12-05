import { useState, useEffect, useContext } from 'react'
import { useSelector } from 'react-redux';
import { Avatar, Box, Typography } from '@mui/material'
import { ImageListItem, ImageList } from '@mui/material'
import { Flexbox, TextBox, MessageContainer } from "../../misc/MUIComponents"
import { SocketContext } from '../../context/Socket';
import moment from "moment"

import SeenIcon from "../../assets/Message/seen.png";
import DeliveredIcon from "../../assets/Message/delivered.png";
import UserImage from "../../assets/User/user.jpg"
import ImageGallery from './ImageGallery';
import axios from 'axios';

const Message = ({ message, next }) => {

    const socket = useContext(SocketContext)

    const user = useSelector((state) => state.user.details)
    const chat = useSelector((state) => state.chat)

    const [hover, setHover] = useState(false)
    const [gallery, setGallery] = useState(false)
    const [readBy, setReadBy] = useState(message.readBy)

    const consecutiveMessage = !(message.senderId === next?.senderId)
    const currentUserMessage = (user.id === message.senderId)

    const dateFormat = "YYYY-MM-DD HH:mm:ss"
    const start = moment(message.createdAt).format(dateFormat)
    const end = moment(next?.createdAt).format(dateFormat)
    const duration = moment(end).diff(start, 'hours');


    // to read message by logged in user
    useEffect(() => {
        const updateMessage = async () => {
            if (!readBy.includes(user.id)) {
                console.log("emitting read by")
                await axios.put(`${process.env.REACT_APP_SERVER}/message/${message._id}`, { userId: user.id })
                socket.emit("readMessage", message)
            }
        }
        updateMessage()
    }, [socket, message, readBy, user.id])


    // to update readby of all message of all users
    useEffect(() => {
        socket.on("getMessageReadby", (details) => {
            if (details._id !== message._id) return;
            setTimeout(() => {
                console.log("on read by");
                console.log([...readBy, ...details.readBy]);
                setReadBy((prev) => [...prev, ...details.readBy])
            }, 1000)
        });
    }, [socket, message._id])


    function srcset(image, size = 148, rows = 1, cols = 1) {
        return {
            src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
            srcSet: `${image}?w=${size * cols}&h=${size * rows
                }&fit=crop&auto=format&dpr=2 2x`,
        };
    }

    return (
        <>
            <MessageContainer sender={currentUserMessage ? 1 : 0} consecutive={consecutiveMessage ? 1 : 0} >

                {(consecutiveMessage && currentUserMessage && message.type !== "info") &&
                    < Avatar src={user.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}

                {(consecutiveMessage && !currentUserMessage && message.type !== "info") &&
                    < Avatar src={chat.otherMembers.filter(member => (member._id === message.senderId))[0]?.profilePicture || UserImage} sx={{ alignSelf: "flex-end" }} />}

                <Flexbox sx={{ flexDirection: "column", alignItems: currentUserMessage ? "flex-end" : "flex-start", maxWidth: "50%" }}>

                    {/* Images */}
                    {message.images.length > 0 &&
                        <>
                            {gallery && <ImageGallery images={message.images} close={() => setGallery(false)} />}
                            <Box
                                sx={{ display: "flex", flexDirection: "column", m: "1.5% 0%", cursor: "pointer", position: "relative" }}
                                onClick={() => setGallery(true)}
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                            >
                                {message.images.length === 1 ?
                                    <Box
                                        component="img"
                                        sx={{ maxWidth: 300, maxHeight: 300, borderRadius: "8px" }}
                                        src={message.images[0]}
                                    />
                                    :
                                    <ImageList
                                        sx={{ width: 450, height: 300, }}
                                        variant="quilted"
                                        cols={4}
                                        rowHeight={148}
                                    >
                                        <ImageListItem cols={2} rows={2} >
                                            <img
                                                {...srcset(message.images[0])}
                                                loading="lazy"
                                                alt=""
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </ImageListItem>
                                        <ImageListItem
                                            cols={(message.images.length === 2 || message.images.length === 3) ? 2 : 1}
                                            rows={message.images.length === 2 ? 2 : 1}
                                        >
                                            <img
                                                {...srcset(message.images[1])}
                                                loading="lazy"
                                                alt=""
                                                style={{ borderRadius: "8px" }}
                                            />
                                        </ImageListItem>
                                        {message.images[2] &&
                                            <ImageListItem
                                                cols={message.images.length === 3 ? 2 : 1}
                                                rows={1}
                                            >
                                                <img
                                                    {...srcset(message.images[2])}
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ borderRadius: "8px" }}
                                                />
                                            </ImageListItem>
                                        }
                                        {message.images[3] &&
                                            <ImageListItem cols={2} rows={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}>
                                                <img
                                                    {...srcset(message.images[3])}
                                                    loading="lazy"
                                                    alt=""
                                                    style={{ borderRadius: "8px" }}
                                                />
                                                {message.images.length > 4 &&
                                                    <Flexbox
                                                        sx={{ backgroundColor: "rgba(0,0,0,0.5)", position: "absolute", height: "100%", width: "100%", borderRadius: "8px" }}>
                                                        <Typography sx={{ fontSize: "28px", color: "white", fontWeight: 200 }}>+ {message.images.length - 4}</Typography>
                                                    </Flexbox>
                                                }
                                            </ImageListItem>
                                        }
                                    </ImageList>
                                }
                                {message.senderId === user.id &&
                                    <Box
                                        component="img"
                                        sx={{ width: "auto", height: "2vh", alignSelf: "flex-end", position: "absolute", top: "90%", right: "2%" }}
                                        src={((chat.otherMembers.length + 1) === readBy.length) ? SeenIcon : DeliveredIcon}
                                    />
                                }


                            </Box>
                        </>
                    }

                    {/* Text */}
                    {(message.content && message.type !== "info") &&
                        <TextBox onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                            <Flexbox>
                                <Typography sx={{ fontSize: "16px" }}>{message.content}</Typography>
                            </Flexbox>
                            {
                                message.senderId === user.id &&
                                <Box
                                    component="img"
                                    sx={{ width: "auto", height: "2vh", alignSelf: "flex-end" }}
                                    src={((chat.otherMembers.length + 1) === readBy.length) ? SeenIcon : DeliveredIcon}
                                />
                            }
                        </TextBox>
                    }

                </Flexbox>

                {hover &&
                    <Flexbox sx={{ backgroundColor: "gray", borderRadius: "10px", width: "auto", height: "2vh", opacity: 0.8, padding: "5px" }}>
                        <Typography sx={{ fontSize: "11px", fontWeight: 300, opacity: 1, color: "white" }}>
                            {moment(message.createdAt).calendar()}
                        </Typography>
                    </Flexbox>
                }

            </MessageContainer >

            {message.type === "info" &&
                <Typography sx={{ fontSize: "15px", fontWeight: 300, opacity: 1, color: "gray", textAlign: "center", margin: "1% 0" }}>
                    {message.content}
                </Typography>
            }

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