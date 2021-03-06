import React, { useState, useEffect } from 'react'
import { ArrowLeftOutlined } from '@ant-design/icons'
import StructurePrincipal from '../../components/StructurePrincipal'
import BarreDroite from '../../components/BarreDroite'
import { useParams } from 'react-router-dom'
import Post from '../../filActualite/components/Post'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { Link } from 'react-router-dom'

function NTFPost({
    socket,
    lastMessage,
    notificationsMessages,
    setNotificationsMessages,
    nbrLikes,
    nbrComments,
    nbrPosts,
    setNbrLikes,
    setNbrComments,
    setNbrPosts,
}) {
    const params = useParams()
    const [post, setPost] = useState([])

    //recuperer les posts utilisateur  dans bdd
    const GET_POST = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/post/notification/${params.id}`,
        })
            .then((res) => {
                setPost(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        GET_POST()
    }, [])

    return (
        <div>
            <StructurePrincipal
                socket={socket}
                lastMessage={lastMessage}
                notificationsMessages={notificationsMessages}
                setNotificationsMessages={setNotificationsMessages}
                nbrLikes={nbrLikes}
                setNbrLikes={setNbrLikes}
                nbrComments={nbrComments}
                setNbrComments={setNbrComments}
                nbrPosts={nbrPosts}
                setNbrPosts={setNbrPosts}
                titrePage=""
                contenu={
                    <>
                        <div className="flex flex-col">
                            <div className="">
                                <Link to={'/notifications'}>
                                    <div className="pl-1 hover hover:text-sky-500 cursor-pointer">
                                        <ArrowLeftOutlined
                                            className="text-lg "
                                            title=""
                                        />
                                    </div>
                                </Link>
                            </div>

                            {post.map((post) => (
                                <Post
                                    key={post.id}
                                    post={post}
                                    socket={socket}
                                    lastMessage={lastMessage}
                                />
                            ))}
                        </div>
                    </>
                }
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default NTFPost
