import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: null,
    isGroupChat: null,
    groupAdmin: null,
    otherMembers: [],
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        conversation(state, action) {
            state.chatId = action.payload.chatId || null;
            state.isGroupChat = action.payload.isGroupChat || null;
            state.otherMembers = action.payload.otherMembers;
            state.groupAdmin = action.payload.groupAdmin || null;
        },
        reset: () => initialState
    },
})

export const chatActions = chatSlice.actions;
export default chatSlice;