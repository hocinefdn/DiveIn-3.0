const router = require('express').Router()
const messagerieController = require('../controllers/message.controller')
const multer = require('../middleware/multer-config-single')

router.post('/follows', messagerieController.getFollowedUsers) //and followed

router.post('/followers', messagerieController.getFollowerUsers) //qui me suivent seulement

router.post('/messages', messagerieController.getMessages)
router.post('/message', multer, messagerieController.addMessage)

router.post('/deleteMessage', messagerieController.deleteMessage)
router.post('/deleteMessages', messagerieController.deleteMessages)

router.post('/reaction', messagerieController.changeReaction) //reagir a un message
router.post('/messages/setSeen', messagerieController.setSeenMessages) // faire vu a un message

router.post('/messages/getNotSeen', messagerieController.getNotSeenMessages)

router.post('/createGroup', messagerieController.createGroup)
router.post('/getGroups', messagerieController.getGroups)
router.post('/getGroupMessages', messagerieController.getGroupMessages)

router.post('/sendGroupMessage', multer, messagerieController.sendGroupMessage)
router.post('/getGroupMembers', messagerieController.getGroupMembers)

router.post('/messageblock', messagerieController.bloquer)
router.post('/messagedeblock', messagerieController.debloquer)
router.post('/getBloque', messagerieController.getBloque)

router.post(
    '/getGroupMessageReactions',
    messagerieController.getGroupMessageReactions
)
router.post('/deleteGroupMessage', messagerieController.deleteGroupMessage)

router.post(
    '/addGroupMessageReaction',
    messagerieController.addGroupMessageReaction
)
router.post(
    '/changeGroupMessageReaction',
    messagerieController.changeGroupMessageReaction
)
router.post(
    '/deleteGroupMessageReaction',
    messagerieController.deleteGroupMessageReaction
)

router.get(
    '/getNotificationsMessages/:id_user',
    messagerieController.getNotificationsMessages
)

router.post('/leaveGroup', messagerieController.leaveGroup)

module.exports = router
