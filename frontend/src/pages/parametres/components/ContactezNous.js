import TextArea from 'antd/lib/input/TextArea'
import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { api } from '../../../constants/constants'
const axios = require('axios')

function ContactezNous() {
    const user = useSelector((state) => state.user)
    const [message, setMessage] = useState()
    const [object, setObject] = useState()
    const [error, setError] = useState()

    function submitContact(e) {
        e.preventDefault()
        axios
            .post(`${api}user/contact`, {
                id_user: user.id,
                object: object,
                message: message,
            })
            .then((res) => {
                setError(res.data.message)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div className="w-10/12 mr-auto ml-auto p-3">
            <div className="flex flex-col mb-4">
                <div className=" mb-4">
                    <span className="text-sky-600 ">Objet</span>
                </div>
                <input
                    placeholder="Objet"
                    type="text"
                    className="border border-solid w-96 h-10"
                    value={object}
                    onChange={(e) => setObject(e.target.value)}
                />
            </div>
            <div className="flex flex-col ">
                <div className="mb-4">
                    <span className="text-sky-600 ">Message</span>
                </div>
                <TextArea
                    type="text"
                    className="p-2 border-solid-2 resize-none rounded-md"
                    // style={{ height: 50 }}
                    placeholder="Votre message"
                    className="w-96 border border-solid"
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                ></TextArea>
            </div>
            {error}
            <button
                onClick={submitContact}
                className="p-3 bg-sky-600 mt-3 float-right mr-10 text-white rounded-md hover:bg-sky-500 "
            >
                Envoyer
            </button>
        </div>
    )
}

export default ContactezNous
