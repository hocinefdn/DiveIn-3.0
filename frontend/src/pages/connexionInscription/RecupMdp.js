import React from 'react'
import { scryRenderedComponentsWithType } from 'react-dom/test-utils'
import './recupMdp.css'
import logo from '../../assets/logos/DiveIn.png'
function RecupMdp() {
    return (
        <div className="recupMdp">
            <form className="container-recupMdp">
                <img src={logo} />
                <h2>Récuperer le mot de passe de votre compte</h2>
                <input
                    type="text "
                    placeholder="Entrez votre adresse email"
                ></input>
                <h2>Nous allons envoyer un code par email</h2>
                <input type="text " placeholder="Entrez le code"></input>
                <button>Confirmer</button>
            </form>
        </div>
    )
}

export default RecupMdp
