const socket = io()

// Elements
// $ lets you know its an element from the DOM selected
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $loadLocation = document.querySelector('#loading-location')
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML

socket.on('welcome', welcomeMessage => {
    console.log(welcomeMessage)
})

socket.on('message', (message) => {
    console.log(message)
    // the message-template in our html will render the message parameter we receive
    const html = Mustache.render(messageTemplate, {
        message: message.text
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (locationURL) => {
    const html = Mustache.render(locationTemplate, {
        locationURL
    })
    $messages.insertAdjacentHTML('beforeend', html)
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

$sendLocationButton.addEventListener('click', () => {
    // if browser doesn't support geolocation
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    $loadLocation.style.display = 'block'

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat: position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            $loadLocation.style.display = 'none'
            console.log('Your location has been shared')
        })
    })
})