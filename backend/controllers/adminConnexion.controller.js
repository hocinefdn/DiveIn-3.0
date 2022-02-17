require('dotenv').config({ path: './config/.env' })

module.exports.connexionAdmin = (req, res, next) => {
    if (
        req.body.nomAdmin != process.env.NOM_ADMIN ||
        req.body.passwordAdmin != process.env.PASSWORD_ADMIN
    ) {
        res.json({ error: 'Identifiants admin incorrect' })
    } else {
        res.json({ message: 'Admin authentifié' })
    }
}
