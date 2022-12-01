import { useSelector } from 'react-redux'
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import moment from 'moment';

import UserIcon from "../../assets/user.jpg";
import GroupBar from "./GroupBar";

const Status = () => {

    const chat = useSelector((state) => state.chat)

    return (
        <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
            {
                chat.isGroupChat ?
                    <GroupBar />
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