import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { apiReact } from '../../constants/constants'
import { useSelector, useDispatch } from 'react-redux'
import { setProp } from '../../redux/actions/userActions'
import { useNavigate } from 'react-router-dom'
import { api } from '../../constants/constants'
import logo from '../../assets/logos/DiveIn.png'
const axios = require('axios')

function Connexion() {
    const navigate = useNavigate()
    const user = useSelector((state) => state.user)
    const [cookiesAuth, setCookieAuth] = useCookies(['jwt'])
    const dispatch = useDispatch()
    const [msgErrEmail, setMsgErrEmail] = useState('')
    const [msgErrMdp, setMsgErrMdp] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault()
        const maxAge = 24 * 60 * 60 * 1000
        axios
            .post(`${api}connexion`, {
                email: user.email,
                password: user.password,
            })
            .then((res) => {
                if (res.data.error == "Cet utilisateur n'existe pas")
                    setMsgErrEmail(
                        'L’adresse e-mail que vous avez saisie n’est pas associée à un compte.'
                    )
                if (res.data.error == 'Mot de passe incorrect')
                    setMsgErrMdp('Le mot de passe entré est incorrect.')
                if (res.data.user_id) {
                    localStorage.setItem('id_user', res.data.user_id)
                    dispatch(setProp('id', res.data.user_id))
                    dispatch(setProp('infoUser', res.data.user))
                    dispatch(setProp('isLogged', true))
                    dispatch(setProp('token', res.data.token))
                    window.location = '/home'
                }
                setCookieAuth('jwt', res.data.token, {
                    path: '/',
                    maxAge: maxAge,
                })
                // window.location = "/";
                navigate('/home')
            })
    }

    return (
        <div className="login-form">
            <div className="flex flex-row">
                <img src={logo} alt="logo DiveIn" className="logo-divein" />
                <div className="title">Connectez vous à DiveIn</div>
            </div>

            <form action="#" onSubmit={handleSubmit}>
                <div className="input-boxes">
                    <div className="input-box flex flex-col">
                        <input
                            id="email"
                            type="text"
                            placeholder="Email"
                            onChange={(e) => {
                                dispatch(setProp('email', e.target.value))
                            }}
                            required
                        />
                        <div className="text-red-600">{msgErrEmail}</div>
                    </div>
                    <div className="input-box flex flex-col">
                        <input
                            id="password"
                            type="password"
                            placeholder="Mot de passe"
                            onChange={(e) => {
                                dispatch(setProp('password', e.target.value))
                            }}
                            required
                        />
                        <div className="text-red-600">{msgErrMdp}</div>
                    </div>
                    <div className="text">
                        {/* <a href={`${apiReact}mot-de-passe-oblie`}>
                            Mot de passe oublier ?
                        </a> */}
                        <Link to={`mot-de-passe-oublie`}>
                            Mot de passe oublier ?
                        </Link>
                    </div>
                    <div className="button">
                        <input
                            type="submit"
                            value="Connexion"
                            className="btn_inscription"
                        />
                    </div>
                    <div className="text sign-up-text">
                        Vous n'avez pas de compte?
                        <label htmlFor="flip"> Inscrivez vous</label>
                    </div>
                </div>
            </form>
        </div>
    )
}
export default Connexion
