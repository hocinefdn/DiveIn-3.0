import React, { useState } from 'react'
import {
    DeleteOutlined,
    FileImageOutlined,
    PictureOutlined,
    MoreOutlined,
    PaperClipOutlined,
    PhoneOutlined,
    SendOutlined,
    SmileOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import Picker from 'emoji-picker-react'
import Message from './Message'
import photo from '../../../assets/images/profil.png'
import '../css/discussion.css'
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
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import TextareaAutosize from 'react-textarea-autosize'

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
    const [btn, setBtn] = useState(true)
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

     // const {sc2, deleteSentMessage, delM}=
      //useSocketEvent(socket,'delete message')

      const { sc,lastMessage, sendM } = 
      useSocketEvent(socket, 'message recieved');*/

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
            .post(`${api}messagerie/messages`, {
                id_sender: parseInt(user.id),
                id_reciever: contacts[currentContact].id,
            })
            .then((res) => {
                setMessages(res.data)
                console.log(messages)

                dispatch(setProp('currentMessages', res.data))
                gotoBottom('discussion')
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function deleteMessages() {
        axios
            .post(`${api}messagerie/deleteMessages`, {
                id_sender: parseInt(user.id),
                id_reciever: contacts[currentContact].id,
            })
            .then((res) => {
                setMessages([])
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
            data.append('id_sender', parseInt(user.id))
            data.append('id_reciever', contacts[currentContact].id)
            data.append('message', message)
            data.append('date', date)

            axios
                .post(`${api}messagerie/message`, data, {
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
                            id_sender: parseInt(user.id),
                            id_reciever: contacts[currentContact].id,
                            date: date,
                            message: message,
                            image: response.data.image,
                        },
                    ])
                    socket.emit(
                        'message',
                        response.data.id,
                        message,
                        parseInt(user.id),
                        contacts[currentContact].id,
                        date,
                        response.data.image
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
                data.append('id_sender', parseInt(user.id))
                data.append('id_reciever', contacts[currentContact].id)
                data.append('message', message)
                data.append('date', date)

                axios
                    .post(`${api}messagerie/message`, data, {
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
                                id_sender: parseInt(user.id),
                                id_reciever: contacts[currentContact].id,
                                date: date,
                                message: message,
                                image: response.data.image,
                            },
                        ])
                        socket.emit(
                            'message',
                            response.data.id,
                            message,
                            parseInt(user.id),
                            contacts[currentContact].id,
                            date,
                            response.data.image
                        )
                    })
            } else {
                // envoi d'un message
                axios
                    .post(`${api}messagerie/message`, {
                        id_sender: parseInt(user.id),
                        id_reciever: contacts[currentContact].id,
                        message: message,
                        date: date,
                    })
                    .then((response) => {
                        setMessages([
                            ...messages,
                            {
                                id: response.data.id,
                                id_sender: parseInt(user.id),
                                id_reciever: contacts[currentContact].id,
                                date: date,
                                message: message,
                            },
                        ])
                        socket.emit(
                            'message',
                            response.data.id,
                            message,
                            parseInt(user.id),
                            contacts[currentContact].id,
                            date
                        )
                        gotoBottom('discussion')
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }

    const envoyerAppel = () => {
        socket.emit('call', user.id, contacts[currentContact].id, true)
        setCall(true)
        setTimeout(() => {
            navigate(
                `/appel-video/${user.id}/${contacts[currentContact].id}/${true}`
            )
        }, 2000)
    }
    const envoyerAppelAudio = () => {
        socket.emit('call', user.id, contacts[currentContact].id, false)
        setCall(true)
        navigate(
            `/appel-video/${user.id}/${contacts[currentContact].id}/${false}`
        )
    }
    /*
    socket.on('call recieved', (id_sender, id_reciever, video) => {  // 'call recieved'
        if (modal.isVisible === false)
            setModal({
                isVisible: true,
                id_sender: id_sender,
                id_reciever,
                video: video,
            })
    })
    */
    /*
    socket.on(
        'message recieved',
        (id, message, id_sender, id_reciever, date, image) => {
            console.log('recieved', message)
            if (contacts[currentContact].id === id_sender)
                setMessages([
                    ...messages,
                    {
                        id: id,
                        id_sender: id_sender,
                        id_reciever: id_reciever,
                        date: date,
                        message: message,
                        image: image,
                    },
                ])
            gotoBottom('discussion')
        }
    )
    */
    /*
    socket.on('delete message', (id) => {
        console.log("delete")
        setMessages(state => state.filter((message) => message.id != id))
    })*/

    function gotoBottom(id) {
        var element = document.getElementById(id)
        element.scrollTop = element.scrollHeight - element.clientHeight
    }

    useEffect(() => {
        //console.log(currentContact)
        if (currentContact != null) {
            if (lastMessage) {
                if (lastMessage.monMessage) {
                    if (lastMessage.id_sender === contacts[currentContact].id)
                        setMessages((state) => [...state, lastMessage])
                }
                if (lastMessage.id_delete) {
                    setMessages(
                        messages.filter(
                            (message) => message.id != lastMessage.id_delete
                        )
                    )
                }
                if (lastMessage.video) {
                    if (modal.isVisible === false) {
                        setModal({
                            isVisible: true,
                            id_sender: lastMessage.id_sender,
                            id_reciever: lastMessage.id_reciever,
                            video: lastMessage.video,
                        })
                    }
                }

                gotoBottom('discussion')
            }
        }
    }, [lastMessage])

    useEffect(() => {
        if (currentContact != null) {
            getMessages()
        }
    }, [currentContact])

    return (
        <div className="border border-box width-descussion rounded-md">
            <div className=" flex flex-row border-b-2  justify-between rounded-t-md">
                <div className="flex flex-row w-4/12 pl-1 pt-1 pb-1 space-x-2">
                    {contacts[currentContact].image !== null ? (
                        <Avatar
                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                            src={contacts[currentContact].image}
                            alt={`${contacts[currentContact].firstname}" "${contacts[currentContact].lastname}`}
                        />
                    ) : (
                        <Avatar
                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                            src={photoProfil_vide}
                            alt={`${contacts[currentContact].firstname}" "${contacts[currentContact].lastname}`}
                        />
                    )}

                    {/* <img
                        src={photo}
                        alt="photo-profil"
                        className="h-10 w-10 rounded-full"
                    /> */}
                    <div className="flex flex-col font-bold">
                        {contacts[currentContact] ? (
                            <span className="text-base">
                                {contacts[currentContact].lastname}{' '}
                                {contacts[currentContact].firstname}{' '}
                            </span>
                        ) : null}
                        {/* <div className="text-xs">Actif il y a 1h</div> */}
                    </div>
                </div>

                <div className="icontop-discussion  w-2/12 flex flex-row justify-between  items-center pl-2 pr-2 ">
                    {currentConnected ? (
                        <div className="iconePhone">
                            <button className="  ">
                                <PhoneOutlined
                                    className="text-2xl hover:text-sky-500"
                                    onClick={() => {
                                        envoyerAppelAudio()
                                    }}
                                />
                            </button>
                        </div>
                    ) : null}
                    {currentConnected ? (
                        <div className=" iconeVideoPhone">
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
                    ) : null}
                    <DeleteOutlined
                        onClick={deleteMessages}
                        title="supprimer la discussion"
                        className="text-sky-600 cursor-pointer text-xl"
                        // style={{ width: '30px', paddingTop: '10px' }}
                    />
                    <div className=" iconeOption ">
                        <button className="">
                            <MoreOutlined className="text-2xl hover:text-sky-500" />
                        </button>
                    </div>
                </div>
            </div>

            <div
                className="hauteur-discussion overflow-auto p-2 "
                id="discussion"
            >
                {messages
                    ? /* <InfiniteScroll
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
                      // <List
                      //     itemLayout="horizontal"
                      //     dataSource={messages}
                      //     renderItem={(item) => (
                      //         <List.Item>

                      //         </List.Item>
                      //     )}
                      // />
                      messages.map((item, index) => (
                          <Message
                              id={item.id}
                              key={item.id}
                              sender={item.id_sender}
                              reciever={item.id_reciever}
                              contenu={item.message}
                              dateHeure={item.date}
                              own={item.id_sender === user.id}
                              reaction_sender={item.react_sender}
                              reaction_reciever={item.react_reciever}
                              image={item.image}
                              lastMessage={lastMessage}
                              socket={socket}
                              setMessages={setMessages}
                              messages={messages}
                              contacts={contacts}
                              currentContact={currentContact}
                          />
                      ))
                    : null}
                <div className="float-right ">
                    {afficherEmofi ? (
                        <Picker onEmojiClick={onEmojiClick} />
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="flex flex-row items-center justify-center border-t-2 p-1 space-x-2">
                <div className="items-center">
                    <SoundRecorder
                        setIsAudio={setIsAudio}
                        audioFile={audioFile}
                        setAudioFile={setAudioFile}
                    />
                </div>
                {/* <FileImageOutlined
                                key="image"
                                name="image"
                                className="text-sky-600 text-lg "
                                //onClick={uploadImages}
                            />
                            <input
                                className="w-8 z-100 absolute opacity-0 cursor-pointer "
                                id="file-upload"
                                type="file"
                                name="file"
                                accept=".jpg, .jpeg, .png"
                                onChange={(e) => uploadImages(e)}
                                multiple
                            /> */}
                {/* <button className="w-4 mr-2">
                    <PaperClipOutlined className="text-lg" />
                </button>
                <input type="file" className="w-6" id="file" /> */}
                <div className="items-center">
                    <button className="flex">
                        <PictureOutlined className="text-lg text-sky-600" />
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
                {/* <textarea
                    className="h-9 w-10/12 p-2 resize-none border border-solid rounded-lg"
                    placeholder="Aa"
                    onChange={(e) => {
                        setMessage(e.target.value)
                    }}
                    value={message}
                ></textarea> */}
                <div className="items-center">
                    <button
                        className=""
                        onClick={() => {
                            afficherEmofi
                                ? setAfficherEmofi(false)
                                : setAfficherEmofi(true)
                        }}
                    >
                        <SmileOutlined className="text-lg text-sky-600" />
                    </button>
                </div>

                <div className="items-center">
                    <button
                        id="sendbtn"
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
