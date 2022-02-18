import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { isEmpty, timestampParser } from '../../../utils/Utils'
import { useSelector } from 'react-redux'
import RDPost from './RDPost'

function Redives({ params, socket, lastMessage }) {
    const [isLoading, setIsLoading] = useState(true)
    const [chargerPosts, setChargerPosts] = useState(true)
    const [RedivePost, setRedivePost] = useState([])
    const [count, setCount] = useState(4) // initialise le counteur des posts
    const array = RedivePost.slice(0, count)

    //recuperer les posts rediver  utilisateur  dans bdd
    const GET_REDIVE_POST = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/post_redive/${params.id}`,
        })
            .then((res) => {
                setRedivePost(res.data)
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
        if (chargerPosts) {
            GET_REDIVE_POST()
            setChargerPosts(false)
            setCount(count + 4)
            setTimeout(() => {
                setIsLoading(false)
            }, 200)
        }

        // verifie le scroll pour charger plus posts
        window.addEventListener('scroll', chargerPlus)
        return () => window.removeEventListener('scroll', chargerPlus)
    }, [chargerPosts, RedivePost, count])

    return (
        <div>
            {isLoading ? (
                <div className=" text-center  ">
                    <Spin size="large" className="text-2xl p-1 text-sky-900" />
                </div>
            ) : (
                <>
                    {!isEmpty(array[0]) ? (
                        array.map((post) => {
                            return (
                                <RDPost
                                    socket={socket}
                                    lastMessage={lastMessage}
                                    key={post.id}
                                    post={post}
                                    RedivePost={RedivePost}
                                    setRedivePost={setRedivePost}
                                />
                            )
                        })
                    ) : (
                        <h2 className="m-4 text-md font-medium text-center">
                            Aucun post rediver.
                        </h2>
                    )}
                </>
            )}
        </div>
    )
}

export default Redives
