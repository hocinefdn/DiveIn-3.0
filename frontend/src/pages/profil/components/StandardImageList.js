import * as React from 'react'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import { Spin } from 'antd'
import { useEffect } from 'react'
import { useState } from 'react'
import { api } from '../../../constants/constants'
import axios from 'axios'
import { isEmpty } from '../../../utils/Utils'

export default function StandardImageList({ params }) {
    // const itemData = []
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
                        <ImageList
                            sx={{ width: 726, height: 450 }}
                            cols={3}
                            rowHeight={164}
                        >
                            {imagePost.map((image) => (
                                <ImageListItem key={image.img}>
                                    <img
                                        src={image.image_post}
                                        alt="image post"
                                        srcSet={`${image.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                                        loading="lazy"
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
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
