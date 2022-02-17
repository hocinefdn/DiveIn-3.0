import React from 'react'
import { List, Avatar } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import { Button } from 'antd'
import {
    UsergroupAddOutlined,
    UsergroupDeleteOutlined,
} from '@ant-design/icons'
import NotificationBadge from 'react-notification-badge'
import { Effect } from 'react-notification-badge'
import { useSocket, useSocketEvent } from 'socket.io-react-hook'
import photo_default from '../../../assets/images/image_profil_vide.png'
import {
    BellOutlined,
    MessageOutlined,
    ThunderboltTwoTone,
} from '@ant-design/icons'
const axios = require('axios')

function Contact({
    socket,
    lastMessage,
    index,
    id,
    lastname,
    firstname,
    setCurrentConnected,
    setCurrentContact,
    groupMembers,
    setGroupMembers,
    image,
    notificationsMessages,
    setNotificationsMessages,
}) {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [isConnected, setIsConnected] = useState(false)
    const [notSeen, setNotSeen] = useState()
    const [inGroup, setInGroup] = useState(false)

    /*
    const { socket, error } = useSocket(api,{
        auth: {
          token: "abcd",
          id:user.id
        }
      });  

      const { sc,lastMessage, sendM } = 
      useSocketEvent(socket, 'message recieved');
      */

    function getNotSeen() {
        axios
            .post(`${api}messagerie/messages/getNotSeen`, {
                id_sender: id,
                id_reciever: user.id,
            })
            .then((res) => {
                setNotSeen(res.data.nbr)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function setSeen() {
        axios
            .post(`${api}messagerie/messages/setSeen`, {
                id_sender: id,
                id_reciever: user.id,
            })
            .then((res) => {
                setNotificationsMessages(notificationsMessages - notSeen)
                setNotSeen(0)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    function handleClick(e) {
        //console.log("e",e.target)
        //e.preventDefault()
        setSeen()
        setCurrentContact('' + index)
        dispatch(setProp('currentContact', index))

        setCurrentConnected(isConnected)
    }

    function addToGroup() {
        setGroupMembers([...groupMembers, id])
        setInGroup(true)
    }
    function removeFromGroup() {
        setGroupMembers(groupMembers.filter((groupMember) => groupMember != id))
        setInGroup(false)
    }
    /*
    socket.on(
        'message notified',
        (message, id_sender, id_reciever, date, image) => {
            if(id_sender == id)
            {
            setNotSeen(state => state+1); 
            }
        })
        */
    /*
        
        socket.on("connected-user", (connected)=>{
            setIsConnected(connected)
        })
        socket.on("user-connected", id_user =>{
            if(id_user === id){
                setIsConnected(true)
            }
        })
        socket.on("user-disconected" , (id_user) =>{
            if(id_user === id){
                setIsConnected(false)
            }
        })
        */
    useEffect(() => {
        if (socket) socket.emit('get-connected-user', id)

        //getNotSeen()
        getNotSeen()
    }, [])
    useEffect(() => {
        if (!groupMembers.includes(id)) {
            setInGroup(false)
        }
    }, [groupMembers])

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.hasOwnProperty('isConnected')) {
                // console.log(lastMessage, id, user.id)
                if (lastMessage.id == id)
                    setIsConnected(lastMessage.isConnected)
            }

            if (lastMessage.socketHandShake) {
                if (lastMessage.socketHandShake === id) {
                    //console.log('connect', lastMessage.socketHandShake)
                    setIsConnected(true)
                }
            }

            if (lastMessage.disconectedUser) {
                //console.log('disco')
                if (lastMessage.disconectedUser === id) setIsConnected(false)
            }

            if (lastMessage.monMessage) {
                if (lastMessage.id_sender === id) {
                    setNotSeen((state) => state + 1)
                }
            }
        }
    }, [lastMessage])

    return (
        <List.Item>
            <List.Item.Meta
                avatar={<Avatar src={image ? image : photo_default} />}
                title={
                    <div>
                        <a href="#" id={index} onClick={handleClick}>
                            {lastname} {firstname}{' '}
                            {isConnected ? (
                                <ThunderboltTwoTone twoToneColor={'green'} />
                            ) : null}{' '}
                        </a>
                    </div>
                }
                description={
                    <div style={{ display: 'flex' }}>
                        <Button type="default">
                            {!inGroup ? (
                                <UsergroupAddOutlined onClick={addToGroup} />
                            ) : (
                                <UsergroupDeleteOutlined
                                    onClick={removeFromGroup}
                                />
                            )}
                        </Button>
                        <button style={{ marginLeft: 30 }}>
                            <NotificationBadge
                                count={notSeen}
                                effect={Effect.SCALE}
                                className="mt-4"
                                style={{ fontSize: '9px' }}
                            />
                        </button>
                    </div>
                }
            />
        </List.Item>
    )
}
export default Contact
