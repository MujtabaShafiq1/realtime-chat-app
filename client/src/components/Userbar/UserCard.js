import { Typography } from '@mui/material';
import { Flexbox, UserAvatar } from '../../misc/MUIComponents';
import UserImage from "../../assets/User/user.jpg";

const UserCard = ({ user }) => {
    return (
        <Flexbox sx={{ gap: 1, justifyContent: "flex-start" }}>
            <UserAvatar src={user.profilePicture || UserImage} />
            <Typography variant='subBody'>{user.username}</Typography>
        </Flexbox>
    )
}

export default UserCard;