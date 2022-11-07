import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: null,
    isGroupChat: null,
    otherMembers: [],
    messageRead: []
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        conversation(state, action) {
            state.chatId = action.payload.chatId || null;
            state.isGroupChat = action.payload.isGroupChat || null;
            state.otherMembers = action.payload.otherMembers;
        },
        readBy(state, action) {
            console.log(action.payload)
        },
        reset: () => initialState
    },
})

export const chatActions = chatSlice.actions;
export default chatSlice;