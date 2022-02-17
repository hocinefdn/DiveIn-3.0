import React, { useState } from 'react'
import { Input, Space } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'

const axios = require('axios')
function MotDePasse() {
    const user = useSelector((state) => state.user)
    const [error, setError] = useState()
    const [oldPassword, setOldPassword] = useState()
    const [password, setPassword] = useState()

    function submitEdit() {
        axios
            .put(`${api}user/updateUser/${user.id}`, {
                id: user.id,
                password: password,
                oldPassword: oldPassword,
            })
            .then((res) => {
                setError(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div className="w-10/12 mr-auto ml-auto">
            <Input.Password
                placeholder="Saisissez votre ancien mot de passe"
                iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="m-3"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
            />
            <Input.Password
                placeholder="Saisissez votre nouveau mot de passe"
                iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="m-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error}
            <button className="p-3 btn-parametre left-2/3" onClick={submitEdit}>
                Valider
            </button>
        </div>
    )
}

export default MotDePasse
