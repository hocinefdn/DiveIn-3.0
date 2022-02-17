import React, { useState, useEffect } from 'react'
import { Layout, Menu } from 'antd'
import { Link } from 'react-router-dom'
import './style.css'
import { useCookies } from 'react-cookie'
import { setProp } from '../../redux/actions/userActions'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import {
    BellOutlined,
    DownloadOutlined,
    HomeOutlined,
    LogoutOutlined,
    MailOutlined,
    SettingOutlined,
    UserOutlined,
} from '@ant-design/icons'

function MenuGauche() {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const confirmation = () => {
        let modal = document.getElementById('alerrrt')
        modal.classList.toggle('show')
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

    const { Sider } = Layout
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
            <Sider
                className="fixed hauteur border-menu"
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {}}
                onCollapse={(collapsed, type) => {}}
                theme="light"
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
                        onClick={confirmation}
                    >
                        Déconnexion
                    </Menu.Item>
                </Menu>
            </Sider>
        </div>
    )
}

export default MenuGauche
