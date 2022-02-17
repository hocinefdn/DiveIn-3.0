import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { List, Spin } from 'antd'
import axios from 'axios'
import { api } from '../../constants/constants'
import { useSelector } from 'react-redux'
import { isEmpty } from '../../utils/Utils'

function ListTendances() {
    const user = useSelector((state) => state.user)
    const [isLoading, setIsLoading] = useState(true)
    const [tendances, setTendances] = useState([])
    const [tendancesSorted, setTendancesSorted] = useState([]) // stocker les tendances par ordre sum
    const array = tendancesSorted.slice(0, 3)

    const GET_TENDANCES = () => {
        axios({
            method: 'GET',
            url: `${api}actualite/tendances`,
        })
            .then((res) => {
                setTendances(res.data)
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    useEffect(() => {
        const interval = setInterval(() => {
            GET_TENDANCES()
        }, 100000)
        return () => clearInterval(interval)
    }, [])

    // pour trie les tendances par ordre de sum
    useEffect(() => {
        if (!isEmpty(tendances[0])) {
            const tendancesArr = Object.keys(tendances).map((i) => tendances[i])
            let sortedArray = tendancesArr.sort((a, b) => {
                return b.sum - a.sum
            })
            // console.log(sortedArray)
            setTendancesSorted(sortedArray)
        }
    }, [tendances])

    useEffect(() => {
        GET_TENDANCES()
        setTimeout(() => {
            setIsLoading(false)
        }, 100)
    }, [])

    return (
        <div>
            {isLoading ? (
                <div className=" text-center  ">
                    <Spin size="large" className="text-2xl p-5 text-sky-900" />
                </div>
            ) : (
                <>
                    {array.map((td) => {
                        return (
                            <Link to="/tendances">
                                <div
                                    className=" mt-1 p-1 hover:bg-sky-200"
                                    key={td.id}
                                >
                                    <a
                                        key="user"
                                        className="text-lg font-medium"
                                    >
                                        {td.firstname} {td.lastname}
                                    </a>
                                    <div className="truncate">{td.content}</div>
                                    <div className="flex felx-row space-x-2">
                                        <div>
                                            {td.nbrCommentaires}{' '}
                                            <span className="text-xs">
                                                Comments
                                            </span>
                                        </div>
                                        <div>
                                            {td.nbrLikes}{' '}
                                            <span className="text-xs">
                                                Likes
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default ListTendances
