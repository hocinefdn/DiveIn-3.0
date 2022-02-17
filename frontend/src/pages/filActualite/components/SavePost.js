import React, { useEffect, useState } from 'react'
import { notification } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { useSelector } from 'react-redux'
import Post from './Post'

function SavePost({
    post,
    isSave,
    setIsSave,
    id_post_enreg,
    enregistrements,
    setEnregistrements,
}) {
    const user = useSelector((state) => state.user)

    const openNotificationSaveWithIcon = (type) => {
        notification[type]({
            message: ' Post enregistrer',
        })
    }

    const openNotificationUnSaveWithIcon = (type) => {
        notification[type]({
            message: ' Post retirer',
        })
    }

    const SAVE_POST = async () => {
        axios({
            method: 'POST',
            url: `${api}actualite/post/save/${user.infoUser.id}&${post.id}`,
        })
            .then(() => {})
            .catch((err) => {
                console.log({ err })
            })
    }

    const NOT_SAVE_POST = async () => {
        axios({
            method: 'delete',
            url: `${api}actualite/post/unsave/${user.infoUser.id}&${post.id}`,
        })
            .then(() => {
                // setEnregistrements([enregistrements])
                setEnregistrements(
                    enregistrements.filter((post) => post.id !== id_post_enreg)
                )
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    const Enregistrer = (e) => {
        e.preventDefault(e)
        openNotificationSaveWithIcon('success')
        SAVE_POST()
    }

    const NotEnregistrer = (e) => {
        e.preventDefault(e)
        openNotificationUnSaveWithIcon('success')
        NOT_SAVE_POST()
    }

    return (
        <div>
            {isSave ? (
                <button
                    onClick={NotEnregistrer}
                    className="space-x-1 flex felx-row"
                >
                    <div className="pt-1">
                        <img src="https://img.icons8.com/material-rounded/16/004DA3/bookmark-ribbon.png" />
                    </div>
                    <div>Ne pas Enregistrer</div>
                </button>
            ) : (
                <button
                    onClick={Enregistrer}
                    className="space-x-1 flex felx-row"
                >
                    <div className="pt-1">
                        <img src="https://img.icons8.com/external-gradak-royyan-wijaya/16/004DA3/external-bookmark-gradak-interface-gradak-royyan-wijaya.png" />
                    </div>
                    <div>Enregistrer</div>
                </button>
            )}
        </div>
    )
}

export default SavePost
