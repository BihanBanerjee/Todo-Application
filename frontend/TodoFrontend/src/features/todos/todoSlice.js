import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    todos: [],
    status: 'idle', // I want to track the state and error for each of the actions(requests) that we'll be performing.
    error: null,
}

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async (token, { rejectWithValue }) => {
    try{
        const response = await axios.get('http://localhost:3000/api/todos', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const createTodo = createAsyncThunk('todos/createTodo', async ({ todo, token }, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:3000/api/todos', todo, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error);
    }
})

export const updateTodo = createAsyncThunk('todos/updateTodo', async ({ id, todo, token }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:3000/api/todos/${id}`, todo, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        rejectWithValue(error);
    }
})

export const deleteTodo = createAsyncThunk('todos/deleteTodo', async ({ id, token }, { rejectWithValue }) => {
    try {
        const respone = await axios.delete(`http://localhost:3000/api/todos/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        return respone.data;
    } catch (error) {
        rejectWithValue(error);
    }
})

const todoSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {}, // We will not actually be using this one rather we will be using the extraReducers. While performing https requests we'll be having action creators and handling their state in extraReducers.
    extraReducers(builder) {
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.status = 'success';
                state.todos = action.payload;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(createTodo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createTodo.fulfilled, (state, action) => {
                state.status = 'success';
                state.todos.push(action.payload);
            })
            .addCase(createTodo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(updateTodo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateTodo.fulfilled, (state, action) => {
                state.status = 'success';
                const index = state.todos.findIndex( todo =>  todo._id === action.payload._id );
                state.todos[index] = action.payload;
            })
            .addCase(updateTodo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

            .addCase(deleteTodo.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteTodo.fulfilled, (state, action) => {
                state.status = 'success';
                state.todos = state.todos.filter( todo => todo._id !== action.payload.id );
            })
            .addCase(deleteTodo.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
    } 
})

export default todoSlice.reducer;