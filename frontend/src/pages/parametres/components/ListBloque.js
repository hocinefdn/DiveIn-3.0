import React from 'react'
import { useState, useEffect } from 'react'
import { List, message, Avatar, Skeleton, Divider } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'

const axios = require('axios')
function ListBloque() {
    const user = useSelector((state) => state.user)
    const [data, setData] = useState([])

    function getBloque() {
        axios
            .post(`${api}messagerie/getBloque`, {
                id_user: user.id,
            })
            .then((res) => {
                setData(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    function unlock(id) {
        axios
            .post(`${api}messagerie/messagedeblock`, {
                id_sender: user.id,
                id_reciever: id,
            })
            .then((res) => {
                setData(data.filter((bloque) => bloque.id != id))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getBloque()
    }, [])
    return (
        <div className="w-10/12 mr-auto ml-auto">
            <div
                id="scrollableDiv"
                style={{
                    maxHeight: 250,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={data}
                    renderItem={(item) => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={
                                    <Avatar src="https://joeschmoe.io/api/v1/random" />
                                }
                                title={
                                    <div>
                                        <Link to={'/profil' + item.id}>
                                            {item.lastname} {item.firstname}
                                        </Link>
                                        <button
                                            className="p-1 bg-red-700 text-white float-right"
                                            onClick={() => unlock(item.id)}
                                        >
                                            Supprimer de la liste
                                        </button>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </div>
    )
}

export default ListBloque
