import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { Spin, Modal, Input } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'

const axios = require('axios')

function DesactiverCompte() {
    const user = useSelector((state) => state.user)

    const [password, setPassword] = useState('')
    const [error, setError] = useState()
    const confirmation = () => {
        let modal = document.getElementById('suppression')
        modal.classList.toggle('show')
    }

    function desactiver() {
        axios
            .post(`${api}user/checkPassword`, {
                id: user.id,
                password: password,
            })
            .then((res) => {
                if (res.data.isMatch) {
                    setError('')
                    confirmation()
                } else {
                    setError('mot de passe incorrect')
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const ClickToDelete = () => {
        setIsModalDeleteVisible(true)
    }

    const handleDeleteOk = () => {
        setIsModalDeleteVisible(false)
    }

    const handleDeleteCancel = () => {
        setIsModalDeleteVisible(false)
    }

    const desactiverMonCompte = (e) => {
        e.preventDefault()
        setIsDeleteLoading(true)
        setTimeout(() => {
            desactiver()
            setIsDeleteLoading(false)
            setIsModalDeleteVisible(false)
        }, 5000)
    }

    const annuler = (e) => {
        e.preventDefault()
        setIsModalDeleteVisible(false)
    }

    return (
        <div className="flew flex-col w-10/12 mr-auto ml-auto space-y-3 pb-4">
            <div>
                <Input.Password
                    placeholder="Saisissez votre mot de passe"
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className="m-3"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="w-full ml-2 text-center">
                {password ? (
                    <button
                        className="p-4 bg-red-500 text-white float-right rounded-md"
                        onClick={ClickToDelete}
                    >
                        Désactiver mon compte
                    </button>
                ) : (
                    <button className="p-4 bg-red-400 text-white float-right rounded-md">
                        Désactiver mon compte
                    </button>
                )}
            </div>
            <div className="text-grey-500 text-md text-center pt-2 pb-4">
                {error}
            </div>

            <Modal
                visible={isModalDeleteVisible}
                onOk={handleDeleteOk}
                onCancel={handleDeleteCancel}
                style={{ top: 100 }}
                width={300}
                footer=""
                className="p-1 ring bg-red-100 rounded-xl"
                title="Désactiver mon compte"
            >
                <div className="text-center">
                    <p className="text-center p-1 font-medium">
                        <br />
                        Êtes-vous sûr de désactiver votre compte ?
                    </p>
                    <div className="flex flex-col space-y-2">
                        <button
                            className="bg-red-500 text-white p-2 text-sm rounded-2xl hover:opacity-90 "
                            onClick={desactiverMonCompte}
                        >
                            {isDeleteLoading ? (
                                <Spin size="meduim" className="pr-2" />
                            ) : null}
                            Désactiver
                        </button>
                        <button
                            className="bg-white text-black border border-solid p-1 text-lg rounded-2xl hover:bg-sky-100  "
                            onClick={annuler}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default DesactiverCompte
