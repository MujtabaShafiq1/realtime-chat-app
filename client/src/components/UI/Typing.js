import { Avatar } from "@mui/material";
import Lottie from "react-lottie";
import { useSelector } from "react-redux";
import animationData from "../../animations/typing.json"
import { Box } from "@mui/material";
import UserImage from "../../assets/user.jpg"

const Typing = () => {

    const userId = useSelector((state) => state.user.details.id)
    const typingUser = useSelector((state) => state.chat.users).filter(user => user._id !== userId)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    return (

        <>
            <Box sx={{ display: "flex", float: "left", gap: 2, marginTop: "1%" }} >
                <Avatar src={typingUser[0].profilePicture || UserImage} />
                <Lottie options={defaultOptions} style={{ height: 35, width: 65, borderRadius: "30px" }} />
            </Box >
        </>

    )
}

export default Typing