import React from 'react'
import { Link } from 'react-router-dom'

function Banniere() {
    return (
        <div className="banniere fixed bottom-0 h-4">
            <span className="txt t1 relative bottom-6">
                Ceci est un projet pédagogique conçu et développé par les
                étudiants de M2 Ingénierie des Systèmes
                d'information-UMMTO-ALGERIE *** VEUILLEZ PRENDRE CONNAISSANCE
                DES{' '}
                <Link
                    to="/condition-utilisation"
                    className="text-sky-400 underline font-bold"
                >
                    {' '}
                    CONDITIONS D'UTILISATION{' '}
                </Link>{' '}
                AVANT DE VOUS INSCRIRE ET DE CREER UN COMPTE --- This is an
                educational project designed and developed by students of M2
                Information Systems Engineering-UMMTO-ALGERIA *** PLEASE READ
                <Link
                    to="/condition-utilisation"
                    className="text-sky-400 underline font-bold"
                >
                    THE TERMS OF USE
                </Link>{' '}
                BEFORE REGISTERING AND CREATING AN ACCOUNT
            </span>
        </div>
    )
}

export default Banniere
