import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Box, TextField, Typography } from '@mui/material'
import { Flexbox, StlyedButton } from '../../misc/MUIComponents'

import { userActions } from '../../store/userSlice';
import axios from 'axios';

import RecentChats from '../Chat/RecentChats';
import SearchedChats from '../Chat/SearchedChats';
import UserImage from "../../assets/user.jpg";


const Userbar = () => {

    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.details)

    const [users, setUsers] = useState([])
    const [search, setSearch] = useState("")
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
        dispatch(userActions.logout())
    }

    const searchHandler = (e) => {
        setSearch(e.target.value)
        const filtered = users.filter((user) => user.username.toLowerCase().includes(e.target.value.toLowerCase()))
        setSearchedUser(filtered)
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

                <Flexbox>
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
                            width: "90%",
                            border: "0.2px solid lightgray",
                        }}
                    />
                </Flexbox>

                {search ? <SearchedChats searchedUsers={searchedUsers} /> : <RecentChats />}

            </Box>
        </>
    )
}

export default Userbar