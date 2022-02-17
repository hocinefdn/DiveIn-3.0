import React, { useState, useRef, useEffect } from 'react'
import { notification } from 'antd'
import { api, apiReact } from '../../constants/constants'
import './css/inscription.css'
import { useForm } from 'react-hook-form'
import logo from '../../assets/logos/DiveIn.png'
import { Modal, Button, Space } from 'antd'

const axios = require('axios')

function Inscription() {
    const [msgErrEmail, setMsgErrEmail] = useState('')

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message:
                'Vous vous êtes inscrit avec succès, vérifiez votre compte en accedant',
        })
    }

    function info() {
        Modal.info({
            title: 'VOUS Y ÊTES PRESQUE !',
            content: (
                <div>
                    <p>Un lien pour activer votre compte vous a été envoyé.</p>
                    <p>
                        Consultez votre Boîte de réception pour finaliser
                        l'inscription et rejoindre la communauté DiveIn!
                    </p>
                    <p className="text-red-500">
                        Vérifiez vos spams si vous ne trouvez pas le lien
                    </p>
                </div>
            ),
            onOk() {
                window.location = apiReact
            },
        })
    }
    function success() {
        Modal.success({
            content: 'some messages...some messages...',
        })
    }
    const {
        register,
        formState: { errors, isValid },
        trigger,
    } = useForm()

    const inscription = () => {
        const date = new Date()
        const nom = document.getElementById('nom').value
        const prenom = document.getElementById('prenom').value
        const email = document.getElementById('emailInscription').value
        const dateNaissance = document.getElementById('dateNaissance').value
        const mdp = document.getElementById('mdp').value
        var sexe = document.querySelector('input[name="sexe"]:checked').value

        const dateInscription =
            date.getFullYear() +
            '-' +
            parseInt(date.getMonth() + 1) +
            '-' +
            date.getDate()

        axios
            .post(`${api}inscription`, {
                email: email,
                nom: nom,
                prenom: prenom,
                date_naissance: dateNaissance,
                date: dateInscription,
                sexe: sexe,
                password: mdp,
            })
            .then((res) => {
                console.log(res.data.error)
                if (res.data.error == 'Cet utilisateur existe deja') {
                    setMsgErrEmail('Cette adresse e-mail a déjà été utilisée')
                    console.log(msgErrEmail)
                } else {
                    setTimeout(() => {
                        if (
                            res.data.message ==
                            'Vous vous êtes inscrit avec succès'
                        ) {
                            info()
                        }
                    }, 1000)
                }
            })
    }

    useEffect(() => {}, [])
    return (
        <div className="signup-form">
            <div className="flex flex-row">
                <img src={logo} alt="logo DiveIn" className="logo-divein" />
                <div className="title">Créer un compte DiveIn</div>
            </div>

            <form>
                <div className="input-boxes">
                    <div className="flex sm:flex-row md: flex-col">
                        <div className="input-box flex flex-col">
                            <input
                                id="nom"
                                placeholder="Nom"
                                type="text"
                                className={`mr-1 form-control ${
                                    errors.nom && 'invalid'
                                }`}
                                {...register('nom', {
                                    required: 'Veuillez renseigner ce champ',
                                    minLength: {
                                        value: 3,
                                        message: 'Minimum sur 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum sur 50 caracteres',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Zé]+$/,
                                        message: 'Que des lettres!',
                                    },
                                })}
                                onKeyUp={() => {
                                    trigger('nom')
                                }}
                            />
                            {errors.nom && (
                                <small className="text-danger text-red-600">
                                    {errors.nom.message}
                                </small>
                            )}
                        </div>
                        <div className="input-box flex flex-col">
                            <input
                                id="prenom"
                                type="text"
                                placeholder="Prénom"
                                className={`ml-1 form-control ${
                                    errors.prenom && 'invalid'
                                }`}
                                {...register('prenom', {
                                    required: 'Veuillez renseigner ce champ',
                                    minLength: {
                                        value: 3,
                                        message: 'Minimum sur 3 caracteres',
                                    },
                                    maxLength: {
                                        value: 50,
                                        message: 'Maximum sur 50 caracteres',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Zé]+$/,
                                        message: 'Que des lettres!',
                                    },
                                })}
                                onKeyUp={() => {
                                    trigger('prenom')
                                }}
                                required
                            />
                            {errors.prenom && (
                                <small className="text-danger text-red-600">
                                    {errors.prenom.message}
                                </small>
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="flex flex-row mb-2">
                            <span
                                id="span-date-naissance"
                                className="mr-20 text-slate-400 text-date"
                            >
                                Date de naissance
                            </span>
                            <input
                                id="dateNaissance"
                                type="date"
                                min="1900-01-01"
                                max="2009-12-31"
                                className={`${
                                    errors.dateNaissance && 'invalid'
                                }`}
                                {...register('dateNaissance', {
                                    required: 'Veuillez renseigner ce champ',
                                    max: {
                                        value: '2009-12-31',
                                        message:
                                            'Date de naissance non autorisé! Pas moins de 13 ans',
                                    },

                                    min: {
                                        value: '1900-01-01',
                                        message: 'Date de naissance invalide',
                                    },
                                })}
                                onKeyUp={() => {
                                    trigger('dateNaissance')
                                }}
                            />
                            {errors.dateNaissance && (
                                <small className="text-danger text-red-600">
                                    {errors.dateNaissance.message}
                                </small>
                            )}
                        </div>
                        <div className="flex flex-row inputs-sexe">
                            <span className=" mr-40 text-slate-400 span-sexe">
                                Sexe
                            </span>
                            <div className="flex flex-row ml-10 input-sexe">
                                <div className="flex flex-row mr-3">
                                    <span>Homme</span>
                                    <input
                                        type="radio"
                                        name="sexe"
                                        value="1"
                                        defaultChecked
                                        className="m-1 "
                                    />
                                </div>
                                <div className="flex flex-row ml-3">
                                    <span>Femme</span>
                                    <input
                                        type="radio"
                                        name="sexe"
                                        value="0"
                                        className="m-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="input-box flex flex-col">
                        <input
                            id="emailInscription"
                            type="text"
                            placeholder="Email"
                            className={`form-control ${
                                errors.email && 'invalid'
                            }`}
                            {...register('email', {
                                required: 'Veuillez renseigner ce champ',
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message:
                                        'Adresse email invalide : exp@exp.exp',
                                },
                            })}
                            onKeyUp={() => {
                                trigger('email')
                            }}
                            required
                        />
                        {errors.email && (
                            <small className="text-danger text-red-600">
                                {errors.email.message}
                            </small>
                        )}
                        <span className="text-red-600">{msgErrEmail}</span>
                    </div>
                    <div className="input-box flex flex-col">
                        <input
                            id="mdp"
                            type="password"
                            placeholder="Mot de passe "
                            className={`form-control ${
                                errors.motdepasse && 'invalid'
                            }`}
                            {...register('motdepasse', {
                                required: 'Veuillez renseigner ce champ',
                                minLength: {
                                    value: 8,
                                    message: 'Au moin 8 caracteres ',
                                },
                                maxLength: {
                                    value: 30,
                                    message: 'Maximum sur 30 caracteres',
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
                                errors.motdepasse2 && 'invalid'
                            }`}
                            required
                            {...register('motdepasse2', {
                                required: 'Veuillez renseigner ce champ',
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
                    </div>
                    <div className="button">
                        <input
                            type="button"
                            value="S'inscrire"
                            disabled={!isValid}
                            onClick={() => inscription()}
                            className="btn_inscription"
                        />
                    </div>
                    <div className="text sign-up-text">
                        Vous avez un compte ?
                        <label htmlFor="flip"> Connectez-vous</label>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Inscription
