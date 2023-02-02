import { createBreakpoints } from "@mui/system";

const breakpoints = createBreakpoints({})

const theme = (mode) => ({

    typography: {
        body: {
            fontSize: 20,
            fontWeight: 400,
            [breakpoints.down("sm")]: {
                fontSize: 18
            },
        },
        subBody: {
            fontSize: 18,
            [breakpoints.down("sm")]: {
                fontSize: 16
            },
        },
        content: {
            fontSize: 16,
            [breakpoints.down("sm")]: {
                fontSize: 14
            },
        },
        header: {
            fontSize: 32,
            textAlign: "center",
            [breakpoints.down("md")]: {
                fontSize: 26
            },
        },
        allVariants: {
            fontFamily: '"Poppins", sans-serif',
            textTransform: 'none',
        },
    },
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: {
                    main: "rgb(255, 255, 255)",
                    light: "rgba(239, 239, 240, 0.8)",
                    other: "rgb(0, 0, 0)",
                },
                secondary: {
                    main: "rgba(180, 180, 180, 0.4)",
                    light: "rgba(239, 239, 240, 0.5)",
                    other: "rgba(102, 51, 153, 0.1)",
                },
                text: {
                    primary: "rgb(0, 0, 0)",
                    secondary: "rgba(128, 128, 128, 0.5)"
                },
            } : {
                // palette values for dark mode
                primary: {
                    main: "rgb(0, 0, 0)",                   // main theme color
                    light: "rgba(128, 128, 128, 0.3)",      // hovering effect
                    other: "rgb(255, 255, 255)",            // button opposite 
                },
                secondary: {
                    main: "rgb(24, 24, 24, 1)",             // main chat  ( top and new message )
                    light: "rgba(40, 40, 43, 0.5)",         // chat background
                    other: "rgba(64, 64, 64, 1)",           // borders
                },
                text: {
                    primary: "rgb(255, 255, 255)",          // primary text 
                    secondary: "rgba(128, 128, 128, 0.6)"   // sub text (latest message etc)
                },
            })
    },
});

export default theme;