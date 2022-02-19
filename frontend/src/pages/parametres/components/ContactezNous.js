import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Input } from 'antd'

import { api } from '../../../constants/constants'
const axios = require('axios')

const { TextArea } = Input

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
        <div className="flex flex-col w-10/12 mr-auto ml-auto space-y-3">
            <div className="flex flex-col p-2 w-full">
                <div className=" p-2">
                    <span className="text-sky-600 ">Objet</span>
                </div>
                <TextArea
                    placeholder="Objet"
                    type="text"
                    className="w-full p-2 border-solid-2 resize-none rounded-md"
                    style={{ height: 50 }}
                    value={object}
                    onChange={(e) => setObject(e.target.value)}
                />
            </div>
            <div className="flex flex-col w-full p-2 ">
                <div className="p-2">
                    <span className="text-sky-600 ">Message</span>
                </div>
                <TextArea
                    type="text"
                    className="w-full p-2 border-solid-2 resize-none rounded-md"
                    // style={{ height: 50 }}
                    placeholder="Votre message"
                    style={{ height: 140 }}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                />
            </div>
            {/*  buttoun envoyer */}
            <div className="w-full text-center ml-5">
                {message ? (
                    <button
                        className="p-3 bg-sky-600 mt-3 float-right mr-10 text-white rounded-md hover:bg-sky-500 "
                        onClick={submitContact}
                    >
                        Envoyer
                    </button>
                ) : (
                    <button className="p-3 bg-sky-500 mt-3 float-right mr-10 text-white rounded-md hover:bg-sky-500 ">
                        Envoyer
                    </button>
                )}
            </div>
            <div className="text-grey-500 text-md text-center pt-2 pb-4">
                {error}
            </div>
        </div>
    )
}

export default ContactezNous
