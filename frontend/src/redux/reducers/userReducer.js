const userReducer = (
    state = { isLogged: false, currentContact: 0 },
    action
) => {
    switch (action.type) {
        case 'SET_PROP':
            state[action.payload.prop] = action.payload.value
            return state
        default:
            return state
    }
}

export default userReducer
