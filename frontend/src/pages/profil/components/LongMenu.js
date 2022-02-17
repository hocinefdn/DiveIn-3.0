import * as React from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { api } from '../../../constants/constants'

const axios = require('axios')
const ITEM_HEIGHT = 48
// const options = ['Abonner', 'Bloquer']
function LongMenu({ changeBloque }, { changeFollow }) {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }
    const [isFollowed, setIsFollowed] = useState()
    const [isBloque, setIsBloque] = useState()

    const user = useSelector((state) => state.user)
    const params = useParams()
    function changeBloque() {
        if (isBloque) {
            axios
                .post(`${api}messagerie/messagedeblock`, {
                    id_sender: user.id,
                    id_reciever: params.id,
                })
                .then((res) => {
                    setIsBloque(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            axios
                .post(`${api}messagerie/messageblock`, {
                    id_sender: user.id,
                    id_reciever: params.id,
                })
                .then((res) => {
                    setIsBloque(true)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
    function changeFollow() {
        if (!isFollowed) {
            axios
                .post(`${api}user/follow`, {
                    follower_id: user.id,
                    followed_id: params.id,
                })
                .then((res) => {
                    setIsFollowed(true)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            axios
                .post(`${api}user/unfollow`, {
                    follower_id: user.id,
                    followed_id: params.id,
                })
                .then((res) => {
                    setIsFollowed(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                id="long-menu"
                MenuListProps={{
                    'aria-labelledby': 'long-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '20ch',
                    },
                }}
            >
                <MenuItem onClick={changeFollow}>
                    {!isFollowed ? "S'abonner" : 'Se désabonner'}
                </MenuItem>
                <MenuItem onClick={changeBloque}>
                    {!isBloque ? 'Bloquer' : 'Débloquer'}
                </MenuItem>
            </Menu>
        </div>
    )
}
