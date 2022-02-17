const http = require('http')
require('dotenv').config({ path: './config/.env' })
const { Server } = require('socket.io')
const app = require('./app')
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
})
users1 = [] // id->socketid
users2 = [] // socketid -> id
users = new Set()
io.on('connection', (socket) => {
    var socketHandShake = socket.handshake.auth.id
    users1[socket.handshake.auth.id] = socket.id
    users2[socket.id] = socket.handshake.auth.id
    users.add(socket.handshake.auth.id)
    //console.log("id ", socket.id , socket.handshake.auth.id)
    socket.to(users1).emit('message recieved', { socketHandShake }) // "user-connected"

    socket.on('get-connected-user', (id) => {
        isConnected = users.has(id)
        var connection = 'connection'
        console.log('get co users', isConnected, id)

        socket.nsp

            .to(socket.id)
            .emit('message recieved', { isConnected, connection, id }) // 'connected-user'
    })
    socket.on('hello', (arg) => {
        console.log(arg) // world
    })
    socket.on('message deleted', (id_delete, reciever) => {
        socket.to(users1[reciever]).emit('message recieved', { id_delete }) //'delete message'
    })
    socket.on('message', (id, message, id_sender, id_reciever, date, image) => {
        const monMessage = 'message'
        socket.to(users1[id_reciever]).emit('message recieved', {
            id,
            message,
            id_sender,
            id_reciever,
            date,
            image,
            monMessage,
        })
    })

    socket.on(
        'group message',
        (id, message, id_user, group, date, image, currentGroupMembers) => {
            const groupMessage = 'message'
            currentGroupMembers.forEach((groupUser) => {
                if (groupUser.id_user != id_user) {
                    socket.to(users1[groupUser]).emit('message recieved', {
                        id,
                        message,
                        id_user,
                        group,
                        date,
                        image,
                        groupMessage,
                    })
                }
            })
        }
    )

    socket.on('call', (id_sender, id_reciever, video) => {
        // console.log('call', users1[id_reciever])
        const thisIsVideoCall = 'videocall'
        console.log('call')
        socket
            .to(users1[id_reciever])
            .emit('message recieved', {
                id_sender,
                id_reciever,
                video,
                thisIsVideoCall,
            })
    })

    socket.on('groupCall', (id_sender, id_group, roomId, groupMembers) => {
        // console.log('call', users1[id_reciever])
        const videoGroup = 'appelvideoGroup'
        console.log(groupMembers)
        if (groupMembers)
            groupMembers.forEach((groupMember) => {
                if (groupMember != id_sender && users1[groupMember])
                    socket.to(users1[groupMember]).emit('message recieved', {
                        id_sender,
                        id_group,
                        roomId,
                        videoGroup,
                    })
            })
    })

    socket.on('reaction changed', (id, id_msg, reaction) => {
        socket.to(users1[id]).emit('message recieved', { id_msg, reaction })
    })

    socket.on(
        'group message deleted',
        (id_msg_grp, id_user, group, members) => {
            if (members)
                members.forEach((member) => {
                    if (member != id_user)
                        socket
                            .to(users1[member])
                            .emit('message recieved', { id_msg_grp, group })
                })
        }
    )
    socket.on(
        'group message changed',
        (id, id_user, group, members, oldReaction, myReaction) => {
            console.log(id, id_user, group, members, oldReaction, myReaction)
            if (members)
                members.forEach((member) => {
                    if (member != id_user && users1[member])
                        socket.to(users1[member]).emit('message recieved', {
                            id,
                            group,
                            oldReaction,
                            myReaction,
                        })
                })
        }
    )

    socket.on('disconnect', () => {
        var disconnected = 'disconnect'
        var disconectedUser = users2[socket.id]
        socket
            .to(users1)
            .emit('message recieved', { disconectedUser, disconnected }) //"user-disconected"
        delete users1[users2[socket.id]]
        users.delete(users2[socket.id])

        delete users2[socket.id]
    })

    socket.on('call stopped', (reciever) => {
        const callStopped = 'call stopped'
        socket.to(users1[reciever]).emit('message recieved', { callStopped })
    })

    socket.on('join-room', (roomId, userId) => {
        const userConnectedToGroupCall = 'connected to group call'
        socket.join(roomId)
        console.log(roomId)
        socket
            .to(roomId)
            .emit('message recieved', { userId, userConnectedToGroupCall })

        socket.on('disconnect', () => {
            socket.to(roomId).emit('message recieved', userId)
        })
    })
    socket.on('join-room-video', (myId, otherId) => {
        const userConnectedToCall = 'new user to call'
        socket
            .to(users1[otherId])
            .emit('message recieved', { myId, userConnectedToCall })

        socket.on('disconnect', () => {
            const userDisconnectedGroup = 'disconected to group'
            console.log('disco')
            socket
                .to(users1[otherId])
                .emit('message recieved', { myId, userDisconnectedGroup })
        })
    })
    socket.on('user-disconnected-group', (myId, room) => {
        const userDisconnectedGroup = 'disconected to group'

        socket
            .to(room)
            .emit('message recieved', { myId, userDisconnectedGroup })
    })

    // ... fil d'actualite
    socket.on('post liked', (user, post) => {
        console.log('liked')
        const postLiked = 'post Liked'
        socket
            .to(users1[post.id_user])
            .emit('message recieved', { user, post, postLiked })
    })

    socket.on('post unliked', (user, post) => {
        console.log('unliked')

        const postUnliked = 'post Unliked'
        socket
            .to(users1[post.id_user])
            .emit('message recieved', { user, post, postUnliked })
    })

    //comments

    socket.on('post commented', (user, post,id_comment) => {
        console.log('commented')
        const postCommented = 'post commented'
        socket
            .to(users1[post.id_user])
            .emit('message recieved', { user, post, postCommented,id_comment })
    })
    
    socket.on('post modified', (user, post) => {
        console.log('modified')
        const postModified = 'post modified'
        socket
            .to(users1[post.id_user])
            .emit('message recieved', { user, post, postModified })
    })

    socket.on('post uncommented', (user, post,id_comment) => {
        console.log('uncommented')
        const postUncommented = 'post uncommented'
        socket
            .to(users1[post.id_user])
            .emit('message recieved', { user, post, postUncommented ,id_comment})
    })

    //posts

    
    socket.on('new post', (user, post,followers) => {
        console.log('new post')
        const newPost = 'new Post'
        followers.forEach(follower=>{
            socket
                .to(users1[follower])
                .emit('message recieved', { user, post, newPost })
        })
      
    })
})

server.listen(process.env.PORT || 5000, () => {
    console.log(`Listening on port ${process.env.PORT || 5000}`)
})
