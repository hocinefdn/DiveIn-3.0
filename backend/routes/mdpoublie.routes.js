const router = require('express').Router()
const resetController = require('../controllers/reset.controller')

router.post('/verification', resetController.reset)
router.get('/', resetController.check)
router.get('/new', resetController.newPassword)

module.exports = router
