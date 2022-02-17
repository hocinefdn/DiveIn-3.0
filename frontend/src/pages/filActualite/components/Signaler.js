import React, { useEffect, useState } from 'react'
import { notification, Popconfirm } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { useSelector } from 'react-redux'

function Signaler({ post }) {
    const user = useSelector((state) => state.user)

    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: ' Post signaler',
        })
    }

    const SIGNALER_POST = async () => {
        axios({
            method: 'POST',
            url: `${api}actualite/post/signaler/${user.infoUser.id}&${post.id}`,
        })
            .then(() => {})
            .catch((err) => {
                console.log({ err })
            })
    }

    const showPopconfirm = () => {
        setVisible(true)
    }
    const handleOk = () => {
        setConfirmLoading(true)
        setTimeout(() => {
            setVisible(false)
            setConfirmLoading(false)
            SIGNALER_POST()
            openNotificationWithIcon('success')
        }, 2000)
    }

    const handleCancel = () => {
        console.log('Clicked cancel button')
        setVisible(false)
    }

    // const signaler = (e) => {
    //     e.preventDefault()
    //     setTimeout(() => {
    //         SIGNALER_POST()
    //         openNotificationWithIcon('success')
    //     }, 800)
    //}

    return (
        <div>
            <Popconfirm
                title="Êtes-vous sûr de signaler ce contenu?"
                visible={visible}
                onConfirm={handleOk}
                okButtonProps={{ loading: confirmLoading }}
                onCancel={handleCancel}
            >
                <button
                    onClick={showPopconfirm}
                    className="space-x-1 flex felx-row"
                >
                    <div className="pt-1">
                        <img src="https://img.icons8.com/ios/16/004DA3/flag--v1.png" />
                    </div>
                    <div>Signaler</div>
                </button>
            </Popconfirm>
        </div>
    )
}

export default Signaler
