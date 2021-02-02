const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } =require('./utils/message')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
// create server outside of express library so we have access to raw http server
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {

    socket.on('join', (userFields, callback) => {
        const { error, user } = addUser({ id: socket.id, ...userFields })

        if (error) {
            return callback(error)
        }
        socket.join(user.room)
 
        socket.emit('message', generateMessage('Welcome!'))
    
        // sends to everybody but this particular socket
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the chat`))

        callback()
    })
     
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        // emit the event to appropriate room
        io.to('Hungry').emit('message', generateMessage(message))
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.lat},${coords.long}`))
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left the room`))
        }
    })
})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`)
}) 