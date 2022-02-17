import axios from 'axios'
import React, { useState } from 'react'
import { Popconfirm, Spin, Modal } from 'antd'
import { api } from '../../../constants/constants'
import { DeleteOutlined } from '@ant-design/icons'

function SuppPost({ post, id_POST, setMesPosts, mesPost }) {
    const [visible, setVisible] = useState(false)
    const [confirmLoading, setConfirmLoading] = useState(false)

    const SUPPRIMER_POST = async () => {
        return axios({
            method: 'delete',
            url: `${api}actualite/post/${post.id}`,
        })
            .then(() => {
                setMesPosts([mesPost])
                //setMesPosts(mesPost.filter((post) => post.id != id_POST))
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
    //         SUPPRIMER_POST()
    //     }, 2000)
    // }

    // const handleCancel = () => {
    //     setVisible(false)
    // }

    // const Supprimer = (e) => {
    //     e.preventDefault()
    //     showPopconfirm()
    //     SUPPRIMER_POST()
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
        //  <Popconfirm
        //         title="Êtes-vous sûr de supprimer ce contenu?"
        //         visible={visible}
        //         onConfirm={handleOk}
        //         okButtonProps={{ loading: confirmLoading }}
        //         onCancel={handleCancel}
        //     >
        //         <button
        //             onClick={showPopconfirm}
        //             className="flex flex-row space-x-1"
        //         >
        //             <div>
        //                 <DeleteOutlined className="text-red-500" />
        //             </div>
        //             <div className="pt-1">Supprimer</div>
        //         </button>
        //     </Popconfirm>
    )
}

export default SuppPost
