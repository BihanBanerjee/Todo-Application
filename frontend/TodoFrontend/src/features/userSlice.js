import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    status: 'idle',
    error: null,
};

export const signUp = createAsyncThunk('user/signUp', async (userData, {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/signup', userData);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const signIn = createAsyncThunk('user/signIn', async (credentials, {rejectWithValue}) => {
    try {
        const response = await axios.post('http://localhost:3000/api/users/signin', credentials);
        localStorage.setItem('token', response.data.token);
        return response.data;
    } catch (error) {
        rejectWithValue(error);
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signOut: (state) => {
            state.user = null;
            state.token = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers(builder){
        builder
            .addCase(signUp.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                //state.token = action.payload.token;
                state.token = localStorage.getItem('token');
                
            })
            .addCase(signUp.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(signIn.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(signIn.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                //state.token = action.payload.token;
                state.token = localStorage.getItem('token');
            })
            .addCase(signIn.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default userSlice.reducer;
export const { signOut } = userSlice.actions;