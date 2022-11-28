import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: null,
    isGroupChat: null,
    groupAdmin: null,
    otherMembers: [],
    createdAt: null
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        conversation(state, action) {

            state.chatId = action.payload.chatId;
            state.isGroupChat = action.payload.isGroupChat || null;
            state.otherMembers = action.payload.otherMembers;
            state.groupAdmin = action.payload.groupAdmin || null;
            state.createdAt = action.payload.createdAt;

        },
        reset: () => initialState
    },
})

export const chatActions = chatSlice.actions;
export default chatSlice;