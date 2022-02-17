const db = require('../models/db.user')
const db_k = require('../database/knex')
const bcrypt = require('bcrypt')
const fs = require('fs')
module.exports.getUser = async (req, res, next) => {
    try {
        let results = await db.getUserId(req.params.id)
        res.status(200).json(results)
        next()
    } catch (err) {
        res.status(500).json({ error: err })
        next()
    }
}
module.exports.sendContact = (req, res) => {
    db.sendContact(req.body.object, req.body.message, req.body.id_user)
        .then((data) =>
            res.status(200).json({ message: 'contact envoyé avec succés' })
        )
        .catch((error) =>
            res.status(400).json({ message: "echec d'envoi veuillez reesayer" })
        )
}

module.exports.getUsers = async (req, res) => {
    console.log(req.params)
    try {
        let results = await db.getUsers(req.params.id)
        res.json(results)
    } catch (err) {
        res.status(500).json({ errorGetUsers: '' + err })
    }
}

module.exports.getAllUsers = async (req, res) => {
    try {
        let results = await db.getAllUsers()
        res.json(results)
    } catch (err) {
        res.status(500).json({ errorGetUsers: '' + err })
    }
}

module.exports.updateUserImage = async (req, res) => {
    db.getUserId(req.body.id).then((user) => {
        const filename = user[0].image.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {})
    })
    db.updateUserImage(
        req.body.id,
        `${req.protocol}://${req.get('host')}/images/${req.body.image}`
    ).then((results) => {
        res.status(200).json({
            image: `${req.protocol}://${req.get('host')}/images/${
                req.body.image
            }`,
        })
    })
}
module.exports.updateUserCouv = async (req, res) => {
    db.getUserId(req.body.id).then((user) => {
        const filename = user[0].image_couverture.split('/images/')[1]
        fs.unlink(`images/${filename}`, () => {})
    })
    db.updateUserCouv(
        req.body.id,
        `${req.protocol}://${req.get('host')}/images/${req.body.image}`
    ).then((results) => {
        res.status(200).json({
            image: `${req.protocol}://${req.get('host')}/images/${
                req.body.image
            }`,
        })
    })
}
/*
    try {
        let results = await db.getUsers()
        res.json(results)
    } catch (err) {
        res.status(500).json({ errorGetUsers: '' + err })
    }*/

// --------------------------- crud user avec knex    ----------------

/**
 *
 * @param {*} req null
 * @param {*} res récupérer tous les utilisateurs
 */
// module.exports.getUsers = (req, res) => {
//     console.log('ok')
//     db_k('users')
//         .select('*')
//         .then((data) => {
//             res.json(data)
//         })
//         .catch((err) => {
//             res.send('Probléme dans la base de données')
//             console.log(err)
//         })
// }

/**
 *
 * @param {*} req objet user en tant que body
 * @param {*} res inscrit avec succés | inscription echoué
 */
// module.exports.saveUser = (req, res) => {
//   let user = req.body;
//   db_k("users")
//     .insert(user)
//     .then((result) => {
//       res.send("Inscrit avec succés");
//     })
//     .catch((err) => {
//       res.send("Inscription echouée");
//     });
// };
module.exports.checkPassword = async (req, res) => {
    try {
        let userInfo = await db.getUserId(req.body.id)
        let isMatch = await bcrypt.compare(
            req.body.password,
            userInfo[0].password
        )
        res.status(200).json({ isMatch: isMatch })
    } catch (error) {
        res.status(400).json({ error: error })
    }
}

module.exports.updateUser = async (req, res) => {
    try {
        let id = req.params.id
        let user = req.body

        if (req.body.password) {
            let userInfo = await db.getUserId(id)

            let isMatch = await bcrypt.compare(
                user.oldPassword,
                userInfo[0].password
            )
            if (!isMatch) {
                res.send('ancien mot de passe incorrect')
            } else {
                newPassHash = await bcrypt.hash(user.password, 10)
                delete req.body.oldPassword
                req.body.password = newPassHash
                console.log(newPassHash)
                user = req.body
                db_k('users')
                    .where('id', id)
                    .update(user)
                    .then((result) => {
                        res.send('mise a jour réussie')
                    })
                    .catch((err) => {
                        res.send('probléme dans la base de donnée')
                    })
            }
        } else {
            db_k('users')
                .where('id', id)
                .update(user)
                .then((result) => {
                    res.send('mise a jour réussie')
                })
                .catch((err) => {
                    res.send('probléme dans la base de donnée')
                })
        }
    } catch (err) {}
}

/**
 *
 * @param {*} req email en tant que paramétre
 * @param {*} res utilisateur supprimé avec succés | erreur dans la base de données
 */
module.exports.deleteUser = (req, res) => {
    let id = req.params.id
    db_k('users')
        .where('id', id)
        .del()
        .then((result) => {
            res.send('Utilisateur supprimé avec succés')
        })
        .catch((err) => {
            console.log(err)
        })
}

/**
 *
 * @param {*} req les 2 emails en paramétres
 * @param {*} res abonné avec succés
 */

module.exports.follow = (req, res) => {
    let ids = req.body
    db_k('follows')
        .insert(ids)
        .then((result) => {
            res.send('Abonné avec succés')
        })
        .catch((err) => {
            console.log(err)
        })
}

/**
 *
 * @param {*} req les 2 emails en paramétres
 * @param {*} res désabonné avec succés
 */
module.exports.unfollow = (req, res) => {
    let ids = req.body
    db_k('follows')
        .where('follower_id', ids.follower_id)
        .andWhere('followed_id', ids.followed_id)
        .del()
        .then((result) => {
            res.send('Désabonné avec succés')
        })
        .catch((err) => {
            console.log(err)
        })
}

module.exports.getFollow = async (req, res) => {
    try {
        let results = await db.getFollow(
            req.body.follower_id,
            req.body.followed_id
        )
        res.json(results)
    } catch (err) {
        res.status(500).json({ error: err })
    }
}

// recuperer les followeds les abonnements utilisateur
module.exports.getFollowed = (req, res) => {
    db.getFollowed(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// recuperer les followers les abonnees utilisateur
module.exports.getFollowers = (req, res) => {
    db.getFollowers(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}

// module.exports.isFollowed = (req, res) => {
//     db.isFollowed(req.body.followed_id, req.body.follower_id)
//         .then((data) => {
//             res.status(200).json(data)
//         })
//         .catch((error) => res.status(400).json({ error }))
// }
