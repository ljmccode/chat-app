const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')

const app = express()
// create server outside of express library so we have access to raw http server
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.json())
app.use(express.static(publicDirectoryPath))

io.on('connection', async (socket) => {
    // emits event to that specific connection
    await socket.emit('welcome', 'Welcome!')
    // sends to everybody but this particular socket
    socket.broadcast.emit('message', 'A new user has joined')
    socket.on('sendMessage', (message) => {
        // emit the event to every single connection available
        io.emit('message', message)
    })

    socket.on('sendLocation', (coords) => {
        io.emit('message', `https://google.com/maps?q=${coords.lat},${coords.long}`)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left!')
    })
})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`)
}) 