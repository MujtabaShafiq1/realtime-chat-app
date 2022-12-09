import { useSelector } from 'react-redux'
import { Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import moment from 'moment';

import UserImage from "../../assets/User/user.jpg";

const SingleChatbar = () => {

    const chat = useSelector((state) => state.chat)

    return (
        <Flexbox sx={{ minHeight: "35vh", flexDirection: "column", gap: 3 }}>
            <Avatar src={chat.otherMembers[0].profilePicture || UserImage} sx={{ width: 150, height: 150 }} />
            <Typography sx={{ fontSize: "24px" }}>{chat.otherMembers[0].username}</Typography>
            <Typography sx={{ fontSize: "20px" }}>Joined {moment(chat.otherMembers[0].createdAt, "YYYYMMDD").fromNow()}</Typography>
        </Flexbox>
    )
}

export default SingleChatbar