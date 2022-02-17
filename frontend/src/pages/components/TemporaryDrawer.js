import * as React from 'react'
import Drawer from '@mui/material/Drawer'
import './style.css'
import {
    BellOutlined,
    DownloadOutlined,
    HomeOutlined,
    LogoutOutlined,
    MailOutlined,
    MenuOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { setProp } from '../../redux/actions/userActions'

export default function TemporaryDrawer() {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    })

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return
        }

        setState({ ...state, [anchor]: open })
    }

    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const confirmation = () => {
        let modal = document.getElementById('alerrrt')
        modal.classList.toggle('show')
        console.log('zzz')
    }

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
        <div>
            <div id="alerrrt" className="alert">
                <div className="rounded-md h-1/3 w-3/4 sm:w-1/2 alert-message">
                    Voulez vous vraiment déconnecter ?
                    <div className="flex flex-col md:flex-row">
                        <button
                            onClick={deconnexion}
                            className="rounded-lg bg-sky-600 hover:bg-sky-500 alert-btn btn-confirm"
                        >
                            Confirmer
                        </button>
                        <button
                            onClick={closeAlert}
                            className="rounded-lg bg-orange-600 hover:bg-orange-400 alert-btn btn-cancel"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
            <div className="leftDrawer relative bottom-3 right-2">
                <React.Fragment key={'left'}>
                    <MenuOutlined
                        onClick={toggleDrawer('left', true)}
                        className="text-lg"
                    />
                    <Drawer
                        left={'left'}
                        open={state['left']}
                        onClose={toggleDrawer('left', false)}
                    >
                        <Menu theme="light" mode="inline">
                            <Menu.Item
                                key="1"
                                icon={<HomeOutlined />}
                                className="text-lg"
                            >
                                <Link to="/home">Accueil</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="2"
                                icon={<BellOutlined />}
                                className="text-lg"
                            >
                                <Link to="/notifications">Notifications</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="3"
                                icon={<MailOutlined />}
                                className="text-lg"
                            >
                                <Link to="/messagerie">Messagerie</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="4"
                                icon={<UserOutlined />}
                                className="text-lg"
                            >
                                <Link to={'/profil/' + user.id}>Profil</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="5"
                                icon={<DownloadOutlined />}
                                icon={
                                    <img src="https://img.icons8.com/external-gradak-royyan-wijaya/16/000000/external-bookmark-gradak-interface-gradak-royyan-wijaya.png" />
                                }
                                className="text-lg"
                            >
                                <Link to="/enregistrements">Enregistré</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="6"
                                icon={<SettingOutlined />}
                                className="text-lg"
                            >
                                <Link to="/parametres">Paramètres</Link>
                            </Menu.Item>

                            <Menu.Item
                                key="7"
                                icon={<LogoutOutlined />}
                                className="text-lg"
                                onClick={deconnexion}
                            >
                                Déconnexion
                            </Menu.Item>
                        </Menu>
                    </Drawer>
                </React.Fragment>
            </div>
        </div>
    )
}
