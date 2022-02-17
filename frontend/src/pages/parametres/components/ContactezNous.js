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
            <div className="mb-3">
                <span className="mr-10">Objet</span>
                <input
                    type="text"
                    className="border border-solid w-96 h-10"
                    value={object}
                    onChange={(e) => setObject(e.target.value)}
                />
            </div>
            <div>
                <span className="relative mr-4 bottom-16">Message</span>
                <textarea
                    className="h-20 w-96 border border-solid"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
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
