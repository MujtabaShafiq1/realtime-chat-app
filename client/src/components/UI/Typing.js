import { Box, Avatar } from "@mui/material";
import { useSelector } from "react-redux";

import animationData from "../../animations/typing.json"
import Lottie from "react-lottie";

import UserImage from "../../assets/User/user.jpg"

const Typing = ({ user }) => {

    const members = useSelector((state) => state.chat.otherMembers)

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
                <Avatar src={members.find(u => u._id === user).profilePicture || UserImage} />
                <Lottie options={defaultOptions} style={{ height: 35, width: 65, borderRadius: "30px" }} />
            </Box >
        </>

    )
}

export default Typing