import moment from 'moment';
import { useSelector } from 'react-redux'
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'

import Userbox from '../Userbar/Userbox';
import UserImage from "../../assets/user.jpg";

const Status = () => {

    const chat = useSelector((state) => state.chat)

    return (
        <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
            {
                chat.isGroupChat ?
                    <>
                        <Typography sx={{ fontSize: "24px", m: "3% 0%", textAlign: "center" }}>Group Members</Typography>
                        {chat.otherMembers.map(user =>
                            <Userbox user={user} />
                        )}
                    </>
                    :
                    <Flexbox sx={{ minHeight: "30vh", flexDirection: "column", gap: 3 }}>
                        <Avatar src={chat.otherMembers[0].profilePicture || UserImage} sx={{ width: 150, height: 150 }} />
                        <Typography sx={{ fontSize: "24px" }}>{chat.otherMembers[0].username}</Typography>
                        <Typography sx={{ fontSize: "20px" }}>Joined {moment(chat.otherMembers[0].createdAt, "YYYYMMDD").fromNow()}</Typography>
                    </Flexbox>
            }
        </Box>
    )
}

export default Status