import React, { useEffect, useState } from 'react'
import ListSuggestion from './ListSuggestion'
import ListTendances from './ListTendances'
import { api, apiReact } from '../../constants/constants'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'
const axios = require('axios')
function BarreDroite() {
    const user = useSelector((state) => state.user)
    const [notSeen, setNotSeen] = useState(0)

    function getNotSeen() {
        axios
            .post(`${api}messagerie/messages/getNotSeen`, {
                id_reciever: user.id,
            })
            .then((res) => {
                setNotSeen(res.data.nbr)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    useEffect(() => {
        // getNotSeen()
    }, [])

    return (
        <div className=" fixed bg-white h-full w-64  border border-l-1 pt-16 space-y-5 p-1 ">
            {/* div de tendances */}
            <div className="p-2 bg-sky-100 rounded-md">
                <span className="text-xl font-bold">Tendances</span>
                <ListTendances />
            </div>

            {/* div suggestion */}
            <div className="p-2 bg-sky-100 rounded-md">
                <span className="text-xl font-bold">Suggestion</span>
                <ListSuggestion />
            </div>
        </div>
    )
}

export default BarreDroite
