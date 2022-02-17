const router = require('express').Router()
const inscriptionController = require('../controllers/inscription.controller')

router.post('/', inscriptionController.inscription)

module.exports = router
