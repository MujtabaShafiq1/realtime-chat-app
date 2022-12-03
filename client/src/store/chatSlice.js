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
            state.chatId = action.payload.chatId || null;
            state.isGroupChat = action.payload.isGroupChat || null;
            state.otherMembers = action.payload.otherMembers;
            state.groupAdmin = action.payload.groupAdmin || null;
            state.createdAt = action.payload.createdAt || null;
        },
        removeUser(state, action) {
            state.otherMembers = state.otherMembers.filter(member => !JSON.stringify(action.payload).includes(member._id));
        },
        addUser(state, action) {
            state.otherMembers.push(...action.payload)
        },
        reset: () => initialState
    },
})

export const chatActions = chatSlice.actions;
export default chatSlice;