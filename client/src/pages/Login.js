import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Grid, Typography, InputAdornment, Divider, CircularProgress } from "@mui/material"
import { useDispatch } from 'react-redux';
import { useFormik } from "formik";
import axios from "axios"

import { userActions } from '../store/userSlice';
import { Flexbox, StyledButton, StyledField } from '../misc/MUIComponents';
import CustomSnackbar from '../components/UI/CustomSnackbar';
import { loginSchema } from '../utils/validationSchema';

import background from "../assets/background.png"
import LoginImage from "../assets/Login/login.jpg"
import ShowIcon from '@mui/icons-material/Visibility';
import HideIcon from '@mui/icons-material/VisibilityOff';


const styles = {
    PaperStyles: {
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: "100vh",
        width: "100vw",
    },
};


const Login = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, details: "" })

    const formik = useFormik({
        initialValues: {
            email: location.state?.email || "",
            password: location.state?.password || "",
        },
        validationSchema: loginSchema,
        onSubmit: (values) => {
            loginHandler(values)
        },
    });

    const loginHandler = async (data) => {
        try {
            setLoading(true)
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/auth/login`, data)
            const user = response.data.details;
            dispatch(userActions.login(user))
            setLoading(false)
            navigate("/")
        } catch (e) {
            console.clear()
            setLoading(false)
            setSnackbar({ open: true, details: e.response.data.message })
            setTimeout(() => {
                setSnackbar({ open: false, details: "" })
            }, 2000)
        }
    }

    return (

        <>
            {snackbar.open && < CustomSnackbar type="error" details={snackbar.details} />}

            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={styles.PaperStyles}
            >

                <Flexbox
                    sx={{
                        bgcolor: "white",
                        minHeight: '55vh',
                        width: { xs: "80%", md: "60%" },
                        borderRadius: "10px",
                        boxShadow: "10px 10px 5px rgba(180, 180, 180, 0.5)"
                    }}
                >

                    <Box component="img" src={LoginImage} sx={{ height: "auto", width: "45%", flex: 1, display: { xs: "none", md: "block" } }} />

                    <Divider orientation='vertical' sx={{ height: "35vh", marginRight: "6%", bgcolor: "purple", opacity: "0.1" }} />

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 4, padding: "10px" }}>


                        <Typography variant="header" sx={{ fontWeight: 500 }} >Welcome Back</Typography>
                        <Typography variant="subBody" sx={{ color: "gray", fontWeight: 300 }} >login to continue</Typography>


                        <form onSubmit={formik.handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 20, }}>

                            <StyledField
                                variant="filled"
                                placeholder="Enter Email"
                                id="email"
                                name="email"
                                type="email"
                                size="small"
                                hiddenLabel
                                auth={+true}
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                helperText={formik.touched.email && formik.errors.email}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                InputProps={{ disableUnderline: true }}
                            />

                            <StyledField
                                variant="filled"
                                placeholder="Enter Password"
                                id="password"
                                name="password"
                                size="small"
                                hiddenLabel
                                auth={+true}
                                type={showPassword ? "text" : "password"}
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                helperText={formik.touched.password && formik.errors.password}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Box sx={{ height: 25, width: 25, cursor: "pointer" }} onClick={() => setShowPassword((prev) => !prev)}>
                                                {showPassword ? <HideIcon sx={{ color: "black" }} /> : <ShowIcon sx={{ color: "black" }} />}
                                            </Box>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <StyledButton type="submit" disabled={loading} sx={{ width: "25%", backgroundColor: "rgba( 76,76,163, 1 )" }}>
                                {loading ? <CircularProgress sx={{ size: "26px", color: "white" }} /> : <Typography>login</Typography>}
                            </StyledButton>

                            <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                                <Typography sx={{ fontSize: "15px" }}>Dont have an account? </Typography>
                                <Typography sx={{ color: "green", cursor: "pointer", fontSize: "15px" }} onClick={() => navigate("/signup")}>
                                    Signup now
                                </Typography>
                            </Box>

                        </form>
                    </Box>
                </Flexbox>
            </Grid >
        </>
    )
}

export default Login