import React, { useState, useEffect } from 'react'
import StructurePrincipal from '../components/StructurePrincipal'
import BarreDroite from '../components/BarreDroite'
import axios from 'axios'
import { api } from '../../constants/constants'
import { useSelector } from 'react-redux'
import { isEmpty } from '../../utils/Utils'
import Post from '../filActualite/components/Post'

function Enregistrements({
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
    const [enregistrements, setEnregistrements] = useState([])
    const [count, setCount] = useState(2) // initialise le counteur des posts
    const array = enregistrements.slice(0, count)
    const [isSave, setIsSave] = useState(true)

    const MES_ENREGISTREMENTS = async () => {
        axios({
            method: 'GET',
            url: `${api}actualite/enregistrements/${user.infoUser.id}`,
        })
            .then((res) => {
                setEnregistrements(res.data)
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
            MES_ENREGISTREMENTS()
            setChargerPosts(false)
            setCount(count + 2)
        }
        // verifie le scroll pour charger plus posts
        window.addEventListener('scroll', chargerPlus)
        return () => window.removeEventListener('scroll', chargerPlus)
    }, [chargerPosts, enregistrements, count])

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
                titrePage="Enregistré"
                contenu={
                    <>
                        <div className="">
                            {!isEmpty(array[0]) ? (
                                array.map((enreg) => {
                                    return (
                                        <Post
                                            socket={socket}
                                            lastMessage={lastMessage}
                                            key={enreg.id}
                                            post={enreg}
                                            id_post_enreg={enreg.id}
                                            isSave={isSave}
                                            setIsSave={setIsSave}
                                            enregistrements={enregistrements}
                                            setEnregistrements={
                                                setEnregistrements
                                            }
                                        />
                                    )
                                })
                            ) : (
                                <div className="flex flex-col  m-5 p-5 ">
                                    <h2 className=" text-lg">
                                        {' '}
                                        Vous n’avez enregistré aucun post,
                                        <br /> quand vous le ferez, ils
                                        apparaîtront ici.
                                    </h2>
                                </div>
                            )}
                        </div>
                    </>
                }
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default Enregistrements
