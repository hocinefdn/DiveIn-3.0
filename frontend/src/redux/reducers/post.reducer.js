import { createSlice } from '@reduxjs/toolkit'

const initialStatePosts = { content: '', id_user: '', type_post: '' }

export const postSlice = createSlice({
    name: 'posts',
    initialState: {
        value: initialStatePosts,
    },
    reducers: {
        addPosts: (state, action) => {
            state.value = action.payload
        },
    },
})

export const { addPosts } = postSlice.actions

export default postSlice.reducer
