import React, { useState } from 'react'
import logo from '../../assets/logos/DiveIn.png'
import axios from 'axios'
import { api } from '../../constants/constants'
import { useNavigate } from 'react-router-dom'
function ConnexionAdmin() {
    const [nomAdmin, setNomAdmin] = useState('')
    const [mdpAdmin, setMdpAdmin] = useState('')
    const [msgErr, setMsgErr] = useState('')

    const navigate = useNavigate()
    const connexion = () => {
        axios
            .post(`${api}admin/connexion`, {
                nomAdmin: nomAdmin,
                passwordAdmin: mdpAdmin,
            })
            .then((res) => {
                if (res.data.error) setMsgErr('Identifiant incorrectes ')
                if (res.data.message == 'Admin authentifié')
                    localStorage.setItem('admin', 'connecté')
                navigate('/admin-tableau-de-bord')
            })
            .catch()
    }
    return (
        <div className="flex justify-center">
            <div className="flex flex-col items-center justify-center border border-stone-400 p-4 rounded-lg mt-10">
                <img src={logo} alt="logo-DiveIn" className="w-12 mb-2" />
                <div className="items-center justify-center text-xl font-bold">
                    Connexion Administrateur
                </div>
                <input
                    type="text"
                    required
                    className="w-60 h-10 border border-stone-400 m-3 p-2 rounded-md"
                    placeholder="Nom administrateur"
                    onChange={(e) => setNomAdmin(e.target.value)}
                    required
                />
                <input
                    type="password"
                    required
                    className="w-60 h-10 border border-stone-400 m-3 p-2 rounded-md"
                    placeholder="Mot de passe"
                    onChange={(e) => setMdpAdmin(e.target.value)}
                    required
                />
                <div className="text-red-600">{msgErr}</div>
                <button
                    className="bg-sky-400 m-3 p-2 font-bold rounded-md"
                    onClick={() => connexion()}
                >
                    Connexion
                </button>
            </div>
        </div>
    )
}

export default ConnexionAdmin
