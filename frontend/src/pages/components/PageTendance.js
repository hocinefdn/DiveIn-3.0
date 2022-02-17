import React, { useEffect, useState } from 'react'
import StructurePrincipal from '../components/StructurePrincipal'
import BarreDroite from '../components/BarreDroite'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { api } from '../../constants/constants'
import Post from '../filActualite/components/Post'
import { isEmpty } from '../../utils/Utils'

function PageTendance({
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
    const [chargerPosts, setChargerPosts] = useState(true)
    const [tendances, setTendances] = useState([])
    const [count, setCount] = useState(3) // initialise le counteur des posts
    const [tendancesSorted, setTendancesSorted] = useState([]) // stocker les tendances par ordre sum
    const array = tendancesSorted.slice(0, count)

    const GET_TENDANCES = () => {
        axios({
            method: 'GET',
            url: `${api}actualite/tendances`,
        })
            .then((res) => {
                setTendances(res.data)
            })
            .catch((err) => {
                console.log({ err })
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
            GET_TENDANCES()
            setChargerPosts(false)
            setCount(count + 3)
        }
        // verifie le scroll pour charger plus posts
        window.addEventListener('scroll', chargerPlus)
        return () => window.removeEventListener('scroll', chargerPlus)
    }, [chargerPosts, tendances, count])

    // pour trie les tendances par ordre de sum

    useEffect(() => {
        if (!isEmpty(tendances[0])) {
            const tendancesArr = Object.keys(tendances).map((i) => tendances[i])
            let sortedArray = tendancesArr.sort((a, b) => {
                return b.sum - a.sum
            })
            // console.log(sortedArray)
            setTendancesSorted(sortedArray)
        }
    }, [tendances])

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
                titrePage="Tendances"
                contenu={
                    <>
                        <div className="">
                            {!isEmpty(array[0])
                                ? array.map((post) => {
                                      return (
                                          <Post
                                              key={post.id}
                                              post={post}
                                              socket={socket}
                                              lastMessage={lastMessage}
                                          />
                                      )
                                  })
                                : null}
                        </div>
                    </>
                }
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default PageTendance
