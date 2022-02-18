import * as React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import PersonAdd from '@mui/icons-material/PersonAdd'
import Settings from '@mui/icons-material/Settings'
import Logout from '@mui/icons-material/Logout'
import { Link, useNavigate } from 'react-router-dom'
import photoProfil_vide from '../../assets/images/image_profil_vide.png'
import { useCookies } from 'react-cookie'
import { setProp } from '../../redux/actions/userActions'
import { useDispatch, useSelector } from 'react-redux'
export default function AccountMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const confirmation = () => {
        let modal = document.getElementById('alerrrt')
        modal.classList.toggle('show')
    }

    const Navigate = useNavigate()
    const allerparametre = () => {
        Navigate('../parametres')
    }
    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const deconnexion = () => {
        removeCookie()
        localStorage.setItem('id_user', '')
        dispatch(setProp('id', ''))
        dispatch(setProp('isLogged', false))
        dispatch(setProp('token', ''))
        window.location = '/'
    }

    const closeAlert = () => {
        document.getElementById('alerrrt').classList.toggle('show')
    }
    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                <Tooltip title="Profil" arrow>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 0 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        {user.infoUser.image !== null ? (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={user.infoUser.image}
                                alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                            />
                        ) : (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={photoProfil_vide}
                                alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                            />
                        )}
                        {/* <Avatar sx={{ width: 32, height: 32 }}>N</Avatar> */}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <Link to={'/profil/' + user.id}>
                    <MenuItem>
                        {user.infoUser.image !== null ? (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={user.infoUser.image}
                                alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                            />
                        ) : (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={photoProfil_vide}
                                alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                            />
                        )}
                        Profil
                        {/* <Avatar /> Profile */}
                    </MenuItem>
                </Link>

                <Divider />

                <MenuItem onClick={allerparametre}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Paramètres
                </MenuItem>

                <MenuItem onClick={deconnexion}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Déconnexion
                </MenuItem>
            </Menu>
        </React.Fragment>
    )
}
