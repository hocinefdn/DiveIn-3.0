const router = require('express').Router()
const userController = require('../controllers/user.controller')
const multer = require('../middleware/multer-config-single')

router.get('/getUsers/:id', userController.getUsers)
router.get('/getAllUsers', userController.getAllUsers)
router.get('/:id', userController.getUser)

// router.post("/saveUser", userController.saveUser);
router.put('/updateUser/:id', userController.updateUser)
router.delete('/deleteUser/:id', userController.deleteUser)

router.post('/changeUserImage', multer, userController.updateUserImage)
router.post('/changeUserCouv', multer, userController.updateUserCouv)

router.post('/follow', userController.follow)
router.post('/unfollow', userController.unfollow)
router.post('/getfollow', userController.getFollow)

router.post('/contact', userController.sendContact)
router.post('/checkPassword', userController.checkPassword)

// recuperer les abonnements
router.get('/getfollowed/:id_user', userController.getFollowed)
// recuperer  les abonnées
router.get('/getfollowers/:id_user', userController.getFollowers)

// // verifie si user abonnements est deja abonnee
// router.post('/isfollowed', userController.isFollowed)

module.exports = router
