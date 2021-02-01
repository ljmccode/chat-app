const socket = io()

// Elements
// $ let's you know its an element from the DOM selected
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')

socket.on('welcome', (welcomeMessage) => {
    console.log(welcomeMessage)
})

socket.on('message', (message) => {
    console.log(`${message}`)
})

$messageFormButton.addEventListener('click', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = document.getElementById('message').value
    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }
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
        }, () => {
            console.log('Your location has been shared')
        })
    })
})