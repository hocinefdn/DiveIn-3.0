const db = require('../models/db.actualite')
const fs = require('fs')
const { error } = require('console')

// -----------------------------   creer un nouveau un post ------------------------------------------------
module.exports.addPost = (req, res) => {
    images = null
    if (req.files) {
        images = []
        for (var i = 0; i < req.files.length; i++)
            images.push(
                `${req.protocol}://${req.get('host')}/images/${
                    req.files[i].filename
                }`
            )
    }

    db.addPost(
        req.body.content,
        req.body.id_user,
        req.body.id_post,
        req.body.type_post,
        images
    )
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//------------------------------- update post --------------------------------------
module.exports.updatePost = (req, res) => {
    images = null
    if (req.files != null) {
        images = []
        for (var i = 0; i < req.files.length; i++)
            images.push(
                `${req.protocol}://${req.get('host')}/images/${
                    req.files[i].filename
                }`
            )
        console.log(images)
    }
    console.log('je suis un message')

    db.getImagesPost(req.body.id)
        .then((ImagesDB) => {
            if (ImagesDB != null)
                ImagesDB.forEach((image) => {
                    const filename = image.url.split('/images/')[1]
                    fs.unlink(`images/${filename}`, () => {})
                })

            db.updatePost(
                req.body.content,
                req.body.type_post,
                req.body.id,
                images
            )
                .then((result) => res.status(200).json(result))
                .catch((error) => res.status(400).json({ error }))
        })
        .catch((error) => res.status(400).json({ error }))
}

//-----------------------------------------------  delete post -----------------------------------------
module.exports.deletePost = (req, res) => {
    db.getImagesPost(req.params.id)
        .then((Images) => {
            if (Images != null)
                Images.forEach((image) => {
                    const filename = image.url.split('/images/')[1]
                    fs.unlink(`images/${filename}`, () => {})
                })
            db.deletePost(req.params.id)
                .then((result) => {
                    res.status(200).json(result)
                })
                .catch((error) => res.status(400).json({ error }))
        })
        .catch((error) => res.status(400).json({ error }))
}

// ------------------------------ recuperer mon post  ---------------------------------------
module.exports.getMyPost = (req, res) => {
    db.getMyPost(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -----------------------------   creer un nouveau un post ------------------------------------------------
// module.exports.addPost = (req, res) => {
//     db.addPost(req.body.content, req.body.id_user, req.body.type_post)
//         .then((data) => res.status(200).json(data))
//         .catch((error) => res.status(400).json({ error }))
// }

// -------------- recuperer tout les posts  ------------------------------
module.exports.getAllPosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getAllPosts()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

//  -------------------recuperer les posts des abonnées de l'utilisateur ---------------------------------------------
module.exports.getFollowedPosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getFollowedPosts(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

//  -------------------recuperer les nouveaux posts des abonnées de l'utilisateur ---------------------------------------------
module.exports.getNewPosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getNewPosts(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -------------- recuperer tout les posts utilisateur  ------------------------------
module.exports.getMesPosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getMesPosts(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -------------- recuperer tout les redive posts utilisateur  ------------------------------
module.exports.getRedivePosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getRedivePosts(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -------------- recuperer  les images posts utilisateur  ------------------------------
module.exports.getImagesPost = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getImagesPost(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -------------- recuperer  les likes posts utilisateur  ------------------------------
module.exports.getLikesPost = (req, res) => {
    db.getLikesPost(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// -------------- recuperer les commentaires de chaque post ---------------------------------
module.exports.getCommentairesPost = (req, res) => {
    db.getCommentairesPost(req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

//-------------- ajouter un commentaire -------------------------------------
module.exports.addCommentaire = (req, res) => {
    db.addCommentaire(req.body.id_user, req.body.id_post, req.body.content)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

// ------------------------------ recuperer last commentaire  ---------------------------------------
module.exports.getLastCommentaire = (req, res) => {
    db.getLastCommentaire(req.params.id_post, req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// ------------- modifier un commentaire --------------------------
module.exports.updateCommentaire = (req, res) => {
    db.updateCommentaire(
        req.body.content,
        req.body.id,
        req.body.id_user,
        req.body.id_post
    )
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//----------------- supprimer un commentaire ---------------------
module.exports.deleteCommentaire = (req, res) => {
    db.deleteCommentaire(req.params.id)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}
// ------------- recuperer le nombre de commenataires d'un post -------------------------
module.exports.nbrCommentaires = (req, res) => {
    db.nbrCommentaires(req.params.id_post)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error: '' + error }))
}

// ------------- recuperer les likes d utilisateur -------------------------
module.exports.getLike = (req, res) => {
    db.getLike(req.params.id_user, req.params.id_post)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

// ------------- recuperer le nombre de likes d'un post -------------------------
module.exports.nbrLike = (req, res) => {
    db.nbrLike(req.params.id_post)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error: '' + error }))
}

// ---------------- ajouter un like pour un post -------------------------
module.exports.addLike = (req, res) => {
    db.addLike(req.params.id_user, req.params.id_post)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

// --------------- supprimer un like pour un post deja liker ------------------
module.exports.deleteLike = (req, res) => {
    db.deleteLike(req.params.id_user, req.params.id_post)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//---------------------  recommandations de personnes ---------------------------
module.exports.getRecommandations = (req, res) => {
    db.getRecommandations(req.params.id_user) //id utilisateur
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// ----------------------------- tendances ----------------------------------
module.exports.getTendance = (req, res) => {
    db.getTendance()
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// --------------------------------- save post -------------------------
module.exports.SavePost = (req, res) => {
    db.SavePost(req.params.id_user, req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// --------------------------------- Unsave post -------------------------
module.exports.UnSavePost = (req, res) => {
    db.UnSavePost(req.params.id_user, req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// --------------------------------- Signaler post -------------------------
module.exports.SignalerPost = (req, res) => {
    db.SignalerPost(req.params.id_user, req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// ------------------ mes enregistrements -------------
module.exports.MesEnregistrements = (req, res) => {
    db.MesEnregistrements(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNotificationsLikes = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getNotificationsLikes(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNotificationsComments = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getNotificationsComments(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNotificationsPosts = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getNotificationsPosts(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNbrNotifications = (req, res) => {
    // req.params.id recupere id dans url d utilisateur
    db.getNbrNotifications(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.SeenNotifications = (req, res) => {
    db.SeenNotifications(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getPost = (req, res) => {
    db.getPost(req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// likerss
module.exports.getLikers = (req, res) => {
    db.getLikers(req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.setCommentSeen = (req, res) => {
    db.setCommentSeen(req.params.id_comment)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.setLikeSeen = (req, res) => {
    db.setLikeSeen(req.params.id_post , req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.setPostSeen = (req, res) => {
    db.setPostSeen(req.params.id_user , req.params.id_post)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

