import React from 'react'
import { List, Avatar } from 'antd'
import { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import { Button } from 'antd'
import { DeleteFilled, ExportOutlined } from '@ant-design/icons'
import photoGroupe from '../../../assets/images/photo_groupe.jpg'
const axios = require('axios')

function GroupContact({
    index,
    id,
    name,
    founder,
    setCurrentContact,
    contacts,
    setContacts,
}) {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()

    function find() {
        contacts.map((contact, i) => {
            if (contact.id == id && contact.name) {
                setCurrentContact('' + i)
                dispatch(setProp('currentContact', i))
                return i
            }
        })
    }
    function handleClick(e) {
        //console.log("e",e.target)
        //e.preventDefault()
        if (index) {
            setCurrentContact('' + index)
            dispatch(setProp('currentContact', index))
        } else {
            find()
        }
    }

    function leaveGroup() {
        axios
            .post(`${api}messagerie/leaveGroup`, {
                id_group: id,
                id_user: user.id,
            })
            .then((res) => {
                setContacts(
                    contacts.filter(
                        (contact) => contact.id != id && contact.founder == null
                    )
                )
            })
            .catch((err) => {})
    }

    return (
        <List.Item>
            <List.Item.Meta
                avatar={
                    <Avatar
                        className="w-10 h-10 border border-stone-200 hover:opacity-80 img"
                        src={photoGroupe}
                    />
                }
                title={
                    <a
                        className="flex flex-row space-x-1"
                        href="#"
                        id={index}
                        onClick={handleClick}
                    >
                        <p>groupe: </p>
                        <span className="font-bold">{name}</span>
                    </a>
                }
                description={
                    <div className="space-x-1 flex flex-row">
                        <ExportOutlined
                            onClick={leaveGroup}
                            title="quiter le groupe"
                            className="text-sky-600 text-lg cursor-pointer"
                            // style={{ width: '30px' }}
                        />
                        <span className="text-black p-2 text-xs">
                            quiter le groupe
                        </span>
                    </div>
                    // <DeleteFilled
                    //     onClick={leaveGroup}
                    //     title="quiter le groupe"
                    //     className="text-sky-600 cursor-pointer"
                    //     style={{ width: '30px' }}
                    // />
                }
            />
        </List.Item>
    )
}
export default GroupContact
