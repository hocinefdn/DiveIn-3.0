import React, { useState } from 'react'
import { EditFilled, EditOutlined } from '@ant-design/icons'
import TextareaAutosize from 'react-textarea-autosize'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { api } from '../../../constants/constants'

function EditCommentaire({ commentaire, setCommentairesPost,socket,lastMessage,post }) {
    const user = useSelector((state) => state.user)

    const [newComment, setNewComment] = useState('')
    const [edit, setEdit] = useState(false)

    // clique sur icon modifie
    const ModifierCommentaire = (e) => {
        e.preventDefault()
        setEdit(!edit)
    }

    const ADD_MODIFIE_COMMENTAIRE = async () => {
        return axios({
            method: 'PUT',
            url: `${api}actualite/commentaire`,
            data: {
                content: newComment,
                id: commentaire.id,
                id_user: user.infoUser.id,
                id_post: commentaire.id_post,
            },
        })
            .then(() => {
                socket.emit("post modified", user.infoUser,post,commentaire.id)

                return axios({
                    method: 'GET',
                    url: `${api}actualite/commentaires/${commentaire.id_post}`,
                })
            })
            .then((res) => {
                setCommentairesPost(res.data)
            })
            .catch((error) => {
                console.log({ error })
            })
    }

    const EnvoyerNewComment = (e) => {
        e.preventDefault()
        if (newComment) {
            ADD_MODIFIE_COMMENTAIRE()
            setEdit(!edit)
        }
    }

    return (
        <>
            {/* la div textarea et button envoyer */}
            <div className="">
                {edit ? (
                    <div className="flex flex-col  ">
                        <TextareaAutosize
                            minRows={1}
                            maxRows={4}
                            className=" resize-none p-2 border border-stone-300 rounded-xl "
                            defaultValue={commentaire.content}
                            // value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        ></TextareaAutosize>
                        {newComment ? (
                            <button
                                type="submit"
                                onClick={EnvoyerNewComment}
                                className="border border-stroke-300 rounded-xl  mt-1 bg-sky-500 w-2/4"
                            >
                                Envoyer
                            </button>
                        ) : (
                            <button className="border border-stroke-300 rounded-xl  mt-1 bg-sky-300 cursor-default w-2/4">
                                Envoyer
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="break-all">{commentaire.content}</p>
                )}
            </div>
            {/* la div icon edit  */}
            <div className="">
                <div>
                    <EditOutlined
                        title="modifie le commentaire"
                        className="text-sky-600 cursor-pointer"
                        onClick={ModifierCommentaire}
                    />
                </div>
            </div>
        </>
    )
}

export default EditCommentaire
