import React, { useState, useEffect } from 'react'
import { LikeFilled, LikeOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { LikePost } from '../../../redux/reducers/post.reducer'
import axios from 'axios'
import { api } from '../../../constants/constants'

function LikeButton({
    post,
    liked,
    setLiked,
    nbrLikes,
    setNbrLikes,
    lastMessage,
    socket,
}) {
    const user = useSelector((state) => state.user)

    //  like
    const ADD_LIKE = async () => {
        return axios({
            method: 'POST',
            url: `${api}actualite/like/${user.infoUser.id}&${post.id}`,
        })
            .then((res) => {
                // console.log('add')
                // dispatch(LikePost())
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const UNLIKE = async () => {
        return axios({
            method: 'DELETE',
            url: `${api}actualite/like/${user.infoUser.id}&${post.id}`,
        })
            .then((res) => {
                // console.log('supp')
                // dispatch(LikePost())
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const liker = () => {
        ADD_LIKE()
        setLiked(true)
        setNbrLikes(nbrLikes + 1)
        socket.emit('post liked', user.infoUser, post)
    }

    const unliker = () => {
        UNLIKE()
        setLiked(false)
        setNbrLikes(nbrLikes - 1)
        socket.emit('post unliked', user.infoUser, post)
    }

    return (
        <>
            {' '}
            {liked ? (
                <LikeFilled
                    key="like"
                    className="text-sky-600 text-lg"
                    onClick={() => unliker()}
                />
            ) : (
                <LikeOutlined
                    key="like"
                    className="text-sky-600 text-lg"
                    onClick={() => liker()}
                />
            )}
        </>
    )
}

export default LikeButton
