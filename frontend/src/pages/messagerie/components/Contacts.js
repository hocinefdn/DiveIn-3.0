import React from 'react'
import { List, Avatar } from 'antd'
import Search from 'antd/lib/input/Search'
import { useState, useEffect } from 'react'
import Contact from './Contact'
import { useSelector } from 'react-redux'
import { Button, Input } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import GroupContact from './GroupContact'
import { CheckOutlined, UsergroupAddOutlined } from '@ant-design/icons'

function Contacts({
    socket,
    lastMessage,
    contacts,
    setContacts,
    setCurrentContact,
    setCurrentConnected,
    notificationsMessages,
    setNotificationsMessages,
    setAfficherContacts,
}) {
    const user = useSelector((state) => state.user)
    const [searchData, setSearchData] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [groupMembers, setGroupMembers] = useState([user.id])
    const [groupName, setGroupName] = useState('')
    const [afficheInput, setAfficheInput] = useState(false)
    function createGroup() {
        if (groupMembers.length > 1) {
            axios
                .post(`${api}messagerie/createGroup`, {
                    id: user.id,
                    groupName: groupName,
                    groupMembers: groupMembers,
                })
                .then((res) => {
                    setContacts([
                        ...contacts,
                        {
                            name: groupName,
                            id: res.data[1][0].id,
                            id_user: user.id,
                        },
                    ])
                    setGroupMembers([user.id])
                    setGroupName('')
                })
                .catch((err) => {})
        }
    }
    const onSearch = (e) => {
        let value = e.target.value
        value.length > 1 && setSearchTerm(value)
        let mydata = contacts.filter((contact) => {
            if (contact.name) {
                return contact.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            } else {
                return (contact.firstname + ' ' + contact.lastname)
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            }
        })
        console.log(mydata)
        if (mydata.length == 0 || value.length == 0) {
            console.log(mydata)
            setSearchData(null)
        } else {
            setSearchData(mydata)
        }
    }

    const afficherNomGroupe = () => {
        if (afficheInput == false) setAfficheInput(true)
        if (afficheInput == true) setAfficheInput(false)
    }

    useEffect(() => {}, [groupName, groupMembers])

    return (
        <div
            style={{ overflowY: 'scroll' }}
            className="bg-white h-full pt-16 fixed w-full border border-solid pl-2"
            id="contacts"
        >
            <div className="text-lg font-bold ml-20 mb-2">Contacts</div>
            <Search
                placeholder="Rechercher un contact"
                onChange={onSearch}
                style={{ width: 275 }}
            />
            <div
                className="flex flex-row"
                style={{ marginTop: '11px', width: '275px' }}
            >
                <Button
                    type="default"
                    onClick={afficherNomGroupe}
                    style={{ width: '10%' }}
                >
                    <UsergroupAddOutlined
                        style={{
                            position: 'relative',
                            right: '5px',
                            bottom: '3px',
                        }}
                    />
                </Button>

                {afficheInput ? (
                    <div className="flex flex-row">
                        <Input
                            style={{ width: '73%' }}
                            placeholder="Nom du groupe"
                            value={groupName}
                            onChange={(e) => {
                                setGroupName(e.target.value)
                            }}
                        />
                        <Button
                            type="default"
                            onClick={createGroup}
                            style={{ width: '10%' }}
                        >
                            <CheckOutlined
                                style={{
                                    position: 'relative',
                                    right: '5px',
                                    bottom: '3px',
                                }}
                            />
                        </Button>
                    </div>
                ) : (
                    ''
                )}
            </div>
            {searchData ? (
                <List
                    itemLayout="horizontal"
                    dataSource={searchData}
                    renderItem={(item, index) =>
                        !item.name ? (
                            <Contact
                                setGroupMembers={setGroupMembers}
                                groupMembers={groupMembers}
                                setCurrentContact={setCurrentContact}
                                contacts={contacts}
                                lastname={item.lastname}
                                firstname={item.firstname}
                                id={item.id}
                                index={index}
                                setCurrentConnected={setCurrentConnected}
                                connected={item.connected}
                                image={item.image}
                                notificationsMessages={notificationsMessages}
                                setNotificationsMessages={
                                    setNotificationsMessages
                                }
                            />
                        ) : (
                            <GroupContact
                                index={index}
                                name={item.name}
                                id={item.id}
                                founder={item.id_user}
                                setCurrentContact={setCurrentContact}
                            />
                        )
                    }
                />
            ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={contacts}
                    renderItem={(item, index) =>
                        !item.name ? (
                            <Contact
                                setGroupMembers={setGroupMembers}
                                groupMembers={groupMembers}
                                setCurrentContact={setCurrentContact}
                                contacts={contacts}
                                lastname={item.lastname}
                                firstname={item.firstname}
                                id={item.id}
                                index={index}
                                setCurrentConnected={setCurrentConnected}
                                connected={item.connected}
                                socket={socket}
                                image={item.image}
                                lastMessage={lastMessage}
                                notificationsMessages={notificationsMessages}
                                setNotificationsMessages={
                                    setNotificationsMessages
                                }
                                setAfficherContacts={setAfficherContacts}
                            />
                        ) : (
                            <GroupContact
                                index={index}
                                name={item.name}
                                id={item.id}
                                founder={item.id_user}
                                setCurrentContact={setCurrentContact}
                                contacts={contacts}
                                setContacts={setContacts}
                            />
                        )
                    }
                />
            )}
        </div>
    )
}

export default Contacts
