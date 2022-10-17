import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const checkUser = createAsyncThunk("user/checkToken", async (arg, { rejectWithValue }) => {
    try {
        const response = await axios.get(`/${process.env.REACT_APP_SERVER}/user/me`)
        return response.data;
    } catch (e) {
        return rejectWithValue(e.response.data.message)
    }
})