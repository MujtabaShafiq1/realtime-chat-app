import { useDispatch, useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import { Flexbox, UserContainer } from '../../misc/MUIComponents'
import { chatActions } from '../../store/chatSlice';
import UserCard from '../Userbar/UserCard';
import axios from "axios"

const SearchedChats = ({ searchedUsers, clear }) => {

    const dispatch = useDispatch();

    const chat = useSelector((state) => state.chat)
    const userId = useSelector((state) => state.user.details.id)

    const chatHandler = async (member) => {
        clear()

        if (chat.otherMembers.includes(member) && !chat.isGroupChat) return;

        console.log("opening searched chat");
        const response = await axios.get(`${process.env.REACT_APP_SERVER}/chat/find/${userId}/${member._id}`)

        const activeChat = {
            chatId: response.data[0]?._id,
            otherMembers: (response.data[0]?.otherMembers?.filter(memberId => memberId._id !== userId) || [member]),
            createdAt: response.data[0]?.createdAt,
        }
        dispatch(chatActions.conversation(activeChat))
    }

    return (
        <>
            <Typography sx={{ fontSize: "22px", m: "3% 0%", textAlign: "center" }}>Searching user</Typography>
            {searchedUsers.length > 0 ?

                <Box sx={{ maxWidth: "sm", overflow: "auto" }}>
                    {searchedUsers.map(user =>
                        <UserContainer key={user._id} onClick={() => chatHandler(user)}>
                            <UserCard user={user} />
                        </UserContainer>
                    )}
                </Box>
                :
                <Flexbox sx={{ minHeight: "30vh" }}>
                    <Typography variant="body" sx={{ color: "text.secondary", opacity: 0.8, textAlign: "center" }}>
                        No users found
                    </Typography>
                </Flexbox>
            }
        </>
    )
}

export default SearchedChats