import { useState, useCallback, useEffect } from "react"
import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { Flexbox, StlyedButton } from '../../misc/MUIComponents'
import axios from 'axios';
import moment from 'moment';

import Userbox from '../Userbar/Userbox';
import RemoveIcon from "../../assets/remove.png";
import AddIcon from "../../assets/add.png";
import CloseIcon from "../../assets/close.png"


const GroupBar = () => {

    const [addUser, setAddUser] = useState(false)

    const chat = useSelector((state) => state.chat)
    const loggedInUser = useSelector((state) => state.user.details)

    // delete request for chat
    const groupRemoveHandler = () => {
        console.log("removing from group")
    }

    // add request for chat
    const addUserHandler = () => {
        console.log("removing from group")
    }

    // fetch only those users who are not in group
    const fetchUsers = useCallback(async () => {
        // const response = await axios.get(`${process.env.REACT_APP_SERVER}/user/all`)
        // const data = response.data.filter((person) => person._id !== user.id)
        // setUsers(data)
    }, [chat.id])

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])


    return (
        <>
            <Flexbox sx={{ flexDirection: "column", minHeight: "20vh", gap: 2 }}>
                <Typography sx={{ fontSize: "24px", fontWeight: 500 }}>
                    Group Admin: {chat.otherMembers.filter((member => member._id === chat.groupAdmin))[0]?.username || loggedInUser.username}
                </Typography>
                <Typography sx={{ fontSize: "20px", fontWeight: 300 }}>Created {moment(chat.createdAt, "YYYYMMDD").fromNow()}</Typography>
                {chat.groupAdmin === loggedInUser.id && !addUser &&
                    <StlyedButton sx={{ backgroundColor: "black", alignSelf: "center" }} onClick={() => setAddUser(true)}>Add User</StlyedButton>
                }
            </Flexbox>

            {!addUser ?
                <>
                    <Typography sx={{ fontSize: "24px", m: "3% 0%", textAlign: "center" }}>Group Members</Typography>
                    <Box sx={{ height: "50vh", overflow: "auto" }}>
                        {
                            chat.otherMembers.map(user => {
                                return (
                                    <Flexbox key={user._id} sx={{ justifyContent: "space-around" }}>
                                        <Userbox user={user} />
                                        {chat.groupAdmin === loggedInUser.id
                                            &&
                                            <Box component="img" src={RemoveIcon} sx={{ height: 25, width: "auto", cursor: "pointer" }} onClick={groupRemoveHandler} />
                                        }
                                    </Flexbox>
                                )
                            })
                        }
                    </Box>
                </>
                :
                <>
                    <Flexbox sx={{ justifyContent: "space-around" }}>
                        <Typography sx={{ fontSize: "24px", m: "3% 0%", textAlign: "center" }}>Add new members</Typography>
                        <Box
                            component="img"
                            sx={{ width: 30, height: "auto", cursor: "pointer" }}
                            src={CloseIcon}
                            onClick={() => setAddUser(false)}
                        />
                    </Flexbox>
                    <Box sx={{ height: "50vh", overflow: "auto" }}>
                        {
                            chat.otherMembers.map(user => {
                                return (
                                    <Flexbox key={user._id} sx={{ justifyContent: "space-around" }}>
                                        <Userbox user={user} />
                                        {chat.groupAdmin === loggedInUser.id
                                            &&
                                            <Box component="img" src={AddIcon} sx={{ height: 25, width: "auto", cursor: "pointer" }} onClick={addUserHandler} />
                                        }
                                    </Flexbox>
                                )
                            })
                        }
                    </Box>
                </>
            }
        </>
    )
}

export default GroupBar