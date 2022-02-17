import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { api } from '../../../constants/constants'
function Posts() {
    const [posts, setPosts] = useState([])

    const getPosts = () => {
        axios
            .get(`${api}actualite/allPosts`)
            .then((res) => {
                console.log(res.data)
                setPosts(res.data)
            })
            .catch((err) => console.log(err))
    }
    // delete user
    const deletePost = (id) => {
        axios
            .delete(`${api}actualite/post/${id}`)
            .then((res) => {
                console.log(res)
            })
            .catch((err) => console.log(err))
    }

    useEffect(() => {
        getPosts()
    }, [])

    return (
        <div>
            <div className="text-lg">Posts</div>
            <table className="w-full">
                <tbody>
                    <tr key={'entete'}>
                        <th className="border ">Id</th>
                        <th className="border ">Contenu</th>
                        <th className="border ">Id utilisateur</th>
                        <th className="border ">Date</th>
                        <th className="border ">Type post</th>
                    </tr>
                    {posts.map((item, index) => (
                        <tr key={`utilisateurs-${index}`} className="border">
                            <td className="font-bold">{item.id}</td>
                            <td className="border p-1">{item.content}</td>
                            <td className="border">{item.id_user}</td>
                            <td className="border">{item.date}</td>
                            <td className="border">{item.type_post}</td>
                            <td className="border">
                                <button
                                    className="bg-red-700 text-white hover:bg-red-500 p-1"
                                    onClick={() => deletePost(item.id)}
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

export default Posts
