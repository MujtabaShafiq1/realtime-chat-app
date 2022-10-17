import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatId: "",
    messages: [],
    groupChat: null,
    users: [],
    selectedUser: null,
    latestMessages: []
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        conversation(state, action) {
            state.chatId = action.payload._id;
            state.groupChat = action.payload.isGroupChat;
            state.users = action.payload.members;
            state.messages = [];
        },
        messages(state, action) {
            state.messages = action.payload;
        },
        addMessage(state, action) {
            state.messages.push(action.payload)
        },
        openChat(state, action) {
            state.selectedUser = { ...action.payload }
            state.chatId = "";
            state.groupChat = null;
            state.users = [];
            state.messages = [];
        },
        latestMessages(state, action) {
            if (!state.latestMessages.some(c => c?.chatId === action.payload.chatId)) {
                state.latestMessages.push(action.payload)
                return;
            }
            const foundIndex = state.latestMessages.findIndex(message => message.chatId === action.payload.chatId);
            state.latestMessages[foundIndex] = action.payload;
        },
        updateReadBy(state, action) {

            const foundIndex = state.latestMessages?.findIndex(message => message?.chatId === action.payload.chatId);
            if (!state.latestMessages[foundIndex]?.readBy?.includes(action.payload.userId)) {
                state.latestMessages[foundIndex]?.readBy.push(action.payload.userId);
            }

            const messageIndex = state.messages?.findIndex(message => message?._id === action.payload.messageId);
            if (!state.messages[messageIndex]?.readBy?.includes(action.payload.userId)) {
                state.messages[messageIndex]?.readBy.push(action.payload.userId);
            }
        },
        reset: () => initialState
    },
})

export const chatActions = chatSlice.actions;
export default chatSlice;