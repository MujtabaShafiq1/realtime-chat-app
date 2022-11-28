import { useDispatch, useSelector } from 'react-redux'
import { chatActions } from '../../store/chatSlice';
import { Flexbox } from '../../misc/MUIComponents'
import { Box, Typography } from '@mui/material'
import Userbox from '../Userbar/Userbox';
import axios from "axios"

const SearchedChats = ({ searchedUsers }) => {

    const dispatch = useDispatch();
    const userId = useSelector((state) => state.user.details.id)
    const chat = useSelector((state) => state.chat)

    const chatHandler = async (member) => {

        if (chat.otherMembers.includes(member)) return;

        const response = await axios.get(`${process.env.REACT_APP_SERVER}/chat/find/${userId}/${member._id}`)

        const activeChat = {
            chatId: response.data[0]?._id,
            otherMembers: (response.data[0]?.members.filter(memberId => memberId._id !== userId) || [member]),
            createdAt: response.data[0]?.createdAt,
        }

        dispatch(chatActions.conversation(activeChat))
    }

    return (
        <>
            <Typography sx={{ fontSize: "22px", m: "3% 0%", textAlign: "center" }}>Searching user</Typography>
            {searchedUsers.length > 0 ?
                <>
                    {searchedUsers.map(user =>
                        <Box key={user._id} onClick={() => chatHandler(user)}>
                            <Userbox user={user} />
                        </Box>
                    )}
                </>
                :
                <Flexbox sx={{ minHeight: "50vh" }}>No users found</Flexbox>
            }
        </>
    )
}

export default SearchedChats