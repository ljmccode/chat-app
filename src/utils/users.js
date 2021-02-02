const users = []

const addUser = ( {id, username, room} ) => {
    username = username.trim()
    room = room.trim()

    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    const userExists = users.find((user) => {
        return user.username.toLowerCase() === username.toLowerCase() && user.room.toLowerCase() === room.toLowerCase()
    })

    if(userExists) {
        return {
            error: 'Username is already in use'
        }
    }

    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        // slice returns an array so need [0] to return object
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room === room)
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

