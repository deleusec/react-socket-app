const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");

// socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

io.on('connection', (socket)=> {
  console.log(`User Connected: ${socket.id}`);
  socket.on("send_message", (data) => {
    socket.broadcast.emit('receive_message', data )
  })
})

server.listen(3001, ()=>{
  console.log('SERVER IS RUNNING');
})
