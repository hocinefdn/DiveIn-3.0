import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Utilisateurs from './components/Utilisateurs'
import Posts from './components/Posts'
import Signales from './components/Signales'
function Admin() {
    const [contenu, setContenu] = useState(null)

    const navigate = useNavigate()
    if (localStorage.getItem('admin') != 'connecté') navigate('/admin')
    const afficherUsers = () => {
        setContenu(<Utilisateurs />)
    }

    const afficherPosts = () => {
        setContenu(<Posts />)
    }
    const afficherSignales = () => {
        setContenu(<Signales />)
    }
    const deconnecter = () => {
        localStorage.removeItem('admin')
        navigate('/admin')
    }

    useEffect(() => {}, [])

    return (
        <div className="flex flex-row">
            <div className="w-2/12 h-screen border border-stone-400">
                <ul className="p-2">
                    <li
                        className="text-lg p-2 hover:bg-gray-200 cursor-pointer rounded-md border border-stone-200 mb-3"
                        onClick={() => afficherUsers()}
                    >
                        Utilisateurs
                    </li>
                    <li
                        className="text-lg p-2 hover:bg-gray-200 cursor-pointer rounded-md border border-stone-200 mb-3"
                        onClick={() => afficherPosts()}
                    >
                        Posts
                    </li>
                    <li
                        className="text-lg p-2 hover:bg-gray-200 cursor-pointer rounded-md border border-stone-200 mb-3"
                        onClick={() => afficherSignales()}
                    >
                        Signales
                    </li>
                    <li
                        className="text-lg p-2 hover:bg-gray-200 cursor-pointer rounded-md border border-stone-200 mb-3"
                        onClick={() => deconnecter()}
                    >
                        Déconnecter
                    </li>
                </ul>
            </div>
            <div className="w-10/12 h-screen p-4 overflow-auto">{contenu}</div>
        </div>
    )
}

export default Admin
