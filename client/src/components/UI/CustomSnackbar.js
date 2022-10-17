import { useState } from "react";
import { Snackbar, Alert } from "@mui/material"

const CustomSnackbar = ({ type, details }) => {

    const [snackbar, setSnackbar] = useState(true)
    return (
        <Snackbar
            open={snackbar}
            autoHideDuration={2000}
            onClose={() => { setSnackbar(false) }}
            sx={{
                color: "white",
                width: '100%',
                height: "20%",
                zIndex: 2,
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert severity={type}>{details}</Alert>
        </Snackbar>
    )
}

export default CustomSnackbar;