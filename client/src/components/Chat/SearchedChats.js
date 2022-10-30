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
        if (member._id === chat?.otherMembers[0]?._id) return;

        // dispatch(chatActions.openChat(member))
        // const response = await axios.get(`${process.env.REACT_APP_SERVER}/chat/find/${userId}/${member._id}`)
        // if (response.data.length === 0 || chat.chatId === response.data[0]._id) return
        // dispatch(chatActions.conversation(response.data[0]))
    }

    return (
        <>
            <Typography sx={{ fontSize: "22px", textAlign: "center" }}>Searching user</Typography>
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