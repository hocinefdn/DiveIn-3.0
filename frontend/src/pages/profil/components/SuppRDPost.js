import axios from 'axios'
import React, { useState } from 'react'
import { Popconfirm, Spin, Modal } from 'antd'
import { api } from '../../../constants/constants'
import { DeleteOutlined } from '@ant-design/icons'

function SuppRDPost({ post, id_RDPOST, RedivePost, setRedivePost }) {
    const SUPPRIMER_POST = async () => {
        return axios({
            method: 'delete',
            url: `${api}actualite/post/${post.id}`,
        })
            .then(() => {
                // setMesPosts([mesPost])
                //setRedivePost([RedivePost])

                setRedivePost(RedivePost.filter((post) => post.id != id_RDPOST))
            })
            .catch((error) => {
                console.log({ error })
            })
    }

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

    const SupprimerPost = (e) => {
        e.preventDefault()
        setIsDeleteLoading(true)
        setTimeout(() => {
            SUPPRIMER_POST()
            setIsDeleteLoading(false)
            setIsModalDeleteVisible(false)
        }, 2000)
    }

    const annuler = (e) => {
        e.preventDefault()
        setIsModalDeleteVisible(false)
    }

    return (
        <>
            {/* ---------------------------- pour supprimer post  ----------------------------  */}

            <button onClick={ClickToDelete} className="flex flex-row space-x-1">
                <div>
                    <DeleteOutlined
                        title="supprimer le commentaire"
                        className="text-red-500 cursor-pointer"
                    />
                </div>
                <div className="pt-1">Supprimer</div>
            </button>

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
                            Êtes-vous sûr de supprimer votre publication ?
                        </p>
                        <div className="flex flex-col space-y-2">
                            <button
                                className="bg-black text-white p-2 text-sm rounded-2xl hover:opacity-80 "
                                onClick={SupprimerPost}
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
        </>
    )
}

export default SuppRDPost
