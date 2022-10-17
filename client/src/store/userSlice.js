import { createSlice } from "@reduxjs/toolkit";
import { checkUser } from "./userActions";

const initialState = {
    details: {
        id: "",
        username: "",
        email: "",
        profilePicture: "",
    },
    status: null,
    error: null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login(state, action) {
            state.details.id = action.payload._id;
            state.details.username = action.payload.username;
            state.details.email = action.payload.email;
            state.details.profilePicture = action.payload.profilePicture;
            state.status = true;
        },
        logout(state, action) {
            state.details = initialState.details;
            state.error = "";
            state.status = false;
        },
    },
    extraReducers: (builder) => {

        builder.addCase(checkUser.pending, (state, action) => {
            state = initialState
        })

        builder.addCase(checkUser.rejected, (state, action) => {
            state.status = false
            state.error = action.payload;
        })

        builder.addCase(checkUser.fulfilled, (state, action) => {
            state.details = { ...action.payload };
            state.status = true;
        })
    }
})

export const userActions = userSlice.actions;

export default userSlice;