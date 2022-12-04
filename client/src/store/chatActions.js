import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const createChat = createAsyncThunk("chat/newChat", async (arg, { rejectWithValue }) => {
    try {

        const response = await axios.post(`${process.env.REACT_APP_SERVER}/chat`, arg)
        return response.data;

    } catch (e) {
        return rejectWithValue(e.response.data.message)
    }
})
