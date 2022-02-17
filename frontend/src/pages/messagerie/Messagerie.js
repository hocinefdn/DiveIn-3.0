import React, { useCallback } from 'react'
import Contacts from './components/Contacts'
import StructurePrincipal from '../components/StructurePrincipal'
import Discussion from './components/Discussion'
import '../components/style.css'
import { useState, useEffect } from 'react'
import Video from './components/Video'
import { api, apiReact } from '../../constants/constants'
import { useSelector, useDispatch } from 'react-redux'

import Modal from './components/Modal'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { setProp } from '../../redux/actions/userActions'
import { Button, Tooltip } from 'antd'
import Icon, { BarsOutlined, UserOutlined } from '@ant-design/icons'

import DiscussionGroup from './components/DiscussionGroup'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'

const axios = require('axios')
function Messagerie({
    socket,
    lastMessage,
    modal,
    setModal,
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
    const [currentContact, setCurrentContact] = useState(null)
    const [currentConnected, setCurrentConnected] = useState(false)
    const [contacts, setContacts] = useState([])
    const [groups, setGroups] = useState([])
    const dispatch = useDispatch()
    const [isDisplayedContacts, setIsDisplayedContacts] = useState(true)
    const [call, setCall] = useState(false)

    const getContacts = () => {
        axios
            .post(`${api}messagerie/follows`, {
                id: user.id,
            })
            .then((res) => {
                axios
                    .post(`${api}messagerie/getGroups`, {
                        id: user.id,
                    })
                    .then((res2) => {
                        setContacts([...res.data, ...res2.data])
                        /*dispatch(setProp("groups",res2.data))*/
                        console.log([...res.data, ...res2.data])
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                /* setContacts([...contacts,res.data])
             
              dispatch(setProp("contacts",res.data))*/
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function contactVisible() {
        // isDisplayedContacts
        //     ? document.getElementById('droite').classList.remove('droite')
        //     : document.getElementById('droite').classList.add('droite')
        console.log(isDisplayedContacts)
        setIsDisplayedContacts(!isDisplayedContacts)
        if (isDisplayedContacts) {
            document.getElementById('droite').style.display = 'block'
            document.getElementById('droite').style.position = 'fixed'
            document.getElementById('droite').style.zIndex = '0'
            document.getElementById('droite').style.right = '0'
        }
        if (!isDisplayedContacts) {
            document.getElementById('droite').style.display = 'none'
        }
    }
    useEffect(() => {
        contactVisible()
        getContacts()
    }, [])
    useEffect(() => {
        if (lastMessage)
            if (lastMessage.thisIsVideoCall) {
                if (modal.isVisible === false) {
                    console.log('appel recu')
                    setModal({
                        isVisible: true,
                        id_sender: lastMessage.id_sender,
                        id_reciever: lastMessage.id_reciever,
                        video: lastMessage.video,
                    })
                }
            }
    }, [lastMessage])
    return (
        <div>
            <Modal modal={modal} setModal={setModal} />

            {
                !call ? (
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
                        style={{ height: '50%' }}
                        titrePage="Messagerie"
                        contenu={
                            <div>
                                <Button
                                    style={{
                                        position: 'absolute',

                                        left: '0vh',
                                    }}
                                    id="btn-right"
                                    // shape="circle"
                                    onClick={contactVisible}
                                >
                                    <UserOutlined className="text-lg" />
                                </Button>
                                {currentContact ? (
                                    !('name' in contacts[currentContact]) ? (
                                        <Discussion
                                            socket={socket}
                                            lastMessage={lastMessage}
                                            setCall={setCall}
                                            modal={modal}
                                            setModal={setModal}
                                            setContacts={setContacts}
                                            contacts={contacts}
                                            currentContact={currentContact}
                                            currentConnected={currentConnected}
                                        />
                                    ) : (
                                        <DiscussionGroup
                                            setContacts={setContacts}
                                            contacts={contacts}
                                            currentContact={currentContact}
                                            socket={socket}
                                            lastMessage={lastMessage}
                                        />
                                    )
                                ) : null}
                            </div>
                        }
                        barreDroite={
                            <Contacts
                                socket={socket}
                                lastMessage={lastMessage}
                                setContacts={setContacts}
                                contacts={contacts}
                                setContacts={setContacts}
                                currentContact={currentContact}
                                setCurrentContact={setCurrentContact}
                                setCurrentConnected={setCurrentConnected}
                                notificationsMessages={notificationsMessages}
                                setNotificationsMessages={
                                    setNotificationsMessages
                                }
                            />
                        }
                    />
                ) : null
                // <Video/>
            }
        </div>
    )
}

export default Messagerie
