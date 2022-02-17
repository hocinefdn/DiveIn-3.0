const pool = require('../database/db')
var moment = require('moment')
let DiveInDB = {}

DiveInDB.getFollowedUsers = (id) => {
    //followed and following
    const query =
        ' SELECT DISTINCT users.id , users.email, users.firstname, users.lastname, users.image FROM users, follows WHERE ((users.id = follows.followed_id AND follower_id = ?)OR(users.id = follows.follower_id AND followed_id = ?)) AND users.id NOT IN (SELECT id_blocked as id FROM blocked_users WHERE id_user = ? UNION SELECT id_user as id FROM blocked_users WHERE id_blocked = ?) ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id, id, id, id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getFollowerUsers = (id) => {
    const query =
        ' SELECT DISTINCT users.id , users.email, users.firstname, users.lastname, users.image FROM users, follows WHERE users.id = follows.follower_id AND followed_id = ?;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            var array = []
            if (results) results.forEach((user) => array.push(user.id))

            return resolve(array)
        })
    })
}

DiveInDB.getMessages = (id_sender, id_reciever) => {
    const query =
        ' SELECT *  FROM messages WHERE (id_sender = ? AND id_reciever = ?) OR (id_sender = ? AND id_reciever = ?) ORDER BY date;'

    return new Promise((resolve, reject) => {
        pool.query(
            query,
            [id_sender, id_reciever, id_reciever, id_sender],
            (err, results) => {
                if (err) {
                    return reject(err)
                }
                // console.log(moment(results[0]))
                return resolve(results)
            }
        )
    })
}

DiveInDB.addMessage = (id_sender, id_reciever, message, image, isImage) => {
    var query
    var attribut
    if (isImage) {
        attribut = image
        query =
            ' INSERT INTO messages(id_sender, id_reciever , image) VALUES (?,?,?);SELECT LAST_INSERT_ID() as id; '
    } else {
        attribut = message
        query =
            ' INSERT INTO messages(id_sender, id_reciever , message) VALUES (?,?,?); SELECT LAST_INSERT_ID() as id;'
    }
    return new Promise((resolve, reject) => {
        pool.query(
            query,
            [id_sender, id_reciever, attribut],
            (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results)
            }
        )
    })
}

DiveInDB.deleteMessage = (id, image) => {
    const query = ' DELETE FROM messages WHERE id= ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.leaveGroup = (id_user, id_group) => {
    const query =
        ' DELETE FROM groupusers WHERE id_user= ? AND groupusers.group = ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, id_group], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
DiveInDB.deleteMessages = (id_sender, id_reciever) => {
    const query =
        ' DELETE FROM messages WHERE id_sender = ? AND id_reciever = ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_sender, id_reciever], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getMessageImage = (id_sender, id_reciever, date) => {
    const query =
        ' SELECT image FROM messages WHERE id_sender = ? AND id_reciever = ? AND date = ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id_sender, id_reciever, date], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results[0].image)
        })
    })
}

DiveInDB.changeReaction = (id, reaction, isSender) => {
    if (isSender) {
        query = 'UPDATE messages SET react_sender=? WHERE id = ? ;'
    } else {
        query = 'UPDATE messages SET react_reciever=? WHERE id = ? ;'
    }
    return new Promise((resolve, reject) => {
        pool.query(query, [reaction, id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.setSeenMessages = (id_sender, id_reciever) => {
    const query =
        'UPDATE messages SET state=true WHERE id_sender = ? AND id_reciever = ?;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_sender, id_reciever], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getNotSeenMessages = (id_sender, id_reciever) => {
    if (id_reciever) {
        const query =
            'SELECT count(*) as nbr FROM messages WHERE id_sender = ? AND id_reciever = ? AND state=false; '
        return new Promise((resolve, reject) => {
            pool.query(query, [id_sender, id_reciever], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results[0])
            })
        })
    } else {
        const query =
            'SELECT count(*) as nbr FROM messages WHERE id_reciever = ? AND state=false; '
        return new Promise((resolve, reject) => {
            pool.query(query, [id_reciever], (err, results) => {
                if (err) {
                    return reject(err)
                }
                return resolve(results[0])
            })
        })
    }
}
DiveInDB.addUserToGroup = (id_group, id_user) => {
    const query = 'INSERT INTO `groupusers`(`group`, `id_user`) VALUES (?,?);'
    return new Promise((resolve, reject) => {
        pool.query(query, [id_group, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }

            return resolve(results)
        })
    })
}
DiveInDB.createGroup = (id, groupName, groupMembers) => {
    const query =
        'INSERT INTO `groups`( `id_user`, `name`) VALUES (?,?); SELECT LAST_INSERT_ID() as id;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id, groupName], (err, results) => {
            if (err) {
                return reject(err)
            }
            groupMembers.forEach((groupMember) => {
                DiveInDB.addUserToGroup(results[1][0].id, groupMember)
            })

            return resolve(results)
        })
    })
}

