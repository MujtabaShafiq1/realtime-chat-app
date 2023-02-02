import { Box, TextField, Button, styled, Badge, Typography, Avatar } from "@mui/material"

const Flexbox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})


const MainContainer = styled(Box)(({ theme }) => ({
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.primary,
}))


const DetailBarContainer = styled(Box)(({ theme }) => ({
    width: "22%",
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.down('lg')]: {
        display: "none"
    },
    borderRight: "0.5px solid rgba(102, 51, 153, 0.1)",
}))


const LongTypography = styled(Typography)(({ all, theme }) => ({
    color: all ? theme.palette.text.secondary : theme.palette.text.primary,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
}))


const ChatHeader = styled(Box)(({ theme }) => ({
    gap: 12,
    padding: "2px 10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    borderBottom: "0.1px solid",
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.other,
    boxShadow: "0px 10px 10px rgba(180, 180, 180, 0.4)",
}))

const ChatHeaderContainer = styled(Box)({
    gap: 2,
    flexGrow: 1,
    overflow: "hidden",
    display: "flex",
    alignItems: "left",
    justifyContent: "flex-start",
    flexDirection: "column",
})


const ChatListContainer = styled(Box)({
    display: "flex",
    alignItems: "left",
    justifyContent: "flex-start",
    flexDirection: "column",
    overflow: "hidden",
})


const UserAvatar = styled(Avatar)(({ theme }) => ({
    width: 50,
    height: 50,
    [theme.breakpoints.down('sm')]: {
        width: 35,
        height: 35,
    },
}))

const ChatAvatar = styled(Avatar)(({ visible, sender, theme }) => ({
    display: "block",
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    visibility: (!visible && "hidden"),
    [theme.breakpoints.down("md")]: {
        display: sender ? "block" : "none",
        width: 25,
        height: 25,
    },
}))


const UserListItem = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "5px 10px",
    borderRadius: "20px",
    backgroundColor: "rgba(191,191,191,1)",
    gap: 10,
})


const UserContainer = styled(Box)(({ theme }) => ({
    mt: "3%",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    '&:hover': {
        cursor: "pointer",
        backgroundColor: theme.palette.primary.light,
    }
}))


const StyledField = styled(TextField)(({ auth, error, theme }) => ({
    width: "90%",
    input: {
        color: auth ? "black" : theme.palette.text.primary,
        borderBottom: auth && error && "0.5px solid red",
        background: auth && "rgb(223, 235, 251, 0.5)",
    },
    [`& fieldset`]: {
        borderRadius: "30px",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        border: "1px solid rgb(0, 0, 0, 0.1)",
        background: "rgb(180, 180, 180, 0.3)",
    },
    "& .Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
            border: error ? "0.5px solid red" : "1px solid lightgray",
        }
    },
}))

const StyledButton = styled(Button)(({ theme }) => ({
    padding: "10px",
    borderRadius: "20px",
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.other,
    "&:hover": {
        backgroundColor: theme.palette.primary.other,
        opacity: "0.8"
    },
    [theme.breakpoints.up('md')]: {
        width: "30%"
    },
    [theme.breakpoints.down('md')]: {
        width: "35%"
    },

}))

const TextBox = styled(Box)(({ sender }) => ({
    color: sender ? "black" : "white",
    backgroundColor: sender ? "rgba(228,230,235,0.8)" : "rgba(0,132,255,0.8)",
    padding: "5px 10px",
    borderRadius: "15px",
    wordBreak: "break-word",
    gap: 10
}))


const ImageDetails = styled(Box)(({ theme }) => ({
    gap: 5,
    top: "90%",
    right: "4%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    justifyContent: "flex-end",
}))


const MessageContainer = styled(Box)(({ sender }) => ({
    gap: 10,
    margin: "1% 0%",
    display: "flex",
    flexDirection: sender && "row-reverse",
    alignItems: "center",
    justifyContent: sender ? "flex-between" : "flex-start",
}))


const NewMessageContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: "11px",
    borderTop: "1px solid",
    borderColor: theme.palette.secondary.other,
    backgroundColor: theme.palette.secondary.main,
    boxShadow: "0px -10px 20px rgba(180, 180, 180, 0.4)",
}))



const StyledStatusBadge = styled(Badge)(({ show }) => ({
    '& .MuiBadge-badge': {
        backgroundColor: show ? '#44b700' : "gray",
        color: '#44b700',
        '&::after': {
            display: !show && "none",
            position: 'absolute',
            top: 0,
            left: 0,
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            animation: 'ripple 1.2s infinite ease-in-out',
            border: '1px solid currentColor',
        },
    },
    '@keyframes ripple': {
        '0%': {
            transform: 'scale(.8)',
            opacity: 1,
        },
        '100%': {
            transform: 'scale(2.4)',
            opacity: 0,
        },
    },
}))



export {
    Flexbox,
    TextBox,
    ImageDetails,
    LongTypography,
    MainContainer,
    DetailBarContainer,
    UserAvatar,
    UserListItem,
    UserContainer,
    ChatAvatar,
    ChatHeader,
    ChatHeaderContainer,
    ChatListContainer,
    MessageContainer,
    NewMessageContainer,
    StyledField,
    StyledButton,
    StyledStatusBadge,
}