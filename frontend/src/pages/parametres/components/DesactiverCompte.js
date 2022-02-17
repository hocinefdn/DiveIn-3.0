import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import { useCookies } from 'react-cookie'
import { useSelector, useDispatch } from 'react-redux'
import { Input } from 'antd'
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

    function validation() {
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

    return (
        <div className="w-10/12 mr-auto ml-auto p-3">
            <Input.Password
                placeholder="Saisissez votre mot de passe"
                iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                className="m-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {error}
            <button
                className="p-4 bg-red-700 text-white float-right"
                onClick={validation}
            >
                Désactiver votre compte
            </button>
        </div>
    )
}

export default DesactiverCompte
