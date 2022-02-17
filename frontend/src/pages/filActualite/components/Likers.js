import React, { useEffect, useState } from 'react'
import { List, Avatar, Popover, Spin } from 'antd'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { isEmpty } from '../../../utils/Utils'

function Likers({ post, nbrLikes }) {
    const [likers, setLikers] = useState([])

    const [isLoading, setIsLoading] = useState(true)

    ///  likers chaque post
    const GET_LIKERS = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/likers/${post.id}`,
        })
            .then((res) => {
                setLikers(res.data)
                //console.log(res.data)
            })
            .catch((err) => {
                console.log({ err })
            })
            .finally(setIsLoading(false))
    }

    useEffect(() => {
        GET_LIKERS()
    }, [nbrLikes])

    return (
        <div>
            <div>
                <div>
                    <p className="text-lg underline">Aimé par </p>
                </div>

                {isLoading ? (
                    <div className=" text-center  ">
                        <Spin
                            size="large"
                            className="text-2xl p-5 text-sky-900"
                        />
                    </div>
                ) : !isEmpty(likers[0]) ? (
                    likers.map((liker) => {
                        return (
                            <>
                                <div
                                    key={liker.id}
                                    className="flex space-x-2 items-center p-1 rounded-xl border border-y-1 hover:bg-sky-100 mt-1 mr-5 "
                                >
                                    <div className="">
                                        {/* --------------------  afficher l'image profil user sinon null mettre par defaut  */}
                                        {liker.image !== null ? (
                                            <Avatar
                                                src={liker.image}
                                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                                alt="user Profil"
                                            />
                                        ) : (
                                            <Avatar
                                                src={photoProfil_vide}
                                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                                alt="user Profil"
                                            />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        {/* ----------------------------------------- div nom user et type notifications ----------------------- */}
                                        <div className="flex flex-row space-x-2">
                                            <div className="">
                                                <Link
                                                    to={
                                                        '/profil/' +
                                                        liker.id_user
                                                    }
                                                >
                                                    <a
                                                        className="font-bold "
                                                        // onClick={SeeProfil}
                                                    >
                                                        {liker.firstname}
                                                        <span> </span>{' '}
                                                        {liker.lastname}
                                                    </a>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )
                    })
                ) : (
                    ' Personne a liké ce post'
                )}
            </div>
        </div>
    )
}

export default Likers
