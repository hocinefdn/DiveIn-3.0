import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { width } from '@mui/system'
import { useSelector } from 'react-redux'

export default function ImageAvatars() {
    const user = useSelector((state) => state.user)
    return (
        <Stack direction="row" spacing={2}>
            <Avatar
                alt="avatar profil"
                // src={user.image}
                sx={{ width: 31, height: 31 }}
            />
        </Stack>
    )
}
