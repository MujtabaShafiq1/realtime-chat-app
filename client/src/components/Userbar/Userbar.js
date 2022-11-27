import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, TextField, Typography, Container } from '@mui/material'
import { Flexbox, StlyedButton } from '../../misc/MUIComponents'

import { userActions } from '../../store/userSlice';
import { chatActions } from '../../store/chatSlice';
import axios from 'axios';

import RecentChats from '../Chat/RecentChats';
import SearchedChats from '../Chat/SearchedChats';
import CreateGroupChat from '../Chat/CreateGroupChat';

import UserImage from "../../assets/user.jpg";
import NewGroupIcon from "../../assets/group.png"


const Userbar = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.details)

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
    const [groupText, setGroupText] = useState(false)
    const [createGroup, setCreateGroup] = useState(false)
    const [searchedUsers, setSearchedUser] = useState([])

    const fetchUsers = useCallback(async () => {
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        const data = response.data.filter((person) => person._id !== user.id)
        setUsers(data)
    }, [user.id])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

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

    const closeCreateGroup = () => {
        setCreateGroup(false)
    }

    return (
        <>

            <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>

                <Flexbox sx={{ justifyContent: "space-around", marginTop: "3%" }}>
                    <Avatar src={user.profilePicture || UserImage} sx={{ width: 50, height: 50 }} />
                    <Typography sx={{ fontSize: "22px" }}>{user.username}</Typography>
                    <StlyedButton sx={{ backgroundColor: "black" }} onClick={logoutHandler}>
                        Logout
                    </StlyedButton>
                </Flexbox>

                <Flexbox gap={3}>

                    <TextField
                        variant="filled"
                        placeholder="Search user"
                        type="text"
                        size="small"
                        hiddenLabel
                        onChange={searchHandler}
                        InputProps={{ disableUnderline: true, autoComplete: "off" }}
                        sx={{
                            margin: "4% 0%",
                            width: "75%",
                            border: "0.2px solid lightgray",
                        }}
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
                        <CreateGroupChat users={search ? searchedUsers : users} close={closeCreateGroup} /> :
                        <> {search ? <SearchedChats searchedUsers={searchedUsers} /> : <RecentChats />}</>
                    }
                </Container>

            </Box>
        </>
    )
}

export default Userbar