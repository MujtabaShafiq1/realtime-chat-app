import { Box, TextField, Button, styled, Badge, Typography } from "@mui/material"

const Flexbox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})

const LatestText = styled(Typography)(({ all, theme }) => ({
    fontWeight: 400,
    // color: all ? "lightgray" : "black",
    color: theme.palette.text.secondary,
    [theme.breakpoints.down(750)]: {
        display: 'none'
    },
    [theme.breakpoints.down("sm")]: {
        display: "block",
    },
}))

const UserContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    [theme.breakpoints.up(750)]: {
        flexDirection: 'row',
        gap: 10,
    },
    [theme.breakpoints.down(750)]: {
        flexDirection: 'column',
        gap: 0,
    },
    [theme.breakpoints.down("sm")]: {
        flexDirection: 'row',
        gap: 10,
    },
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
    [theme.breakpoints.down('sm')]: {
        width: "25%"
    },
}))

const TextBox = styled(Box)(({ sender }) => ({
    display: "flex",
    color: sender ? "black" : "white",
    backgroundColor: sender ? "lightgray" : "lightblue",
    padding: "5px 10px",
    borderRadius: "15px",
    wordBreak: "break-word",
    gap: 10
}))


const MessageContainer = styled(Box)(({ sender, consecutive, theme }) => ({
    display: "flex",
    flexDirection: sender && "row-reverse",
    gap: 15,
    alignItems: "center",
    justifyContent: sender ? "flex-between" : "flex-start",
    [theme.breakpoints.down("sm")]: {
        margin: sender ? "0 1% 0.5% 0" : "0 0 0.5% 1%",
    },
    [theme.breakpoints.up("sm")]: {
        margin: sender ? (!consecutive ? "0 6% 0.5% 0" : "0 1% 0.4% 0") : (!consecutive && "0 0 0.4% 5%"),
    },
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

const ChatContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1% 2%",
    borderBottom: "0.1px solid",
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.secondary.other,
    boxShadow: "0px 10px 10px rgba(180, 180, 180, 0.4)",
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
    StyledField,
    StyledButton,
    TextBox,
    LatestText,
    UserContainer,
    MessageContainer,
    StyledStatusBadge,
    NewMessageContainer,
    ChatContainer
}