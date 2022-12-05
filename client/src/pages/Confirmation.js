import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Box, Typography, Container } from '@mui/material'
import { Flexbox } from '../misc/MUIComponents'
import axios from "axios"

import ErrorImage from "../assets/Email/error.jpg"

const Confirmation = () => {

    const { token } = useParams()
    const navigate = useNavigate()
    const [error, setError] = useState(false)

    const fetchDetails = useCallback(async () => {
        try {
            const response = await axios.post(`/${process.env.REACT_APP_SERVER}/auth/register`, { token: token })
            navigate("/login", { state: { email: response.data.email, password: response.data.password } })
        } catch (e) {
            console.log(e.response);
            setError(true)
        }
    }, [token, navigate])

    useEffect(() => {
        fetchDetails()
    }, [fetchDetails])

    return (
        <>
            {error &&
                <Flexbox sx={{ flexDirection: "column", gap: 2 }}>
                    <Box component="img" src={ErrorImage} sx={{ width: "40%", height: "auto", display: "flex" }} />
                    <Container maxWidth="sm">
                        <Typography variant="h5" color="gray" textAlign="center">
                            Seems like your link is expired due to time expiration or duplicated details, Sign-up and verify account in 1 day
                        </Typography>
                    </Container>
                </Flexbox>
            }
        </>
    )
}

export default Confirmation