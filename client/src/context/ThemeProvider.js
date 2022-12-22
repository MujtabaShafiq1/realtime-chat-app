import { useState, useMemo } from "react";
import { createContext } from "react"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import theme from "../theme/theme";

export const ThemeContext = createContext({
    toggleColorMode: () => { },
    mode: "light",
});

export const ThemeContextProvider = ({ children }) => {

    const [mode, setMode] = useState("light")

    const colorMode = useMemo(() => ({
        toggleColorMode: () => {
            setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        }, mode
    }), [mode]);

    const themeMode = useMemo(() => createTheme(theme(mode)), [mode]);

    return (
        <ThemeContext.Provider value={colorMode}>
            <ThemeProvider theme={themeMode}>
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>)
}