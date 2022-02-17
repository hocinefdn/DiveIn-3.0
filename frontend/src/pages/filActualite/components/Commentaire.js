import React, { createElement, useState, useEffect } from 'react'
import { Comment, Tooltip, Avatar, Popover, message } from 'antd'
import moment from 'moment'
import {
    DeleteFilled,
    DislikeOutlined,
    LikeOutlined,
    DislikeFilled,
    LikeFilled,
    EditFilled,
} from '@ant-design/icons'
import TextareaAutosize from 'react-textarea-autosize'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { timestampParser, isEmpty } from '../../../utils/Utils'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'

import ZoneCommentaires from './ZoneCommentaires'
import EditCommentaire from './EditCommentaire'
import SuppCommentaire from './SuppCommentaire'

function Commentaire({
    post,
    nbrCommentaires,
    setnbrCommentaires,
    socket,
    lastMessage,
}) {
    const user = useSelector((state) => state.user)

    const [commentairesPost, setCommentairesPost] = useState([])
    const [count, setCount] = useState(3) // initialise le counteur des commentaires
    const array = commentairesPost.slice(0, count)

    const [loadingCommentaires, setLoadingCommentaires] = useState(false)
    // modifie le commentaire
    const [newComment, setNewComment] = useState('')
    const [edit, setEdit] = useState(false)

    // recuperer les commentaires de chaque post dans la bdd
    const GET_COMMENTAIRES_POST = async () => {
        setLoadingCommentaires(true)
        return axios({
            method: 'GET',
            url: `${api}actualite/commentaires/${post.id}`,
        })
            .then((res) => {
                setCommentairesPost(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(setLoadingCommentaires(false))
    }

    const chargerPlus = () => {
        // message.success(`${count} more items loaded!`)
        setCount(count + 3)

        //setLoadingCommentaires(true)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            GET_COMMENTAIRES_POST()
        }, 30000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        // if (loadingCommentaires) {
        GET_COMMENTAIRES_POST()
        //     setLoadingCommentaires(false)
        // }
    }, [])
    // mettre commentairepost dans [] fera un changement chaque CRUD

    return (
        <>
            <div className="px-1 rounded-md ">
                <ZoneCommentaires
                    socket={socket}
                    lastMessage={lastMessage}
                    key="commenter"
                    post={post}
                    commentairesPost={commentairesPost}
                    setCommentairesPost={setCommentairesPost}
                    nbrCommentaires={nbrCommentaires}
                    setnbrCommentaires={setnbrCommentaires}
                />
            </div>
            <div className=" px-1 rounded-md ">
                {/* """""""""""""" post dans la bdd """""""""""""""""""""""""""" */}
                {!isEmpty(array[0]) &&
                    array.map((commentaire) => {
                        if (post.id === commentaire.id_post) {
                            // --------------------------------------- verifier les commentaires utilisateur et mettre une bg-color ---------------
                            if (commentaire.id_user === user.infoUser.id) {
                                return (
                                    // """"""""""""""" div  commentaire '''''''''''''''"

                                    <div
                                        className=" flex flex-row  m-1 "
                                        key={commentaire.id}
                                    >
                                        {/* """"""""""" div avatar """"" */}
                                        <div className=" pr-1">
                                            {/*  ---------------  verifie l'image profil ---------------- */}
                                            {user.infoUser.image !== null ? (
                                                <Avatar
                                                    src={user.infoUser.image}
                                                    key="avatar"
                                                    className="w-8 h-8 border border-stone-200 hover:opacity-80 "
                                                    alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                                                />
                                            ) : (
                                                <Avatar
                                                    src={photoProfil_vide}
                                                    key="avatar"
                                                    className="w-8 h-8 border border-stone-200 hover:opacity-80 "
                                                    alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                                                />
                                            )}
                                        </div>
                                        {/*  """"""""""" div all """"""""""""""""" */}
                                        <div className="flex flex-col p-1  rounded-lg border border-stone-300 bg-sky-100">
                                            {/*  """"""""""" div top """""""""" */}
                                            <div className="flex flex-row space-x-2   ">
                                                <a
                                                    key="user"
                                                    className="text-xs font-medium"
                                                >
                                                    {commentaire.firstname}
                                                    <span> </span>
                                                    {commentaire.lastname}
                                                </a>

                                                <span className="text-xs">
                                                    {format(commentaire.date)}
                                                </span>
                                            </div>
                                            {/*  """"""" contenu """"" */}
                                            <div className="pl-1 space-x-1 font-light flex ">
                                                {/* le contenu est afficher dans le composant Edit Commentaire */}
                                                {/* ----------------------------------- Edit Supprime Commentaire user --------------- */}
                                                <div className="flex ">
                                                    <EditCommentaire
                                                        key={commentaire.id}
                                                        commentaire={
                                                            commentaire
                                                        }
                                                        setCommentairesPost={
                                                            setCommentairesPost
                                                        }
                                                        socket={socket}
                                                        lastMessage={
                                                            lastMessage
                                                        }
                                                        post={post}
                                                    />
                                                </div>
                                                <div className="float-right ">
                                                    <SuppCommentaire
                                                        key={commentaire.id}
                                                        commentaire={
                                                            commentaire
                                                        }
                                                        setCommentairesPost={
                                                            setCommentairesPost
                                                        }
                                                        commentairesPost={
                                                            commentairesPost
                                                        }
                                                        nbrCommentaires={
                                                            nbrCommentaires
                                                        }
                                                        setnbrCommentaires={
                                                            setnbrCommentaires
                                                        }
                                                        socket={socket}
                                                        lastMessage={
                                                            lastMessage
                                                        }
                                                        post={post}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                                // -------------------------------- cas ou ce n'est pas commentaire de utilisateur
                            } else
                                return (
                                    // """"""""""""""" div  commentaire '''''''''''''''"

                                    <div
                                        className=" flex flex-row  m-1  "
                                        key={commentaire.id}
                                    >
                                        {/* """"""""""" div avatar """"" */}
                                        <div className=" pr-1">
                                            {commentaire.image !== null ? (
                                                <Avatar
                                                    src={commentaire.image}
                                                    key="avatar"
                                                    className="w-8 h-8 border border-stone-200 hover:opacity-80 "
                                                    alt={`${commentaire.firstname}" "${commentaire.lastname}`}
                                                />
                                            ) : (
                                                <Avatar
                                                    src={photoProfil_vide}
                                                    key="avatar"
                                                    className="w-8 h-8 border border-stone-200 hover:opacity-80 "
                                                    alt={`${commentaire.firstname}" "${commentaire.lastname}`}
                                                />
                                            )}
                                        </div>
                                        {/*  """"""""""" div all """"""""""""""""" */}
                                        <div className="flex flex-col p-1  rounded-lg border border-stone-300">
                                            {/*  """"""""""" div top """""""""" */}
                                            <div className=" flex flex-row space-x-2   ">
                                                <Link
                                                    to={
                                                        '/profil/' +
                                                        commentaire.id_user
                                                    }
                                                >
                                                    <a
                                                        key="user"
                                                        className="text-xs font-medium"
                                                    >
                                                        {commentaire.firstname}
                                                        <span> </span>
                                                        {commentaire.lastname}
                                                    </a>
                                                </Link>
                                                <div>
                                                    <span className="text-xs">
                                                        {format(
                                                            commentaire.date
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                            {/*  """"""" contenu """"" */}
                                            <div className="pl-1  font-light ">
                                                {
                                                    <p className="break-all ">
                                                        {commentaire.content}
                                                    </p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                        }
                    })}
                {array.length !== commentairesPost.length ? (
                    <span
                        className="underline ml-2 text-black hover hover:text-sky-600 cursor-pointer"
                        title="afficher les commentaires"
                        onClick={chargerPlus}
                    >
                        Voire Plus
                    </span>
                ) : (
                    <span className="text-black hover hover:text-sky-600 cursor-pointer">
                        {/* It is all, nothing more 🤐 */}
                    </span>
                )}
            </div>
        </>
    )
}

export default Commentaire
