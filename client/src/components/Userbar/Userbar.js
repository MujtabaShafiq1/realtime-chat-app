import { useState, useEffect, useContext, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { SocketContext } from "../../context/Socket"
import { Box, Typography, Container, InputAdornment, Divider } from '@mui/material'
import { Flexbox, StyledButton, StyledField, UserAvatar } from '../../misc/MUIComponents'
import axios from 'axios';

import { userActions } from '../../store/userSlice';
import { chatActions } from '../../store/chatSlice';
import { ThemeContext } from '../../context/ThemeProvider';

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
                if (chat.chatId === data.chatId) dispatch(chatActions.reset())
                setChats((prev) => prev.filter(c => c._id !== data.chatId))
            }
        })
    }, [socket, dispatch, chats, chat.chatId, user.id])


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

        <Box sx={{
            height: "100%",
            width: { xs: "100%", sm: "33%", lg: "22%" },
            borderRight: "1px solid",
            borderColor: "secondary.other",
            display: { xs: (chat.chatId && "none"), sm: "flex" },
            flexDirection: "column",
        }}>

            <Flexbox sx={{ justifyContent: "space-around", gap: 1, padding: "10px" }}>
                <UserAvatar src={user.profilePicture || UserImage} />
                <Typography variant="body">{user.username}</Typography>
                <StyledButton onClick={logoutHandler}>Logout</StyledButton>
                <Box onClick={toggleColorMode} sx={{ height: 30, width: 30, cursor: "pointer" }}>
                    {mode === "light" ? <DarkIcon /> : <LightIcon />}
                </Box>
            </Flexbox>

            <Flexbox sx={{ gap: 1, padding: "10px" }} >

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
                    sx={{ margin: "4% 0%", width: "90%" }}
                />

                <Flexbox sx={{ flexDirection: "column" }}>
                    <Typography sx={{ fontSize: "10px", fontWeight: 500, textAlign: "center" }}>
                        New Group
                    </Typography>
                    <NewGroupIcon sx={{ fontSize: "30px", color: "text.primary", cursor: "pointer" }} onClick={() => setCreateGroup(true)} />
                </Flexbox>

            </Flexbox>

            <Container sx={{ maxWidth: "sm", grow: 1, overflow: { sm: "auto" } }}>
                {createGroup ?
                    <CreateGroupChat users={search ? searchedUsers : users} close={() => setCreateGroup(false)} />
                    :
                    <Box>
                        <Divider orientation='horizontal' sx={{ m: "1% 0%", background: "secondary.other" }} />
                        {search ?
                            <SearchedChats searchedUsers={searchedUsers} clear={() => setSearch("")} />
                            :
                            <RecentChats chats={chats} clear={() => setSearch("")} />
                        }
                    </Box>
                }
            </Container>

        </Box >

    )
}

export default Userbar