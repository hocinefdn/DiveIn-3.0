import React from 'react'
import StructurePrincipal from '../components/StructurePrincipal'
import ListParametres from './components/ListParametres'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from '../../redux/reducers/user.reducer'
import parametre from './css/parametre.css'
import TextareaAutosize from 'react-textarea-autosize'

import { api } from '../../constants/constants'
import { setProp } from '../../redux/actions/userActions'
import { useCookies } from 'react-cookie'
const axios = require('axios')

function Parametres({
    socket,
    lastMessage,
    notificationsMessages,
    setNotificationsMessages,
    nbrLikes,
    nbrComments,
    nbrPosts,
    setNbrLikes,
    setNbrComments,
    setNbrPosts,
}) {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const [cookies, setCookie, removeCookie] = useCookies(['jwt'])

    const deconnexion = () => {
        removeCookie()
        localStorage.setItem('id_user', '')
        dispatch(setProp('id', ''))
        dispatch(setProp('isLogged', false))
        dispatch(setProp('token', ''))
        window.location = '/'
    }

    const closeAlert = () => {
        document.getElementById('suppression').classList.toggle('show')
    }

    function disableAccount() {
        axios
            .delete(`${api}user/deleteUser/${user.id}`)
            .then((res) => {
                deconnexion()
            })
            .catch((err) => {
                console.log(err)
            })
    }
    return (
        <div>
            <div id="suppression" className="alert">
                <div className="alert-message">
                    Voulez vous vraiment Desactiver votre compte ?
                    <div>
                        <button
                            onClick={disableAccount}
                            className="alert-btn btn-confirm"
                        >
                            Confirmer
                        </button>
                        <button
                            onClick={closeAlert}
                            className="alert-btn btn-cancel"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
            <StructurePrincipal
                socket={socket}
                lastMessage={lastMessage}
                notificationsMessages={notificationsMessages}
                setNotificationsMessages={setNotificationsMessages}
                nbrLikes={nbrLikes}
                setNbrLikes={setNbrLikes}
                nbrComments={nbrComments}
                setNbrComments={setNbrComments}
                nbrPosts={nbrPosts}
                setNbrPosts={setNbrPosts}
                titrePage="Paramètres"
                contenu={
                    <div>
                        <ListParametres />{' '}
                    </div>
                }
            />
        </div>
    )
}

export default Parametres
