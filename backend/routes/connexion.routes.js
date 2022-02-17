const router = require('express').Router()
const connexionController = require('../controllers/connexion.controller')

router.post('/', connexionController.connexion)

module.exports = router
