import React, { useState } from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'

import logo from '../../assets/logos/DiveIn.png'

import imageConnexion from '../../assets/logos/image-connexion.png'
import { api } from '../../constants/constants'
import { useForm } from 'react-hook-form'
import { state } from 'react'

const axios = require('axios')

function RecupMdp() {
    const {
        register,
        formState: { errors, isValid },
        trigger,
    } = useForm()

    let [message, setMessage] = useState('')
    let [email, setEmail] = useState('')
    let [token, setToken] = useState('')
    let [tokenExp, setTokenExp] = useState('')
    let tokenStore = localStorage.getItem('token')

    const handleSubmit = (e) => {
        const email = document.getElementById('email')
        e.preventDefault()
        const maxAge = 24 * 60 * 60 * 1000
        axios
            .post(`http://127.0.0.1:5000/mdpoublie`, {
                email: email.value,
            })
            .then((res) => {
                if (res.data.token) {
                    localStorage.setItem('token', res.data.token)
                    setEmail(email.value)
                    setToken(res.data.token)
                    setTokenExp(res.data.tokenExp)
                    setMessage('')
                } else {
                    setMessage = res.data.erreur
                }
            })
    }

    const setPassword = (e) => {
        let newpass = document.getElementById('newpass')
        let confirm = document.getElementById('confirmerId')
        e.preventDefault()
        if (token === tokenStore && tokenExp > Date.now()) {
            if (newpass.value === confirm.value) {
                axios
                    .post('http://127.0.0.1:5000/mdpoublie/nouveau', {
                        mail: email,
                        password: newpass.value,
                    })
                    .then((res) => {
                        localStorage.removeItem('token')
                        window.location = 'http://127.0.0.1:3000/'
                    })
            } else {
                setMessage('Veuillez confirmer nouveau mot de passe')
            }
        } else {
            setMessage('Votre demande est expiré')
            setTimeout(() => {
                window.location.reload()
                localStorage.removeItem('token')
            }, 3000)
        }
    }
    if (!tokenStore) {
        return (
            <div className="connexion">
                <div className="container">
                    <div className="cover">
                        <div className="front">
                            <img src={imageConnexion} />
                        </div>
                    </div>
                    <div className="forms">
                        <div className="form-content">
                            <div className="login-form">
                                <div className="flex flex-row">
                                    <img
                                        src={logo}
                                        alt="logo DiveIn"
                                        className="logo-divein"
                                    />
                                    <div className="title">
                                        Réinitialisez votre mot de passe
                                    </div>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="input-boxes">
                                        <div className="input-box flex flex-col">
                                            <input
                                                type="email"
                                                required
                                                placeholder="Entrez votre adresse email"
                                                id="email"
                                            />
                                            <div className="text-red-600">
                                                {message}
                                            </div>
                                        </div>
                                        <div className="button">
                                            <input
                                                type="submit"
                                                value="Vérifier"
                                                className="btn_inscription"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="connexion">
                <div className="container">
                    <div className="cover">
                        <div className="front">
                            <img src={imageConnexion} />
                        </div>
                    </div>
                    <div className="forms">
                        <div className="form-content">
                            <div className="login-form">
                                <div className="flex flex-row">
                                    <img
                                        src={logo}
                                        alt="logo DiveIn"
                                        className="logo-divein"
                                    />
                                    <div className="title">
                                        Saisir votre mot de passe
                                    </div>
                                </div>
                                <form onSubmit={setPassword}>
                                    <div className="input-boxes">
                                        <div className="input-box flex flex-col">
                                            <input
                                                id="newpass"
                                                type="password"
                                                placeholder="Mot de passe "
                                                className={`form-control ${
                                                    errors.motdepasse &&
                                                    'invalid'
                                                }`}
                                                {...register('motdepasse', {
                                                    required:
                                                        'Veuillez renseigner ce champ',
                                                    minLength: {
                                                        value: 8,
                                                        message:
                                                            'Au moin 8 caracteres ',
                                                    },
                                                    maxLength: {
                                                        value: 30,
                                                        message:
                                                            'Maximum sur 30 caracteres',
                                                    },
                                                })}
                                                onKeyUp={() => {
                                                    trigger('motdepasse')
                                                }}
                                                required
                                            />
                                            {errors.motdepasse && (
                                                <small className="text-danger text-red-600">
                                                    {errors.motdepasse.message}
                                                </small>
                                            )}
                                        </div>
                                        <div className="input-box flex flex-col">
                                            <input
                                                id="confirmerId"
                                                type="password"
                                                placeholder="Confirmer mot de passe "
                                                className={`form-control ${
                                                    errors.motdepasse2 &&
                                                    'invalid'
                                                }`}
                                                required
                                                {...register('motdepasse2', {
                                                    required:
                                                        'Veuillez renseigner ce champ',
                                                })}
                                                onKeyUp={() => {
                                                    trigger('motdepasse2')
                                                }}
                                            />
                                            {errors.motdepasse2 && (
                                                <small className="text-danger text-red-600">
                                                    {errors.motdepasse2.message}
                                                </small>
                                            )}
                                            <div className="text-red-600">
                                                {message}
                                            </div>
                                        </div>
                                        <div className="button">
                                            <input
                                                type="submit"
                                                value="Vérifier"
                                                className="btn_inscription"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default RecupMdp
