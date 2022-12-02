import { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useFormik } from "formik"
import axios from "axios"

import { Box, Grid, Typography, InputAdornment, IconButton, Divider } from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Flexbox, StyledButton, StyledField } from '../misc/MUIComponents';
import { signupSchema } from '../utils/validationSchema';
import CustomSnackbar from '../components/UI/CustomSnackbar';

import background from "../assets/auth.png"
import WelcomeImage from "../assets/welcome3.jpg"


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

    const navigate = useNavigate();
    const [file, setFile] = useState(null)
    const [imageUploaded, setImageUploaded] = useState(null)
    const [showPassword, setShowPassword] = useState(false)
    const [showconfirmedPassword, setShowConfirmedPassword] = useState(false)
    const [snackbar, setSnackbar] = useState({ open: false, details: "" })

    const formik = useFormik({
        initialValues: {
            email: "",
            username: "",
            password: "",
            confirmedPassword: "",
        },
        validationSchema: signupSchema,
        onSubmit: (values) => {
            signupHandler(values)
        },
    });

    const imageHandler = async (image) => {
        if (image.type === "image/jpeg" || image.type === "image/png") {
            const data = new FormData();
            data.append("file", image);
            data.append("upload_preset", "chatting-app");
            data.append("cloud_name", "dkai1pma6");
            const response = await axios.post("https://api.cloudinary.com/v1_1/dkai1pma6/image/upload", data)
            setFile(response.data.url.toString());
            setImageUploaded(image)
        }
    }

    const signupHandler = async (data) => {
        try {
            const { email, username, password } = data;
            const user = { email, username, password, file };
            await axios.post(`${process.env.REACT_APP_SERVER}/token`, user)
            navigate("/email", { state: { email: email } })
        } catch (e) {
            console.clear()
            const error = e.response.data.message.split('"')[1];
            setSnackbar({ open: true, details: `${error} is already taken` })
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

                <Flexbox sx={{ bgcolor: "white", minHeight: '65vh', width: { xs: "80%", md: "60%" }, borderRadius: "10px", boxShadow: "10px 10px 5px rgba(180, 180, 180, 0.5)" }}>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 4, marginLeft: "5%" }}>

                        <Box>
                            <Typography sx={{ fontSize: "32px" }} fontWeight={500}>SIGN UP  </Typography>
                            <Typography sx={{ fontSize: "20px" }} color="gray" fontWeight={300}>create account to continue</Typography>
                        </Box>

                        <form onSubmit={formik.handleSubmit} autoComplete="off" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

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
                                placeholder="Enter Username"
                                id="username"
                                name="username"
                                size="small"
                                hiddenLabel
                                value={formik.values.username}
                                onChange={formik.handleChange}
                                helperText={formik.touched.username && formik.errors.username}
                                error={formik.touched.username && Boolean(formik.errors.username)}
                                InputProps={{
                                    disableUnderline: true,
                                }}
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

                            <StyledField
                                variant="filled"
                                placeholder="Confirm Password"
                                id="confirmedPassword"
                                name="confirmedPassword"
                                type={showconfirmedPassword ? "text" : "password"}
                                size="small"
                                hiddenLabel
                                value={formik.values.confirmedPassword}
                                onChange={formik.handleChange}
                                helperText={formik.touched.confirmedPassword && formik.errors.confirmedPassword}
                                error={formik.touched.confirmedPassword && Boolean(formik.errors.confirmedPassword)}
                                InputProps={{
                                    disableUnderline: true,
                                    endAdornment: (
                                        <InputAdornment position="end" >
                                            <IconButton onClick={() => setShowConfirmedPassword((prev) => !prev)} >
                                                {showconfirmedPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Box display="flex" alignItems="center" gap={2}>
                                <StyledButton variant="contained" component="label" sx={{ backgroundColor: "gray", width: "auto" }}>
                                    <Typography sx={{ fontSize: "12px" }}>Upload Image</Typography>
                                    <input type="file" hidden onChange={(e) => imageHandler(e.target.files[0])} />
                                </StyledButton>
                                <Typography sx={{ fontSize: "11px" }}>{imageUploaded?.name}</Typography>
                            </Box>


                            <Flexbox sx={{ justifyContent: "left", gap: 2, width: "90%" }}>
                                <StyledButton type="submit" sx={{ backgroundColor: "rgba( 76,76,163, 1 )" }}>
                                    Signup
                                </StyledButton>
                                <Flexbox sx={{ gap: 1 }}>
                                    <Typography sx={{ fontSize: "16px", display: { xs: "none", md: "block" } }}>Already have an account ? </Typography>
                                    <Typography sx={{ color: "green", cursor: "pointer", fontSize: "16px" }} onClick={() => navigate("/login")}>Login</Typography>
                                </Flexbox>
                            </Flexbox>

                        </form>
                    </Box>

                    <Divider orientation='vertical' sx={{ height: "35vh", bgcolor: "purple", opacity: "0.1" }} />
                    <Box component="img" src={WelcomeImage} sx={{ height: "auto", width: "45%", display: { xs: "none", md: "none", lg: "block" } }} />

                </Flexbox>
            </Grid >
        </>
    )
}

export default Login