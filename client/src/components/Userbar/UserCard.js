import { Typography } from '@mui/material';
import { UserAvatar, UserListContainer } from '../../misc/MUIComponents';
import UserImage from "../../assets/User/user.jpg";

const UserCard = ({ user }) => {
    return (
        <UserListContainer>
            <UserAvatar src={user.profilePicture || UserImage} />
            <Typography variant='subBody'>{user.username}</Typography>
        </UserListContainer>
    )
}

export default UserCard;