DiveInDB.getGroups = (id) => {
    const query =
        'SELECT groups.id, groups.name, groups.id_user FROM groupusers, groups WHERE groups.id = groupusers.group AND groupusers.id_user=? GROUP BY groupusers.group;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getGroupMessages = (group) => {
    const query =
        'SELECT groupmessages.id,groupmessages.id_user,groupmessages.group, groupmessages.date,groupmessages.message,users.lastname,users.firstname,groupmessages.image, users.image as userImage FROM groupmessages, users WHERE users.id = groupmessages.id_user AND groupmessages.group = ? ORDER BY date;'
    return new Promise((resolve, reject) => {
        pool.query(query, [group], (err, results) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            return resolve(results)
        })
    })
}
DiveInDB.getGroupMembers = (group) => {
    const query = 'SELECT id_user FROM groupusers WHERE groupusers.group = ?;'
    return new Promise((resolve, reject) => {
        pool.query(query, [group], (err, results) => {
            if (err) {
                return reject(err)
            }
            var array = []
            if (results) results.forEach((member) => array.push(member.id_user))

            return resolve(array)
        })
    })
}

DiveInDB.sendGroupMessage = (id_user, group, message, date, image, isImage) => {
    var query
    var attribut
    if (isImage) {
        attribut = image
        query =
            ' INSERT INTO groupmessages (id_user, groupmessages.group  , image) VALUES (?,?,?); SELECT LAST_INSERT_ID() as id;'
    } else {
        attribut = message
        query =
            ' INSERT INTO groupmessages (id_user, groupmessages.group , message) VALUES (?,?,?); SELECT LAST_INSERT_ID() as id; '
    }
    console.log(query)
    return new Promise((resolve, reject) => {
        pool.query(query, [id_user, group, attribut], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

//bloquer un contact
DiveInDB.bloquer = (id_sender, id_reciever) => {
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
DiveInDB.debloquer = (id_sender, id_reciever) => {
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
DiveInDB.getBloque = (id_user) => {
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

DiveInDB.getGroupMessageReactions = (id, id_user) => {
    query =
        'SELECT count(*)as nbr FROM groupmessagesreact WHERE  id_groupmessage=  ? AND reaction = 1;SELECT count(*)as nbr FROM groupmessagesreact WHERE  id_groupmessage=  ? AND reaction = 2  ; SELECT reaction FROM groupmessagesreact WHERE  id_groupmessage=  ? AND id_user = ?;'
    return new Promise((resolve, reject) => {
        pool.query(query, [id, id, id, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            var nbr1 = results[0][0].nbr
            var nbr2 = results[1][0].nbr
            var nbr3 = 0
            if (results[2][0]) {
                nbr3 = results[2][0].reaction
            }
            return resolve([nbr1, nbr2, nbr3])
        })
    })
}

DiveInDB.addGroupMessageReaction = (id, id_user, reaction) => {
    query =
        'INSERT INTO `groupmessagesreact`(`id_groupmessage`, `id_user`, `reaction`) VALUES (?,?,?);'
    return new Promise((resolve, reject) => {
        pool.query(query, [id, id_user, reaction], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.changeGroupMessageReaction = (id, id_user, reaction) => {
    query =
        'UPDATE `groupmessagesreact` SET `reaction`=? WHERE `id_groupmessage`=? AND `id_user`=?; '
    return new Promise((resolve, reject) => {
        pool.query(query, [reaction, id, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
DiveInDB.deleteGroupMessageReaction = (id, id_user) => {
    query =
        'DELETE FROM `groupmessagesreact` WHERE `id_groupmessage`=? AND `id_user`=?; '
    return new Promise((resolve, reject) => {
        pool.query(query, [id, id_user], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.deleteGroupMessage = (id) => {
    const query = ' DELETE FROM groupmessages WHERE id= ? ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}

DiveInDB.getNotificationsMessages = (id) => {
    const query =
        ' SELECT count(*) as nbr FROM messages WHERE id_reciever = ? AND state = 0 ;'

    return new Promise((resolve, reject) => {
        pool.query(query, [id], (err, results) => {
            if (err) {
                return reject(err)
            }
            return resolve(results)
        })
    })
}
module.exports = DiveInDB
