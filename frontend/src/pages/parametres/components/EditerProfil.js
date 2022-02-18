import React, { useState } from 'react'
import photo from '../../../assets/images/profil.png'
import { Input, Avatar } from 'antd'
import { useSelector, useDispatch } from 'react-redux'
import photoProfil_vide from '../../../assets/images/image_profil_vide.png'
import { api } from '../../../constants/constants'
import { setProp } from '../../../redux/actions/userActions'
import TextareaAutosize from 'react-textarea-autosize'

const axios = require('axios')
const { TextArea } = Input

function EditerProfil() {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [nom, setNom] = useState(user.infoUser.lastname)
    const [prenom, setPrenom] = useState(user.infoUser.firstname)
    const [date, setDate] = useState(user.infoUser.birthday)
    const [bio, setBio] = useState(user.infoUser.biographie)
    const [error, setError] = useState()
    function submitEdit() {
        axios
            .put(`${api}user/updateUser/${user.id}`, {
                lastname: nom,
                firstname: prenom,
                birthday: date,
                biographie: bio,
            })
            .then((res) => {
                setError(res.data)
                dispatch(
                    setProp('infoUser', {
                        ...user.infoUser,
                        lastname: nom,
                        firstname: prenom,
                        birthday: date,
                        biographie: bio,
                    })
                )
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className="border border-solid p-3 ">
            <div className="flex flex-row space-x-2">
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
                {/* <img
                        src={photo}
                        alt="photo de profil"
                        className="rounded-full w-16 cursor-pointer"
                    /> */}
                {/* ------------------ la div des input  -------------------------------*/}
                <div className="flex flex-col space-y-2 w-full">
                    {/* la div input Nom */}
                    <div className="flex flex-col w-full  p-2 ">
                        <div className="p-2">
                            <span className="text-sky-600">Nom</span>
                        </div>

                        <TextArea
                            type="text"
                            className=" p-2 border-solid-2 resize-none rounded-md"
                            style={{ height: 50 }}
                            placeholder="Saisissez votre Nom"
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            // pattern="[A-Za-z]{50}"
                            // title="Three letter country code"
                        />
                    </div>
                    {/* la div input prenom */}
                    <div className=" flex flex-col w-full  p-2  ">
                        <div className="p-2 ">
                            <span className="text-sky-600 ">Prenom</span>
                        </div>

                        <TextArea
                            type="text"
                            className="p-2 border-solid-2 resize-none rounded-md"
                            style={{ height: 50 }}
                            placeholder="Saisissez votre Prenom"
                            value={prenom}
                            onChange={(e) => setPrenom(e.target.value)}
                        ></TextArea>
                    </div>
                    {/*  date de naissance  */}
                    {/* <div className="bg-white flex flex-col w-full  p-2 border border-2 rounded-xl "> */}
                    <div className="flex flex-col w-full  p-2 ">
                        <div className="p-2">
                            <span className=" text-sky-600">
                                Date de naissance
                            </span>
                        </div>
                        <input
                            type="Date"
                            className="pt-1 pb-1 pl-2 text-sm border-2 rounded-md "
                            value={date}
                            max="2009-12-31"
                            onChange={(e) => setDate(e.target.value)}
                        ></input>
                    </div>
                    {/* ----------------------- bio  ------------------- */}
                    <div className=" flex flex-col w-full  p-2 ">
                        <div className="p-2">
                            <label className="text-sky-600">Bio</label>
                        </div>

                        <TextArea
                            className="p-2 border-solid-2 resize-none rounded-md"
                            //showCount
                            maxLength={40}
                            style={{ height: 80 }}
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    {/*  buttoun envoyer */}
                    <div className="w-10/11 m-auto">
                        <button
                            className="p-3 bg-sky-600 mt-3 float-right mr-10 text-white rounded-md hover:bg-sky-500 "
                            onClick={submitEdit}
                        >
                            Valider
                        </button>
                    </div>
                    <div className="text-grey-500 text-lg">{error}</div>
                </div>
            </div>
        </div>
    )
}

export default EditerProfil
