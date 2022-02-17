import { DeleteFilled, DeleteOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Spin, Modal } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import Commentaire from './Commentaire'
import { useSelector, useDispatch } from 'react-redux'

function SuppCommentaire({
    commentaire,
    commentairesPost,
    setCommentairesPost,
    nbrCommentaires,
    setnbrCommentaires,
    socket,
    lastMessage,
    post,
}) {
    const user = useSelector((state) => state.user)

    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const SUPPRIMER_COMMENTAIRE = async () => {
        return axios({
            method: 'delete',
            url: `${api}actualite/commentaire/${commentaire.id}`,
        })
            .then(() => {
                // setCommentairesPost([commentairesPost])
                socket.emit(
                    'post uncommented',
                    user.infoUser,
                    post,
                    commentaire.id
                )
                return axios({
                    method: 'GET',
                    url: `${api}actualite/commentaires/${commentaire.id_post}`,
                }).then((res) => {
                    setCommentairesPost(res.data)
                })
                // setCommentairesPost(
                //     commentairesPost.filter(
                //         (commentaire) => commentaire.id != commentaire.id
                //     )
                // )
            })
            .catch((error) => {
                console.log({ error })
            })
    }

    // const showPopconfirm = () => {
    //     setVisible(true)
    // }
    // const handleOk = () => {
    //     setConfirmLoading(true)
    //     setTimeout(() => {
    //         setVisible(false)
    //         setConfirmLoading(false)
    //         SUPPRIMER_COMMENTAIRE()
    //         setnbrCommentaires(nbrCommentaires - 1)
    //     }, 2000)
    // }

    // const handleCancel = () => {
    //     setVisible(false)
    // }

    const [isModalDeleteVisible, setIsModalDeleteVisible] = useState(false)
    const [isDeleteLoading, setIsDeleteLoading] = useState(false)

    const ClickToDelete = () => {
        setIsModalDeleteVisible(true)
    }

    const handleDeleteOk = () => {
        setIsModalDeleteVisible(false)
    }

    const handleDeleteCancel = () => {
        setIsModalDeleteVisible(false)
    }

    const SupprimerCommentaire = (e) => {
        e.preventDefault()
        setIsDeleteLoading(true)
        setTimeout(() => {
            SUPPRIMER_COMMENTAIRE()
            setnbrCommentaires(nbrCommentaires - 1)
            setIsDeleteLoading(false)
            setIsModalDeleteVisible(false)
        }, 2000)
    }

    const annuler = (e) => {
        e.preventDefault()
        setIsModalDeleteVisible(false)
    }

    // useEffect(() => {}, commentairesPost)

    return (
        <div>
            {/* ---------------------------- pour supprimer commentaire  ----------------------------  */}
            <DeleteOutlined
                title="supprimer le commentaire"
                className="text-red-500 cursor-pointer"
                onClick={ClickToDelete}
            />

            <div className="mt-2 rounded-lg ">
                <Modal
                    visible={isModalDeleteVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    style={{ top: 100 }}
                    width={300}
                    footer=""
                    className="p-1 ring bg-red-100 rounded-xl"
                >
                    <div className="text-center">
                        <p className="text-center p-1">
                            <br />
                            Êtes-vous sûr de supprimer votre commentaire ?
                        </p>
                        <div className="flex flex-col space-y-2">
                            <button
                                className="bg-black text-white p-2 text-sm rounded-2xl hover:opacity-80 "
                                onClick={SupprimerCommentaire}
                            >
                                {isDeleteLoading ? (
                                    <Spin size="meduim" className="pr-2" />
                                ) : null}
                                Supprimer
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
            {/* <Popconfirm
                title="Êtes-vous sûr de supprimer ce contenu?"
                visible={visible}
                onConfirm={handleOk}
                okButtonProps={{ loading: confirmLoading }}
                onCancel={handleCancel}
            >
                <DeleteOutlined
                    title="supprimer le commentaire"
                    className="text-red-500 cursor-pointer"
                    onClick={showPopconfirm}
                />
            </Popconfirm> */}
        </div>
    )
}

export default SuppCommentaire
