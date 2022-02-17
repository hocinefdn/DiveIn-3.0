import React from 'react'
import '../css/suggestionsPerson.css'

import { List, Avatar } from 'antd'
import profil1 from '../../../assets/images/profil1.jpeg'

function SuggestionsPerson() {
    return (
        <div className="div-suggestions flex flex-col">
            <div className="div-follow flex flex-row ">
                <div className="avatar-follow">
                    <img className="image-avatar" src={profil1} alt="" />
                </div>{' '}
                <div className="follow-info">
                    <h5>Nom Prenom</h5>
                </div>
                <div className="div-bouton">
                    <buttom className="bouton-suivre">Suivre</buttom>{' '}
                </div>
            </div>
        </div>
    )
}

export default SuggestionsPerson
