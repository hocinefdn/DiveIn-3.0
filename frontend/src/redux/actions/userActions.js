export const setProp = (prop, value) => {
    return {
        type: 'SET_PROP',
        payload: { prop, value },
    }
}
