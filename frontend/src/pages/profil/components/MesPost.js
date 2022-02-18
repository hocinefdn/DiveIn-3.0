import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Spin } from 'antd'
import { api } from '../../../constants/constants'
import { isEmpty, timestampParser } from '../../../utils/Utils'
import { useSelector } from 'react-redux'
import MPost from './MPost'
import { useParams } from 'react-router-dom'

function MesPost({ params, socket, lastMessage }) {
    /// ---------------------------------------------------------------------------
    const user = useSelector((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const [chargerPosts, setChargerPosts] = useState(true)
    const [mespost, setMesPosts] = useState([])
    const [count, setCount] = useState(4) // initialise le counteur des posts
    const array = mespost.slice(0, count)

    //const params = useParams()

    //recuperer les posts utilisateur  dans bdd
    const GET_MES_POSTS = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/mespost/${params.id}`,
        })
            .then((res) => {
                setMesPosts(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const chargerPlus = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >
            document.scrollingElement.scrollHeight
        ) {
            setChargerPosts(true)
        }
    }

    useEffect(() => {
        // pour charger les posts une seul fois avec chargerPosts

        if (chargerPosts) {
            GET_MES_POSTS()
            setChargerPosts(false)
            setCount(count + 4)
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
        }

        // verifie le scroll pour charger plus posts
        window.addEventListener('scroll', chargerPlus)
        return () => window.removeEventListener('scroll', chargerPlus)
    }, [chargerPosts, mespost, count])

    return (
        <div className=" ">
            {isLoading ? (
                <div className=" text-center  ">
                    <Spin size="large" className="text-2xl p-1 text-sky-900" />
                </div>
            ) : (
                <>
                    {!isEmpty(array[0]) ? (
                        array.map((post) => {
                            return (
                                <MPost
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    key={post.id}
                                    post={post}
                                    id_POST={post.id}
                                    mesPost={MesPost}
                                    setMesPosts={setMesPosts}
                                />
                            )
                        })
                    ) : (
                        <h2 className="m-4 text-md font-medium text-center">
                            Aucun post partager ici.
                        </h2>
                    )}
                </>
            )}
        </div>
    )
}

export default MesPost
