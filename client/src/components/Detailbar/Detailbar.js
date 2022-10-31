import moment from 'moment';
import { useSelector } from 'react-redux'
import { Box, Typography, Avatar } from '@mui/material'
import { Flexbox } from '../../misc/MUIComponents'
import UserImage from "../../assets/user.jpg";

const Status = () => {

    const member = useSelector((state) => state.chat.otherMembers[0])

    return (
        <>
            <Box sx={{ minHeight: "100vh", flex: 1.5, borderRight: "0.5px solid rgba(102, 51, 153, 0.1)" }}>
                <Flexbox sx={{ minHeight: "30vh", flexDirection: "column", gap: 3 }}>
                    <Avatar src={member.profilePicture || UserImage} sx={{ width: 150, height: 150 }} />
                    <Typography sx={{ fontSize: "24px" }}>{member.username}</Typography>
                    <Typography sx={{ fontSize: "20px" }}>Joined {moment(member.createdAt, "YYYYMMDD").fromNow()}</Typography>
                </Flexbox>
            </Box>
        </>
    )
}

export default Status