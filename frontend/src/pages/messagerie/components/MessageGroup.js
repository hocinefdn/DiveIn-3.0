import React, { useEffect, useState } from 'react'
import '../css/message.css'
import Photo from '../../../assets/images/profil.png'

import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { Avatar } from 'antd'
import { format } from 'timeago.js'
import { api, apiReact } from '../../../constants/constants'
import moment from 'moment'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
import {
    DeleteFilled,
    LikeOutlined,
    DislikeOutlined,
    LikeTwoTone,
    DislikeTwoTone,
    UserAddOutlined,
} from '@ant-design/icons'

const axios = require('axios')

function Message({
    group,
    id,
    firstname,
    lastname,
    contenu,
    dateHeure,
    own,
    image,
    socket,
    messages,
    setMessages,
    lastMessage,
    groupMembers,
}) {
    /* console.log(dateHeure.slice(0,-5).split('T')[0].concat(' ',dateHeure.slice(0,-5).split('T')[1]))*/

    const [isDisplayedDelete, setIsDisplayedDelete] = useState(false)

    const user = useSelector((state) => state.user)

    const [ownReaction, setOwnReaction] = useState()
    const [otherReactionBlue, setOtherReactionBlue] = useState(0)
    const [otherReactionRed, setOtherReactionRed] = useState(0)

    const [updated, setUpdated] = useState(false)

    function getOwnReaction() {
        console.log(2)
        axios
            .post(`${api}messagerie/getGroupMessageReactions`, {
                id: id,
                id_user: user.id,
            })
            .then((res) => {
                //socket.emit('message deleted', id, reciever)
                setOtherReactionBlue(res.data[0])
                setOtherReactionRed(res.data[1])
                setOwnReaction(res.data[2])
                //setMessages(messages.filter((message) => message.id != id))
            })
            .catch((err) => {})
    }
    function dislike() {
        var link = api + 'messagerie/'
        var myReaction
        var oldReaction = ownReaction
        if (ownReaction != 2) {
            myReaction = 2
            if (ownReaction == 0) {
                link = link + 'addGroupMessageReaction'
            }
            if (ownReaction == 1) {
                setOtherReactionBlue(otherReactionBlue - 1)
                link = link + 'changeGroupMessageReaction'
            }
            setOwnReaction(2)
            setOtherReactionRed(otherReactionRed + 1)
        } else {
            myReaction = 0
            link = link + 'deleteGroupMessageReaction'
            setOwnReaction(0)
            setOtherReactionRed(otherReactionRed - 1)
        }
        axios
            .post(link, {
                id: id,
                id_user: user.id,
                reaction: 2,
            })
            .then((res) => {
                socket.emit(
                    'group message changed',
                    id,
                    user.id,
                    group,
                    groupMembers,
                    oldReaction,
                    myReaction
                )
            })
            .catch((err) => {})
    }

    function like() {
        var link = api + 'messagerie/'
        var myReaction
        var oldReaction = ownReaction
        if (ownReaction != 1) {
            myReaction = 1
            if (ownReaction == 0) {
                link = link + 'addGroupMessageReaction'
            }
            if (ownReaction == 2) {
                setOtherReactionRed(otherReactionRed - 1)
                link = link + 'changeGroupMessageReaction'
            }
            setOwnReaction(1)
            setOtherReactionBlue(otherReactionBlue + 1)
        } else {
            myReaction = 0
            link = link + 'deleteGroupMessageReaction'
            setOwnReaction(0)
            setOtherReactionBlue(otherReactionBlue - 1)
        }
        axios
            .post(link, {
                id: id,
                id_user: user.id,
                reaction: 1,
            })
            .then((res) => {
                socket.emit(
                    'group message changed',
                    id,
                    user.id,
                    group,
                    groupMembers,
                    oldReaction,
                    myReaction
                )
            })
            .catch((err) => {})
    }

    const deleteMessage = () => {
        axios
            .post(`${api}messagerie/deleteGroupMessage`, {
                id: id,
            })
            .then((res) => {
                console.log(id)
                socket.emit(
                    'group message deleted',
                    id,
                    user.id,
                    group,
                    groupMembers
                )
                setMessages(messages.filter((message) => message.id != id))
            })
            .catch((err) => {})
    }
    useEffect(() => {
        getOwnReaction()
    }, [])

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.id_msg_grp) {
                if (group == lastMessage.group)
                    setMessages(messages.filter((message) => message.id != id))
            }
            if (lastMessage.oldReaction != null && lastMessage.id == id) {
                if (
                    lastMessage.oldReaction == 1 &&
                    lastMessage.myReaction == 2
                ) {
                    setOtherReactionBlue(otherReactionBlue - 1)
                    setOtherReactionRed(otherReactionRed + 1)
                }
                if (
                    lastMessage.oldReaction == 2 &&
                    lastMessage.myReaction == 1
                ) {
                    setOtherReactionBlue(otherReactionBlue + 1)
                    setOtherReactionRed(otherReactionRed - 1)
                }
                if (
                    lastMessage.oldReaction == 1 &&
                    lastMessage.myReaction == 0
                ) {
                    setOtherReactionBlue(otherReactionBlue - 1)
                }
                if (
                    lastMessage.oldReaction == 2 &&
                    lastMessage.myReaction == 0
                ) {
                    setOtherReactionRed(otherReactionRed - 1)
                }
                if (
                    lastMessage.oldReaction == 0 &&
                    lastMessage.myReaction == 1
                ) {
                    setOtherReactionBlue(otherReactionBlue + 1)
                }
                if (
                    lastMessage.oldReaction == 0 &&
                    lastMessage.myReaction == 2
                ) {
                    setOtherReactionRed(otherReactionRed + 1)
                }
            }
        }
    }, [lastMessage])

    return (
        <div className={own ? 'message own' : 'message'}>
            {!image ? (
                <div>
                    {!own && (
                        <p className="text-xs text-bold text-grey-500">
                            {lastname} {firstname}
                        </p>
                    )}
                    <div
                        className="message_Top"
                        onClick={() => setIsDisplayedDelete(!isDisplayedDelete)}
                    >
                        {image !== null ? (
                            <Avatar
                                className="w-8 h-8 border border-stone-200 hover:opacity-80 img"
                                src={image}
                                alt={`${firstname}" "${lastname}`}
                            />
                        ) : (
                            <Avatar
                                className="w-8 h-8 border border-stone-200 hover:opacity-80 img"
                                src={photoProfil_vide}
                                alt={`${firstname}" "${lastname}`}
                            />
                        )}
                        {/* <img
                            className="mr-1 w-10 rounded-full img"
                            src={Photo}
                            alt=""
                        /> */}

                        <p className="message_text break-all">{contenu}</p>

                        {isDisplayedDelete && own ? (
                            <DeleteFilled
                                onClick={deleteMessage}
                                title="supprimer le message"
                                className="text-sky-600 cursor-pointer"
                                style={{ width: '30px', paddingTop: '15px' }}
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <LikeOutlined
                                onClick={like}
                                title="liker"
                                className="text-sky-600 cursor-pointer"
                                style={{ width: '30px', paddingTop: '15px' }}
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <DislikeOutlined
                                onClick={dislike}
                                title="disliker"
                                className="text-sky-600 cursor-pointer"
                                style={{ width: '30px', paddingTop: '15px' }}
                            />
                        ) : null}
                    </div>

                    <div className="message_bottom">{format(dateHeure)}</div>
                </div>
            ) : image.split('.')[image.split('.').length - 1] == 'undefined' ? (
                <div>
                    <audio
                        controls="controls"
                        onPlay={() => setIsDisplayedDelete(!isDisplayedDelete)}
                        onPause={() => setIsDisplayedDelete(!isDisplayedDelete)}
                    >
                        <source src={image} type="audio/mp3" />
                    </audio>
                    {isDisplayedDelete && own ? (
                        <DeleteFilled
                            onClick={deleteMessage}
                            title="supprimer le message"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                    {isDisplayedDelete ? (
                        <LikeOutlined
                            onClick={like}
                            title="liker"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                    {isDisplayedDelete ? (
                        <DislikeOutlined
                            onClick={dislike}
                            title="disliker"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                </div>
            ) : (
                <div>
                    <img
                        src={image}
                        alt=""
                        onClick={() => setIsDisplayedDelete(!isDisplayedDelete)}
                    />
                    {isDisplayedDelete && own ? (
                        <DeleteFilled
                            onClick={deleteMessage}
                            title="supprimer le message"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                    {isDisplayedDelete ? (
                        <LikeOutlined
                            onClick={like}
                            title="liker"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                    {isDisplayedDelete ? (
                        <DislikeOutlined
                            onClick={dislike}
                            title="disliker"
                            className="text-sky-600 cursor-pointer"
                            style={{ width: '30px', paddingTop: '15px' }}
                        />
                    ) : null}
                </div>
            )}
            {own ? (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    {otherReactionBlue != 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                right: '0px',
                            }}
                        >
                            <LikeTwoTone style={{ fontSize: '30px' }} />
                            <span>{otherReactionBlue}</span>{' '}
                        </div>
                    )}
                    {otherReactionRed != 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                right: '50px',
                            }}
                        >
                            <DislikeTwoTone
                                twoToneColor={'red'}
                                style={{ fontSize: '30px' }}
                            />
                            <span>{otherReactionRed} </span>
                        </div>
                    )}
                </div>
            ) : (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    {otherReactionBlue != 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '40px',
                            }}
                        >
                            <LikeTwoTone style={{ fontSize: '30px' }} />
                            <span>{otherReactionBlue}</span>{' '}
                        </div>
                    )}
                    {otherReactionRed != 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '0px',
                                left: '90px',
                            }}
                        >
                            <DislikeTwoTone
                                twoToneColor={'red'}
                                style={{ fontSize: '30px' }}
                            />
                            <span>{otherReactionRed} </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Message
