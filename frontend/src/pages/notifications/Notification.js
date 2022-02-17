import React, { useState, useEffect } from 'react'
import StructurePrincipal from '../components/StructurePrincipal'
import BarreDroite from '../components/BarreDroite'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { api } from '../../constants/constants'
import { isEmpty } from '../../utils/Utils'
import NTF from './components/NTF'

function Notification({
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
    users,
    setUsers,
}) {
    const user = useSelector((state) => state.user)

    const [nbrNotifications, setNbrNotifications] = useState(0)

    const [notificationsLikes, setNotificationsLikes] = useState([])
    const [notificationsComments, setNotificationsComments] = useState([])
    const [notificationsPosts, setNotificationsPosts] = useState([])

    // pour afficher la zone likes
    const [zoneNotificationLikes, SetZoneNotificationLikes] = useState(true)
    const ClickNotificationsLikes = (e) => {
        e.preventDefault()
        SetZoneNotificationLikes(!zoneNotificationLikes)
        SetZoneNotificationComments(false)
        SetZoneNotificationPosts(false)
    }

    // pour afficher la zone comments
    const [zoneNotificationComments, SetZoneNotificationComments] =
        useState(false)
    const ClickNotificationsComments = (e) => {
        e.preventDefault()
        SetZoneNotificationComments(!zoneNotificationComments)
        SetZoneNotificationLikes(false)
        SetZoneNotificationPosts(false)
    }

    // pour afficher la zone posts
    const [zoneNotificationPosts, SetZoneNotificationPosts] = useState(false)
    const ClickNotificationsPosts = (e) => {
        e.preventDefault()
        SetZoneNotificationPosts(!zoneNotificationPosts)
        SetZoneNotificationComments(false)
        SetZoneNotificationLikes(false)
    }

    const get_notifications_likes = () => {
        axios
            .get(`${api}actualite/notificationsLikes/${user.infoUser.id}`)
            .then((res) => {
                setNotificationsLikes(res.data)
                //setNbrNotifications(res.data.length)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const get_notifications_Posts = async () => {
        axios
            .get(`${api}actualite/notificationsPosts/${user.infoUser.id}`)
            .then((res) => {
                setNotificationsPosts(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const get_notifications_comments = async () => {
        axios
            .get(`${api}actualite/notificationsComments/${user.infoUser.id}`)
            .then((res) => {
                setNotificationsComments(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const Notification_SEEN = () => {
        axios
            .post(`${api}actualite/seen-notifications/${user.infoUser.id}`)
            .then(() => {
                //setNotificationsLikes(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // une fois charger le composant notifications
    useEffect(() => {
        get_notifications_comments()
        get_notifications_likes()
        // get_notifications_Posts()
        setTimeout(() => {
            Notification_SEEN()
        }, 10000)

        // setNbrComments(0)
        // setNbrLikes(0)
        // setNbrPosts(0)

        return () => {}
    }, [])

    // pour les sockets
    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.postLiked) {
                // console.log(lastMessage)
                //les informations de celui qui as publiés
                //lastMessage.post
                //les informations de celui qui as liké
                //lastMessage.user
                // setNbrNotifications(nbrNotifications + 1)
                setNotificationsLikes([
                    {
                        id_user: lastMessage.user.id,
                        firstname: lastMessage.user.firstname,
                        lastname: lastMessage.user.lastname,
                        image: lastMessage.user.image,
                        date: Date(),
                        // id post
                        id: lastMessage.post.id,
                        content: lastMessage.post.content,
                    },
                    ...notificationsLikes,
                ])
            }

            if (lastMessage.postUnliked) {
                // setNbrNotifications(nbrNotifications - 1)
                //les informations de celui qui as publiés
                // lastMessage.post
                //les informations de celui qui as liké
                // lastMessage.user
                //enlever la notification qui as les memes informations
                setNotificationsLikes(
                    notificationsLikes.filter(
                        (notificationLike) =>
                            //notificationLike.id_user != lastMessage.user.id &&
                            notificationLike.id != lastMessage.post.id
                    )
                )
            }

            if (lastMessage.postCommented) {
                setNotificationsComments([
                    {
                        id_user: lastMessage.user.id,
                        firstname: lastMessage.user.firstname,
                        lastname: lastMessage.user.lastname,
                        image: lastMessage.user.image,
                        date: Date(),
                        // id post
                        id: lastMessage.post.id,
                        content: lastMessage.post.content,
                        id_comment: lastMessage.id_comment,
                    },
                    ...notificationsComments,
                ])
            }
            if (lastMessage.postUncommented) {
                setNotificationsComments(
                    notificationsComments.filter((notification) => {
                        return notification.id_comment != lastMessage.id_comment
                    })
                )
            }

            if (lastMessage.newPost) {
                setNotificationsPosts([
                    {
                        id_user: lastMessage.user.id,
                        firstname: lastMessage.user.firstname,
                        lastname: lastMessage.user.lastname,
                        image: lastMessage.user.image,
                        date: Date(),
                        id: lastMessage.post.id,
                        content: lastMessage.post.content,
                        id_comment: lastMessage.id_comment,
                        isPost: true,
                    },
                    ...notificationsPosts,
                ])
            }
        }
    }, [lastMessage])

    return (
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
                users={users}
                setUsers={setUsers}
                titrePage="Notifications"
                contenu={
                    <>
                        <div className="flex flex-row w-11/12 mr-auto ml-auto border border-solid p-1">
                            <div className="w-1/3 text-center text-lg">
                                <button
                                    className={
                                        zoneNotificationLikes
                                            ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                            : 'font-medium text-lg hover:text-blue-600'
                                    }
                                    onClick={ClickNotificationsLikes}
                                >
                                    Likes
                                </button>
                            </div>
                            <div className="w-1/3 text-center text-lg">
                                <button
                                    className={
                                        zoneNotificationComments
                                            ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                            : 'font-medium text-lg hover:text-blue-600'
                                    }
                                    onClick={ClickNotificationsComments}
                                >
                                    Comments
                                </button>
                            </div>
                            <div className="w-1/3 text-center text-lg">
                                <button
                                    className={
                                        zoneNotificationPosts
                                            ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                            : 'font-medium text-lg hover:text-blue-600'
                                    }
                                    onClick={ClickNotificationsPosts}
                                >
                                    Posts
                                </button>
                            </div>
                        </div>

                        <div className="w-11/12 mr-auto ml-auto">
                            {zoneNotificationLikes ? (
                                !isEmpty(notificationsLikes[0]) ? (
                                    notificationsLikes.map((notf) => {
                                        return (
                                            <NTF
                                                socket={socket}
                                                lastMessage={lastMessage}
                                                key={notf.id}
                                                notf={notf}
                                                isLike={true}
                                            />
                                        )
                                    })
                                ) : (
                                    <p className="w-11/12 mr-auto ml-auto">
                                        aucune notification
                                    </p>
                                )
                            ) : null}
                        </div>
                        <div className="w-11/12 mr-auto ml-auto">
                            {zoneNotificationComments ? (
                                !isEmpty(notificationsComments[0]) ? (
                                    notificationsComments.map((notf) => {
                                        return (
                                            <NTF
                                                socket={socket}
                                                lastMessage={lastMessage}
                                                key={notf.id_comment}
                                                notf={notf}
                                                isComments={true}
                                            />
                                        )
                                    })
                                ) : (
                                    <p className="w-11/12 mr-auto ml-auto">
                                        aucune notification
                                    </p>
                                )
                            ) : null}
                        </div>

                        <div className="w-11/12 mr-auto ml-auto">
                            {zoneNotificationPosts ? (
                                !isEmpty(notificationsPosts[0]) ? (
                                    notificationsPosts.map((notf) => {
                                        return (
                                            <NTF
                                                socket={socket}
                                                lastMessage={lastMessage}
                                                key={notf.id}
                                                notf={notf}
                                                isPost={true}
                                            />
                                        )
                                    })
                                ) : (
                                    <p className="w-11/12 mr-auto ml-auto">
                                        aucune notification
                                    </p>
                                )
                            ) : null}
                        </div>
                    </>
                }
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default Notification
