import React from 'react'
import Inscription from '../inscription/Inscription'
import Connexion from '../connexion/Connexion'
import './style.css'
import imageConnexion from '../../assets/logos/image-connexion.png'
import imageConnexion2 from '../../assets/logos/image-connexion2.png'
function ConnexionInscription() {
    return (
        <div className="connexion">
            <div className="container">
                <input type="checkbox" id="flip" />
                <div className="cover">
                    <div className="front">
                        <img
                            className="backImg"
                            src={imageConnexion2}
                            alt="image connexion"
                        />
                    </div>
                    <div className="back">
                        <img
                            className="backImg"
                            src={imageConnexion}
                            alt="image connexion"
                        />
                    </div>
                </div>
                <div className="forms">
                    <div className="form-content">
                        {/* ----------------------------  connexion --------------------------- */}
                        <Connexion />
                        {/* --------------------------- inscription  -------------------------- */}
                        <Inscription />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConnexionInscription
