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
import photo from '../../../assets/images/profil.png'
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
        <div className="w-11/12 mr-8 ml-6 border border-box">
            <div className="flex flex-row border border-solid p-1 justify-between">
                <div className="flex flex-row  w-4/12">
                    <img
                        src={photo}
                        alt="photo-profil"
                        className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col ml-4">
                        {contacts[currentContact] ? (
                            <span className="text-base">
                                Groupe:
                                {contacts[currentContact].name}
                            </span>
                        ) : null}
                        <div className="text-xs">Actif il y a 1h</div>
                    </div>
                </div>
                <button className="">
                    <VideoCameraOutlined
                        className="text-2xl hover:text-sky-500"
                        onClick={() => {
                            envoyerAppel()
                        }}
                        type="primary"
                    />
                </button>

                <div className="icontop-discussion  w-2/12 flex flex-row justify-between pl-6 pr-2">
                    <div className=" iconeOption ">
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
            <div className="flex flex-row border border-solid p-2">
                <div className="w-4 mr-2">
                    <SoundRecorder
                        setIsAudio={setIsAudio}
                        audioFile={audioFile}
                        setAudioFile={setAudioFile}
                    />
                </div>
                <button className="flex items-center w-6 ">
                    <PaperClipOutlined className="text-lg" />
                    <input
                        type="file"
                        className="w-6 z-100 absolute opacity-0 "
                        id="file"
                    />
                </button>

                <textarea
                    className="h-9 w-10/12 p-2 resize-none border border-solid rounded-lg"
                    placeholder="Aa"
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    value={message}
                ></textarea>
                <button
                    className="mr-1 ml-3"
                    onClick={() => {
                        afficherEmofi
                            ? setAfficherEmofi(false)
                            : setAfficherEmofi(true)
                    }}
                >
                    <SmileOutlined className="text-lg" />
                </button>

                <button
                    className="w-10 ml-1 border border-solid rounded-md bg-sky-600 hover:bg-sky-500"
                    onClick={() => {
                        sendMessage()
                        setMessage('')
                    }}
                >
                    <SendOutlined className="text-lg text-white" />
                </button>
            </div>
        </div>
    )
}

export default Discussion
