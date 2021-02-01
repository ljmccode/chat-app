const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage } =require('./utils/message')

const app = express()
// create server outside of express library so we have access to raw http server
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    socket.emit('message', generateMessage('Welcome!'))
    
    // sends to everybody but this particular socket
    socket.broadcast.emit('message', generateMessage('A new user has joined'))
     
    socket.on('sendMessage', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed')
        }
        // emit the event to every single connection available
        io.emit('message', generateMessage(message))
        // can send data back
        callback()
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', `https://google.com/maps?q=${coords.lat},${coords.long}`)
        callback()
    })

    socket.on('disconnect', () => {
        io.emit('message', generateMessage('A user has left!'))
    })
})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`)
}) 