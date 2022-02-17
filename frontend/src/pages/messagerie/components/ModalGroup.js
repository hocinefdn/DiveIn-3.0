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
            </Modal>
        </>
    )
}

export default MyModal
