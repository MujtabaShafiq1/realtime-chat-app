import { useState, useEffect, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from "../../context/Socket"
import { Avatar, Box, TextField, Typography, Container, InputAdornment } from '@mui/material'
import { Flexbox, StyledButton } from '../../misc/MUIComponents'

import { userActions } from '../../store/userSlice';
import { chatActions } from '../../store/chatSlice';
import axios from 'axios';

import RecentChats from '../Chat/RecentChats';
import SearchedChats from '../Chat/SearchedChats';
import CreateGroupChat from '../Chat/CreateGroupChat';

import UserImage from "../../assets/User/user.jpg";
import NewGroupIcon from "../../assets/Chat/group.png"
import SearchIcon from "../../assets/Chat/search.png"


const Userbar = ({ users }) => {

    const dispatch = useDispatch();
    const socket = useContext(SocketContext);

    const user = useSelector((state) => state.user.details)

    const [chats, setChats] = useState([])
    const [search, setSearch] = useState("")
    const [groupText, setGroupText] = useState(false)
    const [createGroup, setCreateGroup] = useState(false)
    const [searchedUsers, setSearchedUser] = useState([])

    const fetchingChats = useCallback(async () => {
        console.log("fetching chats");
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/chat/${user.id}`)
        setChats(response.data)
    }, [user.id])

    useEffect(() => {
        fetchingChats();
    }, [fetchingChats])


    useEffect(() => {
        socket.on("getChats", (data) => {
            console.log(`Updating chats`)
            setChats((prev) => [...prev, data])
        })
    }, [socket])


    const logoutHandler = async () => {
        await axios.get(`${process.env.REACT_APP_SERVER}/auth/logout`)
        dispatch(chatActions.reset())
        dispatch(userActions.logout())
    }


    const searchHandler = (e) => {
        setSearch(e.target.value)
        const filtered = users.filter((user) => user.username.toLowerCase().includes(e.target.value.toLowerCase()))
        setSearchedUser(filtered)
    }

    return (
        <>

            <Box sx={{ minHeight: "100vh", width: { xs: "30%", lg: "22%" }, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>

                <Flexbox sx={{ justifyContent: "space-around", gap: 1, padding: "10px" }}>
                    <Avatar src={user.profilePicture || UserImage} sx={{ width: 50, height: 50 }} />
                    <Typography sx={{ fontSize: "22px" }}>{user.username}</Typography>
                    <StyledButton sx={{ backgroundColor: "black" }} onClick={logoutHandler}>
                        Logout
                    </StyledButton>
                </Flexbox>

                <Flexbox sx={{ gap: 3, padding: "10px" }} >

                    <TextField
                        variant="filled"
                        placeholder="Search user"
                        type="text"
                        size="small"
                        hiddenLabel
                        onChange={searchHandler}
                        value={search}
                        InputProps={{
                            disableUnderline: true,
                            autoComplete: "off",
                            endAdornment: (
                                <InputAdornment position="end" sx={{ cursor: "pointer" }}>
                                    <Box component="img" src={SearchIcon} sx={{ height: 30, width: 30, rotate: "270deg" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ margin: "4% 0%", width: "75%", border: "0.2px solid lightgray" }}
                    />

                    <Flexbox>
                        {groupText &&
                            <Flexbox sx={{ padding: "5px", borderRadius: "20px", backgroundColor: "rgba(191,191,191,1)", position: "absolute", top: "7%" }}>
                                <Typography sx={{ color: "black", fontSize: "12px" }}>Create Group</Typography>
                            </Flexbox>
                        }
                        <Box
                            component="img"
                            src={NewGroupIcon}
                            sx={{ width: 50, height: "auto", cursor: "pointer" }}
                            onClick={() => setCreateGroup(true)}
                            onMouseOver={() => setGroupText(true)}
                            onMouseOut={() => setGroupText(false)}
                        />
                    </Flexbox>

                </Flexbox>

                <Container maxWidth="sm">
                    {createGroup ?
                        <CreateGroupChat users={search ? searchedUsers : users} close={() => setCreateGroup(false)} />
                        :
                        <Box>
                            {search ?
                                <SearchedChats searchedUsers={searchedUsers} clear={() => setSearch("")} />
                                :
                                <RecentChats chats={chats} clear={() => setSearch("")} />
                            }
                        </Box>
                    }
                </Container>

            </Box>
        </>
    )
}

export default Userbar