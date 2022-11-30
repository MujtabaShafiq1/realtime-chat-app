import { Box, Avatar, Typography } from '@mui/material';
import UserImage from "../../assets/user.jpg";

const Userbox = ({ user }) => {
    return (
        <Box sx={{
            display: "flex",
            gap: 2,
            justifyContent: "left",
            alignItems: "center",
            marginTop: "3%",
            '&:hover': {
                cursor: "pointer",
                backgroundColor: "rgba(239, 239, 240, 0.8)",
            }
        }}
        >
            <Avatar sx={{ width: 50, height: 50, marginLeft: "3%", }} src={user.profilePicture || UserImage} />
            <Typography sx={{ fontSize: "18px" }}>{user.username}</Typography>
        </Box>
    )
}

export default Userbox;