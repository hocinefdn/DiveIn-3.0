import React, { useState } from 'react'
import { Input, Space } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons'
import { useSelector, useDispatch } from 'react-redux'
import { api } from '../../../constants/constants'
import Password from 'antd/lib/input/Password'

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
        <div className="flex flex-col w-10/12 mr-auto ml-auto space-y-2">
            <div className="w-full">
                <Input.Password
                    placeholder="Saisissez votre ancien mot de passe"
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className=""
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>

            <div className="w-full">
                <Input.Password
                    placeholder="Saisissez votre nouveau mot de passe"
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    className=""
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="w-full  ml-5 text-center">
                {oldPassword && Password ? (
                    <button
                        className="p-3 bg-sky-600 mt-3  mr-10 text-white rounded-md hover:bg-sky-500 "
                        onClick={submitEdit}
                    >
                        Valider
                    </button>
                ) : (
                    <button className="p-3 bg-sky-500 mt-3  mr-10 text-white rounded-md hover:bg-sky-500 ">
                        Valider
                    </button>
                )}
            </div>
            {/* <button className="p-3 btn-parametre left-2/3" onClick={submitEdit}>
                Valider
            </button> */}
            <div className="text-grey-500 text-md text-center pt-2 pb-4">
                {error}
            </div>
        </div>
    )
}

export default MotDePasse
