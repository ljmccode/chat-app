const socket = io()

socket.on('welcome', (welcomeMessage) => {
    console.log(welcomeMessage)
})

socket.on('message', (message) => {
    console.log(`${message}`)
})

document.querySelector('#send').addEventListener('click', (e) => {
    e.preventDefault()
    const message = document.getElementById('message').value
    socket.emit('sendMessage', message, (message) => {
        console.log('The message was delivered', message)
    })
})

document.querySelector('#send-location').addEventListener('click', () => {
    // if browser doesn't support geolocation
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        })
    })
})