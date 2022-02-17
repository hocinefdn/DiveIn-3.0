import React, { useState } from 'react'
import { Comment, Avatar, Form, Button, List, Input } from 'antd'
import moment from 'moment'
import TextareaAutosize from 'react-textarea-autosize'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { useSelector, useDispatch } from 'react-redux'

const { TextArea } = Input
function ZoneCommentaires({
    post,
    commentairesPost,
    setCommentairesPost,
    nbrCommentaires,
    setnbrCommentaires,
    socket,
    lastMessage,
}) {
    const user = useSelector((state) => state.user)

    const [commentaire, setCommentaire] = useState('')
    // const [iduser, setIDUser] = useState(localStorage.getItem('id_user'))

    const dispatch = useDispatch()

    // ajouter commentaire
    const ADD_COMMENTAIRE = async () => {
        return (
            axios({
                method: 'POST',
                url: `${api}actualite/commentaire`,
                data: {
                    id_user: user.infoUser.id,
                    id_post: post.id,
                    content: commentaire,
                },
            })
                .then((res) => {
                    socket.emit(
                        'post commented',
                        user.infoUser,
                        post,
                        res.data.insertId
                    )

                    const data = {
                        id: res.data[1][0].id, // id de commentaire
                        id_user: user.infoUser.id,
                        lastname: user.infoUser.lastname,
                        firstname: user.infoUser.firstname,
                        image: user.infoUser.image,
                        content: commentaire,
                        date: Date(),
                    }

                    // return axios({
                    //     method: 'GET',
                    //     url: `${api}actualite/last-commentaire/${post.id}&${user.infoUser.id}`,
                    // }).then((res) => {
                    setCommentairesPost([data, ...commentairesPost])
                })
                // return axios({
                //     method: 'GET',
                //     url: `${api}actualite/commentaires/${post.id}`,
                // }).then((res) => {
                //     setCommentairesPost(res.data)
                // })
                // })
                // .then((res) => {
                //     const data = {
                //         id_user: user.infoUser.id,
                //         lastname: user.infoUser.lastname,
                //         firstname: user.infoUser.firstname,
                //         id_post: post.id,
                //         content: commentaire,
                //         date: Date(),
                //     }

                //     setCommentairesPost([data, ...commentairesPost])
                //     //dispatch(ajouterCommentaire([data]))
                // })
                .catch((err) => {
                    console.log(err)
                })
        )
    }

    const Commenter = (e) => {
        e.preventDefault()
        if (commentaire) {
            ADD_COMMENTAIRE().then(() => setCommentaire(''))
            setnbrCommentaires(nbrCommentaires + 1)
        }
    }

    return (
        <div className="  m-1">
            <div className="flex items-center space-x-1">
                <div className="flex-none ">
                    {/* <img
                        src={photo}
                        className="w-8 h-8 rounded-full  border border-stone-200  hover:opacity-80"
                    /> */}
                    {/*  ---------------  verifie l'image profil ---------------- */}
                    {user.infoUser.image !== null ? (
                        <Avatar
                            className="w-8 h-8 rounded-full  border border-stone-200  hover:opacity-80"
                            src={user.infoUser.image}
                        />
                    ) : (
                        <Avatar
                            className="w-8 h-8 rounded-full  border border-stone-200  hover:opacity-80"
                            src={photoProfil_vide}
                        />
                    )}
                </div>
                <div className="flex w-full ">
                    <TextareaAutosize
                        minRows={1}
                        maxRows={3}
                        maxLength={300}
                        className="w-full h-11 resize-none p-2 border border-stone-300 rounded-xl "
                        placeholder="Commenter ..."
                        value={commentaire}
                        onChange={(e) => setCommentaire(e.target.value)}
                    ></TextareaAutosize>
                </div>
                <div className="flex-auto w-32">
                    {commentaire ? (
                        <input
                            className=" h-8 bg-sky-600 rounded-md pl-1 pr-1 text-white hover:bg-sky-500 "
                            type="submit"
                            value="Commenter"
                            onClick={Commenter}
                        />
                    ) : (
                        <input
                            className="h-8 bg-sky-400 rounded-md pl-1 pr-1 text-white "
                            type="submit"
                            value="Commenter"
                        />
                    )}
                </div>
            </div>
            <div></div>
        </div>
    )
}

export default ZoneCommentaires
