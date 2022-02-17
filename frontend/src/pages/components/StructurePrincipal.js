import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import Complete from './Complete'
import MenuGauche from './MenuGauche'
import TemporaryDrawer from './TemporaryDrawer'
import './style.css'
import logo from '../../assets/logos/DiveIn.png'
import {
    BellOutlined,
    MessageOutlined,
    SearchOutlined,
} from '@ant-design/icons'
import axios from 'axios'
import { api } from '../../constants/constants'
import ImageAvatars from './ImageAvatars'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Tooltip } from '@mui/material'
import AccountMenu from './AccountMenu'
import PetitMenu from './PetitMenu'
import BarreRecherche from './BarreRecherche'

function StructurePrincipal({
    titrePage,
    contenu,
    barreDroite,
    socket,
    lastMessage,
    notificationsMessages,
    setNotificationsMessages,
    nbrLikes,
    nbrComments,
    nbrPosts,
    setNbrLikes,
    setNbrComments,
    setNbrPosts,
}) {
    const user = useSelector((state) => state.user)

    const { Header, Content } = Layout
    const refNotif = React.useRef()
    const refMess = React.createRef()
    const [afficherSearch, setAfficherSearch] = useState(false)
    const [isGetNotifications, setIsGetNotification] = useState(true)

    // const Navigate = useNavigate()
    // une fois user est connecte recupere nbr-notifications
    const GET_NBR_NOTIFICATIONS = () => {
        axios
            .get(`${api}actualite/nbr-notifications/${user.infoUser.id}`)
            .then((res) => {
                setNbrLikes(res.data[0][0].nbrLikes)
                setNbrComments(res.data[1][0].nbrComments)
                // setNbrPosts(res.data[2][0].nbrPosts)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // const allerprofil = () => {
    //     Navigate('../profil/{user.id}')
    const getNotificationsMessages = () => {
        axios
            .get(`${api}messagerie/getNotificationsMessages/${user.id}`)
            .then((res) => {
                setNotificationsMessages(res.data[0].nbr)
                //setNotificationsMessages(res.data[0].nbrNotifications)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        // if (isGetNotifications) {
        getNotificationsMessages()
        GET_NBR_NOTIFICATIONS()
        // }
        // setIsGetNotification(false)
    }, [])

    useEffect(() => {
        // GET_NBR_NOTIFICATIONS()
        if (lastMessage) {
            if (lastMessage.monMessage) {
                setNotificationsMessages((state) => state + 1)
            }
            if (lastMessage.newPost) {
                setNbrPosts((state) => state + 1)
            }
            if (lastMessage.postUncommented) {
                setNbrComments((state) => state - 1)
            }
            if (lastMessage.postCommented) {
                setNbrComments((state) => state + 1)
            }
            if (lastMessage.postUnliked) {
                setNbrLikes((state) => state - 1)
            }
            if (lastMessage.postLiked) {
                setNbrLikes((state) => state + 1)
            }
        }
    }, [lastMessage])

    const CompteurZero = (e) => {
        // e.preventDefault()
        setNbrComments(0)
        setNbrLikes(0)
        setNbrPosts(0)
    }

    return (
        <div className="">
            <Layout>
                <div className="w-1/6 bg-white gauche">
                    <MenuGauche />
                </div>

                <Header
                    className="site-layout-sub-header-background w-full header"
                    style={{
                        padding: 0,
                        position: 'fixed',
                    }}
                >
                    <div className="flex flex-row justify-center ">
                        <div className="absolute mt-2.5 left-5 flex flex-row ">
                            <TemporaryDrawer />
                            <Link to="/home/">
                                <img
                                    src={logo}
                                    alt="logo DiveIn"
                                    className="w-10 h-10"
                                />
                            </Link>
                            <span className="text-lg font-bold m-2 text-blue-400 ">
                                DiveIn
                            </span>
                            <div className="md:ml-4 lg:ml-16 text-lg font-bold m-2 titre-page text-white">
                                {titrePage}
                            </div>
                        </div>

                        <div className=" hidden sm:flex ">
                            <BarreRecherche />
                        </div>
                    </div>
                    <div className="flex flex-row relative float-right bottom-5 right-3 sm:bottom-16 space-x-2.5 items-center justify-center mt-3.5">
                        <button
                            className="mr-1 sm:hidden"
                            onClick={() => {
                                afficherSearch
                                    ? setAfficherSearch(false)
                                    : setAfficherSearch(true)
                            }}
                        >
                            <SearchOutlined className="text-2xl" />
                        </button>
                        <Link to="/messagerie">
                            <button className="mr-1">
                                {
                                    <NotificationBadge
                                        count={notificationsMessages}
                                        effect={Effect.SCALE}
                                        className="mt-4"
                                        style={{ fontSize: '9px' }}
                                    />
                                }
                                <Tooltip title="Messages" arrow>
                                    {/* <PetitMenu> */}
                                    <MessageOutlined className="w-8 h-8 bg-gray-100 border rounded-lg hover:text-blue-700 hover:bg-gray-200 text-xl " />
                                    {/* </PetitMenu> */}
                                </Tooltip>
                            </button>
                        </Link>
                        <Link to="/notifications">
                            <button onClick={CompteurZero}>
                                <NotificationBadge
                                    count={nbrLikes + nbrComments + nbrPosts}
                                    effect={Effect.SCALE}
                                    className="mt-4"
                                    style={{ fontSize: '9px' }}
                                />
                                <Tooltip title="Notification" arrow>
                                    <BellOutlined className="w-8 h-8 bg-gray-100 border rounded-lg hover:text-blue-700 hover:bg-gray-200 text-xl" />
                                </Tooltip>
                            </button>
                        </Link>

                        <button className="pt-1.5 ">
                            {/* <Tooltip title="Profil" arrow> */}

                            <AccountMenu />

                            {/* </Tooltip> */}
                        </button>
                    </div>
                </Header>
                <Layout>
                    <Layout className="h-screen flex flex-row">
                        <Content className="relative hauteur w-9/12">
                            <div className="bg-white fixed z-50 right-0 left-0 flex justify-center sm:hidden">
                                {afficherSearch ? (
                                    <Complete className="flex items-center justify-center" />
                                ) : (
                                    ''
                                )}
                            </div>
                            <div
                                className="site-layout-background"
                                style={{
                                    position: 'relative',
                                    zIndex: '0',
                                }}
                            >
                                {contenu}
                            </div>
                        </Content>
                        <div
                            id="droite"
                            className="relative w-64 droite bg-white "
                        >
                            {' '}
                            {barreDroite}
                        </div>
                    </Layout>
                </Layout>
            </Layout>
        </div>

        // <div className="w-screen h-screen">
        //     <div className="w-screen">
        //         <HeaderC titrePage="" />
        //     </div>
        //     {/**------herder------ */}
        //     <div className="flex flex-row w-full hauteur">
        //         {/**------contenu ------*/}
        //         <div className="bg-red-600 w-1/4 ">
        //             <MenuGauche />
        //             {/* <MenuGauche /> */}
        //         </div>
        //         {/**------gauche ------*/}
        //         <div className="bg-blue-600 w-2/4">
        //             zerzgruzgeruzygeruzegruzeygr
        //         </div>
        //         {/**------centre ------*/}
        //         <div className="bg-green-600 w-1/4 ">ererere</div>
        //         {/**------droite ------*/}
        //     </div>
        // </div>
    )
}

export default StructurePrincipal
