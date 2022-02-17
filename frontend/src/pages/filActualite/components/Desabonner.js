import React, { useState, useEffect } from 'react'
import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { Modal } from 'antd'
import { api } from '../../../constants/constants'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function Desabonner({
    follower,
    // isFollower,
    // setIsFollower,
    // isFollowed,
    // setIsFollowed,
}) {
    // j ai utiliser mm props follower change d'un composant a l'autre Followers/Followed
    const user = useSelector((state) => state.user)
    const params = useParams()

    const [isFollower, setIsFollower] = useState(false)
    const [isFollowed, setIsFollowed] = useState(false)

    // is follow user
    const GET_FOLLOWER = async () => {
        axios({
            method: 'POST',
            url: `${api}user/getfollow`,
            data: {
                follower_id: user.infoUser.id,
                followed_id: follower,
            },
        })
            .then((res) => {
                if (res.data[0].nbr === 1) {
                    setIsFollower(true)
                } else {
                    setIsFollower(false)
                }
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    // is followed by
    const GET_FOLLOWED = async () => {
        axios({
            method: 'POST',
            url: `${api}user/isfollowed`,
            data: {
                followed_id: follower,
                follower_id: user.infoUser.id,
            },
        })
            .then((res) => {
                if (res.data[0].nbr === 1) {
                    setIsFollowed(true)
                } else {
                    setIsFollowed(false)
                }
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    useEffect(() => {
        GET_FOLLOWER()
        GET_FOLLOWED()
    }, [isFollowed, isFollower])

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
                setIsFollower(false)
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
                setIsFollower(false)
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
        <>
            <div>
                {isFollower || isFollowed ? (
                    <button
                        onClick={ClickToUnfollow}
                        className="flex flex-row space-x-1"
                    >
                        <div className="">
                            <UserDeleteOutlined className="text-sky-800 text-lg" />
                        </div>
                        <div className="pt-1"> Désabonner</div>
                    </button>
                ) : (
                    <button
                        onClick={sabonner}
                        className="flex flex-row space-x-1"
                    >
                        <div>
                            <UserAddOutlined className="text-sky-800 text-lg" />
                        </div>
                        <div className="pt-1">S'abonner</div>
                    </button>
                )}
            </div>
            {/* ---------------------------- pour se désabonner  ----------------------------  */}
            <div className="rounded-lg ">
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
                            Si vous changer d'avis, <br /> Leurs Tweets
                            n’apparaîtront plus dans votre fil d'actualite.
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
        </>
    )
}

export default Desabonner

// import React, { useState, useEffect } from 'react'
// import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
// import { api } from '../../../constants/constants'
// import axios from 'axios'
// import { useSelector } from 'react-redux'

// function Desabonner({ post, isFollow, setIsFollow }) {
//     const user = useSelector((state) => state.user)

//     // pour s'abonner
//     const FOLLOW_USER = () => {
//         axios({
//             method: 'post',
//             url: `${api}user/follow`,
//             data: {
//                 follower_id: user.infoUser.id,
//                 followed_id: post.id_user,
//             },
//         })
//             .then(() => {
//                 setIsFollow(true)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }

//     // pour desabonner
//     const UNFOLLOW_USER = () => {
//         axios({
//             method: 'DELETE',
//             url: `${api}user/unfollow`,
//             data: {
//                 follower_id: user.infoUser.id,
//                 followed_id: post.id_user,
//             },
//         })
//             .then(() => {
//                 setIsFollow(false)
//             })
//             .catch((err) => {
//                 console.log(err)
//             })
//     }

//     const desabonner = (e) => {
//         e.preventDefault()
//         // alert('Ne pas suivre cette personne !')
//         UNFOLLOW_USER()
//     }

//     const sabonner = (e) => {
//         e.preventDefault()
//         // alert('suivre cette personne !')
//         FOLLOW_USER()
//     }
//     return (
//         <div>
//             {isFollow ? (
//                 <button
//                     onClick={desabonner}
//                     className="flex flex-row space-x-1"
//                 >
//                     <div className="">
//                         <UserDeleteOutlined className="text-sky-800 text-lg" />
//                     </div>
//                     <div className="pt-1"> Désabonner</div>
//                 </button>
//             ) : (
//                 <button onClick={sabonner} className="flex flex-row space-x-1">
//                     <div>
//                         <UserAddOutlined className="text-sky-800 text-lg" />
//                     </div>
//                     <div className="pt-1">S'abonner</div>
//                 </button>
//             )}
//         </div>
//     )
// }

// export default Desabonner
