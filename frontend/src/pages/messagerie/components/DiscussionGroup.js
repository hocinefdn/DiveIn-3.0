import React, { useState } from 'react'
import {
    FileImageOutlined,
    MoreOutlined,
    PaperClipOutlined,
    PhoneOutlined,
    SendOutlined,
    SmileOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import Picker from 'emoji-picker-react'
import MessageGroup from './MessageGroup'
import photoGroupe from '../../../assets/images/photo_groupe.jpg'
import '../../components/style.css'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { List, Avatar } from 'antd'

import { api, apiReact } from '../../../constants/constants'
import { useSelector, useDispatch } from 'react-redux'
import { setProp } from '../../../redux/actions/userActions'
import FormData from 'form-data'
import { Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import SoundRecorder from './SoundRecorder'
import TextareaAutosize from 'react-textarea-autosize'
import { io } from 'socket.io-client'
import { DeleteFilled } from '@ant-design/icons'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
const { v4: uuidV4 } = require('uuid')

const axios = require('axios')

function Discussion({
    contacts,
    currentContact,
    setCurrentContact,
    call,
    setCall,
    modal,
    setModal,
    currentConnected,
    socket,
    lastMessage,
}) {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const [groupMembers, setGroupMembers] = useState([])
    const [isAudio, setIsAudio] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [afficherEmofi, setAfficherEmofi] = useState(false)
    const [audioFile, setAudioFile] = useState(null)

    /* const { socket, error } = useSocket(api,{
        auth: {
          token: "abcd",
          id:user.id
        }
      });  
      var { sc,lastMessage, sendM } = 
      useSocketEvent(socket, 'message recieved');
      */

    const onEmojiClick = (event, emojiObject) => {
        setMessage(message + emojiObject.emoji)
    }

    /*  const getMessages = () => {
        axios
            .post(`${api}messagerie/messages`, {
                id_sender: parseInt(user.id),
                id_reciever: contacts[currentContact].id,
            })
            .then((res) => {
                setMessages(res.data)
                dispatch(setProp('currentMessages', res.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }*/
    const getMessages = async () => {
        return axios
            .post(`${api}messagerie/getGroupMessages`, {
                group: contacts[currentContact].id,
            })
            .then((res) => {
                setMessages(res.data)

                dispatch(setProp('currentMessages', res.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const getGroupMembers = () => {
        axios
            .post(`${api}messagerie/getGroupMembers`, {
                group: contacts[currentContact].id,
            })
            .then((res) => {
                setGroupMembers(res.data)

                dispatch(setProp('currentGroupMembers', res.data))
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const sendMessage = () => {
        var files = document.getElementById('file')
        const file = document.getElementById('file').files[0]
        const date = Date.now()
        //envoi d'une image
        if (file) {
            let data = new FormData()
            data.append('image', file, file.name)
            data.append('id_user', parseInt(user.id))
            data.append('group', contacts[currentContact].id)
            data.append('message', message)
            data.append('date', date)
            axios
                .post(`${api}messagerie/sendGroupMessage`, data, {
                    headers: {
                        accept: 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        'Content-Type': undefined,
                    },
                })
                .then((response) => {
                    setMessages([
                        ...messages,
                        {
                            id: response.data.id,
                            id_user: parseInt(user.id),
                            group: contacts[currentContact].id,
                            date: date,
                            message: message,
                            image: response.data.image,
                        },
                    ])
                    socket.emit(
                        'group message',
                        response.data.id,
                        message,
                        parseInt(user.id),
                        contacts[currentContact].id,
                        date,
                        response.data.image,
                        groupMembers
                    )
                    files.value = null
                    //handle success
                })
                .catch((error) => {
                    //handle error
                })
        } else {
            if (isAudio) {
                setIsAudio(false)
                let data = new FormData()
                data.append('image', audioFile, audioFile.name)
                data.append('id_user', parseInt(user.id))
                data.append('group', contacts[currentContact].id)
                data.append('message', message)
                data.append('date', date)

                axios
                    .post(`${api}messagerie/sendGroupMessage`, data, {
                        headers: {
                            accept: 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            'Content-Type': undefined,
                        },
                    })
                    .then((response) => {
                        setAudioFile(null)
                        setMessages([
                            ...messages,
                            {
                                id: response.data.id,
                                id_user: parseInt(user.id),
                                group: contacts[currentContact].id,
                                date: date,
                                message: message,
                                image: response.data.image,
                            },
                        ])
                        socket.emit(
                            'group message',
                            response.data.id,
                            message,
                            parseInt(user.id),
                            contacts[currentContact].id,
                            date,
                            response.data.image,
                            groupMembers
                        )
                    })
            } else {
                // envoi d'un message
                console.log('message', message)
                axios
                    .post(`${api}messagerie/sendGroupMessage`, {
                        id_user: parseInt(user.id),
                        group: contacts[currentContact].id,
                        message: message,
                        date: date,
                    })
                    .then((response) => {
                        setMessages([
                            ...messages,
                            {
                                id: response.data.id,
                                id_user: parseInt(user.id),
                                group: contacts[currentContact].id,
                                date: date,
                                message: message,
                            },
                        ])
                        socket.emit(
                            'group message',
                            response.data.id,
                            message,
                            parseInt(user.id),
                            contacts[currentContact].id,
                            date,
                            null,
                            groupMembers
                        )
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }
    /*
    socket.on(
        'group message recieved',
        (message, id_user, group, date, image ) => {
            if(contacts[currentContact].id === group && contacts[currentContact].name)
            setMessages([
                ...messages,
                {   
                    id_user: id_user,
                    group: group,
                    date: date,
                    message: message,
                    image: image,
                    own:false
                },
            ])
           // gotoBottom('discussion')
        }
    )*/
    const envoyerAppel = () => {
        var roomId = `${uuidV4()}`
        socket.emit(
            'groupCall',
            user.id,
            contacts[currentContact].id,
            roomId,
            groupMembers
        )
        navigate(`/appel-video-group/${roomId}/${user.id}`)
    }

    function gotoBottom(id) {
        var element = document.getElementById(id)
        element.scrollTop = element.scrollHeight - element.clientHeight
    }

    useEffect(() => {
        if (currentContact != null) {
            getMessages()
            getGroupMembers()
            //setMessages([messages,lastMessage])
        }
        gotoBottom('discussion')
    }, [currentContact])
    useEffect(() => {
        if (currentContact != null) {
            if (lastMessage)
                if (lastMessage.group == contacts[currentContact].id)
                    if (lastMessage.groupMessage) {
                        setMessages((state) => [...state, lastMessage])
                    }
            gotoBottom('discussion')
        }
    }, [lastMessage])

    return (
        <div className="border border-box width-descussion rounded-md">
            <div className="flex flex-row border-b-2  justify-between rounded-t-md">
                <div className="flex flex-row w-9/12 pl-1 space-x-2">
                    <Avatar
                        src={photoGroupe}
                        alt="photo-profil"
                        className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                    />
                    <div className="flex flex-col ml-4">
                        {contacts[currentContact] ? (
                            <div className="flex-flex-row space-x-1">
                                <span className="text-medium">Groupe:</span>
                                <span className="font-bold ">
                                    {contacts[currentContact].name}
                                </span>
                            </div>
                        ) : null}
                        <div className="text-xs">Actif il y a 1h</div>
                    </div>
                </div>
                <div className="flex flex-row space-x-2 items-center justify-center">
                    <div className="">
                        <button className="">
                            <VideoCameraOutlined
                                className="text-2xl hover:text-sky-500"
                                onClick={() => {
                                    envoyerAppel()
                                }}
                                type="primary"
                            />
                        </button>
                    </div>

                    <div className="">
                        <button className="">
                            <MoreOutlined className="text-2xl hover:text-sky-500" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="hauteur-discussion overflow-auto p-2"
                id="discussion"
            >
                {messages ? (
                    /* <InfiniteScroll
                    dataLength={messages.length}
                    next={fetchData}
                    style={{ display: 'flex', flexDirection: 'column-reverse' }} //To put endMessage and loader to the top.
                    inverse={true} //
                    hasMore={true}
                    loader={<h4>Loading...</h4>}
                    scrollableTarget="discussion"
                >
                    {array.map((item, index) => {
                       return <Message
                            key={index}
                            contenu={item.message}
                            dateHeure={item.date}
                            own={item.id_sender === user.id}
                            image={item.image}
                        />
                    })}
                </InfiniteScroll>*/
                    <List
                        itemLayout="horizontal"
                        dataSource={messages}
                        renderItem={(item) => (
                            <List.Item>
                                <MessageGroup
                                    group={contacts[currentContact].id}
                                    id={item.id}
                                    lastname={item.lastname}
                                    firstname={item.firstname}
                                    contenu={item.message}
                                    dateHeure={item.date}
                                    own={item.id_user === user.id}
                                    image={item.image}
                                    socket={socket}
                                    messages={messages}
                                    setMessages={setMessages}
                                    lastMessage={lastMessage}
                                    groupMembers={groupMembers}
                                />
                            </List.Item>
                        )}
                    />
                ) : null}

                <div className="float-right ">
                    {afficherEmofi ? (
                        <Picker onEmojiClick={onEmojiClick} />
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="flex flex-row border-t-2 p-1 space-x-2">
                <div className="items-center">
                    <SoundRecorder
                        setIsAudio={setIsAudio}
                        audioFile={audioFile}
                        setAudioFile={setAudioFile}
                    />
                </div>
                <div className="items-center">
                    <button className="flex">
                        <FileImageOutlined className="text-lg" />
                        <input
                            type="file"
                            className="w-6 z-100 absolute opacity-0 "
                            id="file"
                            accept=".jpg, .jpeg, .png"
                        />
                    </button>
                </div>

                <TextareaAutosize
                    className="w-10/12 p-2 resize-none border border-solid rounded-lg"
                    minRows={1}
                    maxRows={2}
                    placeholder="Aa"
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    value={message}
                />
                <div className="items-center">
                    <button
                        className=""
                        onClick={() => {
                            afficherEmofi
                                ? setAfficherEmofi(false)
                                : setAfficherEmofi(true)
                        }}
                    >
                        <SmileOutlined className="text-lg" />
                    </button>
                </div>
                <div className="items-center">
                    <button
                        className="	w-10  border border-solid rounded-md bg-sky-600 hover:bg-sky-500"
                        onClick={(e) => {
                            sendMessage()
                            setMessage('')
                            setAfficherEmofi(false)
                        }}
                    >
                        <SendOutlined className="text-lg text-white" />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Discussion
