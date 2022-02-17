import React, { useEffect, useState } from 'react'
import { Spin } from 'antd'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { isEmpty } from '../../../utils/Utils'

function Media({ params }) {
    const [isLoading, setIsLoading] = useState(true)
    const [imagePost, setImagesPost] = useState([])

    const GET_IMAGES_POST = async () => {
        return axios({
            method: 'GET',
            url: `${api}actualite/imagesPost/${params.id}`,
        })
            .then((res) => {
                setImagesPost(res.data)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        GET_IMAGES_POST()
        setTimeout(() => {
            setIsLoading(false)
        }, 200)
    }, [])

    return (
        <div>
            {isLoading ? (
                <div className=" text-center  ">
                    <Spin size="large" className="text-2xl p-1 text-sky-900" />
                </div>
            ) : (
                <>
                    {!isEmpty(imagePost[0]) ? (
                        <div className="flex flex-wrap gap-1">
                            {imagePost.map((image) => {
                                return (
                                    <div className=" rounded-xl border-stone-400 h-56 ring m-1 ">
                                        <img
                                            src={image.image_post}
                                            alt="image post"
                                            className="h-full  rounded-xl "
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <h2 className="m-4 text-md font-medium text-center">
                            {' '}
                            Aucun media partager quand il le fera va apparaitre
                            ici.
                        </h2>
                    )}
                </>
            )}
        </div>
    )
}

export default Media
