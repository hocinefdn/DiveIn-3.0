const db = require('../models/db.user')
const bcrypt = require('bcrypt')
const randtoken = require('rand-token')
var nodemailer = require('nodemailer')

// function verifyInformations(email, nom, prenom, date_naissance, sexe,password){
//   const validEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//   const validNameRegex = /^[A-Za-z]+$/;

//   try {
//     if(!nom.match(validNameRegex) || nom.length> 50 || nom == null)
//    return {isOk: false ,
//      message: "nom incorrect"}

//      if(!prenom.match(validNameRegex) || nom.length> 50 || prenom == null)
//        return {isOk: false ,
//           message: "prenom incorrect"}

//          if((new Date(date_naissance)).getTime() <= ( Date.now() - 13 * 365.25 * 24 * 3600 *1000)>date_naissance|| date_naissance == null )
//           return {isOk: false ,
//             message: "date de naissance incorrecte ou < 13 ans"}

//             if(sexe != "0" && sexe != "1")
//              return {isOk: false ,
//                message: "sexe incorrect"}

//                 if(!email.match(validEmailRegex)|| email.length> 256 || email == null)
//                    return {isOk: false ,
//                     message: "email incorrect"
//                         }

//                         if(!password.match()|| password.length> 10 || password == null)
//                            return {isOk: false ,
//                               message: "password incorrect"
//                                    }
//                //                       if (value !== req.body.password || !hashedPassword.match(validEmailRegex) ) {
//                //                          throw new Error('La confirmation du mot de passe ne correspond pas au mot de passe');
//                //                            }
//                                     return isOk ;

//   } catch (error) {
//     console.log(error)
//   }
// }
module.exports.inscription = async (req, res) => {
    const verifiedInformations = {
        email: req.body.email,
        nom: req.body.nom,
        prenom: req.body.prenom,
        date_naissance: req.body.date_naissance,
        sexe: req.body.sexe,
        password: req.body.password,
    }
    const validEmailRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    const validNameRegex = /^[A-Za-z]+$/
    const result = await db.isFreeEmail(req.body.email) // pour verifier si l'email n'existe pas deja dans la BDD

    var ver = {
        isOk: true,
    }
    if (
        !req.body.email ||
        !req.body.nom ||
        !req.body.prenom ||
        !req.body.date_naissance ||
        !req.body.password
    ) {
        return (ver = {
            isOk: false,
            message: 'un des champ obligatoires non renseigné',
        })
    }
    if (
        !verifiedInformations.nom.match(validNameRegex) ||
        verifiedInformations.nom.length > 50 ||
        verifiedInformations.nom == null
    )
        return (ver = { isOk: false, message: 'nom incorrect' })

    if (
        !verifiedInformations.prenom.match(validNameRegex) ||
        verifiedInformations.nom.length > 50 ||
        verifiedInformations.prenom == null
    )
        return (ver = { isOk: false, message: 'prenom incorrect' })

    if (
        new Date(verifiedInformations.date_naissance).getTime() <=
            Date.now() - 13 * 365.25 * 24 * 3600 * 1000 >
            verifiedInformations.date_naissance ||
        verifiedInformations.date_naissance == null
    )
        return (ver = {
            isOk: false,
            message: 'date de naissance incorrecte ou < 13 ans',
        })

    if (verifiedInformations.sexe != '0' && verifiedInformations.sexe != '1')
        return (ver = { isOk: false, message: 'sexe incorrect' })

    if (
        !verifiedInformations.email.match(validEmailRegex) ||
        verifiedInformations.email.length > 256 ||
        verifiedInformations.email == null ||
        result[0].nbr != 0
    )
        return (ver = { isOk: false, message: 'email incorrect' })

    if (
        !verifiedInformations.password.match() ||
        verifiedInformations.password.length > 10 ||
        verifiedInformations.password == null
    )
        return (ver = { isOk: false, message: 'password incorrect' })
    //                       if (value !== req.body.password || !hashedPassword.match(validEmailRegex) ) {
    //                          throw new Error('La confirmation du mot de passe ne correspond pas au mot de passe');
    //                            }

    if (ver.isOk == true) {
        try {
            token = randtoken.generate(20)
            const hashedpassword = await bcrypt.hash(req.body.password, 10)
            db.insererUser(
                req.body.email,
                req.body.nom,
                req.body.prenom,
                req.body.date_naissance,
                req.body.sexe,
                hashedpassword,
                req.body.date
                // token
            ).then(
                (
                    res
                ) => /* sendEmail(req.body.email,token,res[1][0].id,req) */ {}
            )

            res.status(200).json({
                message: 'Vous vous êtes inscrit avec succès',
            })
        } catch (err) {
            res.status(400).json({ message: '' + err })
        }
    }
}

module.exports.verifyEmail = (req, res) => {
    db.getUserToken(req.query.id)
        .then((response) => {
            if (response[0].token == req.query.token) {
                db.verifyUser(req.query.id)
                    .then(
                        (response) =>
                            res.status(200).json({ message: 'compte verifié' })
                        //res.location("localhost:3000/") si on veut rediriger ver la connection
                    )
                    .catch((error) =>
                        res.status(400).json({ error: '' + error })
                    )
            }
        })
        .catch((error) => res.status(400).json({ error: '' + error }))
}

function sendEmail(email, token, id, req) {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    })

    var mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Email de verification DiveIn',
        html:
            `<p>Pour verifier votre compte clickez sur ce lien <a href="${
                req.protocol
            }://${req.get('host')}/inscription/verifyEmail?id=` +
            id +
            '&token=' +
            token +
            '">Verifier</a></p>',
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error)
            return 1
        } else {
            return 0
        }
    })
}
