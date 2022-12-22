const theme = (mode) => ({
    typography: {
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
                text: {
                    primary: "rgb(0, 0, 0)",
                    secondary: "rgba(128, 128, 128, 1)"
                },
            } : {
                // palette values for dark mode
                primary: {
                    main: "rgb(0, 0, 0)",
                    light: "rgba(128, 128, 128, 0.3)",
                    other: "rgb(255, 255, 255)",
                },
                text: {
                    primary: "rgb(255, 255, 255)",
                    secondary: "rgba(128, 128, 128, 0.6)"
                },
            })
    },
});

export default theme;