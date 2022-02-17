const db = require('../models/db.user')
const crypto = require('crypto')
exports.check = (req, res) => {
    return res.send(
        `
        <div style="width:50%;margin:8rem auto;background:#90caf9;color:#fff;padding:5rem">
            <h1 style="text-align:center">Vérification</h1>
            <form action="/mot-de-passe-oblie/verification" method="POST" style="width:80%;margin:2rem auto">
                <input type="email" name="email" required=true placeholder="Entrez votre email ..." style="width:100%;padding:10px 30px">
                <br>
                <button type="submit" style="width:100%;padding:15px;text-align:center;margin:10px 0;background:#ff4081;">Valider</button>
            </form>
        </div>    
    `
    )
}
module.exports.reset = async (req, res, next) => {
    let mail = req.body.email
    console.log(mail)
    db.getUserEmail().then(() => {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err)
                return res.redirect('/reset')
            }
            //créer le token
            const token = buffer.toString('hex')
            const resetTokenExperation = Date.now() + 3600000
            db.updateUser(token, resetTokenExperation, mail)
            return res.send(`<div style="margin:50 auto;width:60%">
                                <h1>Réinitialisation Mot de passe</h1>
                                <p>Click <a href="/mot-de-passe-oblie/new">ici</a> pour réinitialiser votre mode passe</p>
                            </div>`)
        })
    })
}

module.exports.newPassword = (req, res, next) => {
    return res.send(`
    <div style="width:50%;margin:8rem auto;background:#90caf9;color:#fff;padding:5rem">
        <h1 style="text-align:center">Nouveau mot de pasee</h1>
        <form action="/mot-de-passe-oblie/verification" method="POST" style="width:80%;margin:2rem auto">
            <input type="password" name="newpass" required=true placeholder="Entrez nouveau password ..." style="width:100%;padding:10px 30px">
            <input type="password" name="newpass" required=true placeholder="Confirmez nouveau password ..." style="width:100%;padding:10px 30px;margin:10px 0 0;">
            <button type="submit" style="width:100%;padding:15px;text-align:center;margin:10px 0;background:#ff4081;">Valider</button>
        </form>
    </div>    
`)
}
