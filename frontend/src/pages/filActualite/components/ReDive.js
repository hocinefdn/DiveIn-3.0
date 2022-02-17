import React, { useEffect, useState } from 'react'
import {
    FileImageOutlined,
    SmileOutlined,
    VideoCameraOutlined,
    LoadingOutlined,
} from '@ant-design/icons'
import { Card, Avatar, Spin, notification } from 'antd'
import TextareaAutosize from 'react-textarea-autosize'
import { timestampParser } from '../../../utils/Utils'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { format } from 'timeago.js'

function ReDive({ post, isModalVisibel, setIsModalVisible }) {
    const user = useSelector((state) => state.user)

    // pour afficher video youtube
    const [video, setVideo] = useState('')
    const [isVideoLoading, setVideoIsLoading] = useState(true)
    const [contenu, setContenu] = useState('') // pour stocker le text separer de lien
    /// trouver comment ajouter type de post pour l'instant random
    //const [typePost, setTypePost] = useState(1) // valeurs 1 pour sport
    const [loading, setLoading] = useState(false)
    const [myRedive, setMyRedive] = useState('')
    const [maxLength, setMaxLength] = useState(300)

    const formdata = new FormData()
    formdata.append('id_user', user.infoUser.id)
    formdata.append('content', myRedive)
    formdata.append('id_post', post.id)
    // formdata.append('type_post', typePost)

    const ADD_REDIVE = async () => {
        return axios({
            method: 'POST',
            url: `${api}actualite/post`,
            data: formdata,
        })
            .then((res) => {
                // console.log(res.data)
            })
            .catch((error) => console.log({ error }))
    }

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: ' Redive avec succès verifiez votre profil ',
        })
    }

    // lire url video youtube
    const READ_Video = () => {
        let findLink = post.content.split(' ')

        for (let i = 0; i < findLink.length; i++) {
            if (
                findLink[i].includes('https://www.yout') ||
                findLink[i].includes('https://yout')
            ) {
                let embed = findLink[i].replace('watch?v=', 'embed/')
                setVideo(embed.split('&')[0])
                findLink.splice(i, 1)
                // stocker le contenu sans lien
                let TextNoLink = ''
                for (let i = 0; i < findLink.length; i++) {
                    TextNoLink = TextNoLink + ' ' + findLink[i]
                }
                setContenu(TextNoLink)
            }
        }
        setVideoIsLoading(false)
    }

    useEffect(() => {
        READ_Video()
    }, [])

    const REDive = (e) => {
        e.preventDefault()
        if (myRedive) {
            setLoading(true)
            setTimeout(() => {
                ADD_REDIVE()
                setMyRedive('')
                setLoading(false)
                setIsModalVisible(false)
                openNotificationWithIcon('success')
            }, 900)
        }
    }

    const Annuler = () => {
        setMyRedive('')
    }

    return (
        <div className=" ">
            <Card className=" border border-none">
                <div className="flex flex-row  ">
                    {/* --------------------------- partie top -------------- */}
                    <div className=" items-center pl-0 p-1">
                        {/*  ---------------  verifie l'image profil ---------------- */}
                        {user.infoUser.image !== null ? (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={user.infoUser.image}
                                alt="photo de profil"
                            />
                        ) : (
                            <Avatar
                                className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                src={photoProfil_vide}
                                alt="photo de profil"
                            />
                        )}
                    </div>
                    <div className=" flex flex-col w-10/12">
                        <div className="bg-white ">
                            {!loading ? (
                                <>
                                    <TextareaAutosize
                                        minRows={2}
                                        maxRows={4}
                                        maxLength={300}
                                        className="  pl-3 p-1 text-md resize-none rounded-md w-11/12 h-16 border border-y-1 "
                                        placeholder="ReDive "
                                        value={myRedive}
                                        onChange={(e) =>
                                            setMyRedive(e.target.value)
                                        }
                                    ></TextareaAutosize>
                                    {myRedive ? (
                                        <span className="text-sky-400 flex flex-row ">
                                            {myRedive.length}/{maxLength}
                                            {myRedive.length >= maxLength ? (
                                                <p className="text-red-900 ml-2">
                                                    Le texte ne doit pas dépasse
                                                    300 caractères
                                                </p>
                                            ) : null}
                                        </span>
                                    ) : null}
                                </>
                            ) : (
                                <div className=" text-center  ">
                                    <Spin
                                        size="large"
                                        className="text-4xl p-5 text-sky-900"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/*  -------------------------------- le post a rediver   ------------------------------------ */}
                <div className="">
                    <Card
                        key={post.id}
                        className="m-0 ml-1 w-11/12 border-stone-400 rounded-md  drop-shadow-lg "
                    >
                        {/* """"""""""""""""""""" Partie photo profil et nom user """"""""""""""""""""""""  */}
                        <div className="flex flex-row ">
                            <div className="">
                                {post.image !== null ? (
                                    <Avatar
                                        src={post.image}
                                        key="avatar"
                                        className="w-10 h-10 border border-stone-200 hover:opacity-80 "
                                        alt="user Profil"
                                    />
                                ) : (
                                    <Avatar
                                        src={photoProfil_vide}
                                        key="avatar"
                                        className="w-10 h-10 border border-stone-200 hover:opacity-80 "
                                        alt="user Profil"
                                    />
                                )}
                            </div>
                            <div className="flex flex-col">
                                <div className="pl-1 flex flex-row space-x-2">
                                    <div className="">
                                        <a className="align-middle font-bold pt-1">
                                            {post.firstname} <span> </span>
                                            {post.lastname}
                                        </a>
                                    </div>
                                    <div className="">
                                        <span className="text-xs pt-2">
                                            {format(post.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* """"""""""""""" partie  contenu """"""""""""""""""""" */}
                        {/* {post.content ? (
                                            <div className=" rounded-md ">
                                                <p className="indent-4 align-middle text-left font-normal p-1 ">
                                                    {post.content}
                                                </p>
                                            </div>
                                        ) : (
                                            ' '
                                        )} */}

                        {video ? (
                            <>
                                <div className="  ">
                                    <p className="break-all indent-4 align-middle text-left font-normal p-1 ">
                                        {contenu}
                                    </p>
                                </div>
                                {isVideoLoading ? (
                                    <div className=" text-center  ">
                                        <Spin
                                            size="large"
                                            className="text-2xl p-1 text-sky-900"
                                        />
                                    </div>
                                ) : (
                                    <iframe
                                        className="h-96 w-full rounded-lg"
                                        src={video}
                                        title={video}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay;
                                clipboard-write; encrypted-media; gyroscope;
                                picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                )}
                            </>
                        ) : (
                            <div className="  ">
                                <p className="break-all indent-4 align-middle text-left font-normal p-1 ">
                                    {post.content}
                                </p>
                            </div>
                        )}
                        {/* """"""""""""""""""  PARTIE IMAGES""""""""""""""""""""""" */}
                        {post.image_post ? (
                            <div className="rounded-xl mt-1 border-stone-400 h-64  ">
                                <img
                                    src={post.image_post}
                                    alt="image post"
                                    className="h-full w-74 mr-auto ml-auto rounded-xl "
                                />
                            </div>
                        ) : (
                            ' '
                        )}

                        {/* ------------------------ pour url video youtube --------------- */}

                        {/* {video ? (
                                            <iframe
                                                className="h-64 w-full rounded-lg"
                                                src={video}
                                                title={video}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay;
                                clipboard-write; encrypted-media; gyroscope;
                                picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            ' '
                                        )} */}
                    </Card>
                </div>
                <div className="flex flex-row justify-center mt-4  w-10/12">
                    {/* <div className="w-1/4 flex items-center  justify-center">
                                <>
                                    <FileImageOutlined
                                        key="image"
                                        name="image"
                                        className="text-sky-600 text-lg "
                                        //onClick={uploadImages}
                                    />
                                    <input
                                        className="w-8 z-100 absolute opacity-0 cursor-pointer "
                                        id="file-upload"
                                        type="file"
                                        name="file"
                                        accept=".jpg, .jpeg, .png"
                                        // onChange={(e) => uploadImages(e)}
                                        multiple
                                    />
                                </>
                            </div>
                            <div className="w-1/4 flex items-center justify-center">
                                <button className="mr-auto ml-auto">
                                    <VideoCameraOutlined
                                        className="text-sky-600 text-lg"
                                        key="video"
                                    />
                                </button>
                            </div>
                            <div className="w-1/4 flex items-center justify-center">
                                <button className="">
                                    <SmileOutlined
                                        key="emoji"
                                        className="text-sky-600 text-lg"
                                    />
                                </button>
                            </div> */}
                    <div className="w-1/4 flex items-center space-x-1 justify-center ">
                        {myRedive ? (
                            <button
                                className="bg-red-600 rounded-md p-1 text-white hover:bg-red-500"
                                type="reset"
                                onClick={() => Annuler()}
                            >
                                Annuler
                            </button>
                        ) : null}
                        {myRedive ? (
                            <button
                                type="submit"
                                onClick={REDive}
                                className="bg-sky-600 rounded-md p-1 text-white hover:bg-sky-500"
                            >
                                REDIVE
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="bg-sky-400 rounded-md p-1 text-white cursor-auto"
                            >
                                REDIVE
                            </button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default ReDive
