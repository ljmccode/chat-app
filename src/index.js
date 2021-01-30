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

io.on('connection', () => {
    console.log('New WebSocket connection')
})

server.listen(port, () => {
    console.log(`Now listening on port ${port}`)
}) 