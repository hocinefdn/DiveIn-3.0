const pool = require('../database/db')
let diveInDB = {}
//--------------------------------------- recuperer les contacts ------------------------------------------
diveInDB.getContact = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

diveInDB.getUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT DISTINCT firstname,lastname,id,email,COALESCE(count(follower_id),0) as nbr FROM users,follows WHERE follows.followed_id = users.id GROUP BY users.id',
            (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            }
        )
    })
}

diveInDB.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users', (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//----------------------------------------  inserer un user --------------------------------------------
diveInDB.insererUser = (
    email,
    nom,
    prenom,
    date_naissance,
    sexe,
    password,
    date
) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO users (email,firstname,lastname,birthday,gender,password,date) VALUES ('${email}','${nom}','${prenom}','${date_naissance}','${sexe}','${password}','${date}');SELECT LAST_INSERT_ID() as id;`,
            function (err, results) {
                if (err) return reject(err)
                console.log('error :', err)
                return resolve(results)
            }
        )
    })
}

//------------------------------------  recuperer un user ----------------------------------
diveInDB.getUserEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT * FROM users WHERE email= '${email}'`,
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}

diveInDB.isFreeEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT count(*)as nbr from users WHERE users.email=?`,
            [email],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}

diveInDB.getUserId = (id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            'SELECT *, COALESCE(count(follows.follower_id),0)as follower FROM (SELECT *, COALESCE(count(follows.followed_id),0) as followed FROM users left join follows on follows.followed_id = users.id where users.id= ? group by users.id) as R2 left JOIN follows on follows.follower_id = id AND follows.follower_id = ? ',
            [id, id],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}
diveInDB.follow = (follower_id, followed_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `INSERT INTO follows VALUES(?,?)`,
            [follower_id, followed_id],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}
diveInDB.unfollow = (follower_id, followed_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?;`,
            [follower_id, followed_id],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}

diveInDB.getFollow = (follower_id, followed_id) => {
    return new Promise((resolve, reject) => {
        pool.query(
            `SELECT count(*) as nbr FROM follows WHERE follower_id = ? AND followed_id = ?;`,
            [follower_id, followed_id],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}

// // verifie si utilisateur est abonnee par une autre personne dans followeds
// diveInDB.isFollowed = (followed_id, follower_id) => {
//     return new Promise((resolve, reject) => {
//         pool.query(
//             `SELECT count(*) as nbr FROM follows WHERE followed_id = ? AND follower_id = ?;`,
//             [followed_id, follower_id],
//             (err, results) => {
//                 if (err) {
//                     return reject(err)
//                 }

//                 return resolve(results)
//             }
//         )
//     })
// }

diveInDB.updateUser = (token, resetTokenExperation, email) => {
    pool.query(
        `UPDATE users SET reset_token = '${token}', reset_at = '${resetTokenExperation}' WHERE email= '${email}'`,
        function (err) {
            if (err) throw err
            console.log('error :', err)
        }
    )
}

diveInDB.verifyUser = (id) => {
    pool.query(
        `UPDATE users SET token = NULL WHERE id= '${id}'`,
        function (err) {
            if (err) throw err
            console.log('error :', err)
        }
    )
}

diveInDB.updateUserImage = (id, image) => {
    const query = 'UPDATE users SET image= ? WHERE id=?'
    return new Promise((resolve, reject) => {
        console.log(query)
        pool.query(query, [image, id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

diveInDB.updateUserCouv = (id, image) => {
    const query = 'UPDATE users SET image_couverture= ? WHERE id=?'
    return new Promise((resolve, reject) => {
        console.log(query)
        pool.query(query, [image, id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

diveInDB.sendContact = (object, message, id_user) => {
    const query =
        'INSERT INTO `contacts`( `object`, `message`, `id_user`) VALUES (?,?,?)'
    return new Promise((resolve, reject) => {
        console.log(query)
        pool.query(query, [object, message, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//bloquer un contact
diveInDB.bloquer = (id_sender, id_reciever) => {
    query = ' INSERT INTO blocked_users(id_user, id_blocked) VALUES (?,?); '

    return new Promise((resolve, reject) => {
        pool.query(query, [id_sender, id_reciever], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//debloquer un contact
diveInDB.debloquer = (id_sender, id_reciever) => {
    query = ' DELETE FROM blocked_users WHERE id_user = ? AND id_blocked = ?; '

    return new Promise((resolve, reject) => {
        pool.query(query, [id_sender, id_reciever], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//debloquer un contact
diveInDB.getBloque = (id_user) => {
    query =
        ' SELECT users.id,users.firstname,users.lastname,users.image FROM  blocked_users, users WHERE blocked_users.id_blocked = users.id AND blocked_users.id_user = ?'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// recuperer les abonnements
diveInDB.getFollowers = (id_user) => {
    query =
        'select users.firstname, users.lastname, users.image ,users.id, users.biographie from users, follows where followed_id = ? AND users.id = follows.follower_id'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// recuperer les followed abonnements
diveInDB.getFollowed = (id_user) => {
    query =
        'select users.firstname, users.lastname, users.image ,users.id, users.biographie FROM users, follows where follower_id = ? AND users.id = follows.followed_id'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

module.exports = diveInDB
