const router = require('express').Router()
const adminConnexion = require('../controllers/adminConnexion.controller')

router.post('/connexion', adminConnexion.connexionAdmin)

module.exports = router
