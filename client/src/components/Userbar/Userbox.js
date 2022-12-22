import { Box, Avatar, Typography } from '@mui/material';
import UserImage from "../../assets/User/user.jpg";

const Userbox = ({ user }) => {
    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            justifyContent: "left",
            alignItems: "center",
            padding: "10px",
            '&:hover': { cursor: "pointer", backgroundColor: "primary.light" }
        }}
        >
            <Avatar sx={{ width: 50, height: 50 }} src={user.profilePicture || UserImage} />
            <Typography sx={{ fontSize: "18px" }}>{user.username}</Typography>
        </Box>
    )
}

export default Userbox;