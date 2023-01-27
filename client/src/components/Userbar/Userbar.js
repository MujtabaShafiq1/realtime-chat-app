import { useState, useEffect, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from "../../context/Socket"
import { Avatar, Box, Typography, Container, InputAdornment, Divider } from '@mui/material'
import { Flexbox, StyledButton, StyledField } from '../../misc/MUIComponents'

import { userActions } from '../../store/userSlice';
import { chatActions } from '../../store/chatSlice';
import { ThemeContext } from '../../context/ThemeProvider';
import axios from 'axios';

import RecentChats from '../Chat/RecentChats';
import SearchedChats from '../Chat/SearchedChats';
import CreateGroupChat from '../Chat/CreateGroupChat';

import UserImage from "../../assets/User/user.jpg";
import NewGroupIcon from '@mui/icons-material/GroupAddRounded';
import SearchIcon from '@mui/icons-material/PersonSearchRounded';
import DarkIcon from '@mui/icons-material/Brightness4';
import LightIcon from '@mui/icons-material/Brightness7';

const Userbar = ({ users }) => {

    const dispatch = useDispatch();
    const { socket } = useContext(SocketContext);
    const { mode, toggleColorMode } = useContext(ThemeContext)

    const chat = useSelector((state) => state.chat)
    const user = useSelector((state) => state.user.details)

    const [chats, setChats] = useState([])
    const [search, setSearch] = useState("")
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
        socket.on("getChats", (data) => setChats((prev) => [...prev, data]))
    }, [socket])


    useEffect(() => {
        socket.on("getRemovedUser", (data) => {
            if (data.removedUsers.includes(user.id)) {
                setChats((prev) => prev.filter(c => c._id !== data.chatId))
            }
        })
    }, [socket, chats, user.id])


    const logoutHandler = async () => {
        socket.disconnect()
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
            <Box
                sx={{
                    height: "100vh",
                    width: { xs: "100%", sm: "33%", lg: "22%" },
                    display: { xs: (chat.chatId && "none"), sm: "block" },
                    borderRight: "1px solid", borderColor: "secondary.other",
                }}
            >
                <Flexbox sx={{ justifyContent: "space-around", gap: 1, padding: "10px" }}>
                    <Avatar src={user.profilePicture || UserImage} sx={{ width: 50, height: 50 }} />
                    <Typography sx={{ fontSize: "20px", display: { xs: "block", sm: "none", md: "block" } }}>{user.username}</Typography>
                    <StyledButton onClick={logoutHandler}>Logout</StyledButton>
                    <Box onClick={toggleColorMode} sx={{ height: 30, width: 30, cursor: "pointer" }}>
                        {mode === "light" ? <DarkIcon /> : <LightIcon />}
                    </Box>
                </Flexbox>

                <Flexbox sx={{ gap: 3, padding: "10px", flexDirection: { xs: "row", sm: "column", md: "row" } }} >

                    <StyledField
                        variant="outlined"
                        placeholder="Search user"
                        type="text"
                        size="small"
                        hiddenLabel
                        onChange={searchHandler}
                        value={search}
                        InputProps={{
                            autoComplete: "off",
                            endAdornment: (
                                <InputAdornment position="end">
                                    <SearchIcon sx={{ fontSize: "38px", cursor: "pointer", color: "text.primary" }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ margin: "4% 0%", width: { xs: "50%", sm: "75%" } }}
                    />

                    <Flexbox sx={{ flexDirection: { xs: "row", md: "column" }, gap: { xs: 2, md: 0 } }}>
                        <Typography sx={{ fontSize: { xs: "14px", md: "12px" }, fontWeight: 500, textAlign: "center" }}>
                            New Group
                        </Typography>
                        <NewGroupIcon sx={{ fontSize: "36px", color: "text.primary", cursor: "pointer" }} onClick={() => setCreateGroup(true)} />
                    </Flexbox>

                </Flexbox>

                <Container maxWidth="sm">
                    {createGroup ?
                        <CreateGroupChat users={search ? searchedUsers : users} close={() => setCreateGroup(false)} />
                        :
                        <Box sx={{ height: { xs: "75vh", sm: "70vh", md: "75vh" }, overflow: "auto" }}>
                            <Divider orientation='horizontal' sx={{ m: "1% 0%", background: "secondary.other" }} />
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