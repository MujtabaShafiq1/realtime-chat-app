import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from "formik";
import axios from "axios"

import { Box, Grid, Typography, InputAdornment, IconButton, Divider } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Flexbox, StyledButton, StyledField } from '../misc/MUIComponents';
import { loginSchema } from '../utils/validationSchema';

import background from "../assets/auth.png"
import WelcomeImage from "../assets/welcome2.jpg"
import CustomSnackbar from '../components/UI/CustomSnackbar';
import { userActions } from '../store/userSlice';


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
            const response = await axios.post(`${process.env.REACT_APP_SERVER}/auth/login`, data)
            const user = response.data.details;
            dispatch(userActions.login(user))
            navigate("/")
        } catch (e) {
            console.clear()
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

                    <Box component="img" src={WelcomeImage} sx={{ height: "auto", width: "45%", flex: 1, display: { xs: "none", md: "block" } }} />
                    <Divider orientation='vertical' sx={{ height: "35vh", marginRight: "6%", bgcolor: "purple", opacity: "0.1" }} />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                            flex: 4,

                        }}
                    >

                        <Box>
                            <Typography sx={{ fontSize: "30px" }} fontWeight={500}>Welcome Back</Typography>
                            <Typography sx={{ fontSize: "20px" }} variant="h6" color="gray" fontWeight={300}>login to continue</Typography>
                        </Box>

                        <form onSubmit={formik.handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 20, }}>

                            <StyledField
                                variant="filled"
                                placeholder="Enter Email"
                                id="email"
                                name="email"
                                type="email"
                                size="small"
                                hiddenLabel
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
                                type={showPassword ? "text" : "password"}
                                size="small"
                                hiddenLabel
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                helperText={formik.touched.password && formik.errors.password}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <IconButton onClick={() => setShowPassword((prev) => !prev)} >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />



                            <StyledButton type="submit" sx={{ width: "25%", backgroundColor: "rgba( 76,76,163, 1 )" }}>
                                login
                            </StyledButton>

                            <Box display="flex" gap={2} flexDirection={{ xs: "column", md: "row" }}>
                                <Typography sx={{ fontSize: "16px" }}>Dont have an account? </Typography>
                                <Typography sx={{ color: "green", cursor: "pointer", fontSize: "16px" }} onClick={() => navigate("/signup")}>
                                    Signup now !
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