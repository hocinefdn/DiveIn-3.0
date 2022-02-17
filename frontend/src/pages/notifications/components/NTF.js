import React from 'react'
import { List, Avatar, Popover, Spin } from 'antd'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { format } from 'timeago.js'
import { api } from '../../../constants/constants'

const axios = require('axios')
function NTF({
    notf,
    isLike,
    isComments,
    isPost,
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

    const navigate = useNavigate();

    function handleClick(){

        if(isComments){
            console.log(notf.id_comment)
            axios({
                method: 'GET',
                url: `${api}actualite/setCommentSeen/${notf.id_comment}`
            })
                .then(() => {
                    setNbrComments(nbrComments -1)
                   navigate('/post/'+ notf.id)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        if(isLike){
            axios({
                method: 'GET',
                url: `${api}actualite/setLikeSeen/${notf.id_user}/${notf.id}`
            })
                .then(() => {
                    setNbrLikes(nbrLikes -1)

                    navigate('/post/'+ notf.id)

                })
                .catch((err) => {
                    console.log(err)
                })
        }
        if(isPost){
           /* axios({
                method: 'GET',
                url: `${api}actualite/setPostSeen/${notf.id_user}/${notf.id}`
            })
                .then(() => {*/
                    setNbrPosts(0)

                    navigate('/post/'+ notf.id)
            /*
                })
                .catch((err) => {
                    console.log(err)
                })*/
        }
    }
    return (
        <>
                <div
                    key={notf.id}
                    className="flex space-x-2  p-1 rounded-xl border border-y-1 hover:bg-sky-100 mt-1 "
                    onClick={handleClick}
                >
                    <div className="">
                        {/* --------------------  afficher l'image profil user sinon null mettre par defaut  */}
                        {notf.image !== null ? (
                            <Avatar
                                src={notf.image}
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
                                <Link to={'/profil/' + notf.id_user}>
                                    <a
                                        className="font-bold "
                                        // onClick={SeeProfil}
                                    >
                                        {notf.firstname}
                                        <span> </span> {notf.lastname}
                                    </a>
                                </Link>
                            </div>

                            {isLike && (
                                <div className="text-sm">
                                    a liké votre publication
                                </div>
                            )}
                            {isComments && (
                                <div className="text-sm">
                                    a commenté votre publication
                                </div>
                            )}

                            {isPost && (
                                <div className="text-sm">
                                    a publié un nouveau Post
                                </div>
                            )}
                        </div>
                        {/* ----------------------------------------- div contenu de la pub  ----------------------- */}
                        <div className="">
                            <p className="text-md">{notf.content}</p>
                        </div>
                        <span className="text-xs text-blue-600">
                            {format(notf.date)}
                        </span>
                    </div>
                </div>
        </>
    )
}

export default NTF
