const { query } = require('express')
const { resolve } = require('path-posix')
const pool = require('../database/db')
const { post } = require('../routes/actualite.routes')

let DiveInDB = {}

// --------------------------  CRUD POST -----------------------------------
DiveInDB.addPost = (content, id_user, id_post, type_post, images) => {
    const query =
        'INSERT INTO posts( `content`, `id_user`, `id_post`, `type_post`) VALUES (?,?,?,?); SELECT LAST_INSERT_ID() as id;'

    return new Promise((resolve, reject) => {
        pool.query(
            query,
            [content, id_user, id_post, type_post],
            (err, results) => {
                if (err) {
                    return reject(err)
                }
                if (images != null)
                    images.forEach((image) => {
                        DiveInDB.addImage(results[1][0].id, image)
                    })
                return resolve(results)
            }
        )
    })
}
DiveInDB.addImage = (id_post, image) => {
    const query = ' INSERT INTO multimedia VALUES (?,?);'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_post, image], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// DiveInDB.updatePost = (content, type_post, id, images) => {
//     const query =
//         ' UPDATE `posts` SET `content`= ? ,`date`= current_timestamp() ,`type_post`= ? WHERE id = ?; '

//     return new Promise((resolve, reject) => {
//         pool.query(query, [content, type_post, id], (err, results) => {
//             if (err) {
//                 return reject(err)
//             }
//             console.log(results)
//             DiveInDB.deleteImages(id)
//             if (images != null)
//                 images.forEach((image) => {
//                     DiveInDB.addImage(id, image)
//                 })
//             return resolve(results)
//         })
//     })
// }

