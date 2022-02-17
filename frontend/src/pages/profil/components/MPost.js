import React, { useState, useEffect } from 'react'
import { Card, Avatar, Skeleton, Modal, Dropdown, Menu, Spin } from 'antd'
import {
    CommentOutlined,
    EllipsisOutlined,
    LikeOutlined,
    RetweetOutlined,
} from '@ant-design/icons'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { api } from '../../../constants/constants'
import Commentaire from '../../filActualite/components/Commentaire'
import { format } from 'timeago.js'
import { timestampParser } from '../../../utils/Utils'
import { useDispatch, useSelector } from 'react-redux'
import LikeButton from '../../filActualite/components/LikeButton'
import ReDive from '../../filActualite/components/ReDive'
import SuppPost from './SuppPost'
import { useParams } from 'react-router-dom'
import Likers from '../../filActualite/components/Likers'

const { Meta } = Card

function MPost({ post, mesPost, setMesPosts, socket, lastMessage }) {
    const user = useSelector((state) => state.user)
    const params = useParams()

    // pour afficher video youtube
    const [video, setVideo] = useState('')
    const [isVideoLoading, setVideoIsLoading] = useState(true)
    const [contenu, setContenu] = useState('') // pour stocker le text separer de lien

    // verifie le chargement des posts
    const [isLoading, setIsLoading] = useState(true)
    const [liked, setLiked] = useState(false)
    const [nbrLikes, setNbrLikes] = useState(post.nbrLikes)

    // pour afficher la zone ajouter commentaire
    const [zoneCommentaire, setZoneCommentaire] = useState(false)
    // pour afficher les commentaires
    const [afficherCommentaires, setAfficherCommentaires] = useState(false)

    // pour charger les posts
    const [chargerPosts, setChargerPosts] = useState(true)
    const [nbrCommentaires, setnbrCommentaires] = useState(post.nbrCommentaires)

    // afficher le champs des commentaires
    const ClickCommentaire = () => {
        setZoneCommentaire(!zoneCommentaire)
    }

    // afficher les commentaires
    const clickAfficherCommentaires = () => {
        setAfficherCommentaires(!afficherCommentaires)
    }

    // recupere les likes de user
    const GET_LIKED_POST = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/like/${user.infoUser.id}&${post.id}`,
        })
            .then((res) => {
                if (res.data.length === 1) {
                    setLiked(true)
                } else {
                    setLiked(false)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }

    /// nbr des likes chaque post
    const GET_NBR_LIKES = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/nbr-like/${post.id}`,
        })
            .then((res) => {
                setNbrLikes(res.data[0].nbrLikes)
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    // // nbr des commentaires chaque post
    const GET_NBR_COMMENTAIRES = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/commentaire/${post.id}`,
        })
            .then((res) => {
                setnbrCommentaires(res.data[0].nbrCommentaires)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    // lire url video youtube
    const READ_Video = () => {
        if (post.content) {
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
    }

    // pour recupere nbr des commentaires chaque 40S
    useEffect(() => {
        const interval = setInterval(() => {
            GET_NBR_COMMENTAIRES()
            GET_NBR_LIKES()
        }, 40000)
        return () => clearInterval(interval)
    }, [])

    // pour charger chaque changement
    useEffect(() => {
        if (chargerPosts) {
            // GET_NBR_COMMENTAIRES()
            READ_Video()
            GET_LIKED_POST()
            setChargerPosts(false)
        }
    }, [chargerPosts, nbrCommentaires])

    // changer l'etat loading
    useEffect(() => {
        if (post !== 0) {
            setIsLoading(false)
        }
    }, [post])

    /// pour le redive -----------------------------
    const [ZoneReDive, setZoneReDive] = useState(false)
    // const ClickReDive = () => {
    //     // setZoneReDive(!ZoneReDive)
    // }
    const [isModalVisible, setIsModalVisible] = useState(false)

    const ClickReDive = () => {
        setIsModalVisible(true)
    }
    // const ClickReDive = () => {
    //     // setZoneReDive(!ZoneReDive)
    //  }

    const handleOk = () => {
        setIsModalVisible(false)
    }

    const handleCancel = () => {
        setIsModalVisible(false)
    }

    /// pour voir qui a like post -----------------------------

    const [isModalLikeVisible, setIsModalLikeVisible] = useState(false)

    const ClickSeeLike = () => {
        setIsModalLikeVisible(true)
    }

    // const ClickReDive = () => {
    //     // setZoneReDive(!ZoneReDive)
    //  }

    const handleLikesOk = () => {
        setIsModalLikeVisible(false)
    }

    const handleLikesCancel = () => {
        setIsModalLikeVisible(false)
    }

    //// menu dropdown
    const menu = (
        <Menu>
            <Menu.Item>
                <SuppPost
                    post={post}
                    id_POST={post.id}
                    mesPost={mesPost}
                    setMesPosts={setMesPosts}
                />
            </Menu.Item>
        </Menu>
    )

    return (
        <div className=" ">
            {/* -----------------------  post pas encore charger ----------------------- */}
            <Card
                key={post.id}
                className="border-stone-400 rounded-md width-card drop-shadow-lg "
                style={{
                    marginTop: 14,
                }}
            >
                {isLoading ? (
                    <Skeleton key="skelton" avatar active>
                        <Meta
                            key="meta"
                            avatar={
                                <Avatar src="https://joeschmoe.io/api/v1/random" />
                            }
                            title="Card title"
                            description="This is the description"
                        />
                    </Skeleton>
                ) : (
                    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  card avec données  &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

                    <div className="flex flex-row ">
                        {/* ---------------------------------------les autres div ----------------------- */}
                        <div className=" w-full  flex flex-col">
                            <div className="flex flex-row">
                                {/* """""""""""""""""""""""""""""""""" Partie photo profil et nom user """"""""""""""""""""""""  */}

                                <div className="p-1">
                                    {post.image !== null ? (
                                        <Avatar
                                            src={post.image}
                                            key="avatar"
                                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                            alt={`${post.firstname}" "${post.lastname}`}
                                        />
                                    ) : (
                                        <Avatar
                                            src={photoProfil_vide}
                                            key="avatar"
                                            className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                            alt={`${post.firstname}" "${post.lastname}`}
                                        />
                                    )}
                                </div>
                                <div className=" p-1 flex flex-row  space-x-2 ">
                                    <div className="">
                                        <a className="align-middle font-bold pt-1">
                                            {post.firstname} <span> </span>
                                            {post.lastname}
                                        </a>
                                    </div>
                                    <div>
                                        <span className="text-xs pt-2">
                                            {format(post.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* """"""""""""""" partie  contenu """"""""""""""""""""" */}
                            {/* {post.content ? (
                                // className=" border border-gray-300  mt-2 rounded-md "
                                <div className="  ">
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
                                        <p className="break-words indent-4 align-middle text-left font-normal p-1 ">
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
                                    <p className="break-words indent-4 align-middle text-left font-normal p-1 ">
                                        {post.content}
                                    </p>
                                </div>
                            )}

                            {/* """"""""""""""""""  PARTIE IMAGES""""""""""""""""""""""" */}
                            {post.image_post ? (
                                <div className="rounded-xl mt-1   w-full ">
                                    <img
                                        src={post.image_post}
                                        alt="image post"
                                        className="mr-auto ml-auto rounded-md"
                                    />
                                </div>
                            ) : (
                                ' '
                            )}

                            {/* ------------------------ pour url video youtube ---------------
                            {video
                                ? (contenu ? (
                                      // className=" border border-gray-300  mt-2 rounded-md "
                                      <div className="  ">
                                          <p className="indent-4 align-middle text-left font-normal p-1 ">
                                              {contenu}
                                          </p>
                                      </div>
                                  ) : (
                                      ' '
                                  ),
                                  isVideoLoading ? (
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
                                  ))
                                : ' '} */}

                            {/* """"""""""""""""""" partie boutons """"""""""""""""""" */}

                            <div className="flex flex-row justify-center border border-solid mt-2 rounded-md">
                                <div className="w-1/4 flex items-center justify-center">
                                    <button className=" cursor-pointer">
                                        <LikeButton
                                            socket={socket}
                                            lastMessage={lastMessage}
                                            key="likebtn"
                                            post={post}
                                            liked={liked}
                                            setLiked={setLiked}
                                            nbrLikes={nbrLikes}
                                            setNbrLikes={setNbrLikes}
                                        />
                                        <button
                                            title="j'aime"
                                            onClick={ClickSeeLike}
                                            className="underline text-gray-600 text-md m-1 text-bold  pl-1 pr-2 "
                                        >
                                            {nbrLikes}
                                            {/* <span className="pl-1">j'aime</span> */}
                                        </button>
                                    </button>
                                </div>
                                <div className="w-1/4 flex items-center justify-center">
                                    <button className="mr-auto ml-auto">
                                        {zoneCommentaire ? (
                                            <CommentOutlined
                                                className="text-sky-800 text-lg"
                                                key="comment"
                                                onClick={() =>
                                                    ClickCommentaire()
                                                }
                                            />
                                        ) : (
                                            <CommentOutlined
                                                className="text-sky-600 text-lg"
                                                key="comment"
                                                onClick={() =>
                                                    ClickCommentaire()
                                                }
                                            />
                                        )}
                                        <span className="text-gray-600 text-md m-1 text-bold">
                                            {nbrCommentaires}
                                        </span>
                                    </button>
                                </div>
                                <div className="w-1/4 flex items-center justify-center">
                                    <button className="mr-auto ml-auto">
                                        <RetweetOutlined
                                            className="text-sky-600 text-lg"
                                            key="partager"
                                            onClick={ClickReDive}
                                        />
                                    </button>
                                </div>

                                {user.infoUser.id == params.id ? (
                                    <div className="w-1/4 flex items-center justify-center">
                                        <Dropdown
                                            overlay={menu}
                                            placement="topCenter"
                                        >
                                            <button className="">
                                                <EllipsisOutlined
                                                    key="option"
                                                    className="text-sky-600 text-lg"
                                                />
                                            </button>
                                        </Dropdown>
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                )}

                {/* """"""""""""""""""""  zone commentairess """""""""""""""""""""""""""""""" */}
                {/* <div className="mt-2 rounded-lg ">
                {zoneCommentaire && <ZoneCommentaires post={post} />}
            </div> */}
                <div className="mt-2 rounded-lg  ">
                    {zoneCommentaire && (
                        <Commentaire
                            socket={socket}
                            lastMessage={lastMessage}
                            key="comment"
                            post={post}
                            nbrCommentaires={nbrCommentaires}
                            setnbrCommentaires={setnbrCommentaires}
                        />
                    )}
                </div>
                {/* ---------------------------- pour le redive ----------------------------  */}
                <div className="mt-2 rounded-lg  ">
                    <Modal
                        visible={isModalVisible}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        style={{ top: 30 }}
                        width={600}
                        footer=""
                        className="p-1 ring bg-red-100 rounded-xl"
                    >
                        <ReDive
                            key={post.id}
                            post={post}
                            isModalVisibel={isModalVisible}
                            setIsModalVisible={setIsModalVisible}
                        />
                    </Modal>
                </div>

                {/* ---------------------------- pour voir les like ----------------------------  */}
                <div className="mt-2 rounded-lg  ">
                    <Modal
                        visible={isModalLikeVisible}
                        onOk={handleLikesOk}
                        onCancel={handleLikesCancel}
                        style={{ top: 30 }}
                        width={500}
                        footer=""
                        className="p-1 ring bg-red-100 rounded-xl"
                    >
                        <Likers
                            //key={post.id}

                            post={post}
                            isModalLikeVisible={isModalLikeVisible}
                            setIsModalLikeVisible={setIsModalLikeVisible}
                        />
                    </Modal>
                </div>
            </Card>
        </div>
    )
}

export default MPost
