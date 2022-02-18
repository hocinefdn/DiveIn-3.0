import React, { useEffect, useState } from 'react'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import {
    FileImageOutlined,
    PictureFilled,
    PictureOutlined,
    SmileOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons'
import { Card, Avatar, notification, Spin, Popover } from 'antd'
import Picker from 'emoji-picker-react'
import TextareaAutosize from 'react-textarea-autosize'
import '../css/card.css'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { useDispatch, useSelector } from 'react-redux'
import { Socket } from 'socket.io-client'

function Publier({ posts, setPosts, socket, lastMessage, followers }) {
    const user = useSelector((state) => state.user)

    const [loading, setLoading] = useState(false)
    const [myPost, setMyPost] = useState('')
    const [maxLength, setMaxLength] = useState(300)
    const [afficherEmoji, setAfficherEmoji] = useState(false)

    /// trouver comment ajouter type de post pour l'instant random
    // const [typePost, setTypePost] = useState('') // valeurs 1 pour sport
    const dispatch = useDispatch()

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: ' Votre post publier',
        })
    }

    const onEmojiClick = (event, emojiObject) => {
        setMyPost(myPost + emojiObject.emoji)
    }

    // pour afficher picker imoji
    const ClickAfficherEmoji = () => {
        setAfficherEmoji(!afficherEmoji)
    }

    // ---------------------- upload images --------------------------------------
    const [video, setVideo] = useState('')
    const [file, setFile] = useState() // pour back
    const [images, setImages] = useState(null) // pour le front
    const [isSend, setIsSend] = useState(false) // pour verifier si user a envoye image
    const [zoneImage, setZoneImage] = useState(false)

    const uploadImages = (e) => {
        //  setZoneImage(!zoneImage)
        setImages(URL.createObjectURL(e.target.files[0]))
        setFile(e.target.files[0])
        setIsSend(false)
        setZoneImage(true)
    }

    const ADD_POST = async () => {
        const formdata = new FormData()
        formdata.append('id_user', user.infoUser.id)
        formdata.append('content', myPost)
        //  formdata.append('type_post', typePost)
        if (file) formdata.append('image', file)
        console.log(file)
        //if (video) formdata.append('image', video)

        // pour ajouter le post a la bdd
        return (
            axios({
                method: 'POST',
                url: `${api}actualite/post`,
                data: formdata,
            })
                // pour recuperer le post ajouter dans la bdd pour avoir son id
                .then((res) => {
                    // return axios({
                    //     method: 'GET',
                    //     url: `${api}actualite/my_post/${user.infoUser.id}`,
                    // }).then((res) => {
                    const data = {
                        id: res.data[1][0].id, // id de post
                        id_user: user.infoUser.id,
                        lastname: user.infoUser.lastname,
                        firstname: user.infoUser.firstname,
                        image: user.infoUser.image,
                        content: myPost,
                        nbrLikes: 0,
                        nbrCommentaires: 0,
                        //type_post: res.data[0].type_post,
                        image_post: images,
                        //video_post: res.data[0].video_post,
                        date: Date(),
                        RTid: null,
                    }
                    socket.emit('new post', user.infoUser, data, followers)
                    setPosts([data, ...posts])
                })
                // })
                .catch((error) => {
                    console.log({ error })
                })
        )
    }

    const Publier = (e) => {
        e.preventDefault()
        if (myPost || images || video) {
            setLoading(true)
            setTimeout(() => {
                ADD_POST()
                setMyPost('')
                // console.log(myPost)
                setImages('')
                setFile('')
                setAfficherEmoji(false)
                setVideo('')
                setIsSend(true)
                openNotificationWithIcon('success')
                setLoading(false)
            }, 900)
        }
    }

    const Annuler = () => {
        setMyPost('')
        setImages('')
        setFile('')
        setAfficherEmoji(false)
        setVideo('')
        setIsSend(true)
    }

    // lire url video youtube
    const Add_Video = () => {
        let findLink = myPost.split(' ')

        for (let i = 0; i < findLink.length; i++) {
            if (
                findLink[i].includes('https://www.yout') ||
                findLink[i].includes('https://yout')
            ) {
                let embed = findLink[i].replace('watch?v=', 'embed/')
                setVideo(embed.split('&')[0])
                findLink.splice(i, 1)
                //setMyPost(findLink.join(' '))
            }
        }
    }

    useEffect(() => {
        Add_Video()
    }, [video, myPost])

    return (
        <div>
            <Card
                style={{
                    marginTop: 16,
                }}
                className="border-stone-400 rounded-md width-card drop-shadow-lg "
            >
                <div className="flex flex-col ">
                    {/* -------------------- autres div --------------------- */}

                    <div className=" w-full flex flex-row ">
                        {/*  ---------------  verifie l'image profil ---------------- */}
                        <div className="p-1">
                            {user.infoUser.image !== null ? (
                                <Avatar
                                    className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                    src={user.infoUser.image}
                                    alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                                />
                            ) : (
                                <Avatar
                                    className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                    src={photoProfil_vide}
                                    alt={`${user.infoUser.firstname}" "${user.infoUser.lastname}`}
                                />
                            )}
                        </div>
                        {/* <div>
                            <span className="text-lg"> Publier un Dive </span>
                        </div> */}
                        {/*------------------- ----- pour text ---------------- */}
                        <div className="w-full">
                            {!loading ? (
                                <>
                                    <TextareaAutosize
                                        minRows={2}
                                        maxRows={5}
                                        maxLength={300}
                                        className="text-md resize-none pr-3 pl-3 pt-2 pb-2 rounded-md border border-stone-400 w-full"
                                        placeholder="Quoi de neuf ? (Ex: Partagez des photos, lien vidéo youtube ...)"
                                        value={myPost}
                                        onChange={(e) => {
                                            setMyPost(e.target.value)
                                        }}
                                    />

                                    {myPost ? (
                                        <span className="text-sky-400 flex flex-row ">
                                            {myPost.length}/{maxLength}
                                            {myPost.length >= maxLength ? (
                                                <p className="text-red-900 ml-2">
                                                    Le texte ne doit pas
                                                    dépasser 300 caractères
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
                    {/* ------------------------------- emoji ----------------------------------- */}
                    {/* {afficherEmoji ? (
                            <Picker onEmojiClick={onEmojiClick} />
                        ) : (
                            ''
                        )} */}
                    {/* ------------------------ pour url video youtube --------------- */}
                    <div className="flex items-center justify-center p-1 ">
                        {video ? (
                            <iframe
                                className=" w-full h-64 rounded-lg"
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
                        )}
                    </div>

                    {/* --------------- pour images --------------- */}

                    {zoneImage ? (
                        <div className="flex items-center justify-center  p-1 ">
                            {isSend ? (
                                ' '
                            ) : (
                                <img
                                    src={images}
                                    alt=""
                                    className=" w-full  rounded-xl"
                                />
                            )}
                        </div>
                    ) : null}

                    <div className="flex flex-row justify-center  mt-1 p-1 ">
                        <div className="w-2/4 flex flex-row space-x-1">
                            <div className="w-1/6 flex items-center justify-center">
                                <>
                                    <PictureOutlined
                                        key="image"
                                        name="image"
                                        className="text-sky-600 text-lg "
                                        //onClick={uploadImages}
                                    />
                                    {!video ? (
                                        <input
                                            className="w-8 z-100 absolute opacity-0 cursor-pointer "
                                            id="file-upload"
                                            type="file"
                                            name="file"
                                            accept=".jpg, .jpeg, .png"
                                            onChange={(e) => uploadImages(e)}
                                            multiple
                                        />
                                    ) : (
                                        <input
                                            className="w-8 z-100 absolute opacity-0 cursor-pointer "
                                            id="file-upload"
                                            type="file"
                                            name="file"
                                            // accept=".jpg, .jpeg, .png"
                                            //onChange={(e) => uploadImages(e)}
                                            multiple
                                        />
                                    )}
                                </>
                            </div>

                            {/* <div className="w-1/4 flex items-center justify-center">
                        <button className="mr-auto ml-auto">
                            <VideoCameraOutlined
                                className="text-sky-600 text-lg"
                                key="video"
                            />
                        </button>
                    </div> */}

                            <div className="w-1/6 flex items-center justify-center">
                                <Popover
                                    content={
                                        afficherEmoji ? (
                                            <Picker
                                                onEmojiClick={onEmojiClick}
                                            />
                                        ) : (
                                            ''
                                        )
                                    }
                                >
                                    <button
                                        className=""
                                        onClick={ClickAfficherEmoji}
                                    >
                                        <SmileOutlined
                                            key="emoji"
                                            className="text-sky-600 text-lg"
                                        />
                                    </button>
                                </Popover>
                            </div>
                        </div>
                        <div className="w-1/3 flex items-center space-x-1 justify-center ">
                            {myPost || images || video ? (
                                <button
                                    className="bg-red-600 rounded-md p-1 text-white hover:bg-red-500"
                                    type="reset"
                                    onClick={() => Annuler()}
                                >
                                    Annuler
                                </button>
                            ) : null}
                            {myPost || images || video ? (
                                <button
                                    type="submit"
                                    // onClick={() => openNotificationWithIcon('success')}
                                    onClick={Publier}
                                    className="bg-sky-600 rounded-md p-1 text-white hover:bg-sky-500"
                                >
                                    Publier
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="bg-sky-400 rounded-md p-1 text-white cursor-auto"
                                >
                                    Publier
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default Publier
