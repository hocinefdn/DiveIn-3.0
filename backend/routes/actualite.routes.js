const router = require('express').Router()
const actualiteController = require('../controllers/actualite.controller')
const multer = require('../middleware/multer-config')

// ------- creer un post + images  ----------------
//router.post('/post', actualiteController.addPost)
//  ----- get recupere le dernier post celui ajouter ------------------
router.get('/my_post/:id_user', multer, actualiteController.getMyPost)
router.post('/post', multer, actualiteController.addPost)
//router.put('/post', multer, actualiteController.updatePost)
router.delete('/post/:id', actualiteController.deletePost)

//router.get('/allPosts', actualiteController.getAllPosts)

// get Posts   /:id identifient user
router.get('/post/:id_user', actualiteController.getFollowedPosts)

// recupere les posts utilisateur
router.get('/mespost/:id_user', multer, actualiteController.getMesPosts)

// recupere les redive posts utilisateur
router.get('/post_redive/:id_user', multer, actualiteController.getRedivePosts)

// recuperer des nouveaux posts
router.get('/newpost/:id_user', multer, actualiteController.getNewPosts)

// recuperer image Post
router.get('/imagesPost/:id_user', multer, actualiteController.getImagesPost)

// recuperer les likes user
router.get('/likesPost/:id_user', multer, actualiteController.getLikesPost)

// id_post identifient de post
router.get('/commentaires/:id_post', actualiteController.getCommentairesPost)
// last add commentaire
router.get(
    '/last-commentaire/:id_post&:id_user',
    actualiteController.getLastCommentaire
)

router.get('/commentaire/:id_post', actualiteController.nbrCommentaires)
router.post('/commentaire', actualiteController.addCommentaire)
router.put('/commentaire', actualiteController.updateCommentaire)
router.delete('/commentaire/:id', actualiteController.deleteCommentaire)

//CRUD likes
// id_user pour identifient utilisateur et id_post pour identifient d post
router.get('/like/:id_user&:id_post', actualiteController.getLike)
router.post('/like/:id_user&:id_post', actualiteController.addLike)
router.get('/nbr-like/:id_post', actualiteController.nbrLike)
router.delete('/like/:id_user&:id_post', actualiteController.deleteLike)

// recommandations
router.get('/recommandations/:id_user', actualiteController.getRecommandations)

// tendances
router.get('/tendances', actualiteController.getTendance)

// save post
router.post('/post/save/:id_user&:id_post', actualiteController.SavePost)
router.delete('/post/unsave/:id_user&:id_post', actualiteController.UnSavePost)

// signaler un post
router.post(
    '/post/signaler/:id_user&:id_post',
    actualiteController.SignalerPost
)
router.get('/enregistrements/:id_user', actualiteController.MesEnregistrements)

//notifications
router.get(
    '/notificationsLikes/:id_user',
    actualiteController.getNotificationsLikes
)
router.get(
    '/notificationsComments/:id_user',
    actualiteController.getNotificationsComments
)

router.get(
    '/notificationsPosts/:id_user',
    actualiteController.getNotificationsPosts
)

router.get(
    '/nbr-notifications/:id_user',
    actualiteController.getNbrNotifications
)

// notifications vue
router.post(
    '/seen-notifications/:id_user',
    actualiteController.SeenNotifications
)

router.get('/post/notification/:id_post', actualiteController.getPost)

// likers
router.get('/likers/:id_post', actualiteController.getLikers)

module.exports = router
