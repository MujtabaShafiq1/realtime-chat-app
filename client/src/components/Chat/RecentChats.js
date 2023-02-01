import { useSelector } from "react-redux"
import { Box, Typography } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"
import RecentUserCard from "../Userbar/RecentUserCard"

const RecentChats = ({ chats }) => {

    const userId = useSelector((state) => state.user.details.id)

    return (
        <Box>
            {
                chats.length > 0 ?
                    <>
                        <Typography sx={{ fontSize: "22px", textAlign: "center", m: "3% 0%" }}>Recent Chats</Typography>
                        {chats.map(chat => {
                            return (
                                <Box key={chat._id}>
                                    <RecentUserCard chat={chat} members={chat.members.filter(member => member._id !== userId)} />
                                </Box>
                            )
                        })}
                    </>
                    :
                    <Flexbox sx={{ minHeight: "30vh" }}>
                        <Typography variant="body" sx={{ color: "text.secondary", opacity: 0.8, textAlign: "center" }}>
                            Your recent Chat box is empty
                        </Typography>
                    </Flexbox>
            }
        </Box>
    )
}

export default RecentChats