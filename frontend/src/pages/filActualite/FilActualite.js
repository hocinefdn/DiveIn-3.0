import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import StructurePrincipal from '../components/StructurePrincipal'
import Post from './components/Post'
import Publier from './components/Publier'
import BarreDroite from '../components/BarreDroite'
import axios from 'axios'
import { isEmpty } from '../../utils/Utils'
import { getPosts } from '../../redux/reducers/post.reducer'
import { useSelector, useDispatch } from 'react-redux'
import { io } from 'socket.io-client'
import { api, apiReact } from '../../constants/constants'
import ListSuggestionTel from '../components/ListSuggestionTel'
import './css/card.css'
function FilActualite({
    modal,
    setModal,
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
    const user = useSelector((state) => state.user)
    const [isLoadingPosts, setisLoadingPosts] = useState(true)
    const [chargerPosts, setChargerPosts] = useState(true)
    const [posts, setPosts] = useState([])
    const [count, setCount] = useState(4) // initialise le counteur des posts
    const array = posts.slice(0, count)

    const [followers, setFollowers] = useState([])
    // const [newPosts, setNewPosts] = useState([])
    // const [isNewPosts, setIsNewPosts] = useState(false)
    //recuperer les posts dans bdd

    const get_followers = () => {
        axios({
            method: 'POST',
            url: `${api}messagerie/followers`,
            data: { id: user.id },
        })
            .then((res) => {
                setFollowers(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    const GET_POSTS = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/post/${user.infoUser.id}`,
        })
            .then((res) => {
                setPosts(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(setisLoadingPosts(false))
    }

    // const GET_NEW_POSTS = async () => {
    //     return axios({
    //         method: 'GET',
    //         url: `${api}actualite/newpost/${user.infoUser.id}`,
    //     })
    //         .then((res) => {
    //             setNewPosts(res.data)
    //             //setIsNewPosts(true)
    //         })
    //         .catch((err) => {
    //             console.log(err)
    //         })
    // }

    const chargerPlus = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop + 1 >
            document.scrollingElement.scrollHeight
        ) {
            setChargerPosts(true)
        }
    }

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         GET_NEW_POSTS()
    //     }, 60000)
    //     return () => clearInterval(interval)
    // }, [])

    useEffect(() => {
        // pour charger les posts une seul fois avec chargerPosts
        if (chargerPosts) {
            GET_POSTS()
            setChargerPosts(false)
            setCount(count + 4)
        }

        // verifie le scroll pour charger plus posts
        window.addEventListener('scroll', chargerPlus)
        return () => window.removeEventListener('scroll', chargerPlus)
    }, [chargerPosts, posts, count])

    useEffect(() => {
        get_followers()
    }, [])

    useEffect(() => {
        if (lastMessage) {
            if (lastMessage.video) {
                if (modal.isVisible === false) {
                    setModal({
                        isVisible: true,
                        id_sender: lastMessage.id_sender,
                        id_reciever: lastMessage.id_reciever,
                        video: lastMessage.video,
                    })
                }
            }
        }
    }, [lastMessage])

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
                contenu={
                    <>
                        <Publier
                            posts={posts}
                            followers={followers}
                            setPosts={setPosts}
                            socket={socket}
                            lastMessage={lastMessage}
                        />

                        {/* <div className="mt-3 border border-solid"></div> */}
                        <div>
                            {isLoadingPosts ? (
                                <div className=" text-center  ">
                                    <Spin
                                        size="large"
                                        className="text-2xl p-5 text-sky-900"
                                    />
                                </div>
                            ) : !isEmpty(array[0]) ? (
                                array.map((post, index) =>
                                    index % 10 == 5 ? (
                                        <div className="">
                                            <ListSuggestionTel />
                                            <Post
                                                socket={socket}
                                                lastMessage={lastMessage}
                                                key={post.id}
                                                post={post}
                                            />
                                        </div>
                                    ) : (
                                        <Post
                                            socket={socket}
                                            lastMessage={lastMessage}
                                            key={post.id}
                                            post={post}
                                        />
                                    )
                                )
                            ) : (
                                <div className="flex flex-col  w-96 mr-auto ml-auto m-5 p-5 ">
                                    <h1 className="font-bold text-2xl">
                                        Bienvenue sur DiveIn
                                    </h1>
                                    <span className="text-lg">
                                        Discover The Hidden World
                                    </span>
                                    <p className="">
                                        Pensez à trouver de nouveaux amis, voir
                                        l'actualité <br /> et partager ce que
                                        vous faites
                                        <br /> Tout ça sur DiveIn !!!
                                    </p>
                                    <ListSuggestionTel />
                                </div>
                            )}
                        </div>
                    </>
                }
                titrePage="Accueil"
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default FilActualite