DiveInDB.deletePost = (id) => {
    const query = 'DELETE FROM `posts` WHERE id = ? ; '

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.deleteImages = (id) => {
    const query = ' DELETE FROM multimedia WHERE id_post = ?'
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getImagesPost = (id) => {
    const query = 'SELECT url FROM multimedia WHERE id_post = ?'

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

/*------ envoyer la requete a la bdd pour recuperer
  Nom, prenom, id_post, contenu, id user, date post, type post, calculer nbr des like et nbr commentaire
  parametre func id c est id d user 
  */
// 'SELECT users.firstname, users.lastname, users.image  , posts.id, posts.content, posts.id_user, posts.date, posts.type_post, multimedia.url as image_post, count( likes.id_user) as nbrLikes  FROM users, follows, posts  LEFT JOIN likes ON likes.id_post=posts.id LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id AND follower_id = ? GROUP BY posts.id  ORDER BY posts.date desc;'
//OLD req  ' SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date, posts.type_post, multimedia.url as image_post, count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, follows, posts LEFT JOIN likes ON likes.id_post=posts.id LEFT JOIN comments on comments.id_post = posts.id LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id AND follower_id = ? GROUP BY posts.id ORDER BY posts.date desc;'

DiveInDB.getFollowedPosts = (id_user) => {
    const query =
        'SELECT * FROM (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post, multimedia.url as image_post,  count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, follows, posts  LEFT JOIN likes ON likes.id_post=posts.id  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id   WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id AND follower_id = ? GROUP BY posts.id ORDER BY posts.date desc ) as R1  LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent,  posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, follows, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id GROUP BY posts.id ORDER BY posts.date desc )as R2 on R1.id_post = R2.RTid'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

// recuperer les notifications likes si user ne les as pas encore vu !
DiveInDB.getNotificationsLikes = (id_user) => {
    const query =
        'SELECT users.id as id_user , users.firstname, users.lastname, users.image, posts.id, posts.content, likes.date FROM likes, posts,users WHERE likes.id_user NOT IN (?) AND likes.id_post = posts.id AND posts.id_user IN (?) AND likes.id_user = users.id AND likes.seen = 0 ORDER BY likes.date desc;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

DiveInDB.getNotificationsPosts = (id_user) => {
    const query =
        'SELECT users.id as id_user , users.firstname, users.lastname, users.image, posts.id, posts.content, posts.date FROM notifications_posts, posts,users WHERE notifications_posts.id_post = posts.id AND notifications_posts.id_user = users.id AND notifications_posts.id_user = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

DiveInDB.getNotificationsComments = (id_user) => {
    const query =
        'SELECT users.id as id_user , users.firstname, users.lastname, users.image, posts.id, posts.content, comments.date FROM comments, posts,users WHERE comments.id_user NOT IN (?) AND comments.id_post = posts.id AND posts.id_user IN (?) AND comments.id_user = users.id AND comments.seen = 0 ORDER BY comments.date desc;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// nbr des notifications
/*
'SELECT count(*) AS nbrLikes FROM likes,posts WHERE likes.id_post = posts.id AND posts.id_user=?  AND likes.seen = 0 ;' +
        'SELECT count(*) AS nbrComments FROM comments,posts WHERE comments.id_post = posts.id AND posts.id_user=?  AND comments.seen = 0 ;' +
        'SELECT count(*) AS nbrPosts FROM notifications_posts WHERE notifications_posts.id_user=?;'
*/
DiveInDB.getNbrNotifications = (id_user) => {
    const query =
        'SELECT count(*) AS nbrLikes FROM likes,posts,users WHERE likes.id_user NOT IN (?) AND likes.id_post = posts.id AND posts.id_user=? AND likes.id_user = users.id AND likes.seen = 0 ;' +
        'SELECT count(*) AS nbrComments FROM comments,posts,users WHERE comments.id_user NOT IN (?) AND comments.id_post = posts.id AND posts.id_user= ? AND comments.id_user = users.id AND comments.seen = 0 ;'
        + 'SELECT count(*) AS nbrPosts FROM notifications_posts WHERE notifications_posts.id_user=?;'

    return new Promise((resolve, reject) => {
        pool.query(
            query,
            [id_user, id_user, id_user, id_user, id_user],
            (err, results) => {
                if (err) {
                    return reject(err)
                }

                return resolve(results)
            }
        )
    })
}

// seen notifiactions
// UPDATE comments SET seen="1"  WHERE id_user= ?;
DiveInDB.SeenNotifications = (id_user) => {
    const query =
        'UPDATE likes INNER JOIN posts ON posts.id = likes.id_post AND posts.id_user = ? SET seen="1" WHERE DATE(likes.date) != curdate() ; UPDATE comments INNER JOIN posts ON posts.id = comments.id_post AND posts.id_user = ? SET seen="1" WHERE DATE(comments.date) != curdate()'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

DiveInDB.setLikeSeen = (id_post,id_user) => {
    const query =
        'UPDATE likes SET seen=1 WHERE id_post = ? AND id_user = ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_post, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

DiveInDB.setCommentSeen = (id_comment) => {
    const query =
        'UPDATE comments SET seen=1 WHERE id = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_comment], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

DiveInDB.setPostSeen = (id_user , id_post) => {
    const query =
        'DELETE FROM notifications_posts WHERE id_user = ? AND id_post = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user,id_post], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

// DiveInDB.getAllPosts = () => {
//     const query = ' SELECT * FROM posts'

//     return new Promise((resolve, reject) => {
//         pool.query(query, (err, results) => {
//             if (err) {
//                 return reject(err)
//             }

//             return resolve(results)
//         })
//     })
// }

// new posts
DiveInDB.getNewPosts = (id_user) => {
    const query =
        'SELECT * FROM (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post, multimedia.url as image_post,  count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, follows, posts  LEFT JOIN likes ON likes.id_post=posts.id  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id   WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id AND follower_id = ? GROUP BY posts.id ORDER BY posts.date desc LIMIT 3) as R1  LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent,  posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, follows, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id GROUP BY posts.id ORDER BY posts.date desc )as R2 on R1.id_post = R2.RTid'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

// ------------------- recuperer le post ajouter d user ----------------------
DiveInDB.getMyPost = (id_user) => {
    const query =
        'SELECT posts.id, posts.content, posts.id_user, posts.type_post, multimedia.url AS image_post FROM posts LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id_user=?  ORDER BY posts.date DESC LIMIT 1;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
/*
' SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date, posts.type_post,
 multimedia.url as image_post, count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires 
 FROM users, follows, posts
  LEFT JOIN likes ON likes.id_post=posts.id 
  LEFT JOIN comments on comments.id_post = posts.id 
  LEFT JOIN multimedia ON multimedia.id_post = posts.id 
  WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id AND follower_id = ? 
  GROUP BY posts.id ORDER BY posts.date desc;'

*/
// ---------------------- recuperer tous les posts publier d l'utilisateur pour le profil  ---------------------------------------
DiveInDB.getMesPosts = (id_user) => {
    const query =
        'SELECT users.image, users.lastname,users.firstname, posts.id, posts.content, posts.id_user, posts.type_post,posts.date, count(distinct likes.id_user) as nbrLikes, count(distinct comments.id) AS nbrCommentaires, multimedia.url AS image_post FROM users, posts LEFT JOIN likes ON likes.id_post=posts.id LEFT JOIN comments on comments.id_post = posts.id LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id_user= ? AND posts.id_user= users.id AND posts.id_post IS NULL GROUP BY posts.id ORDER BY posts.date DESC ;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ---------------------- recuperer tous les posts ou user a rediver  pour le profil  ---------------------------------------
DiveInDB.getRedivePosts = (id_user) => {
    const query =
        'SELECT * FROM (SELECT users.image, users.lastname,users.firstname, posts.id, posts.content, posts.id_user, posts.id_post, posts.date, count(distinct likes.id_user) as nbrLikes, count(distinct comments.id) AS nbrCommentaires, multimedia.url AS image_post FROM users, posts LEFT JOIN likes ON likes.id_post=posts.id LEFT JOIN comments on comments.id_post = posts.id LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id_user= ? AND posts.id_post IS NOT NULL AND posts.id_user= users.id  GROUP BY posts.id ORDER BY posts.date DESC) as R1 LEFT JOIN  (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent, posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, follows, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user  GROUP BY posts.id ORDER BY posts.date desc )as R2  on R1.id_post = R2.RTid'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------- recuperer images post  ----------------------
DiveInDB.getImagesPost = (id_user) => {
    const query =
        'SELECT  posts.id, posts.id_user, multimedia.url AS image_post FROM users, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id_user= ? AND posts.id_user= users.id AND multimedia.url IS NOT NULL GROUP BY posts.id ORDER BY posts.date DESC ;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// recuperer les likes post user ---------------------------
//' SELECT likes.id_post as like_id_post, users.lastname, users.firstname,users.image, posts.id, posts.id_user, posts.date, posts.content, count(distinct likes.id_user) as nbrLikes, count(distinct comments.id) AS nbrCommentaires, multimedia.url AS image_post FROM users, posts LEFT JOIN likes ON likes.id_post=posts.id LEFT JOIN comments on comments.id_post = posts.id LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE likes.id_user = ? AND posts.id = likes.id_post AND users.id = posts.id_user GROUP BY posts.id ORDER BY likes.date DESC;'

DiveInDB.getLikesPost = (id_user) => {
    const query =
        // old'SELECT * FROM (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post, multimedia.url as image_post,  count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, follows, posts  LEFT JOIN likes ON likes.id_post=posts.id  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id  WHERE likes.id_user = ? AND posts.id = likes.id_post AND users.id = posts.id_user  GROUP BY posts.id ORDER BY likes.date DESC ) as R1  LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent, posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user  GROUP BY posts.id ORDER BY posts.date desc )as R2  on R1.id_post = R2.RTid'
        // old 'SELECT * FROM (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post, multimedia.url as image_post, count(distinct comments.id) AS nbrCommentaires FROM users, follows,likes, posts  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id  WHERE likes.id_user = ? AND posts.id = likes.id_post AND users.id = posts.id_user  GROUP BY posts.id ORDER BY likes.date DESC ) as R1  LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent, posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user  GROUP BY posts.id ORDER BY posts.date desc )as R2  on R1.id_post = R2.RTid'
        'SELECT * FROM  (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post,  multimedia.url as image_post,  count( distinct likes.id_user) as nbrLikes ,  count(distinct comments.id) AS nbrCommentaires FROM users, likes as L, posts  LEFT JOIN likes ON likes.id_post=posts.id  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id   WHERE users.id = posts.id_user AND L.id_user = ? AND L.id_post =posts.id GROUP BY posts.id ORDER BY posts.date desc ) as R1  LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent,  posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, follows, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user AND posts.id_user = follows.followed_id GROUP BY posts.id ORDER BY posts.date desc )as R2 on R1.id_post = R2.RTid'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

/*  -----------recuperer ---------------------------
   Nom , prenom , id user , id commentaire,  id user(comments), id post(comments) , contenu commentaire
*/
DiveInDB.getCommentairesPost = (id_post) => {
    const query =
        ' SELECT  users.lastname, users.firstname, users.id, users.image, comments.id, comments.id_user, comments.id_post, comments.content , comments.date  FROM users, comments WHERE comments.id_user=users.id AND id_post = ?  ORDER BY comments.date desc;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//------- ajouter un commentaire  id_user, id_post, et content
DiveInDB.addCommentaire = (id_user, id_post, content) => {
    const query =
        'INSERT INTO comments( id_user, id_post, content) VALUES (?,?,?);SELECT LAST_INSERT_ID() as id;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post, content], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------- recuperer le commentaire ajouter d user ----------------------
DiveInDB.getLastCommentaire = (id_post, id_user) => {
    const query =
        'SELECT  users.lastname, users.firstname, users.id, users.image, comments.id, comments.id_user, comments.id_post, comments.content , comments.date  FROM users, comments WHERE  comments.id_post = ? AND comments.id_user= ? AND comments.id_user = users.id ORDER BY comments.date desc LIMIT 1'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_post, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//--------------------- modifie un commentaire ------------------------------------
DiveInDB.updateCommentaire = (content, id, id_user, id_post) => {
    // date= current_timestamp()
    const query =
        'UPDATE comments SET content= ?  WHERE id = ? AND id_user= ? AND id_post= ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [content, id, id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// --------------------- supprimer un commentaire par id commentaire -----------------------------
DiveInDB.deleteCommentaire = (id) => {
    const query = ' DELETE FROM comments WHERE id=?;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------------  nombres de commentaires  ------------------------------
DiveInDB.nbrCommentaires = (id_post) => {
    const query =
        ' SELECT id_post, count(id_user) as nbrCommentaires FROM comments WHERE id_post = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// -------------------------------------- CRUD likes ------------------------------------------
DiveInDB.getLike = (id_user, id_post) => {
    const query = ' SELECT * FROM likes WHERE id_user = ? AND id_post = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//-----------------------------  nombre de likes ----------------------------------
DiveInDB.nbrLike = (id_post) => {
    const query =
        ' SELECT count(id_user) as nbrLikes FROM likes WHERE id_post = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.addLike = (id_user, id_post) => {
    const query = ' INSERT INTO likes( id_user, id_post) VALUES (?,?);'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.deleteLike = (id_user, id_post) => {
    const query = 'DELETE FROM likes WHERE id_user = ? AND id_post = ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//--------------------------------------------------- recommandations  a modifie le code &&&&& -------------------------------------------------------------

// DiveInDB.getRecommandations = (id_user) => {
//     const query =
//         'SELECT  users.id, users.email, users.phone_number, users.firstname, users.lastname, users.image FROM users,posts WHERE users.id = posts.id_user     AND (posts.id_user NOT IN (SELECT followed_id FROM follows WHERE follower_id = ? UNION SELECT ?) )  AND posts.type_post IN (SELECT * FROM  (SELECT type_post FROM posts WHERE posts.id IN (       SELECT * FROM     (SELECT posts.id FROM likes,posts WHERE likes.id_post = posts.id AND likes.id_user = ?  ORDER BY likes.date LIMIT 30) AS sq ) GROUP BY type_post ORDER BY count(type_post) LIMIT 2) AS sq2 ) GROUP BY users.id ORDER BY posts.date LIMIT 3'

//     return new Promise((resolve, reject) => {
//         pool.query(query, [id_user, id_user, id_user], (err, results) => {
//             if (err) {
//                 return reject(err)
//             }

//             const resolvedResults = DiveInDB.getUsersRandom(
//                 id_user,
//                 results.length
//             )

//             return resolve(resolvedResults)
//             // return [...resolve(results), ...resolvedResults]
//         })
//     })
// }

// DiveInDB.getUsersRandom = (id_user, len) => {
//     const query =
//         'SELECT id,lastname,firstname,image FROM users WHERE id NOT IN (?) AND (users.id NOT IN (SELECT followed_id FROM follows WHERE follower_id = ?)) ORDER BY RAND ( ) LIMIT ?;'
//     return new Promise((resolve, reject) => {
//         pool.query(query, [id_user, id_user, 3 - len], (err, results) => {
//             if (err) {
//                 return reject(err)
//             }
//             return resolve(results)
//         })
//     })
// }

DiveInDB.getRecommandations = (id_user) => {
    const query =
        'SELECT id,lastname,firstname,image FROM users WHERE id NOT IN  (?) AND (users.id NOT IN (SELECT followed_id FROM follows WHERE follower_id = ?)) ORDER BY RAND ( ) LIMIT 3;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//---------------------------------------------------- tendances  -----------------------------------------------------------------------
//  ' SELECT posts.id , MAX( SELECT count(likes.id_user) as nbrLikes FROM likes) FROM posts '
//  '((SELECT R1.id, (COALESCE(comments,0)+COALESCE(likes,0))as sum FROM (SELECT posts.id , count(likes.id_post) as likes FROM likes, posts WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1 LEFT JOIN(SELECT posts.id, count(comments.id) as comments FROM comments, posts WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id )UNION(  SELECT R2.id,(COALESCE(comments,0)+COALESCE(likes,0))as sum FROM (SELECT posts.id ,count(likes.id_post) as likes FROM likes, posts WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1 RIGHT JOIN(SELECT posts.id, count(comments.id) as comments FROM comments, posts WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id ) ) ORDER BY sum DESC LIMIT 3'
//OLD  'SELECT  posts.id, posts.id_user, users.lastname, users.firstname, users.image, nbrCommentaires, nbrLikes, posts.content, posts.date, multimedia.url as image_post FROM   (  ( (SELECT R1.id,R1.id_user,COALESCE(nbrCommentaires,0)as nbrCommentaires,COALESCE(nbrLikes,0)as nbrLikes,  (COALESCE(nbrCommentaires,0)+COALESCE(nbrLikes,0))as sum  FROM (SELECT posts.id,posts.id_user ,posts.date, count(likes.id_post) as nbrLikes FROM likes, posts  WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1  LEFT JOIN(SELECT posts.id, count(comments.id) as nbrCommentaires FROM comments, posts  WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id ) UNION ( SELECT R2.id,R2.id_user,COALESCE(nbrCommentaires,0)as nbrCommentaires,COALESCE(nbrLikes,0)as nbrLikes, (COALESCE(nbrCommentaires,0)+COALESCE(nbrLikes,0))as sum FROM (SELECT posts.id , count(likes.id_post) as nbrLikes  FROM likes, posts  WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1 RIGHT JOIN(SELECT posts.id,posts.id_user,posts.date, count(comments.id) as nbrCommentaires  FROM comments, posts WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id ) ) ORDER BY sum DESC LIMIT 3  ) as R3 ,users, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id = R3.id AND R3.id_user = users.id'

DiveInDB.getTendance = () => {
    const query =
        'SELECT * FROM  ( SELECT  posts.id, posts.id_user, users.lastname, users.firstname, users.image, nbrCommentaires, nbrLikes,  posts.content, posts.date,posts.id_post, multimedia.url as image_post ,sum FROM  (   (  (SELECT R1.id,R1.id_user,COALESCE(nbrCommentaires,0)as nbrCommentaires,COALESCE(nbrLikes,0)as nbrLikes,  (COALESCE(nbrCommentaires,0)+COALESCE(nbrLikes,0))as sum   FROM (SELECT posts.id,posts.id_user ,posts.date, count(likes.id_post) as nbrLikes FROM likes, posts  WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1   LEFT JOIN(SELECT posts.id, count(comments.id) as nbrCommentaires FROM comments, posts   WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id   )  UNION  ( SELECT R2.id,R2.id_user,COALESCE(nbrCommentaires,0)as nbrCommentaires,COALESCE(nbrLikes,0)as nbrLikes, (COALESCE(nbrCommentaires,0)+COALESCE(nbrLikes,0))as sum   FROM (SELECT posts.id , count(likes.id_post) as nbrLikes  FROM likes, posts   WHERE likes.id_post =  posts.id GROUP BY posts.id) as R1 RIGHT JOIN(SELECT posts.id,posts.id_user,posts.date, count(comments.id) as nbrCommentaires  FROM comments, posts  WHERE comments.id_post =  posts.id GROUP BY posts.id)as R2 ON R1.id =R2.id   )  ) ORDER BY sum DESC LIMIT 10  ) as R3 ,users, posts LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE posts.id = R3.id AND R3.id_user = users.id   ) as R4   LEFT JOIN   (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent, posts.id_user as RTid_user,  posts.date as RTdate, multimedia.url as RTimage_post FROM users, follows, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id   WHERE users.id = posts.id_user   GROUP BY posts.id ORDER BY posts.date desc   )as R5  on R4.id_post = R5.RTid  '
    return new Promise((resolve, reject) => {
        pool.query(query, (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}

// ------------------------ save post --------------------

DiveInDB.SavePost = (id_user, id_post) => {
    const query = 'INSERT INTO records( id_user, id_post) VALUES (?,?);'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------------ Unsave post --------------------

DiveInDB.UnSavePost = (id_user, id_post) => {
    const query = 'DELETE from  records where id_user = ? AND id_post = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------------ signaler post --------------------

DiveInDB.SignalerPost = (id_user, id_post) => {
    const query = 'INSERT INTO postreports( id_user, id_post) VALUES (?,?);'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// -------------------  mes enregistrements
//'SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date, posts.type_post, multimedia.url as image_post, count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users,posts ,records LEFT JOIN likes ON likes.id_post=records.id_post  LEFT JOIN comments on comments.id_post = records.id_post  LEFT JOIN multimedia ON multimedia.id_post = records.id_post WHERE records.id_post = posts.id AND posts.id_user = users.id AND records.id_user = ? GROUP BY records.id_post ORDER BY records.id_post desc;'

DiveInDB.MesEnregistrements = (id_user) => {
    const query =
        'SELECT * FROM  (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post,multimedia.url as image_post,  count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, posts,records  LEFT JOIN likes ON likes.id_post=records.id_post  LEFT JOIN comments on comments.id_post = records.id_post LEFT JOIN multimedia ON multimedia.id_post = records.id_post  WHERE records.id_post = posts.id AND posts.id_user = users.id AND records.id_user = ?  GROUP BY records.id_post ORDER BY records.id_post desc) as R1  LEFT JOIN  (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent, posts.id_user asRTid_user,  posts.date as RTdate,posts.id_post as RTid_post, posts.type_post as RTtype_post,  multimedia.url as RTimage_post FROM users, posts  LEFT JOIN multimedia ON multimedia.id_post = posts.id  WHERE users.id = posts.id_user  GROUP BY posts.id ORDER BY posts.date desc )as R2 on R1.id_post = R2.RTid'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// ------------------- recuperer le post ajouter d user ----------------------
DiveInDB.getPost = (id_post) => {
    const query =
        'SELECT * FROM (SELECT users.firstname, users.lastname, users.image , posts.id, posts.content, posts.id_user, posts.date,posts.id_post, multimedia.url as image_post, count( distinct likes.id_user) as nbrLikes , count(distinct comments.id) AS nbrCommentaires FROM users, follows, posts  LEFT JOIN likes ON likes.id_post=posts.id  LEFT JOIN comments on comments.id_post = posts.id  LEFT JOIN multimedia ON multimedia.id_post = posts.id  WHERE posts.id = ? AND posts.id_user = users.id   GROUP BY posts.id ORDER BY likes.date DESC ) as R1   LEFT JOIN (SELECT users.firstname as RTfirstname, users.lastname as RTlastname, users.image as RTimage , posts.id as RTid, posts.content as RTcontent,   posts.id_user as RTid_user, posts.date as RTdate, multimedia.url as RTimage_post FROM users, posts    LEFT JOIN multimedia ON multimedia.id_post = posts.id WHERE users.id = posts.id_user  GROUP BY posts.id ORDER BY posts.date desc )as R2  on R1.id_post = R2.RTid'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

// pour recuper les user qui on like un post ----
DiveInDB.getLikers = (id_post) => {
    const query =
        'SELECT users.id as id_user , users.firstname, users.lastname, users.image, likes.date FROM likes, posts,users WHERE likes.id_post = ? AND likes.id_user = users.id GROUP BY likes.id_user ORDER BY likes.date desc; '
    return new Promise((resolve, reject) => {
        pool.query(query, [id_post], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
/*
DiveInDB.addNotificationsPost = (id_user,id_post)=>{
 const query = 
    'SELECT follower_id FROM follows WHERE followed_id = ?;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            results.forEach(result =>{
                DiveInDB.addNotif(id_user,id_post)
            })
            console.log(resolve(results))
            return resolve(results)
        })
    })

}

DiveInDB.addNotif = ( id_user,id_post)=>{
    const query = 
        'INSERT INTO notifications_posts (id_post,id_user) VALUES (?,?);'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_post,id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
*/
module.exports = DiveInDB
