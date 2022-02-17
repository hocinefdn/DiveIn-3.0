import React, { useEffect, useState } from 'react'
import { List, Avatar, Popover, Spin } from 'antd'
import photoProfil_vide from '../../assets/images/image_profil_vide.png'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { api } from '../../constants/constants'
import { Link, Navigate } from 'react-router-dom'
import FollowUnfollow from './FollowUnfollow'

function ListSuggestion() {
    const user = useSelector((state) => state.user)
    const [userSuggestion, setUserSuggestion] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    // const [isFollower, setIsFollower] = useState(false)
    // const [isFollowed, setIsFollowed] = useState(false)

    // recuperer les users suggestion
    const GET_SUGGESTION = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/recommandations/${user.infoUser.id}`,
        }).then((res) => {
            setUserSuggestion(res.data)
            // console.log(res.data)
        })
    }

    // const follow = (id) => {
    //     axios({
    //         method: 'POST',
    //         url: `${api}user/follow`,
    //         data: {
    //             follower_id: user.id,
    //             followed_id: id,
    //         },
    //     }).then((res) => {
    //         setUserSuggestion(userSuggestion.filter((user) => user.id != id))
    //     })
    // }

    useEffect(() => {
        GET_SUGGESTION()
        setTimeout(() => {
            setIsLoading(false)
        }, 100)
    }, [])

    return (
        <div className="">
            {isLoading ? (
                <div className=" text-center">
                    <Spin size="large" className="text-2xl p-5 text-sky-900" />
                </div>
            ) : (
                <>
                    {userSuggestion.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center p-1 space-x-1 border border-y-1 hover:bg-sky-100 mt-1"
                        >
                            <div className="w-1/5 ">
                                {/* --------------------  afficher l'image profil user sinon null mettre par defaut  */}
                                {user.image !== null ? (
                                    <Avatar
                                        src={user.image}
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
                            {/* ----------------------------------------- div nom user----------------------- */}
                            <div className="w-1/2  ">
                                <Link to={'/profil/' + user.id}>
                                    <a
                                        className="font-bold "
                                        // onClick={SeeProfil}
                                    >
                                        {user.firstname}
                                        <span> </span> {user.lastname}
                                    </a>
                                </Link>
                            </div>

                            {/* -----------------------------------------  button suivre -------------------------- */}
                            <div className=" ">
                                <FollowUnfollow
                                    follower={user.id}
                                    // isFollowed={isFollowed}
                                    // setIsFollowed={setIsFollowed}
                                    // isFollower={isFollower}
                                    // setIsFollower={setIsFollower}
                                />
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}

export default ListSuggestion
