import moment from 'moment';
import { useSelector } from 'react-redux'
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import Userbox from '../Userbar/Userbox';

import UserIcon from "../../assets/user.jpg";
import RemoveIcon from "../../assets/remove.png";

const Status = () => {

    const chat = useSelector((state) => state.chat)
    const loggedInUser = useSelector((state) => state.user.details)

    const groupRemoveHandler = () => {
        console.log("removing from group")
    }

    return (
        <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
            {
                chat.isGroupChat ?
                    <>
                        <Flexbox sx={{ flexDirection: "column", minHeight: "20vh" }}>
                            <Typography sx={{ fontSize: "24px", fontWeight: 500 }}>
                                Group Admin: {chat.otherMembers.filter((member => member._id === chat.groupAdmin))[0]?.username || loggedInUser.username}
                            </Typography>
                            <Typography sx={{ fontSize: "20px", fontWeight: 300 }}>Created {moment(chat.createdAt, "YYYYMMDD").fromNow()}</Typography>
                        </Flexbox>

                        <Typography sx={{ fontSize: "24px", m: "3% 0%", textAlign: "center" }}>Group Members</Typography>
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
                    </>
                    :
                    <Flexbox sx={{ minHeight: "30vh", flexDirection: "column", gap: 3 }}>
                        <Avatar src={chat.otherMembers[0].profilePicture || UserIcon} sx={{ width: 150, height: 150 }} />
                        <Typography sx={{ fontSize: "24px" }}>{chat.otherMembers[0].username}</Typography>
                        <Typography sx={{ fontSize: "20px" }}>Joined {moment(chat.otherMembers[0].createdAt, "YYYYMMDD").fromNow()}</Typography>
                    </Flexbox>
            }
        </Box >
    )
}

export default Status