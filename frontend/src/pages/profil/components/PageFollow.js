import { ArrowLeftOutlined } from '@ant-design/icons'
import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import BarreDroite from '../../components/BarreDroite'
import StructurePrincipal from '../../components/StructurePrincipal'
import Parametres from '../../parametres/Parametres'
import Followed from './Followed'
import Followers from './Followers'

function PageFollow(
    isAbonnees,
    isAbonnements,
    socket,
    lastMessage,
    notificationsMessages,
    setNotificationsMessages,
    nbrLikes,
    nbrComments,
    nbrPosts,
    setNbrLikes,
    setNbrComments,
    setNbrPosts
) {
    const params = useParams()

    // pour afficher les abonnees
    const [zoneFollowers, setZoneFollowers] = useState(true)
    const ClickSeeFollowers = (e) => {
        e.preventDefault()
        setZoneFollowers(!zoneFollowers)
        setZoneFollowed(false)
    }

    // pour afficher abonnements
    const [zoneFollowed, setZoneFollowed] = useState(false)
    const ClickSeeFollowed = (e) => {
        e.preventDefault()
        setZoneFollowed(!zoneFollowed)
        setZoneFollowers(false)
    }
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
                        <div className=" flex flex-row w-10/12 m-auto border border-solid p-1">
                            <Link to={'/profil/' + params.id}>
                                <div className="pl-1 hover hover:text-sky-500 cursor-pointer">
                                    <ArrowLeftOutlined
                                        className="text-lg "
                                        title=""
                                    />
                                </div>
                            </Link>
                            <div className="w-1/2 text-center text-lg">
                                <button
                                    // si on clique sur le bouton on change son focus mm temps verifie son etat
                                    className={
                                        zoneFollowers
                                            ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                            : 'font-medium text-lg hover:text-blue-600'
                                    }
                                    onClick={ClickSeeFollowers}
                                >
                                    Abonnées
                                </button>
                            </div>
                            <div className="w-1/2 text-center text-lg">
                                <button
                                    // si on clique sur le bouton on change son focus mm temps verifie son etat
                                    className={
                                        zoneFollowed
                                            ? 'font-medium text-lg text-blue-600  focus:border-b-2 focus:border-b-blue-600 '
                                            : 'font-medium text-lg hover:text-blue-600'
                                    }
                                    onClick={ClickSeeFollowed}
                                >
                                    Abonnements
                                </button>
                            </div>
                        </div>
                        {/* ----------- zone affichage -------------- */}
                        <div className="w-10/12 m-auto ">
                            <div className="w-full mt-2  ml-auto mr-auto">
                                {zoneFollowers && (
                                    <Followers
                                        id_user={params.id}
                                        socket={socket}
                                        lastMessage={lastMessage}
                                    />
                                )}
                            </div>

                            <div className="w-full mt-2  ml-auto mr-auto">
                                {zoneFollowed && (
                                    <Followed
                                        id_user={params.id}
                                        socket={socket}
                                        lastMessage={lastMessage}
                                    />
                                )}
                            </div>
                        </div>
                    </>
                }
                barreDroite={<BarreDroite />}
            />
        </div>
    )
}

export default PageFollow
