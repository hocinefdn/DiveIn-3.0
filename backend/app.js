const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const path = require('path')
// import routes
const actualiteRoutes = require('./routes/actualite.routes')
const messageRoute = require('./routes/messagerie.routes')
const inscriptionRoute = require('./routes/inscription.routes')
const connexionRoute = require('./routes/connexion.routes')
const userRoute = require('./routes/user.routes')
const adminRoute = require('./routes/admin.routes')

//import middleware
const auth = require('./middleware/auth')

const app = express()
app.use(cors())
app.use(express.json())
app.use(cookieParser())

// use body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'images')))

// routes
app.use('/user', userRoute)
app.use('/actualite', actualiteRoutes)
app.use('/messagerie', messageRoute)
app.use('/inscription', inscriptionRoute)
app.use('/connexion', connexionRoute)
app.use('/admin', adminRoute)
//exporter app et l'utiliser dans serveur.js
module.exports = app
