import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './css/profil.css'
import { Col, Divider, Row, Input, Modal, Tooltip } from 'antd'
import couverture1 from '../../assets/images/couverture1.jpeg'
import profil1 from '../../assets/images/image_profil_vide.png'
import Post from '../filActualite/components/Post'
import {
    CalendarOutlined,
    CameraFilled,
    CameraOutlined,
    MoreOutlined,
} from '@ant-design/icons'
import Profilpost from './components/Profilpost'
import { useSelector, useDispatch } from 'react-redux'
import StructurePrincipal from '../components/StructurePrincipal'
import BarreDroite from '../components/BarreDroite'
import MesPost from './components/MesPost'
import MesLikes from './components/MesLikes'
import Media from './components/Media'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../constants/constants'
import { format } from 'timeago.js'
import moment from 'moment'
import Redives from './components/Redives'
import Followers from './components/Followers'
import Followed from './components/Followed'
import FollowUnfollow from '../components/FollowUnfollow'
import LongMenu from './components/LongMenu'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import StandardImageList from './components/StandardImageList'
import { Grid } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CakeIcon from '@mui/icons-material/Cake'

const axios = require('axios')
function Profil({
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
    const params = useParams()

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [birthday, setBirthday] = useState()
    const [gender, setGender] = useState()
    const [date, setDate] = useState()
    const [image, setImage] = useState()
    const [email, setEmail] = useState()
    const [pohneNumber, setPhoneNumber] = useState()
    const [biographie, setbiographie] = useState()
    const [imageCouverture, setImageCouverture] = useState()
    const [followers, setFollowers] = useState()
    const [followeds, setFolloweds] = useState()

    const [isFollowed, setIsFollowed] = useState()
    const [isBloque, setIsBloque] = useState()

    // pour afficher la zone mes posts
    const [zoneMesPost, setZoneMesPost] = useState(true)
    const ClickMesPost = (e) => {
        e.preventDefault()
        setZoneMesPost(!zoneMesPost)
        setZoneMedia(false)
        setZoneMesLikes(false)
        setZoneRedive(false)
    }

    // pour afficher la zone Redive
    const [zoneRedive, setZoneRedive] = useState(false)
    const ClickRedive = (e) => {
        e.preventDefault()
        setZoneRedive(!zoneRedive)
        setZoneMedia(false)
        setZoneMesPost(false)
        setZoneMesLikes(false)
    }

    // pour afficher la zone Media
    const [zoneMedia, setZoneMedia] = useState(false)
    const ClickMedia = (e) => {
        e.preventDefault()
        setZoneMedia(!zoneMedia)
        setZoneMesPost(false)
        setZoneMesLikes(false)
        setZoneRedive(false)
    }

    // pour afficher la zone mes likes
    const [zoneMesLikes, setZoneMesLikes] = useState(false)
    const ClickMesLikes = (e) => {
        e.preventDefault()
        setZoneMesLikes(!zoneMesLikes)
        setZoneMesPost(false)
        setZoneMedia(false)
        setZoneRedive(false)
    }

    function getUserInfo() {
        axios
            .get(`${api}user/${params.id}`)
            .then((res) => {
                setFirstName(res.data[0].firstname)
                setLastName(res.data[0].lastname)
                setBirthday(res.data[0].birthday)
                setGender(res.data[0].gender)
                setDate(res.data[0].date)
                setImage(res.data[0].image)
                setEmail(res.data[0].email)
                setPhoneNumber(res.data[0].phone_number)
                setbiographie(res.data[0].biographie)
                setImageCouverture(res.data[0].image_couverture)
                setFollowers(res.data[0].follower)
                setFolloweds(res.data[0].followed)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // function changeFollow() {
    //     if (!isFollowed) {
    //         axios
    //             .post(`${api}user/follow`, {
    //                 follower_id: user.id,
    //                 followed_id: params.id,
    //             })
    //             .then((res) => {
    //                 setIsFollowed(true)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    //     } else {
    //         axios
    //             .post(`${api}user/unfollow`, {
    //                 follower_id: user.id,
    //                 followed_id: params.id,
    //             })
    //             .then((res) => {
    //                 setIsFollowed(false)
    //             })
    //             .catch((err) => {
    //                 console.log(err)
    //             })
    //     }
    // }
    function getFollow() {
        axios
            .post(`${api}user/getfollow`, {
                follower_id: parseInt(user.id),
                followed_id: parseInt(params.id),
            })
            .then((res) => {
                setIsFollowed(res.data[0].nbr == 1)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function getBloque() {
        axios
            .post(`${api}messagerie/getBloque`, {
                id_user: parseInt(user.id),
            })
            .then((res) => {
                setIsBloque(
                    res.data.filter((bloque) => (bloque.id = params.id))
                        .length === 1
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function changeBloque() {
        if (isBloque) {
            axios
                .post(`${api}messagerie/messagedeblock`, {
                    id_sender: parseInt(user.id),
                    id_reciever: parseInt(params.id),
                })
                .then((response) => {
                    setIsBloque(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        } else {
            axios
                .post(`${api}messagerie/messageblock`, {
                    id_sender: parseInt(user.id),
                    id_reciever: parseInt(params.id),
                })
                .then((res) => {
                    setIsBloque(true)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    function changeProfilImage() {
        console.log('date')
        var files = document.getElementById('profil')
        const file = document.getElementById('profil').files[0]
        const date = Date.now()
        //envoi d'une image
        if (file) {
            let data = new FormData()
            data.append('image', file, file.name)
            data.append('id', parseInt(user.id))

            axios
                .post(`${api}user/changeUserImage`, data, {
                    headers: {
                        accept: 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': undefined,
                    },
                })
                .then((response) => {
                    setImage(response.data.image)
                    //handle success
                })
                .catch((error) => {
                    //handle error
                })
        }
    }
    function changeCouvImage() {
        console.log('date')
        var files = document.getElementById('couv')
        const file = document.getElementById('couv').files[0]
        const date = Date.now()
        //envoi d'une image
        if (file) {
            let data = new FormData()
            data.append('image', file, file.name)
            data.append('id', parseInt(user.id))

            axios
                .post(`${api}user/changeUserCouv`, data, {
                    headers: {
                        accept: 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': undefined,
                    },
                })
                .then((response) => {
                    setImageCouverture(response.data.image)
                    //handle success
                })
                .catch((error) => {
                    //handle error
                })
        }
    }

    useEffect(() => {
        getUserInfo()
        getFollow()
        getBloque()
        setZoneMesPost(false)
        setZoneMedia(false)
        setZoneMesLikes(false)
        setZoneRedive(false)
        setTimeout(() => {
            setZoneMesPost(true)
        }, 200)
    }, [params.id])

    const Navigate = useNavigate()

    const editerprofil = () => {
        Navigate('../parametres')
    }

    return (
        <>
            <div>
                <StructurePrincipal
                    socket={socket}
                    lastMessage={lastMessage}
                    notificationsMessages={notificationsMessages}
                    setNotificationsMessages={setNotificationsMessages}
                    nbrLikes={nbrLikes}
                    setNbrLikes={setNbrLikes}
                    nbrComments={nbrComments}
                    setNbrComments={setNbrComments}
                    nbrPosts={nbrPosts}
                    setNbrPosts={setNbrPosts}
                    titrePage={'Profil'}
                    contenu={
                        <div className="toutprofil">
                            <div className="centre-profil">
                                <div className="profile">
                                    <div className="profileRight">
                                        <div className="profileRightTop">
                                            <div className="profileCover">
                                                {!imageCouverture ? (
                                                    <img
                                                        className="profileCoverImg"
                                                        src={couverture1}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <img
                                                        className="profileCoverImg"
                                                        src={imageCouverture}
                                                        alt=""
                                                    />
                                                )}
                                                {user.id == params.id ? (
                                                    <div>
                                                        <label htmlFor="couv">
                                                            <Grid item>
                                                                <Tooltip
                                                                    title="changer photo de couverture"
                                                                    placement="left"
                                                                >
                                                                    <AddAPhotoIcon
                                                                        className="iconephotocouv"
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </Grid>
                                                        </label>

                                                        <Input
                                                            id="couv"
                                                            type="file"
                                                            onChange={
                                                                changeCouvImage
                                                            }
                                                            style={{
                                                                display: 'none',
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {!image ? (
                                                    <img
                                                        className="profileUserImg"
                                                        src={profil1}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <img
                                                        className="profileUserImg"
                                                        src={image}
                                                        alt=""
                                                    />
                                                )}
                                                {user.id == params.id ? (
                                                    <div>
                                                        <label htmlFor="profil">
                                                            <Grid item>
                                                                <Tooltip
                                                                    title="changer la photo de profil"
                                                                    placement="right"
                                                                >
                                                                    <AddAPhotoIcon
                                                                        className="iconephoto"
                                                                        style={{
                                                                            cursor: 'pointer',
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            </Grid>
                                                        </label>

                                                        <Input
                                                            id="profil"
                                                            type="file"
                                                            onChange={
                                                                changeProfilImage
                                                            }
                                                            style={{
                                                                display: 'none',
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div></div>
                                                )}

                                                {user.id != params.id ? (
                                                    <div>
                                                        <button className="w-6 h-13 bg-gray-200 float-right text-2xl mr-3 mt-1 hover:bg-gray-400 flex justify-center items-center rounded-md">
                                                            {/* <MoreOutlined />
                                                             */}
                                                            <LongMenu />
                                                        </button>
                                                        {/* <div className="btn-editerprofil">
                                                            <button
                                                                onClick={
                                                                    changeFollow
                                                                }
                                                            >
                                                                {!isFollowed
                                                                    ? "S'abonner"
                                                                    : 'désabonner'}
                                                            </button>
                                                        </div>
                                                        <div className="btn-editerprofil">
                                                            <button
                                                                onClick={
                                                                    changeBloque
                                                                }
                                                            >
                                                                {!isBloque
                                                                    ? 'bloquer'
                                                                    : 'débloquer'}
                                                            </button>
                                                        </div> */}
                                                    </div>
                                                ) : (
                                                    <button
                                                        className="btn-editerprofil"
                                                        onClick={editerprofil}
                                                    >
                                                        Editer profil
                                                    </button>
                                                )}

                                                <div className="coordonées">
                                                    <span className="flex flex-row items-center h-7 ">
                                                        <div className="pr-2">
                                                            <CalendarTodayIcon />
                                                        </div>
                                                        <div className="pt-0.5">
                                                            A rejoint divein{' '}
                                                            {format(date)}
                                                        </div>
                                                    </span>

                                                    <span className="flex flex-row items-center h-7">
                                                        <div className="pr-2">
                                                            <CakeIcon />
                                                        </div>
                                                        <div className="pt-1.5">
                                                            {' '}
                                                            <span className="pr-1">
                                                                {' '}
                                                                Né(e) le
                                                            </span>
                                                            {`${moment(
                                                                new Date(
                                                                    birthday
                                                                )
                                                            ).format(
                                                                'DD MMM YYYY'
                                                            )} `}
                                                        </div>
                                                    </span>

                                                    <div className="abonn">
                                                        {/* ------------ les abonnées ------------------ */}
                                                        <Link
                                                            to={
                                                                '/abonnees/' +
                                                                params.id
                                                            }
                                                        >
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                // onClick={
                                                                //     ClickSeeFollowers
                                                                // }
                                                            >
                                                                {/* abonnées == followers */}
                                                                {followeds}{' '}
                                                                Abonnées
                                                            </span>
                                                        </Link>
                                                        <span></span>
                                                        {/*  ----------------- les abonnements ------------------------ */}
                                                        <Link
                                                            to={
                                                                '/abonnements/' +
                                                                params.id
                                                            }
                                                        >
                                                            <span
                                                                className="cursor-pointer hover:underline"
                                                                // onClick={
                                                                //     ClickSeeFollowed
                                                                // }
                                                            >
                                                                {/* abonnements == followed */}
                                                                {followers}{' '}
                                                                Abonnements
                                                            </span>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="profileInfo">
                                                <h4 className="profileInfoName">
                                                    {`${firstName} ${lastName}`}
                                                </h4>
                                                <div className="profileInfoDesc mb-10">
                                                    {biographie}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <Profilpost /> */}

                            {/* ----------------------------------- a la place de composantt Profil post  */}
                            <div className="flex flex-row w-5/6 border border-y-1 mt-1 ml-auto mr-auto">
                                <div className="w-2/6 flex items-center justify-center ">
                                    <button
                                        // si on clique sur le bouton on change son focus mm temps verifie son etat
                                        className={
                                            zoneMesPost
                                                ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                                : 'font-medium text-lg hover:text-blue-600'
                                        }
                                        onClick={ClickMesPost}
                                    >
                                        DiveIn
                                    </button>
                                </div>

                                <div className="w-2/6 flex items-center justify-center ">
                                    <button
                                        // si on clique sur le bouton on change son focus mm temps verifie son etat
                                        className={
                                            zoneRedive
                                                ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                                : 'font-medium text-lg hover:text-blue-600'
                                        }
                                        onClick={ClickRedive}
                                    >
                                        Redives
                                    </button>
                                </div>

                                <div className="w-2/6 flex  items-center justify-center     ">
                                    <button
                                        className={
                                            zoneMedia
                                                ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                                : 'font-medium text-lg hover:text-blue-600'
                                        }
                                        onClick={ClickMedia}
                                    >
                                        Media
                                    </button>
                                </div>
                                <div className="w-2/6  flex items-center justify-center ">
                                    <button
                                        className={
                                            zoneMesLikes
                                                ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                                : 'font-medium text-lg hover:text-blue-600'
                                        }
                                        onClick={ClickMesLikes}
                                    >
                                        Likes
                                    </button>
                                </div>
                            </div>
                            <div className="w-full mt-2  ml-auto mr-auto">
                                {zoneMesPost && (
                                    <MesPost
                                        params={params}
                                        socket={socket}
                                        lastMessage={lastMessage}
                                    />
                                )}
                            </div>
                            <div className="w-full mt-2  ml-auto mr-auto">
                                {zoneRedive && (
                                    <Redives
                                        params={params}
                                        socket={socket}
                                        lastMessage={lastMessage}
                                    />
                                )}
                            </div>
                            <div className="w-full mt-2  ml-auto mr-auto">
                                {zoneMesLikes && (
                                    <MesLikes
                                        params={params}
                                        socket={socket}
                                        lastMessage={lastMessage}
                                    />
                                )}
                            </div>
                            <div className="w-5/6 mt-2  ml-auto mr-auto">
                                {zoneMedia && <Media params={params} />}
                            </div>
                            {/* <Post /> */}
                        </div>
                    }
                    barreDroite={<BarreDroite />}
                />
            </div>
        </>
    )
}
export default Profil
