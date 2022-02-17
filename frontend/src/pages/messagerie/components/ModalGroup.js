import { api, apiReact } from '../../../constants/constants'

import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const axios = require('axios')

function MyModal({ modalGroup, setModalGroup }) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [reciever, setReciever] = useState({ lastname: 'amghis' })
    const user = useSelector((state) => state.user)
    const navigate = useNavigate()
    const handleClose = () => {
        setModalGroup({
            isVisible: false,
            id_sender: 0,
            id_group: 0,
            roomId: '',
        })
    }

    useEffect(() => {
        setIsModalVisible(modalGroup.isVisible)
    }, [modalGroup.isVisible])

    const showModal = () => {
        setIsModalVisible(true)
    }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    const getReciever = () => {
        axios
            .get(`${api}user/${modalGroup.id_sender}`)
            .then((res) => {
                if (res.data[0]) {
                    console.log(res.data[0])
                    setReciever(res.data[0])
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getReciever()
    }, [modalGroup.id_sender])
    /*
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      */
    /*                     {modalGroup.video ? ' Video...' : ' Audio...'}
     */
    return (
        <>
            <Modal
                title="Appel de Groupe DiveIn"
                visible={isModalVisible}
                // onOk={() =>  {
                //     var modalInfo=modalGroup;
                //     setModalGroup({
                //         isVisible: false,
                //         id_sender: 0,
                //         id_group: 0,
                //         roomId: '',
                //     })
                //     navigate(`/appel-video-group/${modalInfo.roomId}/${user.id}`);}}
                onCancel={handleClose}
                style={{ top: 100 }}
                width={400}
                footer=""
                className="p-1 ring bg-red-100 rounded-xl"
            >
                <div className="text-center space-y-2">
                    <span className="font-bold text-lg">
                        {reciever.lastname} {reciever.firstname}
                    </span>
                    <p className="text-md">vous envoi un Appel</p>
                    <div className="flex flex-col w-2/3 m-auto justify-center space-y-2">
                        <button
                            className="bg-black text-white p-2  text-sm rounded-2xl hover:opacity-80 "
                            onClick={() => {
                                var modalInfo = modalGroup
                                setModalGroup({
                                    isVisible: false,
                                    id_sender: 0,
                                    id_group: 0,
                                    roomId: '',
                                })
                                navigate(
                                    `/appel-video-group/${modalInfo.roomId}/${user.id}`
                                )
                            }}
                        >
                            Accepter
                        </button>
                        <button
                            className="bg-white text-black border border-solid p-1 text-lg rounded-2xl hover:bg-sky-100  "
                            onClick={handleClose}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </Modal>
            {/* <Modal
                title="Appel de Groupe DiveIn"
                visible={isModalVisible}
                onOk={() =>  {
                    var modalInfo=modalGroup;
                    setModalGroup({
                        isVisible: false,
                        id_sender: 0,
                        id_group: 0,
                        roomId: '',
                    })
                    navigate(`/appel-video-group/${modalInfo.roomId}/${user.id}`);}}
                onCancel={handleClose}
            >
                <p>
                    {reciever.lastname} {reciever.firstname} vous envoi un Appel
                    (clickez sur ok pour accepter ou sur cancel pour refuser)
                </p>
            </Modal> */}
        </>
    )
}

export default MyModal
