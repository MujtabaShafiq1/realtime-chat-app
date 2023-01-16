import { useSelector } from "react-redux"
import { Box, Typography } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"
import RecentUserbox from "../Userbar/RecentUserbox"

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
                                    <RecentUserbox chat={chat} members={chat.members.filter(member => member._id !== userId)} />
                                </Box>
                            )
                        })}
                    </>
                    :
                    <Flexbox sx={{ minHeight: "50vh" }}>
                        <Typography sx={{ color: "text.secondary", opacity: 0.8, textAlign: "center", fontSize: "20px" }}>
                            Your recent Chat box is empty
                        </Typography>
                    </Flexbox>
            }
        </Box>
    )
}

export default RecentChats