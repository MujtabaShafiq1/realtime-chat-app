import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const createChat = createAsyncThunk("chat/newChat", async (arg, { rejectWithValue }) => {
    try {

        const response = await axios.post(`${process.env.REACT_APP_SERVER}/chat`, {
            senderId: arg.senderId,
            receiverId: arg.receivers.map(user => user._id)
        })
        const { _id, isGroupChat, groupAdmin, createdAt } = response.data
        const newChat = { chatId: _id, isGroupChat, groupAdmin, otherMembers: arg.receivers, createdAt }
        return newChat;

    } catch (e) {
        return rejectWithValue(e.response.data.message)
    }
})
