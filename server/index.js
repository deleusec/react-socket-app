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

server.listen(3001, ()=>{})
