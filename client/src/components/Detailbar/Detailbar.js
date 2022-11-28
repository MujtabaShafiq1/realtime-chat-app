import moment from 'moment';
import { useSelector } from 'react-redux'
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'

import Userbox from '../Userbar/Userbox';
import UserImage from "../../assets/user.jpg";

const Status = () => {

    const chat = useSelector((state) => state.chat)

    console.log(chat.otherMembers.filter((member => member._id === chat.groupAdmin)))

    return (
        <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
            {
                chat.isGroupChat ?
                    <>
                        <Flexbox sx={{ flexDirection: "column", minHeight: "20vh" }}>
                            <Typography sx={{ fontSize: "24px" }}>Group Admin: {chat.otherMembers.filter((member => member._id !== chat.groupAdmin))[0].username}</Typography>
                            <Typography sx={{ fontSize: "24px" }}>Created {moment(chat.createdAt, "YYYYMMDD").fromNow()}</Typography>
                        </Flexbox>

                        <Typography sx={{ fontSize: "24px", m: "3% 0%", textAlign: "center" }}>Group Members</Typography>
                        {
                            chat.otherMembers.map(user =>
                                <Userbox user={user} key={user._id} />
                            )
                        }
                    </>
                    :
                    <Flexbox sx={{ minHeight: "30vh", flexDirection: "column", gap: 3 }}>
                        <Avatar src={chat.otherMembers[0].profilePicture || UserImage} sx={{ width: 150, height: 150 }} />
                        <Typography sx={{ fontSize: "24px" }}>{chat.otherMembers[0].username}</Typography>
                        <Typography sx={{ fontSize: "20px" }}>Joined {moment(chat.otherMembers[0].createdAt, "YYYYMMDD").fromNow()}</Typography>
                    </Flexbox>
            }
        </Box >
    )
}

export default Status