import { Box, TextField, Button, styled, Badge } from "@mui/material"

const Flexbox = styled(Box)({
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
})

const StyledField = styled(TextField)(({ error }) => ({
    width: "80%",
    backgroundColor: "rgba( 232, 240, 254, 0.75 )",
    borderBottom: !error && "0.5px solid #4c4ca3",
    input: {
        borderBottom: error && "0.5px solid red"
    },
    textarea: { color: 'black' },
}))

const StlyedButton = styled(Button)(({ theme }) => ({
    color: "white",
    padding: "10px",
    borderRadius: "20px",
    "&:hover": {
        backgroundColor: "blue",
        opacity: "0.5"
    },
    [theme.breakpoints.down('md')]: {
        width: "35%"
    },
    [theme.breakpoints.down('sm')]: {
        width: "43%"
    },
    [theme.breakpoints.up('md')]: {
        width: "30%"
    },
}))

const TextBox = styled(Box)(({ sender }) => ({
    display: "flex",
    justifyContent: "center",
    alignItems: "end",
    color: sender ? "black" : "white",
    backgroundColor: sender ? "lightgray" : "lightblue",
    padding: "5px 10px",
    maxWidth: "50%",
    borderRadius: "15px",
    wordBreak: "break-word",
    gap: 10
}))

const ImageBox = styled(Box)({
    display: "flex",
    justifyContent: "right",
    alignItems: "end",
    backgroundColor: "lightgray",
    padding: "2px",
    borderRadius: "15px",
})

const MessageContainer = styled(Box)(({ sender, consecutive }) => ({
    display: "flex",
    flexDirection: sender && "row-reverse",
    gap: 15,
    margin: sender ? (!consecutive ? "0 6% 0.4% 0" : "0 1% 0.4% 0") : (!consecutive && "0 0% 0.4% 5%"),
    alignItems: "center",
    justifyContent: sender ? "flex-between" : "flex-start"
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



export { Flexbox, StyledField, StlyedButton, TextBox, ImageBox, MessageContainer, StyledStatusBadge }