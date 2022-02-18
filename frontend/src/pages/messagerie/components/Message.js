import React, { useEffect } from 'react'
import '../css/message.css'
import Photo from '../../../assets/images/profil.png'
import { format } from 'timeago.js'
import { useState } from 'react'
import {
    DeleteFilled,
    DislikeOutlined,
    LikeTwoTone,
    DislikeTwoTone,
    UserAddOutlined,
} from '@ant-design/icons'
import { Avatar } from 'antd'
import { api, apiReact } from '../../../constants/constants'
import moment from 'moment'
import { io } from 'socket.io-client'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import { SmileOutlined, LikeOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'

const axios = require('axios')

function Message({
    id,
    sender,
    reciever,
    contenu,
    dateHeure,
    own,
    image,
    messages,
    setMessages,
    reaction_sender,
    reaction_reciever,
    socket,
    lastMessage,
    contacts,
    currentContact,
}) {
    const [isDisplayedDelete, setIsDisplayedDelete] = useState(false)

    const user = useSelector((state) => state.user)

    const [ownReaction, setOwnReaction] = useState(
        own ? reaction_sender : reaction_reciever
    )
    const [otherReaction, setOtherReaction] = useState(
        own ? reaction_reciever : reaction_sender
    )

    const [updated, setUpdated] = useState(false)
    const myId = own ? sender : reciever

    /* console.log(dateHeure.slice(0,-5).split('T')[0].concat(' ',dateHeure.slice(0,-5).split('T')[1]))*/
    function deleteMessage() {
        axios
            .post(`${api}messagerie/deleteMessage`, {
                id: id,
            })
            .then((res) => {
                socket.emit('message deleted', id, reciever)

                setMessages(messages.filter((message) => message.id != id))
            })
            .catch((err) => {})
    }
    function changeReaction() {
        axios
            .post(`${api}messagerie/reaction`, {
                id: id,
                isSender: own,
                reaction: ownReaction,
            })
            .then((res) => {
                //socket.emit('message deleted', id, reciever)
            })
            .catch((err) => {})
    }
    useEffect(() => {
        if (updated) {
            changeReaction()
            socket.emit(
                'reaction changed',
                own ? reciever : sender,
                id,
                ownReaction
            )
        }

        setUpdated((state) => true)
    }, [ownReaction])

    useEffect(() => {
        if (lastMessage)
            if (lastMessage.id_msg != null)
                if (lastMessage.id_msg == id)
                    setOtherReaction(lastMessage.reaction)
    }, [lastMessage])
    return (
        <div className={own ? 'message own' : 'message'}>
            {!image ? (
                <div className="">
                    <div
                        className="message_Top "
                        style={{ position: 'relative' }}
                    >
                        {!own && contacts[currentContact].image !== null ? (
                            <Avatar
                                className="w-8 h-8 border border-stone-200 hover:opacity-80 img"
                                src={contacts[currentContact].image}
                                alt={`${contacts[currentContact].firstname}" "${contacts[currentContact].lastname}`}
                            />
                        ) : (
                            <Avatar
                                className="w-8 h-8 border border-stone-200 hover:opacity-80 img"
                                src={photoProfil_vide}
                                alt={`${contacts[currentContact].firstname}" "${contacts[currentContact].lastname}`}
                            />
                        )}

                        {/* <img
                            className="mr-1 w-10 rounded-full img"
                            src={Photo}
                            alt=""
                        /> */}
                        {own ? (
                            <div>
                                <div
                                    className=""
                                    style={{
                                        position: 'absolute',
                                        fontSize: '24px',
                                        bottom: '-40px',
                                        right: '0px',
                                    }}
                                >
                                    {ownReaction == 1 && <LikeTwoTone />}
                                    {ownReaction == 2 && (
                                        <DislikeTwoTone twoToneColor={'red'} />
                                    )}
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        fontSize: '24px',
                                        bottom: '-40px',
                                        right: '30px',
                                    }}
                                >
                                    {otherReaction == 1 && <LikeTwoTone />}
                                    {otherReaction == 2 && (
                                        <DislikeTwoTone twoToneColor={'red'} />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        fontSize: '24px',
                                        bottom: '-40px',
                                        left: '45px',
                                    }}
                                >
                                    {ownReaction == 1 && <LikeTwoTone />}
                                    {ownReaction == 2 && (
                                        <DislikeTwoTone twoToneColor={'red'} />
                                    )}
                                </div>
                                <div
                                    style={{
                                        position: 'absolute',
                                        fontSize: '24px',
                                        bottom: '-40px',
                                        left: '75px',
                                    }}
                                >
                                    {otherReaction == 1 && <LikeTwoTone />}
                                    {otherReaction == 2 && (
                                        <DislikeTwoTone twoToneColor={'red'} />
                                    )}
                                </div>
                            </div>
                        )}

                        <p
                            className="message_text break-all"
                            onClick={() =>
                                setIsDisplayedDelete(!isDisplayedDelete)
                            }
                        >
                            {contenu}
                        </p>
                        <div className="flex flex-row space-x-2 pt-5 ">
                            {isDisplayedDelete && own ? (
                                <DeleteFilled
                                    onClick={deleteMessage}
                                    title="supprimer le message"
                                    className="text-sky-600 cursor-pointer"
                                />
                            ) : null}
                            {isDisplayedDelete ? (
                                <LikeOutlined
                                    onClick={() => {
                                        ownReaction != 1
                                            ? setOwnReaction(1)
                                            : setOwnReaction(0)
                                    }}
                                    title="liker"
                                    className="text-sky-600 cursor-pointer"
                                />
                            ) : null}
                            {isDisplayedDelete ? (
                                <DislikeOutlined
                                    onClick={() => {
                                        ownReaction != 2
                                            ? setOwnReaction(2)
                                            : setOwnReaction(0)
                                    }}
                                    title="disliker"
                                    className="text-sky-600 cursor-pointer"
                                />
                            ) : null}
                        </div>
                    </div>

                    <div className="message_bottom">{format(dateHeure)}</div>
                </div>
            ) : image.split('.')[image.split('.').length - 1] == 'undefined' ? (
                <div>
                    <audio
                        controls="controls"
                        onPause={() => setIsDisplayedDelete(!isDisplayedDelete)}
                        onPlay={() => setIsDisplayedDelete(!isDisplayedDelete)}
                    >
                        <source src={image} type="audio/mp3" />
                    </audio>
                    {own ? (
                        <div style={{ position: 'relative' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    fontSize: '24px',
                                    bottom: '-40px',
                                    right: '0px',
                                }}
                            >
                                {ownReaction == 1 && <LikeTwoTone />}
                                {ownReaction == 2 && (
                                    <DislikeTwoTone twoToneColor={'red'} />
                                )}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    fontSize: '24px',
                                    bottom: '-40px',
                                    right: '30px',
                                }}
                            >
                                {otherReaction == 1 && <LikeTwoTone />}
                                {otherReaction == 2 && (
                                    <DislikeTwoTone twoToneColor={'red'} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div
                                style={{
                                    position: 'absolute',
                                    fontSize: '24px',
                                    bottom: '-40px',
                                    left: '45px',
                                }}
                            >
                                {ownReaction == 1 && <LikeTwoTone />}
                                {ownReaction == 2 && (
                                    <DislikeTwoTone twoToneColor={'red'} />
                                )}
                            </div>
                            <div
                                style={{
                                    position: 'absolute',
                                    fontSize: '24px',
                                    bottom: '-40px',
                                    left: '75px',
                                }}
                            >
                                {otherReaction == 1 && <LikeTwoTone />}
                                {otherReaction == 2 && (
                                    <DislikeTwoTone twoToneColor={'red'} />
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex flex-row space-x-2 pt-5 ">
                        {isDisplayedDelete && own ? (
                            <DeleteFilled
                                onClick={deleteMessage}
                                title="supprimer le message"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <LikeOutlined
                                onClick={() => {
                                    ownReaction != 1
                                        ? setOwnReaction(1)
                                        : setOwnReaction(0)
                                }}
                                title="liker"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <DislikeOutlined
                                onClick={() => {
                                    ownReaction != 2
                                        ? setOwnReaction(2)
                                        : setOwnReaction(0)
                                }}
                                title="disliker"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col ">
                    <div className="rounded-md   w-96 ">
                        <img
                            className="w-full rounded-xl border border-solid"
                            src={image}
                            alt=""
                            onClick={() =>
                                setIsDisplayedDelete(!isDisplayedDelete)
                            }
                        />
                    </div>
                    <div className="flex flex-row space-x-2  p-1">
                        {isDisplayedDelete && own ? (
                            <DeleteFilled
                                onClick={deleteMessage}
                                title="supprimer le message"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <LikeOutlined
                                onClick={() => {
                                    ownReaction != 1
                                        ? setOwnReaction(1)
                                        : setOwnReaction(0)
                                }}
                                title="liker"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                        {isDisplayedDelete ? (
                            <DislikeOutlined
                                onClick={() => {
                                    ownReaction != 2
                                        ? setOwnReaction(2)
                                        : setOwnReaction(0)
                                }}
                                title="disliker"
                                className="text-sky-600 cursor-pointer"
                            />
                        ) : null}
                    </div>
                </div>
            )}
            {own ? (
                <div style={{ position: 'relative' }}>
                    <div
                        style={{
                            position: 'absolute',
                            fontSize: '24px',
                            bottom: '-20px',
                            right: '0px',
                        }}
                    >
                        {ownReaction == 1 && <LikeTwoTone />}
                        {ownReaction == 2 && (
                            <DislikeTwoTone twoToneColor={'red'} />
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            fontSize: '24px',
                            bottom: '-20px',
                            right: '30px',
                        }}
                    >
                        {otherReaction == 1 && <LikeTwoTone />}
                        {otherReaction == 2 && (
                            <DislikeTwoTone twoToneColor={'red'} />
                        )}
                    </div>
                </div>
            ) : (
                <div>
                    <div
                        style={{
                            position: 'absolute',
                            fontSize: '24px',
                            bottom: '-20px',
                            left: '45px',
                        }}
                    >
                        {ownReaction == 1 && <LikeTwoTone />}
                        {ownReaction == 2 && (
                            <DislikeTwoTone twoToneColor={'red'} />
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            fontSize: '24px',
                            bottom: '-20px',
                            left: '75px',
                        }}
                    >
                        {otherReaction == 1 && <LikeTwoTone />}
                        {otherReaction == 2 && (
                            <DislikeTwoTone twoToneColor={'red'} />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Message
