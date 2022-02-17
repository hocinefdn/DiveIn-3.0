import { api, apiReact } from '../../../constants/constants'

import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
const axios = require('axios')

function MyModal({ modal, setModal }) {
    const [isModalVisible, setIsModalVisible] = useState(false)
    const [reciever, setReciever] = useState({ lastname: 'amghis' })
    const navigate = useNavigate()
    const handleClose = () => {
        setModal({
            isVisible: false,
            id_sender: 0,
            id_reciever: 0,
            video: true,
        })
    }

    useEffect(() => {
        setIsModalVisible(modal.isVisible)
    }, [modal.isVisible])

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
            .get(`${api}user/${modal.id_sender}`)
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
    }, [modal.id_sender])
    /*
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      */
    return (
        <>
            <Modal
                title="Appel DiveIn"
                visible={isModalVisible}
                onOk={() => {
                    var modalInfo=modal;
                    setModal({
                        isVisible: false,
                        id_sender: 0,
                        id_reciever: 0,
                        video: true,
                    }) 
                    navigate(`/appel-video/${modalInfo.id_reciever}/${modalInfo.id_sender}/${modalInfo.video}`);
            }}
                onCancel={handleClose}
            >
                <p>
                    {reciever.lastname} {reciever.firstname} vous envoi un Appel
                    {modal.video ? ' Video...' : ' Audio...'}
                    (clickez sur ok pour accepter ou sur cancel pour refuser)
                </p>
            </Modal>
        </>
    )
}

export default MyModal