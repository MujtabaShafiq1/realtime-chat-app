const io = require("socket.io")(8900, {
    cors: { origin: 'http://localhost:3000', credentials: true }
});

let users = [];

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


io.on("connection", (socket) => {

    // when user connects to server
    console.log("user connected to socket server");

    socket.on("setup", (userId) => {
        console.log("authenticated user connected");
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    // join socket room
    socket.on("join chat", (chatId) => {
        socket.join(chatId)
    })

    // new chat
    socket.on("new chat", (chat) => {
        const userSockets = getUsersSocket(chat.members)
        if (userSockets.length === 0) return;
        io.to(userSockets).emit("getChats", (chat.updatedChat || chat))
    })

    // add user to group chat
    socket.on("add user", (data) => {
        const userSocket = getUsersSocket(data.users)
        io.to(userSocket).emit("getNewuser", { newUser: data.newUser, chatId: data.chatId })
    })

    // remove user from group chat
    socket.on("remove member", (chat) => {
        const userSockets = getUsersSocket(chat.members)
        io.to(userSockets).emit("getChats", chat)
    })

    // get latest message of chat
    socket.on("latestMessage", (message) => {
        const userSockets = getUsersSocket(message.users)
        io.to(userSockets).emit('getLatestMessage', message);
    });

    // read message when user is in chat
    socket.on("readMessage", (details) => {
        socket.in(details.chatId).emit('getMessageReadby', details);
    });

    // read all message when user opens chat
    socket.on("readAllMessage", (details) => {
        socket.in(details.chatId).emit('getMessageReadbyAll', details);
    });

    // typing 
    socket.on("typing", (chat) => {
        const userSockets = getUsersSocket(chat?.members)
        socket.to(userSockets).emit("typing", chat.chatId)
    });

    // stop typing
    socket.on("stop typing", (chat) => {
        const userSockets = getUsersSocket(chat?.members)
        socket.to(userSockets).emit("stop typing", chat.chatId)
    });

    // when user disconnects from server
    socket.on("logout", (userId) => {
        removeUser(socket.id)
        socket.disconnect(true)
        io.emit("disconnectedUser", userId);
    })

    socket.on("disconnect", () => {
        console.log("user disconnected")
    })

})