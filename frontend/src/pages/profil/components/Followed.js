import React, { useEffect, useState } from 'react'
import { List, Avatar, Popover, Spin } from 'antd'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import axios from 'axios'
import { api } from '../../../constants/constants'
import { isEmpty } from '../../../utils/Utils'
import FollowUnfollow from '../../components/FollowUnfollow'
import { useSelector } from 'react-redux'

function Followed({ id_user, socket, lastMessage }) {
    const user = useSelector((state) => state.user)

    const [followed, setFollowed] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    /// recuperer les abonnements d utilisateur
    const GET_FOLLOWED = async () => {
        return axios({
            method: 'GET',
            url: `${api}user/getfollowed/${id_user}`,
        })
            .then((res) => {
                setFollowed(res.data)
            })
            .catch((err) => {
                console.log({ err })
            })
            .finally(setIsLoading(false))
    }

    useEffect(() => {
        GET_FOLLOWED()
    }, [])

    return (
        <div>
            <div>
                {isLoading ? (
                    <div className=" text-center  ">
                        <Spin
                            size="large"
                            className="text-2xl p-5 text-sky-900"
                        />
                    </div>
                ) : (
                    <>
                        {!isEmpty(followed[0])
                            ? followed.map((follow) => {
                                  return (
                                      <>
                                          <div
                                              key={follow.id}
                                              className="flex space-x-2 p-1 rounded-xl border border-y-1 hover:bg-sky-100 mt-1 "
                                          >
                                              <div className="">
                                                  {/* --------------------  afficher l'image profil user sinon null mettre par defaut  */}
                                                  {follow.image !== null ? (
                                                      <Avatar
                                                          src={follow.image}
                                                          className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                                          alt="user Profil"
                                                      />
                                                  ) : (
                                                      <Avatar
                                                          src={photoProfil_vide}
                                                          className="w-12 h-12 border border-stone-200 hover:opacity-80 "
                                                          alt="user Profil"
                                                      />
                                                  )}
                                              </div>
                                              <div className="flex flex-col w-full">
                                                  {/* ----------------------------------------- div nom user et bio ----------------------- */}
                                                  <div className="flex flex-row ">
                                                      <div className="w-10/12 pt-1">
                                                          <Link
                                                              to={
                                                                  '/profil/' +
                                                                  follow.id
                                                              }
                                                          >
                                                              <a
                                                                  className="font-bold "
                                                                  // onClick={SeeProfil}
                                                              >
                                                                  {
                                                                      follow.firstname
                                                                  }
                                                                  <span> </span>{' '}
                                                                  {
                                                                      follow.lastname
                                                                  }
                                                              </a>
                                                          </Link>
                                                      </div>
                                                      {follow.id !==
                                                      user.infoUser.id ? (
                                                          <div className="">
                                                              <button>
                                                                  {' '}
                                                                  <FollowUnfollow
                                                                      follower={
                                                                          follow.id
                                                                      }
                                                                  />
                                                              </button>
                                                          </div>
                                                      ) : null}
                                                  </div>
                                                  <span className="break-words">
                                                      {follow.biographie}
                                                  </span>
                                              </div>
                                          </div>
                                      </>
                                  )
                              })
                            : "pas d'abonnements"}
                    </>
                )}
            </div>
        </div>
    )
}

export default Followed
