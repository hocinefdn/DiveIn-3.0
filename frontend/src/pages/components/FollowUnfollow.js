import React, { useState, useEffect } from 'react'
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { api } from '../../constants/constants'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function FollowUnfollow({
    follower,
    // isFollower,
    // setIsFollower,
    // isFollowed,
    // setIsFollowed,
}) {
    // j ai utiliser mm props follower change d'un composant a l'autre Followers/Followed
    const user = useSelector((state) => state.user)
    const params = useParams()

    //const [isFollower, setIsFollower] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)

    function getFollow() {
        axios
            .post(`${api}user/getfollow`, {
                follower_id: user.infoUser.id,
                followed_id: follower,
            })
            .then((res) => {
                // setIsFollowed(res.data[0].nbr == 1)
                if (res.data[0].nbr === 1) {
                    setIsFollowed(true)
                } else {
                    setIsFollowed(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        getFollow()
    }, [])

    // // is follow user
    // const GET_FOLLOWER = async () => {
    //     axios({
    //         method: 'POST',
    //         url: `${api}user/getfollow`,
    //         data: {
    //             follower_id: user.infoUser.id,
    //             followed_id: follower,
    //         },
    //     })
    //         .then((res) => {
    //             if (res.data[0].nbr === 1) {
    //                 setIsFollower(true)
    //             } else {
    //                 setIsFollower(false)
    //             }
    //         })
    //         .catch((err) => {
    //             console.log({ err })
    //         })
    // }

    // // is followed by
    // const GET_FOLLOWED = async () => {
    //     axios({
    //         method: 'POST',
    //         url: `${api}user/isfollowed`,
    //         data: {
    //             followed_id: follower,
    //             follower_id: user.infoUser.id,
    //         },
    //     })
    //         .then((res) => {
    //             if (res.data[0].nbr === 1) {
    //                 setIsFollowed(true)
    //             } else {
    //                 setIsFollowed(false)
    //             }
    //         })
    //         .catch((err) => {
    //             console.log({ err })
    //         })
    // }

    // useEffect(() => {
    //     GET_FOLLOWER()
    //     GET_FOLLOWED()
    // }, [isFollowed, isFollower])

    // pour s'abonner
    const FOLLOW_USER = () => {
        axios({
            method: 'post',
            url: `${api}user/follow`,
            data: {
                follower_id: user.infoUser.id,
                followed_id: follower,
            },
        })
            .then(() => {
                setIsFollowed(true)
                // setIsFollower(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // pour desabonner
    const UNFOLLOW_USER = () => {
        axios({
            method: 'post',
            url: `${api}user/unfollow`,
            data: {
                follower_id: user.infoUser.id,
                followed_id: follower,
            },
        })
            .then(() => {
                setIsFollowed(false)
                // setIsFollower(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const desabonner = (e) => {
        //e.preventDefault()
        UNFOLLOW_USER()
        setIsModalUnfollowVisible(false)
    }

    const sabonner = (e) => {
        //e.preventDefault()
        FOLLOW_USER()
        setIsModalUnfollowVisible(false)
    }

    const annuler = (e) => {
        e.preventDefault()
        setIsModalUnfollowVisible(false)
    }

    //--------------- pour se désabonner  -----------------------------
    const [isModalUnfollowVisible, setIsModalUnfollowVisible] = useState(false)

    const ClickToUnfollow = () => {
        setIsModalUnfollowVisible(true)
    }

    const handleUnfollowOk = () => {
        setIsModalUnfollowVisible(false)
    }

    const handleUnfollowCancel = () => {
        setIsModalUnfollowVisible(false)
    }

    return (
        <div>
            {isFollowed ? (
                <button
                    onClick={ClickToUnfollow}
                    className="flex flex-row space-x-1"
                >
                    {/* <div className="">
                        <UserDeleteOutlined className="text-sky-800 text-lg" />
                    </div> */}
                    <div className="bg-black text-white p-1 pl-2 pr-2 text-sm rounded-2xl hover:opacity-80  ">
                        {' '}
                        Abonné(e)
                    </div>
                </button>
            ) : (
                <button onClick={sabonner} className="flex flex-row space-x-1">
                    {/* <div>
                        <UserAddOutlined className="text-sky-800 text-lg" />
                    </div> */}
                    <div className="bg-sky-500 text-white p-1 pl-2 pr-2 rounded-2xl hover:opacity-80">
                        S'abonner
                    </div>
                </button>
            )}

            {/* ---------------------------- pour se désabonner  ----------------------------  */}

            <div className="mt-2 rounded-lg ">
                <Modal
                    visible={isModalUnfollowVisible}
                    onOk={handleUnfollowOk}
                    onCancel={handleUnfollowCancel}
                    style={{ top: 100 }}
                    width={300}
                    footer=""
                    className="p-1 ring bg-red-100 rounded-xl"
                >
                    <div className="text-center">
                        <p className="text-center p-1">
                            Si vous changez d'avis, <br /> Leurs publications
                            n’apparaîtront plus sur votre fil d'actualité.
                        </p>
                        <div className="flex flex-col space-y-2">
                            <button
                                className="bg-black text-white p-2 text-sm rounded-2xl hover:opacity-80 "
                                onClick={desabonner}
                            >
                                Se désabonner
                            </button>
                            <button
                                className="bg-white text-black border border-solid p-1 text-lg rounded-2xl hover:bg-sky-100  "
                                onClick={annuler}
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default FollowUnfollow
