const io = require("socket.io")(8900, {
    cors: { origin: 'http://localhost:3000', credentials: true }
});

let users = [];

const getUsersId = () => {
    const usersId = users.map((user) => user.userId)
    return usersId
}

const getUsersSocket = (members) => {
    const usersSockets = users.filter(user => JSON.stringify(members?._id || members)?.includes(user.userId))
    return usersSockets.map(user => { return user.socketId });
}

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId);
}

io.on("connect", (socket) => {

    socket.on("connection", (userId) => {
        addUser(userId, socket.id);
        const usersId = getUsersId()
        io.emit("getUsers", usersId);
    })

    socket.on("join chat", (chatId) => {
        socket.join(chatId)
    })

    socket.on("sendMessage", (messageBody) => {
        io.in(messageBody.chatId).emit('getMessage', messageBody);
    });

    socket.on("latestMessage", (message) => {
        const userSockets = getUsersSocket(message.users)
        io.to(userSockets).emit('getLatestMessage', message.messageBody);
    });

    socket.on("readMessage", (details) => {
        socket.in(details.chatId).emit('getMessageReadby', details);
    });

    socket.on("typing", (chat) => {
        const userSockets = getUsersSocket(chat?.members)
        socket.to(userSockets).emit("typing", chat.chatId)
    });

    socket.on("stop typing", (chat) => {
        const userSockets = getUsersSocket(chat?.members)
        socket.to(userSockets).emit("stop typing", chat.chatId)
    });

    socket.on("disconnect", () => {
        removeUser(socket.id)
        const usersId = getUsersId()
        io.emit("getUsers", usersId);
    });

})