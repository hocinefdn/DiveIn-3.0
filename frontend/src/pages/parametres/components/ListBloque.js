import React from 'react'
import { useState, useEffect } from 'react'
import { List, message, Avatar, Skeleton, Divider } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'

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
        <div className="w-10/12 mr-auto ml-auto items-center">
            <div
                id="scrollableDiv"
                style={{
                    maxHeight: 250,
                    overflow: 'auto',
                    padding: '0 6px',
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
                                    item.image !== null ? (
                                        <Avatar
                                            src={item.image}
                                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                            alt="photo profil"
                                        />
                                    ) : (
                                        <Avatar
                                            src={photoProfil_vide}
                                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                            alt="photo profil"
                                        />
                                    )
                                }
                                title={
                                    <div className="flex flex-row items-center">
                                        <div className="w-9/12">
                                            <Link to={'/profil/' + item.id}>
                                                <span className="font-bold space-x-2">
                                                    {item.firstname}{' '}
                                                    {item.lastname}
                                                </span>
                                            </Link>
                                        </div>

                                        <div>
                                            <button
                                                className="p-1 bg-red-700 text-white float-right rounded-md"
                                                onClick={() => unlock(item.id)}
                                            >
                                                Débloquer
                                            </button>
                                        </div>
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
