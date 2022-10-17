import { Typography } from '@mui/material'
import { Flexbox } from '../misc/MUIComponents'

const NotFound = () => {

    return (
        <Flexbox sx={{ minHeight: "80vh" }}>
            <Typography variant="h3" sx={{ textAlign: "center", textJustify: "inter-word" }}>Page not found</Typography>
        </Flexbox>
    )
}

export default NotFound