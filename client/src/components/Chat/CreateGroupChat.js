import { useState } from "react"
import { Box, Typography, Avatar } from "@mui/material"
import { Flexbox } from "../../misc/MUIComponents"

import UserImage from "../../assets/user.jpg";
import AddIcon from "../../assets/add.png"
import RemoveIcon from "../../assets/remove.png"
import CloseIcon from "../../assets/close.png"
import RemoveCircleIcon from "../../assets/remove-circle.png"

const CreateGroupChat = ({ users, close }) => {

    const [addedUsers, setAddedUsers] = useState([])

    const clickHandler = (user) => {
        if (addedUsers.some(member => member.id.includes(user._id))) {
            setAddedUsers(addedUsers.filter(member => member.id !== user._id))
            return;
        }
        setAddedUsers(prev => [...prev, { id: user._id, username: user.username }])
    }


    return (
        <>
            <Flexbox sx={{ justifyContent: "space-around" }}>
                <Typography sx={{ fontSize: "22px", m: "3% 0%" }}>Create New Group</Typography>
                <Box
                    component="img"
                    sx={{ width: 30, height: "auto", cursor: "pointer" }}
                    src={CloseIcon}
                    onClick={close}
                />
            </Flexbox>

            {addedUsers.length > 0
                &&
                <Flexbox sx={{ justifyContent: "flex-start", flexWrap: "wrap", gap: 1 }}>
                    {addedUsers.map(user => {
                        return (

                            <Flexbox key={user.id} sx={{ padding: "5px 10px", borderRadius: "20px", backgroundColor: "rgba(191,191,191,1)", gap: 0.5 }}>
                                <Typography sx={{ color: "black", fontSize: "12px" }}>{user.username}</Typography>
                                <Box
                                    component="img"
                                    sx={{ width: 15, height: "auto", cursor: "pointer" }}
                                    src={RemoveCircleIcon}
                                    onClick={() => clickHandler(user)}
                                />
                            </Flexbox>
                        )
                    })}
                </Flexbox>
            }

            {users.map(user =>
                <Flexbox key={user._id} sx={{
                    mt: "3%",
                    justifyContent: "space-between",
                    '&:hover': {
                        cursor: "pointer",
                        backgroundColor: "rgba(239, 239, 240, 0.8)",
                    }
                }}
                >
                    <Flexbox gap={2}>
                        <Avatar sx={{ width: 50, height: 50, marginLeft: "3%", }} src={user.profilePicture || UserImage} />
                        <Typography sx={{ fontSize: "18px" }}>{user.username}</Typography>
                    </Flexbox>
                    <Box
                        component="img"
                        sx={{ width: 20, height: "auto", cursor: "pointer" }}
                        src={addedUsers.some(member => member.id.includes(user._id)) ? RemoveIcon : AddIcon}
                        onClick={() => clickHandler(user)}
                    />
                </Flexbox>
            )
            }
        </>
    )
}

export default CreateGroupChat