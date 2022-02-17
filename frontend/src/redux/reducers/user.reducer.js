import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
const initialStateUser = {
    id: '',
    firstname: '',
    lastname: '',
    birthday: '',
    gender: '',
    image: '',
    email: '',
    biographie: '',
}
export const GET_USER = 'GET_USER'

export const userSlice = createSlice({
    name: 'user',
    initialState: { value: initialStateUser },
    reducers: {
        getUser: (state) => {},
        // (id) => {
        //     return async (dispatch) => {
        //         return axios
        //             .get('http://localhost:5000/user/' + id)
        //             .then((res) => {
        //                 dispatch({ type: GET_USER, payload: res.data })
        //             })
        //             .catch((err) => {
        //                 console.log(err)
        //             })
        //     }
        // },
    },
})

export const { getUser } = userSlice.actions

export default userSlice.reducer
