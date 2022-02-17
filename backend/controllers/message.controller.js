const db = require('../models/db.messagerie')
const fs = require('fs')

//Contacts
module.exports.getFollowedUsers = (req, res) => {
    db.getFollowedUsers(req.body.id) //id de l'utilisateur
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getFollowerUsers = (req, res) => {
    db.getFollowerUsers(req.body.id) //id de l'utilisateur
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json({ error }))
}

//Messages d'une conversation
module.exports.getMessages = (req, res) => {
    db.getMessages(req.body.id_sender, req.body.id_reciever)
        .then((data) => res.status(200).json(data))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.addMessage = (req, res) => {
    let isImage = req.body.image != null
    //console.log(req.body.image)
    db.addMessage(
        req.body.id_sender,
        req.body.id_reciever,
        req.body.message,
        `${req.protocol}://${req.get('host')}/images/${req.body.image}`,
        isImage
    )
        .then((result) => {
            res.status(200).json({
                image: `${req.protocol}://${req.get('host')}/images/${
                    req.body.image
                }`,
                id: result[1][0].id,
            })
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.deleteMessage = (req, res) => {
    db.deleteMessage(req.body.id)
        .then((result) => {
            res.status(200).json(result)
            console.log(result)
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.deleteMessages = (req, res) => {
    console.log(req.body.id_sender, req.body.id_reciever)
    db.deleteMessages(req.body.id_sender, req.body.id_reciever)
        .then((result) => {
            res.status(200).json(result)
            console.log(result)
        })
        .catch((error) => res.status(400).json({ error }))
}

// faire vu a un message
module.exports.setSeenMessages = (req, res) => {
    // faire vu a un message
    db.setSeenMessages(req.body.id_sender, req.body.id_reciever)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}
//reaction  pour supprimer mettre a null , our ajouter ou modifier saisir une reaction_id
module.exports.changeReaction = (req, res) => {
    // verifie si celui qui as envoyé le message est l'utilisateur de la session courrante
    db.changeReaction(req.body.id, req.body.reaction, req.body.isSender)
        .then((result) => res.status(201).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNotSeenMessages = (req, res) => {
    // recuperer le nombre de messages non lu
    db.getNotSeenMessages(req.body.id_sender, req.body.id_reciever)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.createGroup = (req, res) => {
    // recuperer le nombre de messages non lu
    db.createGroup(req.body.id, req.body.groupName, req.body.groupMembers)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getGroups = (req, res) => {
    // recuperer le nombre de messages non lu
    db.getGroups(req.body.id)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getGroupMessages = (req, res) => {
    // recuperer le nombre de messages non lu
    db.getGroupMessages(req.body.group)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.sendGroupMessage = (req, res) => {
    let isImage = req.body.image != null
    //console.log(req.body.image)
    db.sendGroupMessage(
        req.body.id_user,
        req.body.group,
        req.body.message,
        req.body.date,
        `${req.protocol}://${req.get('host')}/images/${req.body.image}`,
        isImage
    )
        .then((result) => {
            res.status(200).json({
                image: `${req.protocol}://${req.get('host')}/images/${
                    req.body.image
                }`,
                id: result[1][0].id,
            })
        })
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getGroupMembers = (req, res) => {
    db.getGroupMembers(req.body.group)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//bloquer un contact
module.exports.bloquer = (req, res) => {
    db.bloquer(req.body.id_sender, req.body.id_reciever)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//pour debloquer
module.exports.debloquer = (req, res) => {
    db.debloquer(req.body.id_sender, req.body.id_reciever)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

//pour debloquer
module.exports.getBloque = (req, res) => {
    db.getBloque(req.body.id_user)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getGroupMessageReactions = (req, res) => {
    db.getGroupMessageReactions(req.body.id, req.body.id_user)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.deleteGroupMessage = (req, res) => {
    db.deleteGroupMessage(req.body.id)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.addGroupMessageReaction = (req, res) => {
    db.addGroupMessageReaction(req.body.id, req.body.id_user, req.body.reaction)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.changeGroupMessageReaction = (req, res) => {
    db.changeGroupMessageReaction(
        req.body.id,
        req.body.id_user,
        req.body.reaction
    )
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.deleteGroupMessageReaction = (req, res) => {
    db.deleteGroupMessageReaction(req.body.id, req.body.id_user)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.leaveGroup = (req, res) => {
    db.leaveGroup(req.body.id_user, req.body.id_group)
        .then((result) => res.status(200).json(result))
        .catch((error) => res.status(400).json({ error }))
}

module.exports.getNotificationsMessages = (req, res) => {
    db.getNotificationsMessages(req.params.id_user)
        .then((data) => {
            res.status(200).json(data)
        })
        .catch((error) => res.status(400).json({ error }))
}