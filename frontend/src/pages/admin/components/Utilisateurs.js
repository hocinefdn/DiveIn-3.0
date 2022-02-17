import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from '../../../constants/constants'

function Utilisateurs() {
    const [utilisateurs, setUtlilisateurs] = useState([])

    // get All users
    const getUsers = () => {
        axios
            .get(`${api}user/getAllzUsers`)
            .then((res) => {
                setUtlilisateurs(res.data)
                console.log(res)
            })
            .catch((err) => console.log(err))
    }

    // delete user
    const deleteUser = (id) => {
        axios
            .delete(`${api}user/deleteUser/${id}`)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getUsers()
    }, [])

    return (
        <div>
            <div className="p-3">
                <div className="text-lg">Utilisateurs</div>
                <input
                    type="search"
                    placeholder="Cherchez un utilisateur"
                    className="h-8 w-60 p-2 border border-stone-600"
                />
                <button className="border bg-sky-400  hover:bg-sky-300 p-1 m-1 rounded-md">
                    Rechercher
                </button>
            </div>

            <table className="w-full">
                <tbody>
                    <tr key={'entete'}>
                        <th className="border ">Id</th>
                        <th className="border ">Nom</th>
                        <th className="border ">Prénom</th>
                        <th className="border ">Date de naissance</th>
                        <th className="border ">Sexe</th>
                        <th className="border ">Date d'inscription</th>
                        <th className="border ">E-mail</th>
                    </tr>
                    {utilisateurs.map((item, index) => (
                        <tr key={`utilisateurs-${index}`} className="border">
                            {console.log(item)}
                            <td className="font-bold">{item.id}</td>
                            <td className="border p-1">{item.lastname}</td>
                            <td className="border">{item.firstname}</td>
                            <td className="border">{item.birthday}</td>
                            <td className="border"></td>
                            <td className="border">{item.date}</td>
                            <td className="border">{item.email}</td>
                            <td className="border">
                                <button
                                    className="bg-red-700 text-white hover:bg-red-500 p-1"
                                    onClick={() => deleteUser(item.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Utilisateurs
