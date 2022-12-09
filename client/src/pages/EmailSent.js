import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Box, Typography, Container } from '@mui/material'
import { Flexbox } from '../misc/MUIComponents'
import Loader from '../components/UI/Loader'
import { useEffect } from 'react'

import NotificationImage from "../assets/Email/notification.jpg"

const EmailSent = () => {

    const location = useLocation()
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        if (!location.state?.email) navigate("/login")
    })

    if (user.status === null) return <Loader />

    return (
        user.status ?
            <Navigate to="/" replace />
            :
            <>
                <Flexbox sx={{ flexDirection: "column", gap: 2, minHeight: "80vh" }}>
                    <Box component="img" src={NotificationImage} sx={{ width: { xs: "80%", md: "45%" }, display: "flex" }} />
                    <Container maxWidth="sm">
                        <Typography fontSize="22px" color="gray" textAlign="center">
                            We have sent email to : <span style={{ fontWeight: 600, color: "black", wordBreak: "break-word" }}> {location.state?.email} </span>
                            to confirm the validity of your email address. After receiving follow the link provided to complete the registration
                        </Typography>
                    </Container>
                </Flexbox>
            </>
    )
}

export default EmailSent