const socket = io()

// Elements
// $ lets you know its an element from the DOM selected
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $loadLocation = document.querySelector('.loading-location')
const $messages = document.querySelector('#messages')
const $navToggle = document.querySelector('.nav-toggle')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
const navbarTemplate = document.querySelector('#navbar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // Scroll position
    const scrollOffset = $messages.scrollTop + visibleHeight

    // If at bottom of messages container
    if (containerHeight - newMessageHeight <= scrollOffset) {
        // set scroll location to bottom 
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    // the message-template in our html will render the message parameter we receive
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (message) => {
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        locationURL: message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.getElementById('sidebar').innerHTML = html

    const navHtml = Mustache.render(navbarTemplate, {
        room,
        users
    })
    document.querySelector('.nav-dropdown').innerHTML = navHtml
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

$navToggle.addEventListener("click", function () {
    document.querySelector('.nav-dropdown').classList.toggle("show-nav");
  });

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href ='/'
    }
})